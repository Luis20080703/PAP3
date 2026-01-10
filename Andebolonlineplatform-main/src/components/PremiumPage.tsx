import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Check, Crown, Loader2, Star, X } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

interface PremiumPageProps {
    onBack: () => void;
}

export function PremiumPage({ onBack }: PremiumPageProps) {
    const { user, updateUser } = useApp();
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: string) => {
        if (!user) return;
        setLoading(plan);

        // Simulação de processamento para efeito visual
        setTimeout(async () => {
            try {
                const response = await usersAPI.update(user.id, {
                    ...user,
                    is_premium: true,
                    premium_plan: plan === 'monthly' ? 'pro' : 'elite'
                });

                if (response.success) {
                    updateUser({
                        ...user,
                        is_premium: true,
                        premium_plan: plan === 'monthly' ? 'pro' : 'elite'
                    });
                    toast.success(plan === 'monthly' ? "Parabéns! Bem-vindo ao Nível PRO 🚀" : "Parabéns! Bem-vindo ao Nível Elite 🚀");
                    onBack();
                } else {
                    toast.error(response.message || "Não foi possível processar a subscrição.");
                }
            } catch (error) {
                console.error("Erro na subscrição:", error);
                toast.error("Erro de ligação. Tenta novamente em instantes.");
            } finally {
                setLoading(null);
            }
        }, 1800);
    };

    if (!user || user.tipo !== 'treinador') {
        return (
            <div
                className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-8 text-center bg-gray-600 text-white"
                style={{ backgroundColor: '#495361ff' }}
            >

                <div className="bg-red-500/10 p-4 rounded-full mb-6">
                    <X className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Acesso Exclusivo</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8 font-light">
                    As ferramentas de scouting e estatística avançada NexusHand PRO são exclusivas para utilizadores com perfil de treinador.
                </p>
                <Button
                    className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-2xl font-bold transition-all"
                    onClick={onBack}
                >
                    Regressar ao Dashboard
                </Button>
            </div>
        );
    }

    const isPremium = user.is_premium;

    return (
        <div
            className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-600 text-white selection:bg-blue-500/30 font-sans"
            style={{ backgroundColor: '#282f38ff', color: 'white' }}
        >
            <div className="relative z-10 container mx-auto py-12 px-4 pb-24">
                {/* NAV BAR */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 sm:mb-20 animate-in fade-in slide-in-from-top duration-700">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 shadow-sm transition-all text-sm font-medium text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
                    </button>
                    <div className="px-5 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                        Excelência Técnica
                    </div>
                </div>

                {/* HERO SECTION */}
                <div className="text-center mb-16 sm:mb-24 max-w-7xl mx-auto animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-[calc(-0.05em)] mb-8 leading-[0.85] text-balance text-white">
                        Domina o Campo com<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">Dados de Elite</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed px-4">
                        Desbloqueia a análise global, estatísticas comparativas e toma decisões que levam a tua equipa ao <span className="text-blue-400 font-medium font-serif italic">topo do Andebol</span>.
                    </p>
                </div>
                <br></br>
                <br></br>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto mb-32 px-4 justify-items-center">

                    {/* PLANO BÁSICO */}
                    <div className="e-card playing shadow-2xl border border-white/5 bg-white/5 backdrop-blur-xl group hover:shadow-blue-500/10 transition-all duration-500 rounded-[40px]">
                        <div className="wave bg-gray-500 opacity-10"></div>
                        <div className="wave bg-gray-500 opacity-10"></div>
                        <div className="wave bg-gray-500 opacity-10"></div>
                        <div className="infotop">
                            <h3 className="text-4xl font-black text-white tracking-tight flex items-center gap-2 mt-4">
                                <span className="text-gray-500">-</span> GRÁTIS
                            </h3>
                            <span className="text-xl font-medium text-gray-400">0€/mês</span>
                            <p className="text-gray-500 text-lg mt-2 font-medium">O essencial para começar</p>

                            <div className="w-full h-px bg-white/5 my-6"></div>

                            <ul className="space-y-4 text-left w-full mb-8">
                                <li className="flex items-center gap-3 text-base text-gray-300">
                                    <div className="rounded-full bg-blue-500/10 p-1"><Check className="w-3 h-3 text-blue-400" /></div>
                                    Gestão da própria equipa
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-300">
                                    <div className="rounded-full bg-blue-500/10 p-1"><Check className="w-3 h-3 text-blue-400" /></div>
                                    Jogadas públicas
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-600">
                                    <div className="rounded-full bg-white/5 p-1"><X className="w-3 h-3 text-gray-600" /></div>
                                    Análise de adversários
                                </li>
                            </ul>

                            <button
                                className="fancy-btn w-full mt-auto mb-8 cursor-not-allowed opacity-50"
                                disabled={true}
                            >
                                <span className="py-4">
                                    {!isPremium ? 'Plano Atual' : 'Downgrade Indisponível'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* PLANO MENSAL PRO */}
                    <div className="e-card playing shadow-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl group hover:shadow-blue-500/20 transition-all duration-500 rounded-[40px] ring-1 ring-blue-500/20">
                        <div className="wave bg-blue-600/10"></div>
                        <div className="wave bg-blue-600/10"></div>
                        <div className="wave bg-blue-600/10"></div>
                        <div className="infotop">
                            <h3 className="text-4xl font-black text-blue-400 tracking-tight flex items-center gap-2 mt-4">
                                <span className="text-blue-500">★</span> PRO
                            </h3>
                            <span className="text-xl font-medium text-blue-200/80">5€/mês</span>
                            <p className="text-blue-400/70 text-lg mt-2 font-medium">Poder total sem limites</p>

                            <div className="w-full h-px bg-blue-500/10 my-6"></div>

                            <ul className="space-y-4 text-left w-full mb-8">
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-blue-500/20 p-1"><Check className="w-3 h-3 text-blue-400" /></div>
                                    Gestão da própria equipa
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-blue-500/20 p-1"><Check className="w-3 h-3 text-blue-400" /></div>
                                    Jogadas públicas
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-blue-500/20 p-1"><Check className="w-3 h-3 text-blue-400" /></div>
                                    Análise de adversários
                                </li>
                            </ul>

                            <button
                                className="fancy-btn w-full mt-auto mb-8"
                                onClick={() => handleUpgrade('monthly')}
                                disabled={user.premium_plan === 'pro' || loading === 'monthly'}
                            >
                                <span className="py-6">
                                    {loading === 'monthly' ? (
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
                                    ) : user.premium_plan === 'pro' ? 'Subscrição Ativa' : 'Aderir ao PRO'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* PLANO TRIMESTRAL */}
                    <div className="e-card playing shadow-2xl border border-indigo-500/20 bg-white/5 backdrop-blur-xl group hover:shadow-indigo-500/20 transition-all duration-500 rounded-[40px] ring-1 ring-indigo-500/20">
                        <div className="wave bg-indigo-600/10"></div>
                        <div className="wave bg-indigo-600/10"></div>
                        <div className="wave bg-indigo-600/10"></div>
                        <div className="infotop">

                            <h3 className="text-4xl font-black text-indigo-400 tracking-tight flex items-center gap-2 mt-4">
                                <span className="text-indigo-400">★</span> Elite
                            </h3>
                            <span className="text-xl font-medium text-indigo-200/80">14,99  €/3 meses</span>
                            <p className="text-indigo-400/70 text-lg mt-2 font-medium">O Pack de Performance</p>

                            <div className="w-full h-px bg-indigo-500/10 my-6"></div>

                            <ul className="space-y-4 text-left w-full mb-8">
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-indigo-500/20 p-1"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    Gestão da própria equipa
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-indigo-500/20 p-1"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    Jogadas públicas
                                </li>
                                <li className="flex items-center gap-3 text-base text-gray-200">
                                    <div className="rounded-full bg-indigo-500/20 p-1"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    Análise de adversários
                                </li>
                            </ul>

                            <button
                                className="fancy-btn w-full mt-auto mb-8"
                                onClick={() => handleUpgrade('quarterly')}
                                disabled={user.premium_plan === 'elite' || loading === 'quarterly'}
                            >
                                <span className="py-6 font-black tracking-widest">
                                    {loading === 'quarterly' ? (
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
                                    ) : user.premium_plan === 'elite' ? 'Subscrição Ativa' : 'Escolher Elite'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                {/* TESTIMONIALS & TRUST */}
                <div className="mt-32 max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-[0.3em] uppercase text-gray-400/50">Confiado pela Elite do Andebol</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch gap-12 bg-white/5 border border-white/10 p-8 sm:p-12 rounded-[40px] shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
                        <div className="flex-1 space-y-8 relative z-10 flex flex-col items-center justify-center text-center">
                            <div className="animate-text-shine">
                                <h3 className="text-3xl sm:text-4xl md:text-6xl font-black italic leading-tight tracking-[calc(-0.03em)]">
                                    “Quero ser lembrado como alguém que inspirou as pessoas a fazer coisas que pareciam impossíveis.”
                                </h3>
                            </div>
                            <p className="text-lg sm:text-xl font-bold text-blue-400 uppercase tracking-[0.3em] opacity-80 mt-4">
                                - Alfredo Quintana
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BADGES */}
                {/* RODAPÉ DE CONTACTO */}
                <footer className="bg-white/5 border-t border-white/5 py-12 mt-24 text-center rounded-[40px] shadow-2xl px-6 backdrop-blur-md">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 uppercase tracking-wider">Mais Informações</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        Para dúvidas ou suporte especializado, entra em contacto com a nossa equipa técnica:
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-base sm:text-lg">
                        <a href="mailto:luis.ml.carvalho3@gmail.com" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-medium">
                            📧 luis.ml.carvalho3@gmail.com
                        </a>
                        <a href="tel:+351964011633" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-medium">
                            📞 +351 964 011 633
                        </a>
                    </div>

                    <p className="text-gray-500 text-sm mt-12 font-medium tracking-widest">
                        NEXUSHAND © 2025/2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
