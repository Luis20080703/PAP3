<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use App\Models\AtletaJogoStat;
use App\Models\EstatisticaAtleta;
use App\Models\Jogo;
use App\Models\Treinador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JogoImportController extends Controller
{
    /**
     * Download CSV template pre-filled with team athletes.
     */
    public function downloadTemplate(Request $request)
    {
        $user = $request->user();
        $equipaId = null;
        
        $treinador = Treinador::where('user_id', $user->id)->first();
        if ($treinador) {
            $equipaId = $treinador->equipa_id;
        } elseif (in_array($user->tipo, ['root', 'admin'])) {
            $firstEquipa = \App\Models\Equipa::first();
            $equipaId = $firstEquipa ? $firstEquipa->id : null;
        } elseif ($user->equipa) {
            $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
            if ($equipa) {
                $equipaId = $equipa->id;
            }
        }

        if (!$equipaId) {
            return response()->json(['message' => 'Equipa não encontrada.'], 403);
        }

        $atletas = Atleta::where('equipa_id', $equipaId)->with('user')->get();

        $filename = "modelo_jogo_" . now()->format('Y-m-d') . ".csv";
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
        ];

        $callback = function() use ($atletas) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            // Linha de metadados do jogo
            fputcsv($file, ['ADVERSARIO', 'GOLOS_SOFRIDOS', 'DATA_JOGO']);
            fputcsv($file, ['', '', date('Y-m-d')]); // Valores padrão vazios/data atual
            fputcsv($file, []); // Linha vazia para separação
            // Cabeçalho dos atletas
            fputcsv($file, ['cipa', 'nome', 'golos', 'amarelo', 'vermelho', 'dois_minutos']);
            foreach ($atletas as $atleta) {
                fputcsv($file, [$atleta->cipa, $atleta->user->nome, 0, 0, 0, 0]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export a specific game statistics pre-filled in CSV for editing.
     * Includes ALL athletes from the team, with current stats for this game if they exist.
     */
    public function exportGame($id)
    {
        $jogo = Jogo::find($id);
        
        if (!$jogo) {
            return response()->json(['message' => 'Jogo não encontrado.'], 404);
        }

        // Fetch all athletes from the team, including their stats for THIS specific game
        $atletas = Atleta::where('equipa_id', $jogo->equipa_id)
            ->with(['user', 'jogoStats' => function($query) use ($id) {
                $query->where('jogo_id', $id);
            }])
            ->get();

        $filename = "editar_jogo_" . $jogo->data_jogo . ".csv";
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
        ];

        $callback = function() use ($atletas, $jogo) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            // Linha de metadados do jogo
            fputcsv($file, ['ADVERSARIO', 'GOLOS_SOFRIDOS', 'DATA_JOGO']);
            fputcsv($file, [$jogo->adversario, $jogo->golos_sofridos, date('Y-m-d', strtotime($jogo->data_jogo))]);
            fputcsv($file, []); // Linha vazia para separação
            // Cabeçalho dos atletas
            fputcsv($file, ['cipa', 'nome', 'golos', 'amarelo', 'vermelho', 'dois_minutos']);

            foreach ($atletas as $atleta) {
                $stat = $atleta->jogoStats->first();
                fputcsv($file, [
                    $atleta->cipa,
                    $atleta->user->nome,
                    $stat ? $stat->golos : 0,
                    $stat ? $stat->amarelo : 0,
                    $stat ? $stat->vermelho : 0,
                    $stat ? $stat->dois_minutos : 0
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Import or Update game and stats from CSV.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'adversario' => 'sometimes|nullable|string',
            'golos_sofridos' => 'sometimes|nullable|integer|min:0',
            'data_jogo' => 'sometimes|nullable|date',
            'jogo_id' => 'sometimes|integer|exists:jogos,id'
        ]);

        $user = $request->user();
        $equipaId = null;
        
        $treinador = Treinador::where('user_id', $user->id)->first();
        if ($treinador) {
            $equipaId = $treinador->equipa_id;
        } elseif (in_array($user->tipo, ['root', 'admin'])) {
            $firstEquipa = \App\Models\Equipa::first();
            $equipaId = $firstEquipa ? $firstEquipa->id : null;
        } elseif ($user->equipa) {
            $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
            if ($equipa) {
                $equipaId = $equipa->id;
            }
        }

        if (!$equipaId) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        
        // 1. Ler Metadados do Jogo (Linha 1 e 2)
        $metaHeader = fgetcsv($handle);
        if ($metaHeader[0] && strpos($metaHeader[0], "\xEF\xBB\xBF") === 0) {
            $metaHeader[0] = substr($metaHeader[0], 3);
        }
        
        $metaValues = fgetcsv($handle);
        
        // Extrair valores do CSV (prioridade) ou do request
        $csvAdversario = $metaValues[0] ?? $request->adversario;
        $csvGolosSofridos = (isset($metaValues[1]) && $metaValues[1] !== '') ? (int)$metaValues[1] : $request->golos_sofridos;
        $csvDataJogo = $metaValues[2] ?? $request->data_jogo;

        if (!$csvAdversario || !isset($csvGolosSofridos) || !$csvDataJogo) {
            fclose($handle);
            return response()->json(['message' => 'Metadados do jogo (adversário, golos sofridos ou data) não encontrados no CSV ou formulário.'], 422);
        }

        // 2. Saltar linha vazia (Linha 3) e ler cabeçalho dos atletas (Linha 4)
        fgetcsv($handle); // consome a linha vazia
        fgetcsv($handle); // consome o cabeçalho dos atletas

        $totalGolosMarcados = 0;
        $rows = [];
        while (($data = fgetcsv($handle)) !== FALSE) {
            if (count($data) < 6) continue;
            
            $cipa = $data[0];
            $nome = $data[1];
            $golos = (int)$data[2];
            $amarelo = (int)$data[3];
            $vermelho = (int)$data[4];
            $dois_minutos = (int)$data[5];

            // Validações de limites
            if ($amarelo > 2) {
                fclose($handle);
                return response()->json(['message' => "O atleta $nome (CIPA: $cipa) não pode ter mais de 2 cartões amarelos."], 422);
            }
            if ($vermelho > 1) {
                fclose($handle);
                return response()->json(['message' => "O atleta $nome (CIPA: $cipa) não pode ter mais de 1 cartão vermelho."], 422);
            }
            if ($dois_minutos > 3) {
                fclose($handle);
                return response()->json(['message' => "O atleta $nome (CIPA: $cipa) não pode ter mais de 3 suspensões de 2 minutos."], 422);
            }

            $atleta = Atleta::where('cipa', $cipa)->first();
            if ($atleta) {
                $rows[] = [
                    'atleta_id' => $atleta->id,
                    'golos' => $golos,
                    'amarelo' => $amarelo,
                    'vermelho' => $vermelho,
                    'dois_minutos' => $dois_minutos
                ];
                $totalGolosMarcados += $golos;
            }
        }
        fclose($handle);

        if (empty($rows)) {
            return response()->json(['message' => 'Nenhum dado de atleta encontrado no CSV.'], 422);
        }

        try {
            DB::beginTransaction();
            
            if ($request->jogo_id) {
                $jogo = Jogo::find($request->jogo_id);
                $oldStats = AtletaJogoStat::where('jogo_id', $jogo->id)->get();
                foreach ($oldStats as $old) {
                    $this->revertGlobalStats($old->atleta_id, $old);
                    $old->delete();
                }
                $jogo->update([
                    'adversario' => $csvAdversario,
                    'golos_marcados' => $totalGolosMarcados,
                    'golos_sofridos' => $csvGolosSofridos,
                    'data_jogo' => $csvDataJogo
                ]);
            } else {
                $jogo = Jogo::create([
                    'equipa_id' => $equipaId,
                    'adversario' => $csvAdversario,
                    'golos_marcados' => $totalGolosMarcados,
                    'golos_sofridos' => $csvGolosSofridos,
                    'data_jogo' => $csvDataJogo
                ]);
            }

            foreach ($rows as $rowData) {
                AtletaJogoStat::create([
                    'atleta_id' => $rowData['atleta_id'],
                    'jogo_id' => $jogo->id,
                    'golos' => $rowData['golos'],
                    'amarelo' => $rowData['amarelo'],
                    'vermelho' => $rowData['vermelho'],
                    'dois_minutos' => $rowData['dois_minutos'],
                ]);
                $this->updateGlobalStats($rowData['atleta_id'], $rowData);
            }

            DB::commit();
            return response()->json(['message' => 'Operação concluída com sucesso!', 'jogo_id' => $jogo->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro: ' . $e->getMessage()], 500);
        }
    }

    private function revertGlobalStats($atletaId, $oldData)
    {
        $stats = EstatisticaAtleta::where('atleta_id', $atletaId)->first();
        if ($stats) {
            $stats->golos_marcados -= $oldData->golos;
            $stats->cartoes_amarelos -= $oldData->amarelo;
            $stats->cartoes_vermelhos -= $oldData->vermelho;
            $stats->dois_minutos -= $oldData->dois_minutos;
            $stats->jogos = max(0, $stats->jogos - 1);
            if ($stats->jogos > 0) {
                $stats->media_golos = $stats->golos_marcados / $stats->jogos;
            } else { $stats->media_golos = 0; }
            $stats->save();
        }
    }

    private function updateGlobalStats($atletaId, $rowData)
    {
        $stats = EstatisticaAtleta::firstOrNew(['atleta_id' => $atletaId]);
        $stats->golos_marcados += $rowData['golos'];
        $stats->cartoes_amarelos += $rowData['amarelo'];
        $stats->cartoes_vermelhos += $rowData['vermelho'];
        $stats->dois_minutos += $rowData['dois_minutos'];
        $stats->jogos += 1;
        if ($stats->jogos > 0) {
            $stats->media_golos = $stats->golos_marcados / $stats->jogos;
        }
        if (!$stats->epoca) {
            $atleta = Atleta::find($atletaId);
            $stats->epoca = $atleta->epoca_id ?? 1;
        }
        $stats->save();
    }
}
