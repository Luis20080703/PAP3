import { useState, useEffect } from 'react';
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
import { equipasAPI, escaloesAPI } from '../services/api';

interface LoginProps {
  onBack: () => void;
}

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
  equipa: string;
  posicao?: string;
  numero?: string;
  escalao?: string;
  validado?: boolean;
}

export function Login({ onBack }: LoginProps) {
  // agora pedimos logout e user também do contexto
  const { login, register, logout, user } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [equipas, setEquipas] = useState<any[]>([]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerNome, setRegisterNome] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('atleta');
  const [equipa, setEquipa] = useState('');
  const [posicao, setPosicao] = useState('');
  const [numero, setNumero] = useState('');
  const [escalao, setEscalao] = useState('');
  const [escaloes, setEscaloes] = useState<any[]>([]);

  // Carregar equipas ao montar o componente
  useEffect(() => {
    const fetchEquipasAndEscaloes = async () => {
      try {
        const [teamsData, levelsData] = await Promise.all([
          equipasAPI.getAll(),
          escaloesAPI.getAll()
        ]);
        setEquipas(teamsData);
        setEscaloes(levelsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchEquipasAndEscaloes();
  }, []);

  const [loginBtnPos, setLoginBtnPos] = useState({ x: 0, y: 0 });
  const [registerBtnPos, setRegisterBtnPos] = useState({ x: 0, y: 0 });

  // Fun helper to move button randomly
  const moveButton = (type: 'login' | 'register') => {
    // Mantemos o movimento lateral (X) igual
    const xMin = -150;
    const xMax = 150;
    const x = Math.random() * (xMax - xMin) + xMin;

    // Restringimos o movimento vertical (Y) para que o botão não fuja para cima do formulário.
    // Usamos valores positivos para que ele se desloque essencialmente para baixo.
    const yMin = 0;
    const yMax = 150;
    const y = Math.random() * (yMax - yMin) + yMin;

    if (type === 'login') {
      setLoginBtnPos({ x, y });
    } else {
      setRegisterBtnPos({ x, y });
    }
  };

  // --- HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // Login retorna o usuário logado
      const loggedUser = await login(loginEmail, loginPassword);

      // Verificar se é treinador ou atleta não validado
      if (loggedUser && (loggedUser.tipo === 'treinador' || loggedUser.tipo === 'atleta') && !loggedUser.validado) {
        // Fazer logout
        await logout();
        const msg = loggedUser.tipo === 'atleta'
          ? 'Conta de atleta aguarda aprovação do treinador.'
          : 'Conta de treinador ainda não validada pelo administrador.';
        toast.error(msg);
        return;
      }

      toast.success('Login efetuado com sucesso!');
      // (a navegação para a dashboard é feita por quem controla a rota/estado global)
    } catch (error) {
      // Se a API retornar 403 Forbidden com mensagem específica, tentamos mostrar
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLE REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerNome || !registerEmail || !registerPassword || !equipa) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const registerData: RegisterData = {
      nome: registerNome,
      email: registerEmail,
      password: registerPassword,
      tipo: userType,
      equipa: equipa,
      escalao: escalao,
    };

    if (userType === 'atleta') {
      if (!posicao || !numero || !escalao) {
        toast.error('Preencha posição, número e escalão para atletas');
        return;
      }
      registerData.posicao = posicao;
      registerData.numero = numero;
      registerData.escalao = escalao;
      registerData.validado = false; // ✅ Atleta também precisa de validação
    } else if (userType === 'treinador') {
      if (!escalao) {
        toast.error('Preencha o escalão para treinadores');
        return;
      }
      registerData.validado = false; // precisa de validação do admin
    }

    // debug
    console.log('🔍 [DEBUG] Dados a enviar no registo:', registerData);

    try {
      setIsLoading(true);

      // Chama o register do contexto (por ex. AppContext.register)
      await register(registerData);

      // Depois do register, o AppContext pode ter feito setUser automaticamente.
      // Garantimos comportamento desejado:
      if (userType === 'treinador' || userType === 'atleta') {
        // Se o registo criou um user e fez login automaticamente, forçamos logout
        // para ficar no estado "aguardar validação".
        await logout();

        const msg = userType === 'atleta'
          ? 'Registo efetuado! Aguarde aprovação do treinador da sua equipa.'
          : 'Registo efetuado! Aguarde validação do administrador.';

        toast.success(msg);
      }

      // limpar formulário
      setRegisterNome('');
      setRegisterEmail('');
      setRegisterPassword('');
      setEquipa('');
      setPosicao('');
      setNumero('');
      setEscalao('');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginValid = loginEmail && loginPassword;
  const isRegisterValid = () => {
    const baseValid = registerNome && registerEmail && registerPassword && equipa;
    if (!baseValid) return false;
    if (userType === 'atleta') return !!posicao && !!numero && !!escalao;
    if (userType === 'treinador') return !!escalao;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 md:py-12 px-4">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">Registar</TabsTrigger>
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
                  <div
                    onMouseEnter={() => {
                      if (!isLoginValid) moveButton('login');
                      else setLoginBtnPos({ x: 0, y: 0 }); // Reset if valid
                    }}
                    style={{
                      transform: `translate(${loginBtnPos.x}px, ${loginBtnPos.y}px)`,
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    <button type="submit" className="fancy-btn" disabled={isLoading}>
                      <span>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            A entrar...
                          </>
                        ) : (
                          'Entrar'
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>Registe-se como atleta ou treinador</CardDescription>
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
                    <select
                      id="equipa"
                      value={equipa}
                      onChange={(e) => setEquipa(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white text-sm"
                      required
                    >
                      <option value="">Selecionar equipa</option>
                      {equipas.map((team: any) => (
                        <option key={team.id} value={team.nome}>
                          {team.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escalao">Escalão *</Label>
                    <select
                      id="escalao"
                      value={escalao}
                      onChange={(e) => setEscalao(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white text-sm"
                      required
                    >
                      <option value="">Selecionar escalão</option>
                      {escaloes.map((level: any) => (
                        <option key={level.id} value={level.nome}>
                          {level.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Utilizador</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value: string) => {
                        setUserType(value as UserType);
                        if (value === 'treinador') {
                          setPosicao('');
                          setNumero('');
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="atleta" id="atleta" />
                        <Label htmlFor="atleta" className="cursor-pointer">
                          Atleta
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="treinador" id="treinador" />
                        <Label htmlFor="treinador" className="cursor-pointer">
                          Treinador
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {userType === 'treinador' && (
                    <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Label className="text-blue-700 font-semibold">👨‍🏫 Registo como Treinador</Label>
                      <p className="text-sm text-blue-600 mb-2">
                        Será criado automaticamente um registo na tabela de treinadores.
                      </p>
                    </div>
                  )}

                  {userType === 'atleta' && (
                    <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Label className="text-green-700 font-semibold">⚽ Informações do Atleta</Label>
                      <p className="text-xs text-green-600 mb-2">
                        Após o registo, terá de aguardar aprovação do treinador.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="posicao">Posição *</Label>
                        <select
                          id="posicao"
                          value={posicao}
                          onChange={(e) => setPosicao(e.target.value)}
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
                          onChange={(e) => setNumero(e.target.value)}
                          min="1"
                          max="99"
                          required
                        />
                      </div>

                      <p className="text-xs text-green-600 mt-2">* Campos obrigatórios para atletas</p>
                    </div>
                  )}

                  <div
                    onMouseEnter={() => {
                      if (!isRegisterValid()) moveButton('register');
                      else setRegisterBtnPos({ x: 0, y: 0 }); // Reset if valid
                    }}
                    style={{
                      transform: `translate(${registerBtnPos.x}px, ${registerBtnPos.y}px)`,
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    <button type="submit" className="fancy-btn" disabled={isLoading}>
                      <span>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            A criar conta...
                          </>
                        ) : (
                          'Criar Conta'
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >
    </div >
  );
}
