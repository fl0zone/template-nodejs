# Utilizar una imagen base de Node
FROM node:16

# Establecer un directorio de trabajo
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de archivos de tu proyecto al contenedor
COPY . .

# Puppeteer requiere algunas dependencias adicionales que no están en la imagen base de Node
# Estas dependencias son necesarias para ejecutar navegadores headless.
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils

# Establecer el puerto en una variable de entorno
ENV PORT 8080
EXPOSE $PORT

# Comando para ejecutar tu aplicación
CMD [ "npm", "start" ]
