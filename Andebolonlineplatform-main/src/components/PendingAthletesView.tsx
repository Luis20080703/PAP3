import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Check, X, Clock, RefreshCw } from 'lucide-react';
import { trainersAPI } from '../services/api';
import { toast } from "sonner";

interface PendingAthlete {
    id: number;
    user_id: number;
    equipa_id: number;
    posicao: string;
    numero: number;
    user: {
        id: number;
        nome: string;
        email: string;
        validado: boolean;
    };
}

export function PendingAthletesView() {
    const [loading, setLoading] = useState(true);
    const [athletes, setAthletes] = useState<PendingAthlete[]>([]);

    const fetchAthletes = async () => {
        setLoading(true);
        try {
            const data = await trainersAPI.getPendingAthletes();
            setAthletes(data);
        } catch (error) {
            console.error("Erro ao buscar atletas pendentes:", error);
            toast.error("Não foi possível carregar os pedidos pendentes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAthletes();
    }, []);

    const handleApprove = async (athleteId: number) => {
        try {
            await trainersAPI.approveAthlete(athleteId.toString());
            toast.success("Atleta aprovado com sucesso!");
            fetchAthletes(); // Refresh list
        } catch (error) {
            toast.error("Falha ao aprovar atleta.");
        }
    };

    const handleReject = async (athleteId: number) => {
        if (!confirm("Tem a certeza que deseja rejeitar e remover este utilizador?")) return;

        try {
            await trainersAPI.rejectAthlete(athleteId.toString());
            toast.success("Pedido rejeitado e utilizador removido.");
            fetchAthletes(); // Refresh list
        } catch (error) {
            toast.error("Falha ao rejeitar atleta.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Atletas Pendentes</h2>
                    <p className="text-gray-500">
                        Gerira os pedidos de entrada na sua equipa.
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={fetchAthletes} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-24 bg-gray-100 rounded-t-xl" />
                            <CardContent className="h-32 bg-gray-50 rounded-b-xl mt-1" />
                        </Card>
                    ))}
                </div>
            ) : athletes.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                        <Clock className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Sem pedidos pendentes</p>
                        <p className="text-sm">Novos atletas que se registarem na sua equipa aparecerão aqui.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {athletes.map((athlete) => (
                        <div key={athlete.id} className="play-tip-card">
                            <div className="play-tip-content">
                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white">
                                                {athlete.user?.nome}
                                            </h3>
                                            <p className="text-blue-100/70 text-sm font-medium">{athlete.user?.email}</p>
                                        </div>
                                        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                            Pendente
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                                            <span className="text-blue-100 text-[10px] block uppercase font-black tracking-widest opacity-70 mb-1">Posição</span>
                                            <span className="font-bold text-white">{athlete.posicao}</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                                            <span className="text-blue-100 text-[10px] block uppercase font-black tracking-widest opacity-70 mb-1">Número</span>
                                            <span className="font-bold text-white">#{athlete.numero}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button className="aprovar-button flex-1" onClick={() => handleApprove(athlete.id)}>
                                            <span className="aprovar-button-shadow"></span>
                                            <span className="aprovar-button-edge"></span>
                                            <span className="aprovar-button-front text-white flex items-center justify-center gap-2 font-bold text-sm">
                                                <Check className="w-4 h-4" />
                                                Aprovar
                                            </span>
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleReject(athlete.id)}
                                            className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border border-white/5"
                                            title="Rejeitar"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
