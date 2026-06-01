# Gerenciador de Tarefas Web

Projeto simples e funcional com:

- **Frontend:** HTML, CSS e JavaScript puro
- **Backend:** Node.js + Express
- **Banco de dados:** MySQL
- **Deploy simples em VM Ubuntu:** Node + PM2 + Nginx

## Estrutura do projeto

```text id="r48u85"
task-manager-webapp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── tasksController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   └── tasks.js
│   │   └── db.js
│   ├── .env.example
│   ├── database.sql
│   ├── ecosystem.config.js
│   ├── package.json
│   └── server.js
├── deploy/
│   └── nginx-task-manager.conf
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Funcionalidades

- Criar tarefa
- Listar tarefas
- Editar tarefa
- Excluir tarefa
- Marcar tarefa como concluída
- Reabrir tarefa concluída
- Filtrar por todas, pendentes e concluídas

## 1) Instalação local

### Requisitos

- Node.js 20+
- MySQL 8+
- NPM

### Instalar dependências do backend

```bash
cd backend
npm install
```

### Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Depois edite o `.env` com os dados reais do seu MySQL:

```env id="5myo2j"
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=task_manager
```

### Criar banco e tabela

Entre no MySQL e execute:

```bash
mysql -u root -p < database.sql
```

### Rodar o projeto

```bash
npm start
```

Acesse:

```text id="f95gvg"
http://SEU_IP_OU_LOCALHOST:3000
```

---

## 2) Rotas da API

### Listar todas as tarefas
```http
GET /api/tasks
```

### Listar por status
```http
GET /api/tasks?status=pendente
GET /api/tasks?status=concluida
```

### Buscar uma tarefa por ID
```http
GET /api/tasks/:id
```

### Criar tarefa
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa"
}
```

### Atualizar tarefa
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Tarefa atualizada",
  "description": "Nova descrição",
  "status": "pendente"
}
```

### Atualizar apenas o status
```http
PATCH /api/tasks/:id/status
Content-Type: application/json

{
  "status": "concluida"
}
```

### Excluir tarefa
```http
DELETE /api/tasks/:id
```

---

## 3) Subir em uma VM Ubuntu

## Atualizar sistema

```bash
sudo apt update && sudo apt upgrade -y
```

## Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Conferir versões

```bash
node -v
npm -v
```

## Instalar MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

## Fazer configuração inicial do MySQL

```bash
sudo mysql_secure_installation
```

## Criar pasta do projeto na VM

```bash
sudo mkdir -p /var/www/task-manager
sudo chown -R $USER:$USER /var/www/task-manager
```

Envie os arquivos para:

```text id="8h0nig"
/var/www/task-manager
```

## Instalar dependências do backend na VM

```bash
cd /var/www/task-manager/backend
npm install
```

## Configurar `.env`

Crie:

```bash
nano /var/www/task-manager/backend/.env
```

Exemplo:

```env id="f9xv4r"
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=task_manager
```

## Criar banco e tabela na VM

```bash
cd /var/www/task-manager/backend
mysql -u root -p < database.sql
```

## Testar aplicação manualmente

```bash
cd /var/www/task-manager/backend
npm start
```

Acesse no navegador:

```text id="jkrp6n"
http://IP_DA_VM:3000
```

---

## 4) Rodar em produção com PM2

Instalar PM2 globalmente:

```bash
sudo npm install -g pm2
```

Iniciar aplicação:

```bash
cd /var/www/task-manager/backend
pm2 start ecosystem.config.js
```

Salvar configuração do PM2:

```bash
pm2 save
pm2 startup
```

Ver status:

```bash
pm2 list
pm2 logs task-manager
```

---

## 5) Configurar Nginx como proxy reverso

Instalar Nginx:

```bash
sudo apt install -y nginx
```

Copiar a configuração de exemplo:

```bash
sudo cp /var/www/task-manager/deploy/nginx-task-manager.conf /etc/nginx/sites-available/task-manager
```

Editar o domínio ou IP:

```bash
sudo nano /etc/nginx/sites-available/task-manager
```

Ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/task-manager /etc/nginx/sites-enabled/
```

Testar configuração:

```bash
sudo nginx -t
```

Reiniciar Nginx:

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Agora o app deverá abrir em:

```text id="xrb2ij"
http://IP_DA_VM
```

---

## 6) Observações importantes

- O backend serve o frontend automaticamente.
- Você não precisa de outro servidor só para o frontend.
- O Nginx apenas encaminha as requisições para o Node.js.
- Se quiser trocar a porta, altere no `.env`.
- Se o MySQL estiver em outro servidor, altere `DB_HOST`.

## 7) Melhorias futuras que você pode adicionar

- Login de usuário
- Categorias de tarefas
- Prioridade
- Paginação
- Busca por texto
- Docker
- SSL com Certbot
- Multiusuário

## 8) Teste rápido de saúde

No navegador ou curl:

```bash
curl http://127.0.0.1:3000/health
```

Retorno esperado:

```json id="dhrwoz"
{
  "ok": true,
  "message": "Servidor e conexão com banco funcionando."
}
```
