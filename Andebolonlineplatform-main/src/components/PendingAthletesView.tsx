import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {athletes.map((athlete) => (
                        <Card key={athlete.id} className="overflow-hidden border-orange-100 dark:border-orange-900 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-orange-50/50 dark:bg-orange-950/20 pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            {athlete.user?.nome}
                                        </CardTitle>
                                        <CardDescription>{athlete.user?.email}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pendente
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded-lg">
                                        <span className="text-gray-500 text-xs block uppercase font-bold">Posição</span>
                                        <span className="font-medium">{athlete.posicao}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg">
                                        <span className="text-gray-500 text-xs block uppercase font-bold">Número</span>
                                        <span className="font-medium">#{athlete.numero}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button className="aprovar-button flex-1" onClick={() => handleApprove(athlete.id)}>
                                        <span className="aprovar-button-shadow"></span>
                                        <span className="aprovar-button-edge"></span>
                                        <span className="aprovar-button-front text-white flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Aprovar
                                        </span>
                                    </button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleReject(athlete.id)}
                                        title="Rejeitar"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
