import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { atletasAPI } from '../services/api';
import { Pencil, Trash2, Search, User, Loader2, Save } from 'lucide-react';
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
        a.posicao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><LoadingWave /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Gestão da Minha Equipa</h2>
                    <p className="text-gray-500">Administre os jogadores do seu plantel</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Pesquisar atleta..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold">#</TableHead>
                                <TableHead className="font-bold">Nome</TableHead>
                                <TableHead className="font-bold text-center">Posição</TableHead>
                                <TableHead className="font-bold text-center">Escalão</TableHead>
                                <TableHead className="font-bold text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAthletes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                        Nenhum atleta encontrado na equipa.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAthletes.map((athlete: any) => (
                                    <TableRow key={athlete.id} className="hover:bg-blue-50/30 transition-colors">
                                        <TableCell className="font-mono font-bold text-blue-600">
                                            {athlete.numero || '--'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">{athlete.user?.nome}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase text-gray-600">
                                                {athlete.posicao || 'Não def.'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center text-gray-500">
                                            {athlete.escalao || '--'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditClick(athlete)}
                                                    className="text-blue-600 hover:bg-blue-50 h-8 w-8"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(athlete.id)}
                                                    className="text-red-500 hover:bg-red-50 h-8 w-8"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Athlete Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Atleta</DialogTitle>
                        <DialogDescription>
                            Atualize as informações do jogador na equipa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome do Atleta</Label>
                            <Input
                                id="name"
                                value={editForm.nome}
                                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="number">Número Camisola</Label>
                                <Input
                                    id="number"
                                    type="number"
                                    value={editForm.numero}
                                    onChange={(e) => setEditForm({ ...editForm, numero: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Posição</Label>
                                <Input
                                    id="position"
                                    value={editForm.posicao}
                                    onChange={(e) => setEditForm({ ...editForm, posicao: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="escalao">Escalão</Label>
                            <Input
                                id="escalao"
                                value={editForm.escalao}
                                onChange={(e) => setEditForm({ ...editForm, escalao: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveEdit} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
