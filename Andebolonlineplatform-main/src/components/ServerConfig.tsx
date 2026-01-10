import React, { useState, useEffect } from 'react';
import { Settings, Wifi, WifiOff, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export const ServerConfig: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [serverIP, setServerIP] = useState('');
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        const savedIP = localStorage.getItem('server_ip');
        if (savedIP) {
            setServerIP(savedIP);
        }
        testConnection();
    }, []);

    const testConnection = async () => {
        setIsTesting(true);
        try {
            const testIP = serverIP || window.location.hostname;
            const response = await fetch(`http://${testIP}:8000/api/test`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            console.error('Erro ao testar conexão:', error);
            setIsConnected(false);
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = () => {
        if (serverIP.trim()) {
            localStorage.setItem('server_ip', serverIP.trim());
            alert('✅ IP do servidor guardado! A página será recarregada.');
            window.location.reload();
        } else {
            localStorage.removeItem('server_ip');
            alert('✅ Configuração removida! A usar deteção automática.');
            window.location.reload();
        }
    };

    const handleClear = () => {
        setServerIP('');
        localStorage.removeItem('server_ip');
        alert('✅ IP removido! A página será recarregada.');
        window.location.reload();
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title="Configurar Servidor"
            >
                <Settings className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                <Wifi className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Configuração do Servidor</h2>
                                <p className="text-sm text-slate-400">Configure o IP para acesso móvel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Connection Status */}
                    <div className={`flex items-center gap-3 p-4 rounded-lg ${isConnected === true ? 'bg-green-500/10 border border-green-500/20' :
                            isConnected === false ? 'bg-red-500/10 border border-red-500/20' :
                                'bg-slate-700/50 border border-slate-600'
                        }`}>
                        {isConnected === true ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-green-400">Servidor Conectado</p>
                                    <p className="text-xs text-slate-400">A API está a responder corretamente</p>
                                </div>
                            </>
                        ) : isConnected === false ? (
                            <>
                                <WifiOff className="w-5 h-5 text-red-400" />
                                <div>
                                    <p className="text-sm font-medium text-red-400">Servidor Indisponível</p>
                                    <p className="text-xs text-slate-400">Verifique o IP e tente novamente</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Wifi className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">Estado Desconhecido</p>
                                    <p className="text-xs text-slate-400">Teste a conexão</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* IP Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            IP do Servidor (ex: 192.168.1.100)
                        </label>
                        <Input
                            type="text"
                            value={serverIP}
                            onChange={(e) => setServerIP(e.target.value)}
                            placeholder="192.168.x.x ou deixe vazio para auto"
                            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <p className="text-xs text-slate-400">
                            💡 Deixe vazio para usar deteção automática
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-slate-300">📱 Como obter o IP:</p>
                        <ol className="text-xs text-slate-400 space-y-1 ml-4 list-decimal">
                            <li>No PC, abra o terminal/cmd</li>
                            <li>Execute: <code className="bg-slate-700 px-1 rounded">ipconfig</code></li>
                            <li>Procure "IPv4 Address" da rede Wi-Fi</li>
                            <li>Cole o IP aqui (ex: 192.168.1.100)</li>
                        </ol>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={testConnection}
                            disabled={isTesting}
                            variant="outline"
                            className="flex-1 border-slate-600 hover:bg-slate-700"
                        >
                            {isTesting ? 'A testar...' : 'Testar Conexão'}
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                            Guardar
                        </Button>
                    </div>

                    {serverIP && (
                        <Button
                            onClick={handleClear}
                            variant="ghost"
                            className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                            Limpar Configuração
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
