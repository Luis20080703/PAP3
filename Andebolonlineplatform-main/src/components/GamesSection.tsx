import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from './ui/dialog';
import {
    FileDown,
    FileUp,
    Loader2,
    Trophy,
    AlertCircle,
    CheckCircle2,
    History,
    Trash2,
    Calendar,
    FileEdit,
    Download,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL, trainersAPI } from '../services/api';

export function GamesSection() {
    // --- States for New Game Import ---
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    // --- States for History ---
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [gameHistory, setGameHistory] = useState<any[]>([]);

    // --- States for Edit Modal ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingJogo, setEditingJogo] = useState<any>(null);
    const [editFile, setEditFile] = useState<File | null>(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const history = await trainersAPI.getTeamGames();
            setGameHistory(history);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            toast.error('Erro ao carregar histórico de jogos');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // --- Handlers for New Game ---
    const handleDownloadTemplate = async () => {
        setIsDownloading(true);
        try {
            const token = localStorage.getItem('api_token');
            const response = await fetch(`${API_BASE_URL}/jogos/template`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Falha ao baixar modelo');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `modelo_jogo_vazio_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Modelo carregado com sucesso!');
        } catch (error) {
            toast.error('Erro ao baixar modelo');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('Selecione o ficheiro CSV');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('api_token');
            const response = await fetch(`${API_BASE_URL}/jogos/import`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Jogo importado com sucesso!');
                setFile(null);
                const input = document.getElementById('csv-file') as HTMLInputElement;
                if (input) input.value = '';
                loadHistory();
            } else {
                toast.error(result.message || 'Erro na importação');
            }
        } catch (error) {
            toast.error('Erro de rede');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Handlers for Edit ---
    const openEditModal = (jogo: any) => {
        setEditingJogo(jogo);
        setEditFile(null);
        setIsEditModalOpen(true);
    };

    const downloadCurrentGameCSV = async () => {
        if (!editingJogo) return;
        setIsDownloading(true);
        try {
            const token = localStorage.getItem('api_token');
            const response = await fetch(`${API_BASE_URL}/jogos/${editingJogo.id}/export`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Falha ao exportar');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dados_jogo_${editingJogo.adversario}_${editingJogo.data_jogo}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.info('Dados atuais baixados! Edite o ficheiro e carregue-o abaixo.');
        } catch (error) {
            toast.error('Erro ao baixar dados do jogo');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleEditSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFile) {
            toast.error('Selecione o ficheiro corrigido');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', editFile);
        formData.append('jogo_id', editingJogo.id.toString());

        try {
            const token = localStorage.getItem('api_token');
            const response = await fetch(`${API_BASE_URL}/jogos/import`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Jogo atualizado com sucesso!');
                setIsEditModalOpen(false);
                loadHistory();
            } else {
                toast.error(result.message || 'Erro na atualização');
            }
        } catch (error) {
            toast.error('Erro de rede');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteGame = async (id: number) => {
        if (!confirm('Tem a certeza? As estatísticas dos atletas serão recalculadas.')) return;
        try {
            const token = localStorage.getItem('api_token');
            const response = await fetch(`${API_BASE_URL}/jogos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Jogo removido');
                loadHistory();
            }
        } catch (error) {
            toast.error('Erro ao eliminar');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-12 mb-12">
            {/* Header com Estilo Admin */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-12">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
                        Gestão de Jogos
                    </h2>
                    <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        Importa estatísticas e gere o histórico da tua equipa
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Passo 1: Download */}
                <Card className="border-2 border-blue-50 hover:border-blue-100 transition-all shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
                            Baixar Modelo
                        </CardTitle>
                        <CardDescription>Obtém o ficheiro CSV com os teus atletas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 py-6 rounded-xl font-bold transition-all"
                        >
                            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            Modelo (Novo Jogo)
                        </Button>
                    </CardContent>
                </Card>

                {/* Passo 2: Upload */}
                <Card className="lg:col-span-2 border-2 border-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">2</div>
                            Upload de Resultados
                        </CardTitle>
                        <CardDescription>Envia o ficheiro preenchido para registar o jogo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="bg-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-100/50 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                        <FileUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900">Configuração do Jogo</h4>
                                        <p className="text-xs text-emerald-600 font-medium tracking-tight">
                                            O adversário, golos sofridos e data são lidos do CSV.<br />
                                            <span className="text-red-500 font-bold">⚠️ Limites: Máx 2 amarelos, 1 vermelho e 3 suspensões (2min) por jogador.</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Ficheiro CSV Preenchido</Label>
                                    <Input
                                        id="csv-file"
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="h-32 border-2 border-dashed border-emerald-200 bg-white/50 hover:bg-white hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center file:hidden pt-12"
                                    />
                                    {file && <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {file.name}</p>}
                                </div>
                            </div>
                            <Button type="submit" disabled={isUploading || !file} className="finalizar-button w-full gap-2 py-8 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trophy className="w-6 h-6" />}
                                FINALIZAR IMPORTAÇÃO
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Histórico com Estilo Admin/Retro */}
            <div className="retro-card shadow-2xl">
                <div className="retro-card__title">
                    <span className="flex items-center gap-3">
                        <History className="w-5 h-5 text-blue-300" />
                        HISTÓRICO DE JOGOS
                    </span>
                    <span className="text-xs font-mono opacity-50">{gameHistory.length} JOGOS REGISTADOS</span>
                </div>

                <div className="retro-card__data">
                    {/* Coluna Esquerda: Detalhes do Jogo */}
                    <div className="retro-card__right">
                        <div className="retro-item retro-header">
                            DATA / ADVERSÁRIO / RESULTADO
                        </div>
                        {isLoadingHistory ? (
                            <div className="retro-item justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                            </div>
                        ) : gameHistory.length === 0 ? (
                            <div className="retro-item text-center text-gray-400 font-mono">
                                Nenhum jogo registado no histórico.
                            </div>
                        ) : (
                            gameHistory.map((jogo) => (
                                <div key={jogo.id} className="retro-item">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-black text-xs shrink-0 font-mono text-center px-1">
                                            {new Date(jogo.data_jogo).toLocaleDateString().split('/').slice(0, 2).join('/')}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-gray-900 text-sm truncate leading-none">
                                                    VS {jogo.adversario.toUpperCase()}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-400 font-mono mb-1.5">{new Date(jogo.data_jogo).toLocaleDateString()}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                                    RESULTADO: {jogo.golos_marcados} - {jogo.golos_sofridos}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Coluna Direita: Ações */}
                    <div className="retro-card__left">
                        <div className="retro-item retro-header justify-end">
                            OPERAÇÕES
                        </div>
                        {!isLoadingHistory && gameHistory.map((jogo) => (
                            <div key={jogo.id} className="retro-item justify-end gap-2">
                                <div className="flex items-center bg-gray-100 rounded-md border border-gray-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(jogo)}
                                        className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-white rounded-none border-r border-gray-200"
                                        title="Editar Jogo"
                                    >
                                        <FileEdit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteGame(jogo.id)}
                                        className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-white rounded-none"
                                        title="Remover Jogo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de Edição - Estilo Admin */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-2xl p-0 bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Editar Jogo</DialogTitle>
                        <DialogDescription>Formulário para editar os dados de um jogo através de CSV.</DialogDescription>
                    </DialogHeader>
                    <div className="retro-card mb-0 shadow-2xl">
                        <div className="retro-card__title">
                            <span className="flex items-center gap-3">
                                <FileEdit className="w-5 h-5 text-blue-500" />
                                EDITAR DADOS DO JOGO
                            </span>
                        </div>
                        <div className="bg-white border-x border-b border-gray-300 p-8 flex flex-col gap-8">
                            {/* Passo A: Download */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">STEP A</div>
                                    <h4 className="font-black text-gray-900 uppercase tracking-tighter">Descarregar dados atuais</h4>
                                </div>
                                <Button
                                    onClick={downloadCurrentGameCSV}
                                    className="w-full bg-white text-blue-600 border-2 border-blue-100 hover:bg-blue-50 font-black py-8 rounded-none shadow-sm transition-all"
                                >
                                    <Download className="w-5 h-5 mr-3" />
                                    BAIXAR CSV PARA EDIÇÃO
                                </Button>
                                <p className="text-[10px] text-gray-400 font-mono italic">Os dados atuais do jogo serão exportados para que os possas corrigir.</p>
                            </div>

                            <div className="h-px bg-gray-100 border-t-2 border-dashed border-gray-200" />

                            {/* Passo B: Upload */}
                            <form onSubmit={handleEditSubmission} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs font-mono">STEP B</div>
                                    <h4 className="font-black text-gray-900 uppercase tracking-tighter">Enviar ficheiro corrigido</h4>
                                </div>

                                <div className="bg-gray-50 border-2 border-gray-100 p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <FileUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Novo Ficheiro CSV</h4>
                                            <p className="text-[10px] text-gray-500 font-mono">O sistema irá reprocessar as estatísticas automaticamente.</p>
                                        </div>
                                    </div>
                                    <Input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                        className="h-24 border-2 border-dashed border-gray-200 bg-white/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center text-center file:hidden pt-8 font-mono text-xs"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-black uppercase text-xs tracking-widest text-gray-400">
                                        CANCELAR
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isUploading || !editFile}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-6 rounded-none shadow-md flex-1 gap-2 uppercase tracking-widest"
                                    >
                                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                        Guardar Alterações
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
