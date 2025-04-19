# 🛍️ E-Commerce Platform with Event-Driven Architecture

![Banner](docs/images/banner.png)

Una plataforma moderna de comercio electrónico construida con una **arquitectura orientada a eventos**, utilizando **Node.js**, **TypeScript**, **Kafka**, **MongoDB** y **PostgreSQL**.

---

## 📚 Tabla de Contenidos

- [📐 Arquitectura del Sistema](#-arquitectura-del-sistema)
- [🧩 Componentes](#-componentes)
- [⚙️ Instalación](#-instalación)
- [🚀 Ejecución de la Aplicación](#-ejecución-de-la-aplicación)
- [🧪 Pruebas](#-pruebas)
- [📖 Documentación de la API](#-documentación-de-la-api)
- [🖼️ Capturas de Pantalla](#-capturas-de-pantalla)
- [🛠️ Tecnologías Usadas](#-tecnologías-usadas)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)

---

## 📐 Arquitectura del Sistema

El sistema adopta un enfoque **event-driven** que incluye:

- **Event Sourcing**: Cada cambio de estado se representa como un evento inmutable.
- **CQRS**: Modelos separados para lectura y escritura.
- **Microservicios** comunicándose mediante eventos en **Kafka**.

![Arquitectura](docs/images/architecture.png)

---

## 🧩 Componentes

### 🧠 Backend

- **User Service**: Registro, autenticación y gestión de usuarios.
- **Product Service**: Gestión de productos, inventario y precios.
- **Cart Service**: Operaciones de carrito de compras.
- **Order Service**: Procesamiento de órdenes y pagos.
- **Notification Service**: Notificaciones y correos.

### 📬 Consumers de Eventos

- **Welcome Flow Consumer**
- **Notification Consumer**
- **Cart Removal Consumer**
- **Invoice Processing Consumer**

### 🖥️ Frontend

- Aplicación SPA con React y diseño responsive.
- Gestión de estado con Context API.
- Navegación con React Router.

---

## ⚙️ Instalación

### 🔧 Requisitos

- Node.js (v14+)
- Docker + Docker Compose
- PostgreSQL & MongoDB (si no usas Docker)
- Kafka (si no usas Docker)

### 🧭 Pasos

```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
npm install
```

Crea un archivo `.env` con:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
KAFKA_BROKERS=localhost:9092
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

---

## 🚀 Ejecución de la Aplicación

### 🐳 Con Docker

```bash
docker-compose up -d
npm run migrations
npm run seed
npm start
```

### 💻 Manualmente

1. Levanta PostgreSQL, MongoDB y Kafka
2. Ejecuta migraciones:

```bash
npm run migrations
npm run seed
npm start
```

3. Inicia el frontend:

```bash
cd E-Commerce-Front
npm install
npm run dev
```

- Backend: http://localhost:3000  
- Frontend: http://localhost:5173

---

## 🧪 Pruebas

```bash
npm test                       # Todas las pruebas
npm test -- --testPathPattern=user.service
npm test -- --coverage         # Con cobertura
```

---

## 📖 Documentación de la API

Disponible en Swagger UI:  
👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🖼️ Capturas de Pantalla

### 👥 Interfaz de Usuario

| Página | Imagen |
|-------|--------|
| Home | ![Home](docs/images/home-page.png) |
| Catálogo de Productos | ![Product Listing](docs/images/product-listing.png) |
| Detalle del Producto | ![Product Detail](docs/images/product-detail.png) |
| Carrito de Compras | ![Shopping Cart](docs/images/shopping-cart.png) |
| Checkout | ![Checkout](docs/images/checkout.png) |
| Confirmación de Orden | ![Order Confirmation](docs/images/order-confirmation.png) |

### 🛠️ Dashboard Administrativo

| Página | Imagen |
|--------|--------|
| Gestión de Productos | ![Admin Products](docs/images/admin-products.png) |
| Gestión de Órdenes | ![Admin Orders](docs/images/admin-orders.png) |

### 🔄 Visualización del Flujo de Eventos

![Event Flow](docs/images/event-flow.png)

---

## 🛠️ Tecnologías Usadas

### Backend
- Node.js • TypeScript • Express
- Kafka • MongoDB • PostgreSQL
- Jest

### Frontend
- React • TypeScript • Tailwind CSS
- React Router • Context API

### DevOps
- Docker • Docker Compose • GitHub Actions

---

## 🤝 Contribuciones

¡Contribuciones son bienvenidas!

```bash
# 1. Haz un fork
# 2. Crea una rama: git checkout -b feature/nueva-feature
# 3. Realiza tus cambios: git commit -m 'Agrega nueva funcionalidad'
# 4. Push: git push origin feature/nueva-feature
# 5. Abre un Pull Request
```

---

## 📄 Licencia

Distribuido bajo la **Licencia MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más información.
