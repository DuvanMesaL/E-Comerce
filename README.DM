# E-Commerce Platform with Event-Driven Architecture

![E-Commerce Platform](docs/images/banner.png)

A modern e-commerce platform built with an event-driven architecture using Node.js, TypeScript, Kafka, MongoDB for event sourcing, and PostgreSQL for data storage.

## Table of Contents

- [System Architecture](#system-architecture)
- [Components](#components)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## System Architecture

This application follows an event-driven architecture pattern with:

- **Event Sourcing**: All state changes are captured as a sequence of events
- **CQRS (Command Query Responsibility Segregation)**: Separate models for reading and writing data
- **Microservices Communication**: Services communicate through events via Kafka

![Architecture Diagram](docs/images/architecture.png)

## Components

The application consists of the following main components:

### Backend Services

- **User Service**: Handles user registration, authentication, and profile management
- **Product Service**: Manages product catalog, inventory, and pricing
- **Cart Service**: Manages shopping cart operations
- **Order Service**: Processes orders and payment
- **Notification Service**: Sends emails and notifications to users

### Event Consumers

- **Welcome Flow Consumer**: Processes user registration events and triggers welcome emails
- **Notification Consumer**: Processes notification events and sends emails
- **Cart Removal Consumer**: Processes cart removal events and sends abandonment emails
- **Invoice Processing Consumer**: Processes order events and generates invoices

### Frontend

- React-based SPA with responsive design
- State management with Context API
- Routing with React Router

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)
- MongoDB (if running without Docker)
- Kafka (if running without Docker)

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

\`\`\`
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
\`\`\`

## Running the Application

### Using Docker

The easiest way to run the application is using Docker Compose:

\`\`\`bash
# Start all services
docker-compose up -d

# Run database migrations
npm run migrations

# Seed the database with initial data
npm run seed

# Start the application
npm start
\`\`\`

### Without Docker

If you prefer to run the services individually:

1. Start PostgreSQL, MongoDB, and Kafka separately
2. Run database migrations:

\`\`\`bash
npm run migrations
\`\`\`

3. Seed the database:

\`\`\`bash
npm run seed
\`\`\`

4. Start the backend server:

\`\`\`bash
npm start
\`\`\`

5. Start the frontend development server:

\`\`\`bash
cd E-Commerce-Front
npm install
npm run dev
\`\`\`

The backend API will be available at http://localhost:3000, and the frontend at http://localhost:5173.

## Testing

The application includes comprehensive tests:

\`\`\`bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=user.service
npm test -- --testPathPattern=product.service

# Run tests with coverage
npm test -- --coverage
\`\`\`

## API Documentation

API documentation is available using Swagger UI at http://localhost:3000/api-docs when the application is running.

## Screenshots

### User Interface

#### Home Page
![Home Page](docs/images/home-page.png)
*The main landing page showing featured products and categories*

#### Product Listing
![Product Listing](docs/images/product-listing.png)
*Product catalog with filtering and sorting options*

#### Product Detail
![Product Detail](docs/images/product-detail.png)
*Detailed product view with add to cart functionality*

#### Shopping Cart
![Shopping Cart](docs/images/shopping-cart.png)
*Shopping cart with product list and checkout option*

#### Checkout Process
![Checkout](docs/images/checkout.png)
*Checkout page with shipping and payment information*

#### Order Confirmation
![Order Confirmation](docs/images/order-confirmation.png)
*Order confirmation with order details and tracking information*

### Admin Dashboard

#### Product Management
![Product Management](docs/images/admin-products.png)
*Admin interface for managing products*

#### Order Management
![Order Management](docs/images/admin-orders.png)
*Admin interface for managing orders*

### Event Flow Visualization

![Event Flow](docs/images/event-flow.png)
*Visualization of the event flow between services*

## Technologies Used

### Backend
- Node.js
- TypeScript
- Express.js
- Kafka (for event streaming)
- MongoDB (for event sourcing)
- PostgreSQL (for data storage)
- Jest (for testing)

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Context API

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
\`\`\`

```plaintext file="docs/images/README.md"
# Images Directory

This directory contains screenshots and diagrams for the E-Commerce application.

## Organization

- `architecture.png` - System architecture diagram
- `banner.png` - Main banner image for README
- `event-flow.png` - Event flow visualization
- `home-page.png` - Screenshot of the home page
- `product-listing.png` - Screenshot of the product listing page
- `product-detail.png` - Screenshot of the product detail page
- `shopping-cart.png` - Screenshot of the shopping cart
- `checkout.png` - Screenshot of the checkout process
- `order-confirmation.png` - Screenshot of the order confirmation
- `admin-products.png` - Screenshot of the admin product management
- `admin-orders.png` - Screenshot of the admin order management

## Adding New Images

When adding new screenshots or diagrams:

1. Use descriptive filenames
2. Optimize images for web (compress if needed)
3. Update the README.md to reference new images
4. Add a description in this file

## Image Standards

- Screenshots should be taken at 1920x1080 resolution
- Use PNG format for screenshots and diagrams
- Maximum file size: 500KB per image
\`\`\`

```mermaid file="docs/images/architecture.png" type="diagram"
graph TD;
    A["Frontend SPA"] --> B["API Gateway"]
    B --> C["User Service"]
    B --> D["Product Service"]
    B --> E["Cart Service"]
    B --> F["Order Service"]
    
    C --> G["Kafka"]
    D --> G
    E --> G
    F --> G
    
    G --> H["Welcome Flow Consumer"]
    G --> I["Notification Consumer"]
    G --> J["Cart Removal Consumer"]
    G --> K["Invoice Processing Consumer"]
    
    H --> L["MongoDB<br>Event Store"]
    I --> L
    J --> L
    K --> L
    
    C --> M["PostgreSQL<br>Data Store"]
    D --> M
    E --> M
    F --> M
