# Migração de Capacitor para Flutter

## Estrutura criada

- `andebol_flutter_app/` - Novo projeto Flutter
- `lib/main.dart` - Aplicação principal
- `lib/services/` - Serviços de API e autenticação
- `lib/screens/` - Telas da aplicação
- `android/` - Configuração Android nativa

## Funcionalidades implementadas

1. **Autenticação**: Login/logout com armazenamento local
2. **API Service**: Comunicação com backend Laravel (127.0.0.1:8000)
3. **Telas básicas**: Login e Home
4. **Estado global**: Provider para gerenciamento de estado

## Próximos passos

1. Instalar Flutter SDK
2. Executar `flutter pub get` no diretório `andebol_flutter_app/`
3. Configurar emulador Android ou dispositivo
4. Executar `flutter run`

## Endpoints utilizados

- POST /api/login
- POST /api/register  
- GET /api/equipas
- GET /api/estatisticas-equipas
- GET /api/estatisticas-atletas

## Dependências principais

- `http`: Requisições HTTP
- `provider`: Gerenciamento de estado
- `shared_preferences`: Armazenamento local
- `flutter_secure_storage`: Armazenamento seguro