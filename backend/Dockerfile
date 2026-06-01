# Usa uma imagem oficial leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json
COPY package*.json ./

# Instala apenas as dependências que o projeto precisa para rodar
RUN npm install --production

# Copia o resto do código do backend para o contêiner
COPY . .

# EXPOSE apontando a porta do backend
EXPOSE 3000

# Comandos para iniciar a aplicação
CMD ["npm", "start"]
