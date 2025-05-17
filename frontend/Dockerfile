# Dockerfile para servir frontend ya compilado con Nginx

FROM nginx:stable-alpine

# Copia la carpeta dist (build ya hecho) al directorio público de Nginx
COPY ./dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
