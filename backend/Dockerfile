# Usa una imagen oficial de Node con soporte para TypeScript
FROM node:18

# Crea carpeta de trabajo
WORKDIR /app

# Copia package.json y lock para instalar dependencias
COPY package*.json ./

# Instala dependencias de producción y desarrollo
RUN npm install

# Copia el resto del código
COPY . .

# Compila el TypeScript
RUN npm run build

# Expón el puerto (ajusta si usas otro)
EXPOSE 3000

# Arranca la app compilada
CMD ["node", "dist/index.js"]
