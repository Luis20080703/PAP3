import re

# Ler o ficheiro
with open(r'c:\PAP3\Andebolonlineplatform-main\src\services\api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Padrão a procurar (versão simplificada)
old_pattern = r"if \(\!user\.tipo \|\| \!\['admin', 'root'\]\.includes\(user\.tipo\)\) \{[^}]+throw new Error\('Sessão de admin inválida[^}]+\}"

# Novo código
new_code = """if (!['admin', 'root'].includes(user.tipo)) {
            console.error('❌ Sessão substituída por utilizador não-admin.');
            localStorage.removeItem('current_user');
            localStorage.removeItem('api_token');
            if (typeof window !== 'undefined') {
              alert('Sessão substituída. Faça login novamente.');
              window.location.href = '/';
            }
            throw new Error('Sessão inválida.');
          } else {
            console.warn('⚠️ Admin recebeu 403. Token pode ter sido substituído.');
            console.warn('💡 Se persistir, faça logout e login novamente.');
          }"""

# Fazer a substituição
content = re.sub(old_pattern, new_code, content, flags=re.DOTALL)

# Guardar
with open(r'c:\PAP3\Andebolonlineplatform-main\src\services\api.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Correção aplicada com sucesso!")
