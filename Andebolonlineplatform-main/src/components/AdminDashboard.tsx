import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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

    // Edit Team State
    const [editingTeam, setEditingTeam] = useState<any>(null);
    const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
    const [editTeamData, setEditTeamData] = useState({ nome: '' });

    // Edit Play State
    const [editingPlay, setEditingPlay] = useState<any>(null);
    const [isEditPlayOpen, setIsEditPlayOpen] = useState(false);
    const [editPlayData, setEditPlayData] = useState({ titulo: '', descricao: '' });

    // Edit Tip State
    const [editingTip, setEditingTip] = useState<any>(null);
    const [isEditTipOpen, setIsEditTipOpen] = useState(false);
    const [editTipData, setEditTipData] = useState({ titulo: '', conteudo: '', categoria: '' });

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

    const handleOpenEditTeam = (team: any) => {
        setEditingTeam(team);
        setEditTeamData({ nome: team.nome });
        setIsEditTeamOpen(true);
    };

    const handleUpdateTeam = async () => {
        if (!editingTeam) return;
        try {
            // Check if equipasAPI has update method (we just added it)
            const res = await equipasAPI.update(editingTeam.id, { nome: editTeamData.nome });
            if (res.success) {
                toast.success("Equipa atualizada com sucesso!");
                setIsEditTeamOpen(false);
                await loadData();
            }
        } catch (error) {
            toast.error("Erro ao atualizar equipa");
        }
    };

    const handleOpenEditPlay = (play: any) => {
        setEditingPlay(play);
        setEditPlayData({ titulo: play.titulo, descricao: play.descricao });
        setIsEditPlayOpen(true);
    };

    const handleUpdatePlay = async () => {
        if (!editingPlay) return;
        try {
            const res = await playsAPI.update(editingPlay.id, editPlayData);
            if (res) {
                toast.success("Jogada atualizada com sucesso!");
                setIsEditPlayOpen(false);
                await loadData();
            }
        } catch (error) {
            toast.error("Erro ao atualizar jogada");
        }
    };

    const handleOpenEditTip = (tip: any) => {
        setEditingTip(tip);
        setEditTipData({
            titulo: tip.titulo || '',
            conteudo: tip.conteudo || tip.texto || '',
            categoria: tip.categoria
        });
        setIsEditTipOpen(true);
    };

    const handleUpdateTip = async () => {
        if (!editingTip) return;
        try {
            const res = await tipsAPI.update(editingTip.id, editTipData);
            if (res) {
                toast.success("Dica atualizada com sucesso!");
                setIsEditTipOpen(false);
                await loadData();
            }
        } catch (error) {
            toast.error("Erro ao atualizar dica");
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
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
                        Master Panel
                    </h2>
                    <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        Controlo Total do Sistema NexusHand
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">

                    <Button
                        onClick={loadData}
                        disabled={loading}
                        variant="outline"
                        className="bg-white text-blue-600 border-2 border-blue-100 hover:bg-blue-50 shadow-sm transition-all py-5 sm:py-6 px-6 sm:px-8 rounded-2xl gap-3 font-bold w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
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
                <br />
                {/* Dashboard Overview */}
                <TabsContent value="overview" className="space-y-8">
                    {/* Stats Cards - Retro Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Utilizadores */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    UTILIZADORES
                                </span>
                            </div>
                            <div className="bg-white border-x border-b border-gray-300 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 font-mono">{stats?.users ?? '--'}</div>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-3 uppercase tracking-wide">Total de contas</p>
                            </div>
                        </div>

                        {/* Atletas */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    ATLETAS
                                </span>
                            </div>
                            <div className="bg-white border-x border-b border-gray-300 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-lg bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                                        <Activity className="w-7 h-7" />
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 font-mono">{stats?.atletas ?? '--'}</div>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-3 uppercase tracking-wide">Jogadores ativos</p>
                            </div>
                        </div>

                        {/* Equipas */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    EQUIPAS
                                </span>
                            </div>
                            <div className="bg-white border-x border-b border-gray-300 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-lg bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                                        <Trophy className="w-7 h-7" />
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 font-mono">{equipas.length}</div>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-3 uppercase tracking-wide">Clubes registados</p>
                            </div>
                        </div>

                        {/* Pendentes */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                                    PENDENTES
                                </span>
                            </div>
                            <div className="bg-white border-x border-b border-gray-300 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-lg bg-rose-100 border-2 border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
                                        <AlertTriangle className="w-7 h-7" />
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 font-mono">{stats?.pendentes ?? '--'}</div>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-3 uppercase tracking-wide">Aguardam validação</p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Status & Actions - Retro Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Estado da Plataforma */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                    ESTADO DA PLATAFORMA
                                </span>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-blue-900 border-x border-b border-blue-300 p-6">
                                <p className="text-white text-xs mb-4 font-mono leading-relaxed">
                                    Sistema operacional a 100%. Todos os serviços de análise e estatística estão ativos.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded border border-white/20">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Conteúdo</p>
                                        <p className="text-2xl font-black text-white font-mono">{(stats?.jogadas || 0) + (stats?.dicas || 0)}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded border border-white/20">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Comentários</p>
                                        <p className="text-2xl font-black text-white font-mono">{stats?.comentarios || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ações Recomendadas */}
                        <div className="retro-card shadow-2xl mb-0">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    AÇÕES RECOMENDADAS
                                </span>
                            </div>
                            <div className="bg-white border-x border-b border-gray-300 p-6">
                                {pending.length > 0 ? (
                                    <div className="bg-amber-50 p-5 rounded border-2 border-amber-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded flex items-center justify-center text-amber-600">
                                                <UserPlus className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-gray-900 text-sm">{pending.length} utilizador{pending.length > 1 ? 'es' : ''} a aguardar</p>
                                                <p className="text-xs text-gray-600 font-mono">Verifica as credenciais</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setActiveTab('users')}
                                            className="bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs rounded-sm shadow-md w-full uppercase tracking-wider"
                                        >
                                            Ver Agora
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-5 rounded border-2 border-green-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600">
                                                <Check className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm">Tudo em ordem</p>
                                                <p className="text-xs text-gray-600 font-mono">Sem pendentes</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Users Management */}
                <TabsContent value="users" className="space-y-6">
                    {/* Gestão de Utilizadores - Retro Format */}
                    <div className="retro-card shadow-2xl">
                        <div className="retro-card__title">
                            <span className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-300" />
                                GESTÃO DE UTILIZADORES
                            </span>
                            <span className="text-xs font-mono opacity-50">{allUsers.length} RECORDS</span>
                        </div>
                        <div className="retro-card__data">
                            {/* Left Column: User Details */}
                            <div className="retro-card__right">
                                <div className="retro-item retro-header">
                                    IDENTIFICAÇÃO / CARGO
                                </div>
                                {allUsers.map((u) => (
                                    <div key={u.id} className="retro-item">
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-600 font-black text-xl shrink-0">
                                                {u.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-gray-900 text-sm truncate leading-none">{u.nome}</p>
                                                    {u.equipa && (
                                                        <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-mono truncate max-w-[100px]">
                                                            {u.equipa}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono truncate mb-1.5">{u.email}</p>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${u.tipo === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                    u.tipo === 'treinador' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                        'bg-blue-100 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {u.tipo}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column: Status & Actions */}
                            <div className="retro-card__left">
                                <div className="retro-item retro-header justify-end">
                                    ESTADO / AÇÕES
                                </div>
                                {allUsers.map((u) => (
                                    <div key={u.id} className="retro-item justify-end gap-2">

                                        {/* Status Badge */}
                                        <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider mr-2 ${u.validado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.validado ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {u.validado ? 'Ativo' : 'Bloq'}
                                        </div>

                                        {/* Premium Toggle */}
                                        <button
                                            onClick={() => handleTogglePremium(u.id)}
                                            className={`h-8 px-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${u.is_premium
                                                ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
                                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                                }`}
                                            title="Toggle Premium"
                                        >
                                            <Zap className={`w-3 h-3 ${u.is_premium ? 'fill-amber-600' : ''}`} />
                                            <span className="hidden lg:inline">{u.is_premium ? 'Elite' : 'Std'}</span>
                                        </button>

                                        <div className="h-4 w-px bg-gray-200 mx-1"></div>

                                        {/* Validate Action */}
                                        {!u.validado && (u.tipo === 'treinador' || u.tipo === 'atleta') && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleValidate(u.id)}
                                                className="h-8 w-8 p-0 sm:w-auto sm:px-3 text-green-600 border-green-200 hover:bg-green-50"
                                            >
                                                <Check className="w-4 h-4 sm:mr-1" />
                                                <span className="hidden sm:inline text-[10px] font-bold uppercase">Validar</span>
                                            </Button>
                                        )}

                                        {/* Edit/Delete */}
                                        <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 relative z-10">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenEditUser(u)}
                                                className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-white rounded-none border-r border-gray-200"
                                            >
                                                <User className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-white rounded-none"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Edit User Dialog */}
                    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                        <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Editar Utilizador</DialogTitle>
                                <DialogDescription>Formulário para editar as permissões e dados do utilizador.</DialogDescription>
                            </DialogHeader>
                            <div className="retro-card mb-0 shadow-2xl">
                                <div className="retro-card__title">
                                    <span className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-blue-500" />
                                        EDITAR UTILIZADOR
                                    </span>
                                </div>
                                <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-5">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</Label>
                                        <Input
                                            value={editUserData.nome}
                                            onChange={(e) => setEditUserData({ ...editUserData, nome: e.target.value })}
                                            className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cargo</Label>
                                        <Select value={editUserData.tipo} onValueChange={(val: string) => setEditUserData({ ...editUserData, tipo: val })}>
                                            <SelectTrigger className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="font-mono border-2 border-gray-200 rounded-none">
                                                <SelectItem value="atleta">Atleta</SelectItem>
                                                <SelectItem value="treinador">Treinador</SelectItem>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Equipa</Label>
                                        <Input
                                            value={editUserData.equipa}
                                            onChange={(e) => setEditUserData({ ...editUserData, equipa: e.target.value })}
                                            className="font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 h-12"
                                            placeholder="Nome da equipa"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            onClick={handleUpdateUser}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold w-full h-12 rounded-sm shadow-md uppercase tracking-wider"
                                        >
                                            Guardar Alterações
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Equipas Management */}
                <TabsContent value="equipas" className="space-y-6">
                    {/* Gestão do Ecossistema - Retro Format */}
                    <div className="retro-card shadow-2xl">
                        <div className="retro-card__title">
                            <span className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                GESTÃO DO ECOSSISTEMA
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono opacity-50">{equipas.length} EQUIPAS</span>
                                <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="h-8 bg-amber-500 hover:bg-amber-600 text-white font-bold border-none">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Criar Equipa
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
                                        <DialogHeader className="sr-only">
                                            <DialogTitle>Criar Nova Equipa</DialogTitle>
                                            <DialogDescription>Formulário para registar uma nova equipa na plataforma.</DialogDescription>
                                        </DialogHeader>
                                        <div className="retro-card mb-0 shadow-2xl">
                                            <div className="retro-card__title">
                                                <span className="flex items-center gap-3">
                                                    <Plus className="w-5 h-5 text-amber-500" />
                                                    CRIAR NOVA EQUIPA
                                                </span>
                                            </div>
                                            <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome da Equipa</Label>
                                                    <Input
                                                        id="name"
                                                        value={newTeamName}
                                                        onChange={(e) => setNewTeamName(e.target.value)}
                                                        className="font-mono border-2 border-gray-200 focus:border-amber-500 rounded-none bg-gray-50 h-12"
                                                        placeholder="Ex: FC Porto"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setIsTeamDialogOpen(false)}
                                                        disabled={isCreatingTeam}
                                                        className="font-mono font-bold text-gray-500 hover:text-gray-900"
                                                    >
                                                        CANCELAR
                                                    </Button>
                                                    <button
                                                        onClick={handleCreateTeam}
                                                        disabled={isCreatingTeam}
                                                        className="bg-amber-500 text-white font-mono font-bold px-4 py-2 rounded-sm shadow-md active:translate-y-0.5 transition-all flex items-center gap-2"
                                                    >
                                                        {isCreatingTeam ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <span className="uppercase">Criar</span>
                                                                <Plus className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="retro-card__data">
                            {/* Left Column: Team Details */}
                            <div className="retro-card__right">
                                <div className="retro-item retro-header">
                                    IDENTIFICAÇÃO DA EQUIPA
                                </div>
                                {equipas.map((e) => (
                                    <div key={e.id} className="retro-item">
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="w-12 h-12 rounded-lg bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-amber-700 font-black text-xl shrink-0">
                                                {e.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 text-lg">{e.nome}</p>
                                                <p className="text-xs text-gray-400 font-mono">ID: {e.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column: Actions */}
                            <div className="retro-card__left">
                                <div className="retro-item retro-header justify-end">
                                    OPERAÇÕES
                                </div>
                                {equipas.map((e) => (
                                    <div key={e.id} className="retro-item justify-end gap-2">
                                        <div className="flex items-center bg-gray-100 rounded-md border border-gray-200">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenEditTeam(e)}
                                                className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-white rounded-none border-r border-gray-200"
                                                title="Editar Equipa"
                                            >
                                                <div className="w-4 h-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                </div>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteTeam(e.id)}
                                                className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-white rounded-none"
                                                title="Remover Equipa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Edit Team Dialog */}
                    <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
                        <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Editar Equipa</DialogTitle>
                                <DialogDescription>Formulário para alterar o nome da equipa.</DialogDescription>
                            </DialogHeader>
                            <div className="retro-card mb-0 shadow-2xl">
                                <div className="retro-card__title">
                                    <span className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        EDITAR EQUIPA
                                    </span>
                                </div>
                                <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome da Equipa</Label>
                                        <Input
                                            value={editTeamData.nome}
                                            onChange={(e) => setEditTeamData({ ...editTeamData, nome: e.target.value })}
                                            className="font-mono border-2 border-gray-200 focus:border-amber-500 rounded-none bg-gray-50 h-12"
                                            placeholder="Ex: FC Porto"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsEditTeamOpen(false)}
                                            className="font-mono font-bold text-gray-500 hover:text-gray-900"
                                        >
                                            CANCELAR
                                        </Button>
                                        <Button
                                            onClick={handleUpdateTeam}
                                            className="bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold rounded-sm shadow-md uppercase tracking-wider"
                                        >
                                            GUARDAR
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Content Management */}
                <TabsContent value="content" className="space-y-6">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Jogadas - Retro Format */}
                        <div className="retro-card shadow-2xl">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                    JOGADAS
                                </span>
                                <span className="text-xs font-mono opacity-50">{jogadas.length} RECORDS</span>
                            </div>
                            <div className="retro-card__data">
                                {/* Left Column: Play Details */}
                                <div className="retro-card__right">
                                    <div className="retro-item retro-header">
                                        CONTEÚDO / AUTOR
                                    </div>
                                    {jogadas.map(j => (
                                        <div key={j.id} className="retro-item">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-12 h-12 rounded-lg bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm truncate leading-tight mb-1">{j.titulo}</p>
                                                    <p className="text-xs text-gray-500 font-mono truncate uppercase tracking-tight">
                                                        {j.autorNome} <span className="text-gray-300 mx-1">•</span> <span className="text-emerald-600 font-bold">{j.equipa}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Column: Actions */}
                                <div className="retro-card__left">
                                    <div className="retro-item retro-header justify-end">
                                        OPERAÇÕES
                                    </div>
                                    {jogadas.map(j => (
                                        <div key={j.id} className="retro-item justify-end gap-2">
                                            <div className="flex items-center bg-gray-100 rounded-md border border-gray-200">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEditPlay(j)}
                                                    className="h-9 w-9 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-none border-r border-gray-200"
                                                    title="Editar Jogada"
                                                >
                                                    <div className="w-4 h-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteContent('jogada', j.id)}
                                                    className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-white rounded-none"
                                                    title="Remover Jogada"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Edit Play Dialog */}
                        <Dialog open={isEditPlayOpen} onOpenChange={setIsEditPlayOpen}>
                            <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none shadow-none">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Editar Jogada</DialogTitle>
                                    <DialogDescription>Formulário para editar o título e descrição da jogada.</DialogDescription>
                                </DialogHeader>
                                <div className="retro-card mb-0 shadow-2xl">
                                    <div className="retro-card__title">
                                        <span className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-emerald-500" />
                                            EDITAR JOGADA
                                        </span>
                                    </div>
                                    <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-5">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título</Label>
                                            <Input
                                                value={editPlayData.titulo}
                                                onChange={(e) => setEditPlayData({ ...editPlayData, titulo: e.target.value })}
                                                className="font-mono border-2 border-gray-200 focus:border-emerald-500 rounded-none bg-gray-50 h-12"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</Label>
                                            <textarea
                                                value={editPlayData.descricao}
                                                onChange={(e) => setEditPlayData({ ...editPlayData, descricao: e.target.value })}
                                                className="font-mono border-2 border-gray-200 focus:border-emerald-500 rounded-none bg-gray-50 p-3 min-h-[100px] w-full resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsEditPlayOpen(false)}
                                                className="font-mono font-bold text-gray-500 hover:text-gray-900"
                                            >
                                                CANCELAR
                                            </Button>
                                            <Button
                                                onClick={handleUpdatePlay}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold rounded-sm shadow-md uppercase tracking-wider"
                                            >
                                                GUARDAR
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Dicas - Retro Format */}
                        <div className="retro-card shadow-2xl">
                            <div className="retro-card__title">
                                <span className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-amber-500" />
                                    DICAS
                                </span>
                                <span className="text-xs font-mono opacity-50">{dicas.length} RECORDS</span>
                            </div>
                            <div className="retro-card__data">
                                {/* Left Column: Tip Details */}
                                <div className="retro-card__right">
                                    <div className="retro-item retro-header">
                                        CONTEÚDO / CATEGORIA
                                    </div>
                                    {dicas.map(d => (
                                        <div key={d.id} className="retro-item">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-12 h-12 rounded-lg bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm truncate leading-tight mb-1">{d.titulo || d.texto || 'Sem Título'}</p>
                                                    <span className="inline-block bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded border border-amber-100 font-bold uppercase tracking-wider">
                                                        {d.categoria}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Column: Actions */}
                                <div className="retro-card__left">
                                    <div className="retro-item retro-header justify-end">
                                        OPERAÇÕES
                                    </div>
                                    {dicas.map(d => (
                                        <div key={d.id} className="retro-item justify-end gap-2">
                                            <div className="flex items-center bg-gray-100 rounded-md border border-gray-200">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEditTip(d)}
                                                    className="h-9 w-9 text-gray-400 hover:text-amber-600 hover:bg-white rounded-none border-r border-gray-200"
                                                    title="Editar Dica"
                                                >
                                                    <div className="w-4 h-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteContent('dica', d.id)}
                                                    className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-white rounded-none"
                                                    title="Remover Dica"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Edit Tip Dialog */}
                        <Dialog open={isEditTipOpen} onOpenChange={setIsEditTipOpen}>
                            <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none shadow-none">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Editar Dica</DialogTitle>
                                    <DialogDescription>Formulário para editar o conteúdo e categoria da dica.</DialogDescription>
                                </DialogHeader>
                                <div className="retro-card mb-0 shadow-2xl">
                                    <div className="retro-card__title">
                                        <span className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-amber-500" />
                                            EDITAR DICA
                                        </span>
                                    </div>
                                    <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col gap-5">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título</Label>
                                            <Input
                                                value={editTipData.titulo}
                                                onChange={(e) => setEditTipData({ ...editTipData, titulo: e.target.value })}
                                                className="font-mono border-2 border-gray-200 focus:border-amber-500 rounded-none bg-gray-50 h-12"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</Label>
                                            <Select value={editTipData.categoria} onValueChange={(val: string) => setEditTipData({ ...editTipData, categoria: val })}>
                                                <SelectTrigger className="font-mono border-2 border-gray-200 focus:border-amber-500 rounded-none bg-gray-50 h-12">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="font-mono border-2 border-gray-200 rounded-none">
                                                    <SelectItem value="drible">Drible</SelectItem>
                                                    <SelectItem value="remate">Remate</SelectItem>
                                                    <SelectItem value="passe">Passe</SelectItem>
                                                    <SelectItem value="defesa">Defesa</SelectItem>
                                                    <SelectItem value="táctica">Táctica</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Conteúdo</Label>
                                            <textarea
                                                value={editTipData.conteudo}
                                                onChange={(e) => setEditTipData({ ...editTipData, conteudo: e.target.value })}
                                                className="font-mono border-2 border-gray-200 focus:border-amber-500 rounded-none bg-gray-50 p-3 min-h-[120px] w-full resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsEditTipOpen(false)}
                                                className="font-mono font-bold text-gray-500 hover:text-gray-900"
                                            >
                                                CANCELAR
                                            </Button>
                                            <Button
                                                onClick={handleUpdateTip}
                                                className="bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold rounded-sm shadow-md uppercase tracking-wider"
                                            >
                                                GUARDAR
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}



