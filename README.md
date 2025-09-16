# 📂 Projects managment – Fullstack App

Aplicación Fullstack para la gestión de proyectos, desarrollada con:

- **Backend:** Node.js, Express, Prisma ORM y PostgreSQL  
- **Frontend:** React + Tailwind CSS + Recharts  
- **Extras:** Swagger para documentación de API y Gemini API para generación automática de resúmenes.

---

##  Características principales

✅ Diseño **responsivo** con Tailwind CSS  
✅ CRUD completo de proyectos  
✅ Búsqueda y filtros en tiempo real  
✅ Estados visuales con **iconos y colores**  
✅ Validación de formularios  
✅ Manejo de errores y estados de carga  
✅ Vista en tarjetas y tabla  
✅ Progreso calculado automáticamente  
✅ **Gemini AI**: generación de resúmenes automáticos  
✅ **Swagger**: documentación interactiva de API  
✅ **Prisma Studio**: administración visual de la base de datos  

---

## ⚙️ Tecnologías

**Backend**  
- Node.js + Express  
- Prisma ORM + PostgreSQL  
- Swagger (swagger-ui-express + swagger-autogen)  
- express-async-handler  
- dotenv  
- @google/generative-ai  

**Frontend**  
- React (CRA)  
- Tailwind CSS  
- Axios  
- Recharts  
- Lucide-react (iconos)  

---

## 📂 Estructura de carpetas

### Backend
```
backend/
├── controllers/     # Lógica de validación y manejo de requests
├── services/        # Conexión a Prisma y lógica de negocio
├── routes/          # Definición de endpoints
├── prisma/          # Schema y migraciones de base de datos
├── server.js        # Configuración principal del servidor
├── swagger.js       # Configuración de Swagger
└── .env             # Variables de entorno (DB, claves API)
```

### Frontend
```
frontend/
├── components/      # Componentes UI (cards, forms, layouts, gráficos…)
├── hooks/           # Custom hooks
├── pages/           # Páginas principales (lista, detalle, manager…)
├── services/        # Conexión con API backend (Axios)
├── utils/           # Funciones auxiliares
├── App.js           # Configuración principal
├── index.js         # Render de React
└── tailwind.config.js
```

---

## 🛠️ Instalación y ejecución

### 1. Clonar repositorio
```bash
git clone https://github.com/MateoGomez11/projectManagment_FullStack.git
cd projectApp
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Configura el archivo `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://glocation_user:1234@localhost:5432/glocation"
PORT=5001
GOOGLE_API_KEY=tu_clave_google
```

Migraciones:
```bash
npm run migrate:dev
```

Levantar servidor:
```bash
npm run dev
```

📄 Swagger disponible en:  
[http://localhost:5001/docs](http://localhost:5001/docs)

---

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

Variables de entorno (`.env`):
```env
REACT_APP_API_URL=http://localhost:5001/api
```

Levantar servidor:
```bash
npm start
```

---

## 📡 Endpoints principales

- **GET /api/projects** → Listar proyectos  
- **GET /api/projects/:id** → Obtener proyecto por ID  
- **POST /api/projects** → Crear nuevo proyecto  
- **PUT /api/projects/:id** → Actualizar proyecto  
- **DELETE /api/projects/:id** → Eliminar proyecto  
- **GET /api/projects/summary/:id** → Generar/resumir con Gemini  
- **GET /api/projects/analytics/status** → Conteo por estado  
- **GET /api/projects/analytics/months** → Conteo por mes  

---

## 🧪 Ejemplos de peticiones API




### Crear proyecto
![Postman - Crear Proyecto](Screenshots/CrearProyectoPostman.png)


### Obtener proyectos
![Postman - Listar Proyectos](Screenshots/ListarProyectosPostman.png)

### Actualizar proyecto
![Postman - Actualizar Proyecto](Screenshots/ActualizarProyectoPostman.png)

### Generar resumen con Gemini
![Postman - Generar resumen con Gemini](Screenshots/ResumenGemini.png)

### Eliminar proyecto
![Postman - Generar resumen con Gemini](Screenshots/EliminarProyecto.png)



---

## 🎨 Interfaz

📌 **Agrega capturas del frontend en la carpeta `/docs/screenshots/` y enlázalas aquí.**


### Vista tipo dashboard donde vemos un resumen de los proyectos
![Vista dashboard](Screenshots/dashboard.png)

### Vista de detalle
![Vista detalle](Screenshots/Detalle.png)

### Vista crear/actualizar
![Vista formulario](Screenshots/formulario.png)

### Gráficos con Recharts
![Graficos con Recharts](Screenshots/Graficos.png)


---

## 💡 Decisiones técnicas

- **Prisma ORM**: elegido por simplicidad y rapidez en desarrollo con PostgreSQL.  
- **Arquitectura modular**: separación clara entre **Routes → Controllers → Services**.  
- **Swagger**: facilita la validación de endpoints durante pruebas técnicas.  
- **React + Tailwind**: garantiza un diseño moderno y responsivo sin overhead de CSS.  
- **Recharts**: librería ligera para dashboards con datos analíticos.  
- **Gemini API**: valor agregado para enriquecer los proyectos con resúmenes automáticos.  

---

## 📊 Scripts disponibles

### Backend
```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "migrate:dev": "prisma migrate dev",
  "migrate:deploy": "prisma migrate deploy",
  "generate": "prisma generate",
  "studio": "prisma studio"
}
```


---

## 👨‍💻 Mateo Gomez Patiño
📌 Tech stack: Node.js · Express · PostgreSQL · Prisma · React · Tailwind CSS · Recharts · Swagger · Gemini AI.  

---