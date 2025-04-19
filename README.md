# 🚀 Transaction Application | Banking Microservices

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Microservices](https://img.shields.io/badge/architecture-microservices-orange.svg?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js&logoColor=white)

</div>

<p align="center">A modern microservices-based banking application for managing transactions, accounts, and user profiles securely.</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📝 Overview

This project is a comprehensive banking transaction application built on a microservices architecture. It allows users to manage accounts, perform transactions, and monitor their financial activities through a sleek, modern interface.

---

## 🏗️ Architecture

The application consists of the following microservices:

- **User Service** - Manages user registration, authentication, and profile data
- **Account Service** - Handles account creation, balance management, and transactions
- **Logs Service** - Records all system activities for audit and debugging
- **Mailing Service** - Manages email notifications for important account activities

Each microservice is designed to operate independently, with its own database and business logic.

---

## 📌 Prerequisites

Before running the application, ensure you have the following requirements installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| MongoDB | 4.4+ | NoSQL database for user data and logs |
| PostgreSQL | 12+ | Relational database for transaction records |
| Node.js | 16+ | JavaScript runtime environment |
| npm | 7+ | Node.js package manager |
| Git | Any | Version control system |

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/DuvanMesaL/7th_semester_partial_exam_term_1_transaction_application.git
cd 7th_semester_partial_exam_term_1_transaction_application
```

### 2. Install microservices dependencies

```bash
# Account Microservice
cd Back/microservice-account
npm install

# User Microservice
cd ../microservice-user
npm install

# Logs Microservice
cd ../microservice-logs
npm install

# Mailing Microservice
cd ../microservice-mailing
npm install
```

### 3. Install frontend dependencies

```bash
cd ../../monigo
npm install
```

### 4. Configure environment variables

Copy the example environment files in each microservice folder:

```bash
cp Back/microservice-account/.env.example Back/microservice-account/.env
cp Back/microservice-user/.env.example Back/microservice-user/.env
cp Back/microservice-logs/.env.example Back/microservice-logs/.env
cp Back/microservice-mailing/.env.example Back/microservice-mailing/.env
```

Edit each `.env` file with your specific configuration settings.

---

## 🚀 Running the Application

### Start the databases

Ensure MongoDB and PostgreSQL services are running:

```bash
# Check MongoDB status
mongod --version

# Check PostgreSQL status
pg_isready
```

### Launch the microservices

In separate terminal windows:

```bash
# Start Account Microservice
cd Back/microservice-account
npm run dev

# Start User Microservice
cd ../microservice-user
npm run dev

# Start Logs Microservice
cd ../microservice-logs
npm run dev

# Start Mailing Microservice
cd ../microservice-mailing
npm run dev
```

### Start the frontend

```bash
cd monigo
npm run dev
```

After starting all services, navigate to `http://localhost:3000` in your browser.

---

## ✨ Key Features

- 🔐 **Secure Authentication** - Multi-factor authentication for account protection
- 💰 **Transaction Management** - Send, receive, and track all financial transactions
- 📊 **Financial Dashboard** - Visual representation of account activities and balances
- 🔔 **Real-time Notifications** - Instant alerts for account activities
- 👤 **User Profile Management** - Easy updating of personal information
- 🛡️ **Security Settings** - Customizable security preferences

---

## 📸 Screenshots

### ENJOY THE APP

#### Login
![login](https://github.com/user-attachments/assets/b18b2a87-c011-4238-8f8b-8491088bef5f)
![Login](https://github.com/user-attachments/assets/f39f0b34-5278-4d89-835e-e439c86e2c26)

#### Register
![register](https://github.com/user-attachments/assets/ffbf3a0a-9d1f-4728-bbea-65d57266c1b6)
![Register](https://github.com/user-attachments/assets/50f5acc6-3603-489d-b5e4-f3e22d3652ab)

#### Dashboard
![Dashboard](https://github.com/user-attachments/assets/ba6132a6-c98b-4926-b890-8f2f3884ed91)
![DashBoard-1](https://github.com/user-attachments/assets/f1bd181c-ac7f-4c95-8d8f-c9c654fe2226)
![DashBoard-2](https://github.com/user-attachments/assets/de796d41-11df-45c4-8c24-d466edc55af4)

#### Account
![Account](https://github.com/user-attachments/assets/6f409a46-6229-469a-a4d7-a4868e3727a0)
![Account](https://github.com/user-attachments/assets/62ce8cf0-1839-4ae7-a283-d11bbeb4cb3d)

#### Transaction
![Transaction](https://github.com/user-attachments/assets/f29028b5-99f0-4803-80a6-7d00ae767ed0)
![Transaction](https://github.com/user-attachments/assets/5a3f91f5-e4cb-4e52-881c-1d835c8c09c8)

#### Transfer
![Transfer](https://github.com/user-attachments/assets/bce12fc9-b8ea-47ea-9945-b161bfcb7964)
![Transfer](https://github.com/user-attachments/assets/de2ce68b-0115-45e4-9899-65bf7a91de50)

---


## ⚠️ Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure MongoDB and PostgreSQL are running
   - Verify connection strings in each microservice's `.env` file

2. **Dependency Issues**

```bash
npm cache clean --force
npm install
```

3. **Port Conflicts**
   - Check if specified ports are already in use
   - Update ports in the configuration files if needed

4. **Microservices Communication**
   - Ensure all microservices are running
   - Check network configuration if services are on different machines

---

## 🤝 Contributing

We welcome contributions to improve this project! Here's how you can help:

1. **Fork** the repository
2. **Create a branch** for your feature:

```bash
git checkout -b feature/amazing-feature
```

3. **Commit your changes**:

```bash
git commit -m "Add: Implement amazing feature"
```

4. **Push to your branch**:

```bash
git push origin feature/amazing-feature
```

5. **Open a Pull Request**

Please make sure to update tests as appropriate and follow our code of conduct.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
