# 🚀 E-Commerce Platform | Event-Driven Architecture

> A modern e-commerce platform built with an event-driven architecture using **Node.js**, **TypeScript**, **Kafka**, **MongoDB**, and **PostgreSQL**.

---

## 📋 Table of Contents

- [📌 Overview](#-overview)
- [🏗️ Architecture](#-architecture)
- [🧩 Components](#-components)
- [⚙️ Installation](#-installation)
- [🚀 Running the Application](#-running-the-application)
- [🧪 Testing](#-testing)
- [📘 API Documentation](#-api-documentation)
- [📸 Screenshots](#-screenshots)
- [🛠️ Technologies Used](#-technologies-used)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📌 Overview

This platform supports complete e-commerce flows including product management, shopping carts, orders, notifications, and admin tools. It is built with scalability and modularity in mind using event-driven patterns.

---

## 🏗️ Architecture

The system follows:

- **Event Sourcing** – all changes are stored as a sequence of events.
- **CQRS** – separation between commands (write) and queries (read).
- **Kafka** – asynchronous communication between microservices.

---

## 🧩 Components

### 🔙 Backend Services

- **User Service** – user registration, authentication, and profiles  
- **Product Service** – catalog, pricing, and inventory  
- **Cart Service** – shopping cart management  
- **Order Service** – payment and order processing  
- **Notification Service** – email and user alerts

### 📦 Event Consumers

- Welcome Flow  
- Notification Dispatcher  
- Abandoned Cart Handler  
- Invoice Generator

### 💻 Frontend

- Built using React with Vite  
- TailwindCSS for UI  
- React Router + Context API

---

## ⚙️ Installation

```bash
# Clone the project
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce

# Install backend dependencies
npm install

# Create the environment file
echo "PORT=3000
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
EMAIL_PASS=your_email_password" > .env

# Install frontend
cd E-Commerce-Front
npm install
```

---

## 🚀 Running the Application

### With Docker

```bash
docker-compose up -d
npm run migrations
npm run seed
npm start
```

### Without Docker

Ensure MongoDB, PostgreSQL, and Kafka are running, then:

```bash
npm run migrations
npm run seed
npm start
```

In another terminal:

```bash
cd E-Commerce-Front
npm run dev
```

Access the app at:

- Backend → http://localhost:3000  
- Frontend → http://localhost:5173

---

## 🧪 Testing

```bash
npm test
npm test -- --testPathPattern=user.service
npm test -- --coverage
```

---

## 📘 API Documentation

Swagger UI is available at:

http://localhost:3000/api-docs

---

## 📸 Screenshots

Coming soon...

---

## 🛠️ Technologies Used

### Backend
- Node.js  
- TypeScript  
- Express  
- Kafka  
- MongoDB  
- PostgreSQL  
- Jest

### Frontend
- React  
- Vite  
- Tailwind CSS  
- React Router  
- Context API

### DevOps
- Docker  
- Docker Compose  
- GitHub Actions

---

## 🤝 Contributing

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push the changes
git push origin feature/amazing-feature

# Open a pull request 🎉
```

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more information.
