import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent } from './ui/tabs';
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
  const { login, register } = useApp();

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
  const [registerCipa, setRegisterCipa] = useState(''); // New state for registration
  const [escaloes, setEscaloes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('login');

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



  // --- HANDLE LOGIN ---
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

  // --- HANDLE REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerNome || !registerEmail || !registerPassword || !equipa) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const registerData: RegisterData & { cipa?: string } = {
      nome: registerNome,
      email: registerEmail,
      password: registerPassword,
      tipo: userType,
      equipa: equipa,
      escalao: escalao,
    };

    if (userType === 'atleta') {
      if (!posicao || !numero || !escalao || !registerCipa) {
        toast.error('Preencha posição, número, escalão e CIPA para atletas');
        return;
      }
      if (registerCipa.length !== 6) {
        toast.error('O número CIPA deve ter 6 dígitos.');
        return;
      }
      registerData.posicao = posicao;
      registerData.numero = numero;
      registerData.escalao = escalao;
      registerData.cipa = registerCipa;
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



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
      <div className="w-full max-w-[500px]">
        <button onClick={onBack} className="voltar-button" style={{ marginBottom: '1rem', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }} /> Voltar
        </button>

        <div className="custom-login-container bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="login-toggle-container">
              <div className="login-toggle-heading">NexusHand</div>
              <div className="login-toggle-wrapper">
                <input
                  type="radio"
                  name="auth_type"
                  value="login"
                  id="toggle-login"
                  className="toggle-input"
                  checked={activeTab === 'login'}
                  onChange={() => setActiveTab('login')}
                  readOnly
                />
                <label htmlFor="toggle-login" className="login-toggle-tab" onClick={() => setActiveTab('login')}> Entrar no jogo </label>

                <input
                  type="radio"
                  name="auth_type"
                  value="register"
                  id="toggle-register"
                  className="toggle-input"
                  checked={activeTab === 'register'}
                  onChange={() => setActiveTab('register')}
                  readOnly
                />
                <label htmlFor="toggle-register" className="login-toggle-tab" onClick={() => setActiveTab('register')}> Criar conta </label>
              </div>
            </div>

            <TabsContent value="login">
              <div className="login-heading">Entrar no jogo</div>
              <form onSubmit={handleLogin} className="login-form">
                <input
                  required
                  className="login-input"
                  type="email"
                  name="email"
                  id="login-email"
                  placeholder="E-mail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  required
                  className="login-input"
                  type="password"
                  name="password"
                  id="login-password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />


                <button
                  className="login-submit-button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> A entrar no jogo
                    </span>
                  ) : 'Entrar no jogo'}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <div className="login-heading">Criar conta</div>
              <form onSubmit={handleRegister} className="login-form">
                <input
                  required
                  className="login-input"
                  type="text"
                  placeholder="Nome Completo"
                  value={registerNome}
                  onChange={(e) => setRegisterNome(e.target.value)}
                />
                <input
                  required
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <input
                  required
                  className="login-input"
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />

                <select
                  value={equipa}
                  onChange={(e) => setEquipa(e.target.value)}
                  className="login-input"
                  required
                >
                  <option value="">Selecionar equipa</option>
                  {equipas.map((team: any) => (
                    <option key={team.id} value={team.nome}>
                      {team.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={escalao}
                  onChange={(e) => setEscalao(e.target.value)}
                  className="login-input"
                  required
                >
                  <option value="">Selecionar escalão</option>
                  {escaloes.map((level: any) => (
                    <option key={level.id} value={level.nome}>
                      {level.nome}
                    </option>
                  ))}
                </select>

                <div className="mt-4 px-2">
                  <Label className="mb-2 block text-gray-500 text-sm">Tipo de Utilizador</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: string) => {
                      setUserType(value as UserType);
                      if (value === 'treinador') {
                        setPosicao('');
                        setNumero('');
                        setRegisterCipa('');
                      }
                    }}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="atleta" id="atleta" />
                      <Label htmlFor="atleta" className="cursor-pointer text-sm text-gray-600">Atleta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="treinador" id="treinador" />
                      <Label htmlFor="treinador" className="cursor-pointer text-sm text-gray-600">Treinador</Label>
                    </div>
                  </RadioGroup>
                </div>

                {userType === 'atleta' && (
                  <>
                    <select
                      value={posicao}
                      onChange={(e) => setPosicao(e.target.value)}
                      className="login-input"
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
                    <input
                      type="number"
                      placeholder="Número da Camisola"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="login-input"
                      min="1"
                      max="99"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nº CIPA (6 dígitos)"
                      value={registerCipa}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 6) setRegisterCipa(val);
                      }}
                      className="login-input"
                      required
                    />
                  </>
                )}

                <button
                  className="login-submit-button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'A criar conta...' : 'Criar'}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
