# 🏠 RDRP - Frontend Revisión de Casas

[English](#english) | [Español](#español)

---

## English

### 📌 Overview
This is the **frontend** of the **House Inspection System (RDRP - Revisión de Casas)**.  
It was developed with **React + TypeScript + Vite** and styled with **Tailwind CSS**.  
The application is optimized for **mobile and tablet** use by inspectors to manage house inspections in real time.

### ✨ Features
- 🔐 **Login system** for companies and users.  
- 👥 **Clients management** (create, edit, delete, search by RUT or name).  
- 📍 **Google Maps integration** for addresses and geolocation.  
- 📝 **Requests/Inspections management** (property data, type of inspection, status).  
- 🗂️ **Spaces and observations**: add, edit, delete, update status (pending, done, persists).  
- 📷 **Upload images** for observations (Cloudinary integration).  
- 📑 **PDF report generation** (classic and GOLD versions).  
- 📊 **Internal control panel** with statistics and usage tracking.  

### 🛠️ Tech Stack
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)  
- [Vite](https://vitejs.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Axios](https://axios-http.com/) (API requests)  
- [HeadlessUI](https://headlessui.dev/) (UI components)  

### 🚀 Getting Started
1. Clone this repository:
   ```bash
   git clone https://github.com/your-user/frontend-revision-casa.git
   cd frontend-revision-casa

🌐 Deployment

Frontend can be deployed on Netlify, Vercel or any static hosting.

Configure environment variables in your deploy panel.

📜 License

This project is proprietary to RDRP. Not for public distribution without authorization.

---

## Español

📌 Descripción

Este es el frontend del Sistema de Inspección de Casas (RDRP - Revisión de Casas).
Está desarrollado con React + TypeScript + Vite y estilizado con Tailwind CSS.
La aplicación está optimizada para uso en móviles y tablets, permitiendo a los inspectores gestionar inspecciones en tiempo real.

✨ Funcionalidades

🔐 Login para empresas y usuarios.

👥 Gestión de clientes (crear, editar, eliminar, búsqueda por RUT o nombre).

📍 Integración con Google Maps para direcciones y geolocalización.

📝 Gestión de solicitudes/inspecciones (datos de la propiedad, tipo de inspección, estado).

🗂️ Espacios y observaciones: agregar, editar, eliminar, actualizar estado (pendiente, realizado, persiste).

📷 Subida de imágenes para observaciones (integración con Cloudinary).

📑 Generación de informes PDF (versión clásica y GOLD).

📊 Panel de control interno con estadísticas y registro de uso.

🛠️ Tecnologías

React + TypeScript

Vite

Tailwind CSS

Axios (para peticiones API)

HeadlessUI (componentes UI)

🚀 Cómo comenzar

Clona este repositorio:

git clone https://github.com/tu-usuario/frontend-revision-casa.git
cd frontend-revision-casa


Instala dependencias:

npm install


Crea el archivo de entorno .env:

VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_KEY=TU_API_KEY_DE_GOOGLE


Inicia el servidor de desarrollo:

npm run dev


Compila para producción:

npm run build

🌐 Despliegue

El frontend se puede desplegar en Netlify, Vercel o cualquier hosting estático.

Configura las variables de entorno en tu panel de despliegue.

📜 Licencia

Este proyecto es propiedad de RDRP. No está permitido su uso o distribución sin autorización.