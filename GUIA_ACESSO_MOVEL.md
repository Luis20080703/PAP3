# 📱 Guia de Acesso Móvel - NexusHand

## Problema Resolvido
O site no telemóvel estava a mostrar "servidor indisponível" porque não conseguia conectar-se à API Laravel.

## ✅ Soluções Implementadas

### 1. **Configuração Dinâmica do IP do Servidor**
- A API agora suporta configuração manual do IP do servidor
- Permite acesso móvel na mesma rede Wi-Fi

### 2. **Componente de Configuração**
- Botão flutuante (⚙️) no canto inferior direito
- Interface para configurar o IP do servidor
- Teste de conexão integrado

### 3. **Servidor Vite Acessível na Rede**
- Configurado para aceitar conexões de dispositivos na rede local

## 🚀 Como Usar no Telemóvel

### Passo 1: Obter o IP do PC
No PC, abra o terminal/PowerShell e execute:
```powershell
ipconfig
```

Procure por "IPv4 Address" na secção da sua rede Wi-Fi. Exemplo:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### Passo 2: Aceder no Telemóvel
1. Certifique-se que o telemóvel está na **mesma rede Wi-Fi** que o PC
2. No telemóvel, abra o browser e aceda a:
   ```
   http://[IP_DO_PC]:3000
   ```
   Exemplo: `http://192.168.1.100:3000`

### Passo 3: Configurar o Servidor
1. Quando a página carregar, clique no botão **⚙️** (Settings) no canto inferior direito
2. No campo "IP do Servidor", insira o IP do PC (ex: `192.168.1.100`)
3. Clique em **"Testar Conexão"** para verificar
4. Se aparecer ✅ "Servidor Conectado", clique em **"Guardar"**
5. A página será recarregada e já deve funcionar!

## 🔍 Verificação

### No PC - Verificar se os servidores estão a correr:

**Laravel API (porta 8000):**
```powershell
netstat -ano | findstr :8000
```
Deve mostrar algo como:
```
TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING
```

**Vite Dev Server (porta 3000):**
```powershell
netstat -ano | findstr :3000
```

### No Telemóvel - Testar a API diretamente:
Abra o browser e aceda a:
```
http://[IP_DO_PC]:8000/api/test
```

Se aparecer uma resposta JSON, a API está acessível! ✅

## 🛠️ Troubleshooting

### Problema: "Servidor Indisponível"
**Soluções:**
1. Verifique se o PC e o telemóvel estão na mesma rede Wi-Fi
2. Verifique se a Firewall do Windows não está a bloquear as portas 3000 e 8000
3. Confirme que os servidores estão a correr no PC

### Problema: "Não consigo aceder ao site"
**Soluções:**
1. Verifique o IP do PC novamente (pode mudar)
2. Tente desativar temporariamente a Firewall do Windows
3. Certifique-se que o servidor Vite está a correr com `npm run dev`

### Problema: "Site carrega mas não mostra dados"
**Soluções:**
1. Abra as configurações (botão ⚙️)
2. Configure o IP do servidor manualmente
3. Teste a conexão antes de guardar

## 📋 Comandos Úteis

### Reiniciar os Servidores

**Laravel:**
```powershell
cd C:\PAP3\Api
php artisan serve --host=0.0.0.0 --port=8000
```

**Vite:**
```powershell
cd C:\PAP3\Andebolonlineplatform-main
npm run dev
```

### Ver o IP do PC rapidamente:
```powershell
ipconfig | findstr "IPv4"
```

## 🎯 Notas Importantes

1. **Mesma Rede Wi-Fi**: O PC e o telemóvel DEVEM estar na mesma rede
2. **IP Dinâmico**: O IP do PC pode mudar. Se deixar de funcionar, verifique o IP novamente
3. **Firewall**: Pode ser necessário permitir as portas 3000 e 8000 na Firewall do Windows
4. **HTTPS**: Como está a usar HTTP (não HTTPS), algumas funcionalidades PWA podem não funcionar no telemóvel

## ✨ Funcionalidades Adicionadas

- ⚙️ **Botão de Configuração**: Sempre visível no canto inferior direito
- 🔄 **Teste de Conexão**: Verifica se o servidor está acessível
- 💾 **Configuração Persistente**: O IP é guardado no localStorage
- 🎨 **Interface Intuitiva**: Design moderno com feedback visual
- 🌐 **Deteção Automática**: Se não configurar manualmente, tenta detetar automaticamente

## 🔐 Segurança

⚠️ **IMPORTANTE**: Esta configuração é apenas para desenvolvimento local. 
Para produção, deve:
- Usar HTTPS
- Configurar CORS adequadamente
- Usar um domínio real
- Implementar autenticação robusta
