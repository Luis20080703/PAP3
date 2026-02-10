import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { atletasAPI } from '../services/api';
import { Pencil, Trash2, Search, User, Users, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingWave } from './ui/LoadingWave';

export function TeamManagementSection() {
    const [athletes, setAthletes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        nome: '',
        posicao: '',
        numero: '',
        escalao: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAthletes();
    }, []);

    const loadAthletes = async () => {
        setLoading(true);
        try {
            const res = await atletasAPI.getAll();
            if (res.success) {
                setAthletes(res.data);
            }
        } catch (error) {
            toast.error("Erro ao carregar atletas");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja remover este atleta da equipa?")) return;

        try {
            const res = await atletasAPI.delete(id);
            if (res.success) {
                toast.success("Atleta removido com sucesso");
                loadAthletes();
            }
        } catch (error) {
            toast.error("Erro ao remover atleta");
        }
    };

    const handleEditClick = (athlete: any) => {
        setEditingAthlete(athlete);
        setEditForm({
            nome: athlete.user?.nome || '',
            posicao: athlete.posicao || '',
            numero: athlete.numero?.toString() || '',
            escalao: athlete.escalao || ''
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingAthlete) return;

        setSaving(true);
        try {
            const res = await atletasAPI.update(editingAthlete.id, {
                nome: editForm.nome,
                posicao: editForm.posicao,
                numero: parseInt(editForm.numero),
                escalao: editForm.escalao
            });

            if (res.success) {
                toast.success("Dados do atleta atualizados");
                setIsEditModalOpen(false);
                loadAthletes();
            }
        } catch (error) {
            toast.error("Erro ao atualizar atleta");
        } finally {
            setSaving(false);
        }
    };

    const filteredAthletes = athletes.filter((a: any) =>
        a.user?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.posicao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><LoadingWave /></div>;

    return (
        <div className="space-y-6">
            {/* Header com Estilo Admin */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
                        Gestão da Minha Equipa
                    </h2>
                    <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        Administre os jogadores do seu plantel
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 mb-6 shadow-sm rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pesquisar Atleta</Label>
                        <div className="relative">
                            <Input
                                placeholder="Nome ou posição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10 pl-9 font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 text-sm"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="retro-card shadow-2xl">
                <div className="retro-card__title">
                    <span className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-300" />
                        GESTOR DE PLANTEL
                    </span>
                    <span className="text-xs font-mono opacity-50">{filteredAthletes.length} ATLETAS REGISTADOS</span>
                </div>

                <div className="retro-card__data">
                    {/* Coluna Esquerda: Detalhes do Atleta */}
                    <div className="retro-card__right">
                        <div className="retro-item retro-header">
                            IDENTIFICAÇÃO / POSIÇÃO / ESCALÃO
                        </div>
                        {filteredAthletes.length === 0 ? (
                            <div className="retro-item text-center text-gray-400 font-mono">
                                Nenhum atleta encontrado na equipa.
                            </div>
                        ) : (
                            filteredAthletes.map((athlete: any) => (
                                <div key={athlete.id} className="retro-item">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-black text-xl shrink-0">
                                            {athlete.numero || '??'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-gray-900 text-sm truncate leading-none">
                                                    {athlete.user?.nome}
                                                </p>
                                                <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                                                    {athlete.escalao || 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-mono truncate mb-1.5">{athlete.user?.email}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                    {athlete.posicao || 'SEM POSIÇÃO'}
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
                        {filteredAthletes.map((athlete: any) => (
                            <div key={athlete.id} className="retro-item justify-end gap-2">
                                <div className="flex items-center bg-gray-100 rounded-md border border-gray-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditClick(athlete)}
                                        className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-white rounded-none border-r border-gray-200"
                                        title="Editar Atleta"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(athlete.id)}
                                        className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-white rounded-none"
                                        title="Remover Atleta"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Athlete Modal - Estilo Admin */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Editar Atleta</DialogTitle>
                        <DialogDescription>Formulário para editar as permissões e dados do atleta.</DialogDescription>
                    </DialogHeader>
                    <div className="retro-card mb-0 shadow-2xl">
                        <div className="retro-card__title">
                            <span className="flex items-center gap-3">
                                <Pencil className="w-5 h-5 text-blue-500" />
                                EDITAR ATLETA
                            </span>
                        </div>
                        <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-5">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</Label>
                                <Input
                                    id="name"
                                    value={editForm.nome}
                                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                                    className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nº Camisola</Label>
                                    <Input
                                        id="number"
                                        type="number"
                                        value={editForm.numero}
                                        onChange={(e) => setEditForm({ ...editForm, numero: e.target.value })}
                                        className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Posição</Label>
                                    <Input
                                        id="position"
                                        value={editForm.posicao}
                                        onChange={(e) => setEditForm({ ...editForm, posicao: e.target.value })}
                                        className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Escalão</Label>
                                <Input
                                    id="escalao"
                                    value={editForm.escalao}
                                    onChange={(e) => setEditForm({ ...editForm, escalao: e.target.value })}
                                    className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="font-mono font-bold text-gray-500 hover:text-gray-900"
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold flex-1 h-12 rounded-sm shadow-md uppercase tracking-wider gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Guardar Alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
