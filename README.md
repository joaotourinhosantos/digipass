# 📲 CardPass

**CardPass** é um sistema mobile de controle de entrada e saída de pessoas em uma empresa. Ele permite que usuários façam login, editem seu perfil e registrem movimentações de entrada e saída. O sistema possui autenticação segura via JWT e backend conectado a banco de dados PostgreSQL, com potencial de expansão comercial.

---

## 🚀 Tecnologias Utilizadas

### 🖥 Backend
- **Node.js** – Ambiente de execução JavaScript
- **Express.js** – Framework para API REST
- **PostgreSQL** ou **SQLite** – Banco de dados relacional
- **JWT (jsonwebtoken)** – Autenticação por token
- **bcrypt** – Criptografia de senhas
- **dotenv** – Gerenciamento de variáveis de ambiente
- **CORS** – Permite requisições entre frontend e backend

### 📱 Frontend (Mobile)
- **React Native** – Desenvolvimento do app mobile
- **Expo** – Ambiente de desenvolvimento simplificado
- **expo-router** – Navegação baseada em arquivos
- **AsyncStorage** – Armazenamento de token local
- **React Navigation** – Navegação entre telas
- **FontAwesome (Expo Icons)** – Ícones estilizados
- **TypeScript** – Tipagem estática (se ativado)

---

## 📄 Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha
- Registro de novos usuários
- Armazenamento seguro do token JWT
- Redirecionamento automático conforme autenticação

### 🧑 Perfil
- Cadastro de nome, contato e foto
- Visualização de dados pessoais
- Edição de **contato** e **foto**
- Logout

### 📋 Movimentações
- Registro de entrada/saída com observações
- Listagem dos registros com data e tipo
- Edição e exclusão de movimentações
- Atualização automática

### 👤 Administração
- Usuário `admin` pode:
  - Visualizar dados de todos os usuários
  - Bloquear/desbloquear contas
  - Trocar senhas
  - Ver movimentações gerais

---

## 🗃️ Estrutura do Banco de Dados

### `usuarios`
| Campo       | Tipo         | Descrição                           |
|-------------|--------------|-------------------------------------|
| id          | SERIAL       | Chave primária                      |
| email       | VARCHAR(50)  | E-mail do usuário                   |
| senha       | VARCHAR(255) | Senha criptografada (bcrypt)        |
| tipoUsuario | INTEGER      | 0 = comum, 1 = admin                |
| mudaSenha   | BOOLEAN      | Troca de senha no próximo login     |
| liberacao   | BOOLEAN      | Conta ativa (1) ou inativa (0)      |

### `perfil`
| Campo   | Tipo         | Descrição                          |
|---------|--------------|------------------------------------|
| id      | SERIAL       | Chave primária                     |
| userID  | INTEGER      | FK de `usuarios`                   |
| nome    | VARCHAR(50)  | Nome completo                      |
| contato | VARCHAR(11)  | WhatsApp com DDD                   |
| foto    | TEXT         | Caminho da imagem de perfil        |

### `movimentacoes`
| Campo        | Tipo         | Descrição                         |
|--------------|--------------|-----------------------------------|
| id           | SERIAL       | Chave primária                    |
| usuario_id   | INTEGER      | FK de `usuarios`                  |
| tipo         | VARCHAR(10)  | "entrada" ou "saida"              |
| data         | TIMESTAMP    | Data e hora do registro           |
| observacao   | TEXT         | Comentário opcional               |

