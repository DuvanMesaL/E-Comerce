# 🚀 E-Commerce Platform | Event-Driven Architecture

[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![license](https://img.shields.io/badge/license-MIT-green.svg)]()
[![architecture](https://img.shields.io/badge/architecture-Event--Driven-red.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-16+-brightgreen.svg)]()

> A modern e-commerce platform built with an event-driven architecture using **Node.js**, **TypeScript**, **Kafka**, **MongoDB**, and **PostgreSQL**.

---

## 📑 Table of Contents

- [📌 Overview](#-overview)
- [🏗️ Architecture](#-architecture)
- [🧩 Components](#-components)
- [⚙️ Installation](#-installation)
- [🚀 Running the Application](#-running-the-application)
- [🧪 Testing](#-testing)
- [📘 API Documentation](#-api-documentation)
- [🖼️ Screenshots](#-screenshots)
- [🛠️ Technologies Used](#-technologies-used)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📌 Overview

This platform leverages event-driven design principles to ensure scalability, traceability, and modularity. It supports full e-commerce flows including product management, shopping carts, orders, and notifications.

---

## 🏗️ Architecture

The application follows an **Event-Driven Architecture** pattern using:

- **Event Sourcing**: Each change in state is stored as an immutable event.
- **CQRS**: Separate models for commands (writes) and queries (reads).
- **Microservices** communicate asynchronously via **Kafka**.

![Architecture](docs/images/architecture.png)

---

## 🧩 Components

### 🔙 Backend Services

- **User Service** – Registration, authentication, profile.
- **Product Service** – Product catalog, inventory, and prices.
- **Cart Service** – Shopping cart operations.
- **Order Service** – Order processing and payment.
- **Notification Service** – Emails and alerts.

### 📦 Event Consumers

- **Welcome Flow Consumer**
- **Notification Consumer**
- **Cart Removal Consumer**
- **Invoice Processing Consumer**

### 💻 Frontend

- Built with **React**, **TailwindCSS**, and **React Router**.
- SPA architecture with responsive design.

---

## ⚙️ Installation

### 🔧 Requirements

- Node.js (v16+)
- Docker & Docker Compose
- PostgreSQL & MongoDB (or Docker)
- Kafka (or Docker)

### 🧭 Setup

```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
npm install
```

Create a `.env` file:

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

## 🚀 Running the Application

### 🐳 With Docker

```bash
docker-compose up -d
npm run migrations
npm run seed
npm start
```

### ⚒️ Manually

1. Start PostgreSQL, MongoDB, Kafka manually
2. Run:

```bash
npm run migrations
npm run seed
npm start
```

3. Launch frontend:

```bash
cd E-Commerce-Front
npm install
npm run dev
```

- Backend: http://localhost:3000  
- Frontend: http://localhost:5173

---

## 🧪 Testing

```bash
npm test                            # All tests
npm test -- --testPathPattern=...  # Specific tests
npm test -- --coverage             # With coverage
```

---

## 📘 API Documentation

Swagger UI available at:

**http://localhost:3000/api-docs**

---

## 🖼️ Screenshots

### 🛍️ User Interface

| Page | Preview |
|------|---------|
| Home | ![Home](docs/images/home-page.png) |
| Product List | ![Product Listing](docs/images/product-listing.png) |
| Product Detail | ![Product Detail](docs/images/product-detail.png) |
| Cart | ![Shopping Cart](docs/images/shopping-cart.png) |
| Checkout | ![Checkout](docs/images/checkout.png) |
| Confirmation | ![Order Confirmation](docs/images/order-confirmation.png) |

### 🔧 Admin Dashboard

| Feature | Preview |
|--------|---------|
| Product Management | ![Admin Products](docs/images/admin-products.png) |
| Order Management | ![Admin Orders](docs/images/admin-orders.png) |

### 🔁 Event Flow

![Event Flow](docs/images/event-flow.png)

---

## 🛠️ Technologies Used

### Backend
- Node.js • TypeScript • Express
- Kafka • MongoDB • PostgreSQL
- Jest

### Frontend
- React • TypeScript • Tailwind CSS
- Context API • React Router

### DevOps
- Docker • Docker Compose • GitHub Actions

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork this repository
# 2. Create your feature branch: git checkout -b feature/new-feature
# 3. Commit your changes: git commit -m 'Add new feature'
# 4. Push to the branch: git push origin feature/new-feature
# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file.
