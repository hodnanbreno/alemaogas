# 💰 ALEMÃO GÁS - Sistema de Vendas

Um sistema moderno e responsivo de gerenciamento de vendas para a empresa ALEMÃO GÁS, desenvolvido com HTML5, CSS3 e JavaScript puro.

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma dependência externa (funciona offline com localStorage)

## 🚀 Como Executar

### Opção 1: Usar Python (Recomendado)

```bash
# Navegar até a pasta do projeto
cd "Nova pasta (3)"

# Iniciar servidor HTTP
python -m http.server 8000
```

Depois abra em seu navegador:
```
http://localhost:8000/index.html.html
```

### Opção 2: Usar Node.js

```bash
# Instalar http-server (se não tiver)
npm install -g http-server

# Navegar até a pasta
cd "Nova pasta (3)"

# Iniciar servidor
http-server
```

### Opção 3: Abrir diretamente no navegador

Abra o arquivo `index.html.html` diretamente no seu navegador com duplo clique.

## 📁 Estrutura de Arquivos

```
Nova pasta (3)/
├── index.html.html       # Arquivo principal do sistema
├── styles.css            # Estilos CSS (cores, layout, responsividade)
├── functions.js          # Funções JavaScript principais
└── README.md            # Este arquivo
```

## 🎨 Paleta de Cores

- **Preto**: #1a1a1a (fundo principal)
- **Azul Água**: #00bcd4 (destaques, headers)
- **Laranja Gás**: #ff7a00 (botões, ênfase)
- **Verde**: #4caf50 (lucros positivos)
- **Vermelho**: #f44336 (prejuízos)

## 👤 Credenciais Padrão

```
Usuário: ALEMAO
Senha: 96103719
```

## 🎯 Funcionalidades Principais

### 📊 Dashboard
- Visão geral completa do dia
- Lucro real em destaque (verde/vermelho)
- Total de vendas por forma de pagamento
- Quantidade de produtos vendidos
- Margem de lucro calculada automaticamente

### 🛍️ Vendas
- Registrar novas vendas
- Múltiplos produtos (Gás, Água, Regulador, Mangueira)
- Formas de pagamento (Dinheiro, PIX, Cartão, Fiado)
- Cálculo automático de totais

### 📋 Fiados
- Controle de vendas não pagas
- Histórico de fiados por cliente
- Exportação para CSV

### 💳 Créditos
- Gerencie créditos disponibilizados
- Histórico de transações

### ⚙️ Configurações
- **Balancete Mensal**: Resumo de vendas do mês
- **Entregadores**: Gerenciar equipe de entrega
- Definição de custos de produtos

### 💾 Backup/Restore
- Salvar dados em arquivo JSON
- Restaurar dados de backup anterior

## 💾 Armazenamento de Dados

Todos os dados são armazenados no **localStorage** do navegador:
- Não há servidor externo necessário
- Dados perseguem entre sessões
- Backups manuais disponíveis

## 📱 Responsividade

O sistema funciona perfeitamente em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 600px)

## 🔒 Segurança

⚠️ **Nota**: Este é um sistema local. Para produção, implemente:
- Autenticação segura no servidor
- Criptografia de dados
- Validação no backend

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, contate o desenvolvedor.

---

**Última atualização**: 24 de janeiro de 2026
**Versão**: 2.0 - Layout Moderno
