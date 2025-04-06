import { initMongoDB, closeMongoDB } from "../lib/event-store"
import { createProduct } from "../models/product.model"
import { createUser } from "../models/user.model"
import { publishEvent } from "../lib/kafka"

// Sample products data
const products = [
  {
    name: "Laptop HP",
    description: "16GB RAM, SSD 512GB, Procesador Intel i7",
    price: 899.99,
    category: "Tecnología",
    stock: 10,
  },
  {
    name: "Smartphone Samsung Galaxy S21",
    description: "8GB RAM, 128GB Almacenamiento, Cámara 108MP",
    price: 799.99,
    category: "Tecnología",
    stock: 15,
  },
  {
    name: "Auriculares Sony WH-1000XM4",
    description: "Cancelación de ruido, Bluetooth, 30h de batería",
    price: 349.99,
    category: "Accesorios",
    stock: 20,
  },
  {
    name: 'Monitor LG 27"',
    description: "Monitor UltraHD 4K, 144Hz, 1ms respuesta",
    price: 299.99,
    category: "Tecnología",
    stock: 8,
  },
  {
    name: "Teclado Mecánico Logitech",
    description: "Switches Cherry MX, RGB, Layout Español",
    price: 129.99,
    category: "Accesorios",
    stock: 12,
  },
]

// Sample users data
const users = [
  {
    name: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    password: "SecurePass123",
    phone: "+123456789",
  },
  {
    name: "María",
    lastName: "González",
    email: "maria@example.com",
    password: "SecurePass456",
    phone: "+987654321",
  },
]

// Seed database
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...")

    // Initialize MongoDB connection for event store
    await initMongoDB()

    // Seed products
    console.log("Seeding products...")
    for (const productData of products) {
      const product = await createProduct(productData)
      console.log(`Created product: ${product.name}`)

      // Publish product created event
      await publishEvent(
        "product-created",
        "ProductSeeder",
        {
          productId: product.id,
          name: product.name,
          price: product.price,
        },
        {
          productId: product.id,
          status: "CREATED",
        },
      )
    }

    // Seed users
    console.log("Seeding users...")
    for (const userData of users) {
      const user = await createUser(userData)
      console.log(`Created user: ${user.email}`)
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    // Close connections
    await closeMongoDB()
    process.exit(0)
  }
}

// Run seeder
seedDatabase()

