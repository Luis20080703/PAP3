import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';

interface LoginProps {
  onBack: () => void;
}

// ✅ INTERFACE CORRIGIDA PARA OS DADOS DE REGISTO
interface RegisterData {
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
  equipa: string;
  posicao?: string;
  numero?: string;
}

export function Login({ onBack }: LoginProps) {
  const { login, register } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerNome, setRegisterNome] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('atleta');
  const [equipa, setEquipa] = useState('');
  const [posicao, setPosicao] = useState('');
  const [numero, setNumero] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Login efetuado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerNome || !registerEmail || !registerPassword || !equipa) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // ✅ VERIFICAÇÃO ESPECÍFICA PARA ATLETA
    if (userType === 'atleta') {
      if (!posicao) {
        toast.error('Por favor, selecione uma posição para o atleta');
        return;
      }
      if (!numero) {
        toast.error('Por favor, insira o número da camisola');
        return;
      }
    }

    // ✅ LOGS DE DEBUG DETALHADOS
    console.log('🔍 [DEBUG] Estados antes do registo:');
    console.log('🔍 registerNome:', registerNome);
    console.log('🔍 registerEmail:', registerEmail);
    console.log('🔍 registerPassword:', registerPassword ? '***' : 'vazio');
    console.log('🔍 userType:', userType);
    console.log('🔍 equipa:', equipa);
    console.log('🔍 posicao:', posicao, '(tipo:', typeof posicao, ')');
    console.log('🔍 numero:', numero, '(tipo:', typeof numero, ')');

    // ✅ DADOS A ENVIAR - COM TIPAGEM CORRETA
    const registerData: RegisterData = {
      nome: registerNome,
      email: registerEmail,
      password: registerPassword,
      tipo: userType,
      equipa: equipa,
    };

    // ✅ ADICIONAR CAMPOS DE ATLETA APENAS SE FOR ATLETA
    if (userType === 'atleta') {
      registerData.posicao = posicao;
      registerData.numero = numero;
      
      console.log('🔍 [ATLETA] Campos adicionados:', {
        posicao: posicao,
        numero: numero
      });
    }

    console.log('🔍 [DEBUG FINAL] Dados a enviar para register():', registerData);

    setIsLoading(true);
    try {
      await register(registerData);
      toast.success('Registo efetuado com sucesso!');
      
      // ✅ LIMPAR FORMULÁRIO APÓS SUCESSO
      setRegisterNome('');
      setRegisterEmail('');
      setRegisterPassword('');
      setEquipa('');
      setPosicao('');
      setNumero('');
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar no NexusHand</CardTitle>
                <CardDescription>
                  Aceda à sua conta para utilizar todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A entrar...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Registe-se como atleta ou treinador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nome">Nome Completo</Label>
                    <Input
                      id="register-nome"
                      type="text"
                      placeholder="João Silva"
                      value={registerNome}
                      onChange={(e) => setRegisterNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipa">Equipa</Label>
                    <Input
                      id="equipa"
                      type="text"
                      placeholder="Nome da equipa"
                      value={equipa}
                      onChange={(e) => setEquipa(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Utilizador</Label>
                    <RadioGroup 
                      value={userType} 
                      onValueChange={(value: string) => {
                        console.log('🔍 RadioGroup mudou para:', value);
                        setUserType(value as UserType);
                        // ✅ LIMPAR CAMPOS ESPECÍFICOS AO MUDAR TIPO
                        if (value === 'treinador') {
                          setPosicao('');
                          setNumero('');
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="atleta" id="atleta" />
                        <Label htmlFor="atleta" className="cursor-pointer">Atleta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="treinador" id="treinador" />
                        <Label htmlFor="treinador" className="cursor-pointer">Treinador</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* CAMPOS PARA TREINADOR - APENAS INFO BÁSICA */}
                  {userType === 'treinador' && (
                    <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Label className="text-blue-700 font-semibold">👨‍🏫 Registo como Treinador</Label>
                      <p className="text-sm text-blue-600">
                        Será criado automaticamente um registo na tabela de treinadores.
                      </p>
                    </div>
                  )}

                  {/* CAMPOS PARA ATLETA - POSIÇÃO E NÚMERO */}
                  {userType === 'atleta' && (
                    <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Label className="text-green-700 font-semibold">⚽ Informações do Atleta</Label>
                      
                      <div className="space-y-2">
                        <Label htmlFor="posicao">Posição *</Label>
                        <select 
                          id="posicao"
                          value={posicao}
                          onChange={(e) => {
                            console.log('🔍 [SELECT] Valor selecionado:', e.target.value);
                            setPosicao(e.target.value);
                          }}
                          className="w-full p-2 border rounded-md bg-white"
                          required
                        >
                          <option value="">Selecionar posição</option>
                          <option value="Pivô">Pivô</option>
                          <option value="Ponta">Ponta</option>
                          <option value="Lateral Direito">Lateral Direito</option>
                          <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                          <option value="Guarda-Redes">Guarda-Redes</option>
                          <option value="Central">Central</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numero">Número da Camisola *</Label>
                        <Input
                          id="numero"
                          type="number"
                          placeholder="Ex: 7"
                          value={numero}
                          onChange={(e) => {
                            console.log('🔍 [NUMERO] Valor:', e.target.value);
                            setNumero(e.target.value);
                          }}
                          min="1"
                          max="99"
                          required
                        />
                      </div>
                      
                      <p className="text-xs text-green-600 mt-2">
                        * Campos obrigatórios para atletas
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A criar conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}