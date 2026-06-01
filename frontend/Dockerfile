# Usa uma imagem oficial e super leve do Nginx
FROM nginx:alpine

# Copia todos os arquivos do seu frontend para a pasta pública padrão do Nginx
COPY . /usr/share/nginx/html

# Remove o Dockerfile de dentro da pasta pública para não ficar exposto à toa
RUN rm /usr/share/nginx/html/Dockerfile

# Expõe a porta 80 do contêiner
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
