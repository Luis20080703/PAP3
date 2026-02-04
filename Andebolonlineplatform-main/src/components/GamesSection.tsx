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
    DialogDescription,
    DialogFooter
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
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Jogos</h2>
                    <p className="text-gray-500 font-medium tracking-wide">Importa estatísticas e gere o histórico da tua equipa</p>
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

            {/* Histórico */}
            <Card className="border-2 border-gray-100 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gray-50/80 border-b-2 border-gray-100 py-6 px-8">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                        <History className="w-6 h-6 text-blue-600" /> Histórico de Jogos
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingHistory ? (
                        <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-widest px-8">
                                        <th className="px-8 py-5">DATA</th>
                                        <th className="px-8 py-5">ADVERSÁRIO</th>
                                        <th className="px-8 py-5 text-center">RESULTADO</th>
                                        <th className="px-8 py-5 text-center">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm font-bold text-gray-700">
                                    {gameHistory.map((jogo) => (
                                        <tr key={jogo.id} className="hover:bg-blue-50/30">
                                            <td className="px-8 py-6">{new Date(jogo.data_jogo).toLocaleDateString()}</td>
                                            <td className="px-8 py-6">{jogo.adversario}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                                                    {jogo.golos_marcados} - {jogo.golos_sofridos}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center space-x-2">
                                                <button onClick={() => openEditModal(jogo)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <FileEdit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDeleteGame(jogo.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Edição */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                    <DialogHeader className="bg-blue-600 p-8 text-white relative">
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <FileEdit className="w-6 h-6" /> Editar Jogo
                        </DialogTitle>
                        <DialogDescription className="text-blue-100 font-medium">
                            Corrige os dados carregando um novo ficheiro CSV.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        {/* Passo A: Download */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">A</div>
                                <h4 className="font-bold text-gray-900">Descarrega os dados atuais</h4>
                            </div>
                            <Button
                                onClick={downloadCurrentGameCSV}
                                variant="outline"
                                className="w-full border-2 border-blue-100 text-blue-600 hover:bg-blue-50 font-bold py-6 rounded-xl"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Baixar CSV para Edição
                            </Button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Passo B: Upload */}
                        <form onSubmit={handleEditSubmission} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">B</div>
                                <h4 className="font-bold text-gray-900">Envia o ficheiro corrigido</h4>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <FileUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Novo Ficheiro CSV</h4>
                                        <p className="text-xs text-gray-500 font-medium">As informações do adversário e resultado também serão atualizadas pelo CSV.</p>
                                    </div>
                                </div>
                                <Input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                    className="h-24 border-2 border-dashed border-gray-200 bg-white/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center text-center file:hidden pt-8"
                                />
                                <p className="text-[10px] text-gray-400 italic">O sistema irá reverter automaticamente as estatísticas anteriores e aplicar as novas do CSV.</p>
                            </div>

                            <DialogFooter className="pt-4 gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-bold">Cancelar</Button>
                                <Button
                                    type="submit"
                                    disabled={isUploading || !editFile}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg"
                                >
                                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
                                    Guardar Alterações
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
