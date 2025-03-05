# express-app/Dockerfile
FROM node:20.11.1

# Crear y usar directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto de la app
EXPOSE 3000