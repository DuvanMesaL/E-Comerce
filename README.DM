# 🚀 E-Commerce Platform | Event-Driven Architecture

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Architecture](https://img.shields.io/badge/architecture-Event--Driven-red.svg?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js&logoColor=white)

</div>

<p align="center">A modern e-commerce platform built with an event-driven architecture using Node.js, TypeScript, Kafka, MongoDB, and PostgreSQL.</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Components](#-components)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📝 Overview

This platform supports complete e-commerce flows including product management, shopping carts, orders, notifications, and admin tools. It is built with scalability and modularity in mind using event-driven patterns.

---

## 🏗️ Architecture

The system follows:

- **Event Sourcing** – all changes are stored as a sequence of events.
- **CQRS** – separation between commands (write) and queries (read).
- **Kafka** – asynchronous communication between microservices.

![Architecture](docs/images/architecture.png)

---

## 🧩 Components

### 🔙 Backend Services

- **User Service** – user registration, authentication, and profiles
- **Product Service** – catalog, pricing, and inventory
- **Cart Service** – add/remove products from cart
- **Order Service** – payment and order processing
- **Notification Service** – emails and updates

### 📦 Event Consumers

- Welcome Flow
- Notification Dispatcher
- Abandoned Cart Handler
- Invoice Generator

### 💻 Frontend

SPA with:

- **React + Vite**
- **TailwindCSS**
- **React Router**
- **Context API**

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Create environment variables

```bash
cp .env.example .env
```

Fill `.env` with:

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

### 4. Install frontend

```bash
cd E-Commerce-Front
npm install
```

---

## 🚀 Running the Application

### Start services with Docker

```bash
docker-compose up -d
npm run migrations
npm run seed
npm start
```

### Run manually

Ensure MongoDB, PostgreSQL, and Kafka are running:

```bash
npm run migrations
npm run seed
npm start
```

Then in a new terminal:

```bash
cd E-Commerce-Front
npm run dev
```

Visit:

- Backend → http://localhost:3000
- Frontend → http://localhost:5173

---

## 🧪 Testing

```bash
npm test
npm test -- --testPathPattern=product.service
npm test -- --coverage
```

---

## 📘 API Documentation

Swagger UI is available at:

**http://localhost:3000/api-docs**

---

## 📸 Screenshots

### 🛍️ User Interface

| Page | Preview |
|------|---------|
| Home | ![Home](docs/images/home-page.png) |
| Product Listing | ![Product Listing](docs/images/product-listing.png) |
| Product Detail | ![Product Detail](docs/images/product-detail.png) |
| Shopping Cart | ![Shopping Cart](docs/images/shopping-cart.png) |
| Checkout | ![Checkout](docs/images/checkout.png) |
| Order Confirmation | ![Order Confirmation](docs/images/order-confirmation.png) |

### 🔧 Admin Dashboard

| Page | Preview |
|------|---------|
| Product Management | ![Admin Products](docs/images/admin-products.png) |
| Order Management | ![Admin Orders](docs/images/admin-orders.png) |

### 🔁 Event Flow

![Event Flow](docs/images/event-flow.png)

---

## 🛠️ Technologies Used

### Backend
- Node.js, TypeScript, Express
- Kafka, MongoDB, PostgreSQL
- Jest for testing

### Frontend
- React, TypeScript
- Tailwind CSS, React Router, Context API

### DevOps
- Docker, Docker Compose, GitHub Actions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m "Add awesome feature"`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file.
