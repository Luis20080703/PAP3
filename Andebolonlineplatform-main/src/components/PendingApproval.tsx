import { Clock, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface PendingApprovalProps {
    userEmail?: string;
    userName?: string;
    onLogout: () => void;
}

export function PendingApproval({ userEmail, userName, onLogout }: PendingApprovalProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
                    {/* Header with Logo */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJoLTJ2LTJoMnptLTItMmgydjJoLTJ2LTJ6bTItMmgydjJoLTJ2LTJ6bS0yLTJoMnYyaC0ydi0yem0yLTJoMnYyaC0ydi0yem0tMi0yaDF2Mmgtdi0yem0xLTFoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                        <div className="relative z-10">
                            <img src="/logo.png" alt="NexusHand Logo" className="w-20 h-20 mx-auto mb-4 brightness-0 invert" />
                            <h1 className="text-3xl font-black text-white mb-2">NexusHand</h1>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest">Plataforma de Andebol</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        {/* Animated Clock Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-blue-100 rounded-full p-6">
                                    <Clock className="w-16 h-16 text-blue-600 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Main Message */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                                Pedido em Análise
                            </h2>
                            <p className="text-gray-600 text-lg mb-6">
                                Olá <span className="font-bold text-blue-600">{userName || 'Utilizador'}</span>! 👋
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                O seu pedido de registo está a ser analisado pela nossa equipa de administração.
                                Receberá uma notificação por email assim que a sua conta for aprovada.
                            </p>
                        </div>

                        {/* Status Steps */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                            <div className="space-y-4">
                                {/* Step 1 - Complete */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Registo Concluído</h3>
                                        <p className="text-sm text-gray-600">A sua conta foi criada com sucesso</p>
                                    </div>
                                </div>

                                {/* Step 2 - In Progress */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Análise em Progresso</h3>
                                        <p className="text-sm text-gray-600">A validar as suas credenciais</p>
                                    </div>
                                </div>

                                {/* Step 3 - Pending */}
                                <div className="flex items-start gap-4 opacity-50">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Notificação por Email</h3>
                                        <p className="text-sm text-gray-600">Receberá um email de confirmação</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Info */}
                        {userEmail && (
                            <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Email Registado</p>
                                        <p className="text-sm font-mono text-blue-700">{userEmail}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-amber-50 rounded-xl p-5 mb-8 border-2 border-amber-200">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                                        <span className="text-amber-700 font-black">!</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-900 mb-2">Tempo de Aprovação</h4>
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                        A aprovação pode demorar até <strong>24-48 horas</strong> em dias úteis.
                                        Verifique regularmente a sua caixa de email, incluindo a pasta de spam.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={onLogout}
                                variant="outline"
                                className="flex-1 h-14 text-base font-bold border-2 border-gray-300 hover:bg-gray-50 gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Voltar ao Início
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Precisa de ajuda?{' '}
                            <a href="mailto:suporte@nexushand.com" className="text-blue-600 font-bold hover:underline">
                                Contacte o suporte
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Note */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2026 NexusHand - Plataforma Profissional de Andebol
                    </p>
                </div>
            </div>
        </div>
    );
}
