<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Conta Aprovada</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #374151;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #2563eb; /* Nexus Hand Blue */
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #111827;
        }
        .message {
            margin-bottom: 30px;
            color: #4b5563;
        }
        .btn-container {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        .highlight {
            color: #2563eb;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header using Public URLs (No Attachments) -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td align="center" style="background-image: url('https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/hero-handball.jpg'); background-size: cover; background-position: center 70%; border-radius: 8px 8px 0 0;" background="https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/hero-handball-2.png">
                    <!-- Semi-transparent overlay to make text readable -->
                    <div style="background-color: rgba(37, 99, 235, 0.6); padding: 30px; border-radius: 8px 8px 0 0;">
                        <img src="https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/logo.png" alt="Nexus Hand Logo" style="max-width: 100px; height: auto; margin-bottom: 10px; display: block;">
                        <h1 style="color: #ffffff; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Nexus Hand</h1>
                    </div>
                </td>
            </tr>
        </table>
        
        <div class="content">
            <div class="greeting">Olá, {{ $user->nome }}!</div>
            
            <p class="message">
                Temos o prazer de informar que o seu pedido de registo foi <span class="highlight">aprovado</span>.
            </p>
            
            <p class="message">
                Já pode aceder à plataforma Nexus Hand e começar a explorar todas as funcionalidades disponíveis para a sua equipa.
            </p>
            
            <div class="btn-container">
                <a href="{{ url('/') }}" class="btn">Entrar na Plataforma</a>
            </div>
            
            <p class="message" style="font-size: 14px;">
                Se tiver alguma dúvida, não hesite em contactar o nosso suporte.
            </p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} Nexus Hand. Todos os direitos reservados.
        </div>
    </div>
</body>
</html>
