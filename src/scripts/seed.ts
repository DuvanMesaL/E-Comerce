import { initMongoDB, closeMongoDB } from "../lib/event-store"
import { createProduct } from "../models/product.model"
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
  {
    name: "Mouse Gamer Razer",
    description: "16000 DPI, RGB, Sensor Óptico",
    price: 79.99,
    category: "Accesorios",
    stock: 18,
  },
  {
    name: "Tablet Apple iPad Air",
    description: "10.9'', 64GB, Wi-Fi, Chip M1",
    price: 599.99,
    category: "Tecnología",
    stock: 7,
  },
  {
    name: "Impresora HP DeskJet",
    description: "Multifuncional, Wi-Fi, Cartuchos incluidos",
    price: 89.99,
    category: "Oficina",
    stock: 10,
  },
  {
    name: "Silla ergonómica de oficina",
    description: "Reclinable, Apoyo lumbar, Negro",
    price: 189.99,
    category: "Oficina",
    stock: 6,
  },
  {
    name: "Webcam Logitech C920",
    description: "1080p Full HD, Micrófono Estéreo",
    price: 99.99,
    category: "Accesorios",
    stock: 14,
  }
]

// Seed database
const seedDatabase = async () => {
  try {
    console.log("Starting product seeding...")

    await initMongoDB()

    for (const productData of products) {
      const product = await createProduct(productData)
      console.log(`✔ Producto creado: ${product.name}`)

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
        }
      )
    }

    console.log("✅ Productos insertados correctamente.")
  } catch (error) {
    console.error("❌ Error al insertar productos:", error)
  } finally {
    await closeMongoDB()
    process.exit(0)
  }
}

seedDatabase()
