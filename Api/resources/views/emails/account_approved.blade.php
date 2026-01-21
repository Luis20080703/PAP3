<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>Conta Aprovada</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

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

        <!-- HEADER COM IMAGEM -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center"
                    background="https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/hero-handball-2.png"
                    style="background-image: url('https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/hero-handball-2.png');
                           background-size: cover;
                           background-position: center 10%;
                           border-radius: 8px 8px 0 0;">
                    
                    <div style="background-color: rgba(37, 99, 235, 0.65); padding: 30px;">
                        <img src="https://raw.githubusercontent.com/Luis20080703/PAP3/main/Andebolonlineplatform-main/public/logo.png"
                             alt="Nexus Hand Logo"
                             style="max-width: 100px; margin-bottom: 10px; display: block;">
                        
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                            NexusHand
                        </h1>
                    </div>
                </td>
            </tr>
        </table>

        <!-- CONTEÚDO -->
        <div class="content">

            <div class="greeting">
                Olá, {{ $user->nome }}!
            </div>

            <p class="message">
                Temos o prazer de informar que o seu pedido de registo foi
                <span class="highlight">aprovado</span>.
            </p>

            <p class="message">
                Já pode aceder à plataforma NexusHand e começar a explorar
                todas as funcionalidades disponíveis para a sua equipa.
            </p>

            <!-- BOTÃO -->
            <div class="btn-container">
                <a href="{{ url('/') }}"
                   style="
                    display: inline-block;
                    width: 10em;
                    height: 3.5em;
                    line-height: 3.5em;
                    text-align: center;
                    border: 3px ridge #149CEA;
                    border-radius: 6px;
                    background-color: #2563eb;
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: bold;
                    text-decoration: none;
                   ">
                    Entrar na Plataforma
                </a>
            </div>

            <p class="message" style="font-size: 14px;">
                Se tiver alguma dúvida, não hesite em contactar o nosso suporte.
            </p>

        </div>

        <!-- FOOTER -->
        <div class="footer">
            &copy; {{ date('Y') }} NexusHand. Todos os direitos reservados.
        </div>

    </div>
</body>
</html>
