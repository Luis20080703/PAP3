import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { adminAPI, playsAPI, tipsAPI, equipasAPI, escaloesAPI } from '../services/api'; // ✅ Importar escaloesAPI
import { useApp } from '../context/AppContext';
import {
    Check, Shield, User, Loader2, Users, Activity,
    Trash2, UserPlus, FileText, MessageSquare,
    TrendingUp, AlertTriangle, RefreshCw, Zap, Plus, Trophy
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<any>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);
    const [jogadas, setJogadas] = useState<any[]>([]);
    const [dicas, setDicas] = useState<any[]>([]);
    const [equipas, setEquipas] = useState<any[]>([]); // ✅ Estado para equipas
    const [escaloes, setEscaloes] = useState<any[]>([]); // ✅ Estado para escalões
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editUserData, setEditUserData] = useState({ nome: '', tipo: '', equipa: '' });

    // Restored States
    const [actionId, setActionId] = useState<number | null>(null);
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamEscalao, setNewTeamEscalao] = useState('');
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, u, p, j, d, e, esc, pAtletas] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers(),
                adminAPI.getPendingTreinadores(),
                playsAPI.getAll(),
                tipsAPI.getAll(),
                equipasAPI.getAll(),
                escaloesAPI.getAll(),
                adminAPI.getPendingAthletes()
            ]);
            setStats(s);
            setAllUsers(u);
            // Combine pending lists for the alert box
            const combinedPending = [
                ...(p || []),
                ...(pAtletas || [])
            ];
            setPending(combinedPending);
            setJogadas(j);
            setDicas(d);
            setEquipas(e || []);
            setEscaloes(esc || []);
        } catch (error) {
            toast.error("Erro ao carregar dados do painel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && ['admin', 'root'].includes(user.tipo)) {
            loadData();
        }
    }, [user]);

    const handleTogglePremium = async (id: number) => {
        try {
            const res = await adminAPI.togglePremium(id);
            if (res.success) {
                toast.success(res.message);
                await loadData();
            }
        } catch (e) {
            toast.error("Erro ao alterar estado premium");
        }
    };

    const handleOpenEditUser = (user: any) => {
        setEditingUser(user);
        setEditUserData({
            nome: user.nome,
            tipo: user.tipo,
            equipa: user.equipa || ''
        });
        setIsEditUserOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            const res = await adminAPI.updateUser(editingUser.id, editUserData);
            if (res.success) {
                toast.success("Utilizador atualizado");
                setIsEditUserOpen(false);
                await loadData();
            }
        } catch (e) {
            toast.error("Erro ao atualizar utilizador");
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName) {
            toast.error("O nome da equipa é obrigatório");
            return;
        }

        setIsCreatingTeam(true);
        try {
            const res = await equipasAPI.create({
                nome: newTeamName,
            });

            if (res.success) {
                toast.success("Equipa criada com sucesso!");
                setNewTeamName('');
                setNewTeamEscalao('');
                setIsTeamDialogOpen(false);
                await loadData();
            }
        } catch (error) {
            toast.error("Erro ao criar equipa");
        } finally {
            setIsCreatingTeam(false);
        }
    };

    const handleDeleteTeam = async (id: number) => {
        if (!confirm("Tem a certeza que deseja apagar esta equipa?")) return;
        try {
            const res = await equipasAPI.delete(id);
            if (res.success) {
                toast.success("Equipa removida");
                await loadData();
            }
        } catch (e) {
            toast.error("Erro ao remover equipa");
        }
    };

    const handleValidate = async (id: number) => {
        try {
            const res = await adminAPI.validateUser(id);
            if (res.success) {
                toast.success("Utilizador validado!");
                await loadData();
            }
        } catch (e) {
            toast.error("Erro na validação");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Tem a certeza que deseja apagar este utilizador?")) return;
        try {
            const res = await adminAPI.deleteUser(id);
            if (res.success) {
                toast.success("Utilizador removido");
                await loadData();
            }
        } catch (e) {
            toast.error("Erro ao remover utilizador");
        }
    };

    const handleDeleteContent = async (type: any, id: number) => {
        if (!confirm("Apagar este conteúdo permanentemente?")) return;
        try {
            const res = await adminAPI.deleteContent(type, id);
            if (res.success) {
                toast.success("Removido com sucesso");
                await loadData();
            }
        } catch (e) {
            toast.error("Erro ao remover conteúdo");
        }
    };

    if (!user || !['admin', 'root'].includes(user.tipo)) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 animate-pulse" />
                        Master Panel
                    </h2>
                    <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                        Controlo Total do Sistema NexusHand
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">

                    <Button
                        onClick={loadData}
                        disabled={loading}
                        variant="outline"
                        className="bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 shadow-sm transition-all py-5 sm:py-6 px-6 sm:px-8 rounded-2xl gap-3 font-bold w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-8">
                <div className="flex justify-start">
                    <TabsList className="admin-tab-container h-auto flex-wrap md:flex-nowrap">
                        {[
                            { val: 'overview', lab: 'Vista Geral', ico: TrendingUp },
                            { val: 'users', lab: 'Utilizadores', ico: Users },
                            { val: 'equipas', lab: 'Equipas', ico: Trophy },
                            { val: 'content', lab: 'Moderação', ico: Shield }
                        ].map((t: any) => (
                            <TabsTrigger
                                key={t.val}
                                value={t.val}
                                className="admin-tab-button data-[state=active]:shadow-none shadow-none"
                            >
                                <t.ico className="w-5 h-5 admin-tab-icon" />
                                <span className="hidden sm:inline">{t.lab}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Dashboard Overview */}
                <TabsContent value="overview" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Utilizadores', val: stats?.users, icon: Users, color: 'indigo' },
                            { label: 'Atletas', val: stats?.atletas, icon: Activity, color: 'emerald' },
                            { label: 'Equipas', val: equipas.length, icon: Trophy, color: 'amber' },
                            { label: 'Pendentes', val: stats?.pendentes, icon: AlertTriangle, color: 'rose' }
                        ].map((item, idx) => (
                            <Card key={idx} className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group rounded-[32px] bg-white">
                                <CardContent className="p-8 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{item.label}</p>
                                        <h3 className="text-5xl font-black text-gray-900 tracking-tighter">{item.val ?? '--'}</h3>
                                    </div>
                                    <div className={`p-5 rounded-[24px] group-hover:rotate-12 transition-all duration-500 bg-gray-50 text-indigo-600 shadow-sm`}>
                                        <item.icon className="w-10 h-10" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Charts Placeholder or Reports Section could go here */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-xl rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-900 text-black overflow-hidden p-10 relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                            <h3 className="text-2xl font-black mb-4 relative z-10 flex items-center gap-3">
                                <Zap className="w-8 h-8 text-amber-400" />
                                Estado da Plataforma
                            </h3>
                            <p className="text-black/10 font-medium max-w-sm mb-8 leading-relaxed relative z-10 ">
                                A plataforma está a operar com 100% de disponibilidade. Todos os serviços de análise e estatística estão ativos.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1 border border-white/10">
                                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Conteúdo</p>
                                    <p className="text-2xl font-black">{(stats?.jogadas || 0) + (stats?.dicas || 0)}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1 border border-white/10">
                                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Comentários</p>
                                    <p className="text-2xl font-black">{stats?.comentarios || 0}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-10">
                            <h3 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-indigo-500" />
                                Ações Recomendadas
                            </h3>
                            <div className="space-y-4">
                                {pending.length > 0 ? (
                                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                                <UserPlus className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">{pending.length} Treinadores a aguardar</p>
                                                <p className="text-sm text-gray-500 font-medium">Verifica as credenciais para validar acesso.</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setActiveTab('users')}
                                            className="bg-amber-500 hover:bg-amber-600 rounded-xl font-bold px-6"
                                        >
                                            Ver Agora
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">Tudo em ordem</p>
                                            <p className="text-sm text-gray-500 font-medium">Não existem pendentes de validação neste momento.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* Users Management */}
                <TabsContent value="users" className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
                        <CardHeader className="p-10 border-b border-gray-50 bg-gray-50/20">
                            <CardTitle className="flex items-center gap-4 text-3xl font-black">
                                <Users className="w-10 h-10 text-indigo-500" />
                                Gestão de Utilizadores
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="font-black py-6 pl-10 text-gray-400 uppercase tracking-widest text-xs">UTILIZADOR</TableHead>
                                            <TableHead className="font-black text-gray-400 uppercase tracking-widest text-xs">ACESSO / EQUIPA</TableHead>
                                            <TableHead className="font-black text-gray-400 uppercase tracking-widest text-xs">PREMIUM</TableHead>
                                            <TableHead className="font-black text-gray-400 uppercase tracking-widest text-xs">ESTADO</TableHead>
                                            <TableHead className="text-right font-black pr-10 text-gray-400 uppercase tracking-widest text-xs">GESTOR</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allUsers.map((u) => (
                                            <TableRow key={u.id} className="hover:bg-indigo-50/20 transition-all border-b border-gray-50 duration-300">
                                                <TableCell className="py-8 pl-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-black text-2xl shadow-inner border-2 border-white">
                                                            {u.nome.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-black text-gray-900 text-xl tracking-tight">{u.nome}</p>
                                                            <p className="text-sm text-gray-400 font-bold">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-2">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.tipo === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            u.tipo === 'treinador' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                            }`}>
                                                            {u.tipo}
                                                        </span>
                                                        <p className="text-xs text-gray-400 font-black ml-1 flex items-center gap-1.5">
                                                            <Activity className="w-3 h-3" /> {u.equipa || 'Sem Equipa'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleTogglePremium(u.id)}
                                                        className={`group flex items-center gap-2 px-4 py-2 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border ${u.is_premium
                                                            ? 'bg-amber-100 text-amber-600 border-amber-200 shadow-sm shadow-amber-200/50'
                                                            : 'bg-gray-100 text-gray-400 border-gray-200'
                                                            }`}
                                                    >
                                                        <Zap className={`w-4 h-4 ${u.is_premium ? 'fill-amber-500 animate-pulse' : ''}`} />
                                                        {u.is_premium ? 'Elite' : 'Padrão'}
                                                    </button>
                                                </TableCell>
                                                <TableCell>
                                                    {u.validado ? (
                                                        <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                            Autorizado
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                            Bloqueado
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!u.validado && (u.tipo === 'treinador' || u.tipo === 'atleta') && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleValidate(u.id)}
                                                                className="validar-button"
                                                            >
                                                                Validar
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEditUser(u)}
                                                            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all h-11 w-11"
                                                        >
                                                            <User className="w-6 h-6" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all h-11 w-11"
                                                        >
                                                            <Trash2 className="w-6 h-6" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit User Dialog */}
                    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Editar Utilizador</DialogTitle>
                                <DialogDescription className="text-gray-500 font-medium"> Modificar perfil de {editingUser?.nome} </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700 ml-1">Nome Completo</Label>
                                    <Input
                                        value={editUserData.nome}
                                        onChange={(e) => setEditUserData({ ...editUserData, nome: e.target.value })}
                                        className="rounded-xl py-6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700 ml-1">Cargo / Tipo</Label>
                                    <Select value={editUserData.tipo} onValueChange={(val: string) => setEditUserData({ ...editUserData, tipo: val })}>
                                        <SelectTrigger className="rounded-xl py-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="atleta">Atleta</SelectItem>
                                            <SelectItem value="treinador">Treinador</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700 ml-1">Equipa Filiada</Label>
                                    <Input
                                        value={editUserData.equipa}
                                        onChange={(e) => setEditUserData({ ...editUserData, equipa: e.target.value })}
                                        className="rounded-xl py-6"
                                        placeholder="Nome da equipa"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleUpdateUser}
                                    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl w-full py-6 font-black shadow-lg"
                                >
                                    Guardar Alterações
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Equipas Management */}
                <TabsContent value="equipas" className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
                        <CardHeader className="p-10 border-b border-gray-50 bg-gray-50/30 flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-4 text-3xl font-black">
                                <Trophy className="w-10 h-10 text-amber-500" />
                                Gestão do Ecossistema
                            </CardTitle>

                            <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="equipaadm-button">
                                        <Plus className="equipaadm-button__icon" />
                                        Criar Equipa
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Criar Nova Equipa</DialogTitle>
                                        <DialogDescription className="text-gray-500 font-medium">
                                            Adicione uma nova equipa ao ecossistema NexusHand.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Nome da Equipa</Label>
                                            <Input
                                                id="name"
                                                value={newTeamName}
                                                onChange={(e) => setNewTeamName(e.target.value)}
                                                className="rounded-xl border-gray-100 bg-gray-50/50 py-6"
                                                placeholder="Ex: FC Porto"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="gap-3">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsTeamDialogOpen(false)}
                                            disabled={isCreatingTeam}
                                            className="rounded-xl font-bold"
                                        >
                                            Cancelar
                                        </Button>
                                        <button
                                            onClick={handleCreateTeam}
                                            disabled={isCreatingTeam}
                                            className="criarequipa-button"
                                        >
                                            {isCreatingTeam ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Criar Equipa
                                                    <svg className="criarequipa-buttonicon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="font-black py-6 pl-10 text-gray-400 uppercase tracking-widest text-xs">IDENTIFICAÇÃO DA EQUIPA</TableHead>
                                            <TableHead className="text-right font-black pr-10 text-gray-400 uppercase tracking-widest text-xs">OPERAÇÕES</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {equipas.map((e) => (
                                            <TableRow key={e.id} className="hover:bg-amber-50/10 transition-all border-b border-gray-50 duration-300">
                                                <TableCell className="py-8 pl-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-black text-2xl shadow-inner border-2 border-white">
                                                            {e.nome.charAt(0).toUpperCase()}
                                                        </div>
                                                        <p className="font-black text-gray-900 text-xl tracking-tight">{e.nome}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteTeam(e.id)}
                                                        className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Content Management */}
                <TabsContent value="content" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Jogadas */}
                        <Card className="border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-2">
                            <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
                                <CardTitle className="text-2xl font-black flex items-center gap-3">
                                    <Activity className="w-8 h-8 text-emerald-500" />
                                    Jogadas
                                </CardTitle>
                                <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {jogadas.length} total
                                </span>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                                <div className="divide-y divide-gray-50">
                                    {jogadas.map(j => (
                                        <div key={j.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                                    <FileText className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-lg leading-tight mb-1">{j.titulo}</p>
                                                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-none">
                                                        {j.autorNome} • <span className="text-emerald-500">{j.equipa}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteContent('jogada', j.id)}
                                                className="h-12 w-12 text-gray-300 hover:text-red-500 rounded-2xl"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dicas */}
                        <Card className="border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-2">
                            <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
                                <CardTitle className="text-2xl font-black flex items-center gap-3">
                                    <MessageSquare className="w-8 h-8 text-amber-500" />
                                    Dicas
                                </CardTitle>
                                <span className="bg-amber-50 text-amber-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {dicas.length} total
                                </span>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                                <div className="divide-y divide-gray-50">
                                    {dicas.map(d => (
                                        <div key={d.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                                                    <Zap className="w-7 h-7" />
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <p className="font-black text-gray-900 text-lg leading-tight mb-1 truncate">{d.titulo || d.texto}</p>
                                                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-none">
                                                        Categoria: <span className="text-amber-500">{d.categoria}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteContent('dica', d.id)}
                                                className="h-12 w-12 text-gray-300 hover:text-red-500 rounded-2xl"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}



