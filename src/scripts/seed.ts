import { initMongoDB, closeMongoDB } from "../lib/event-store"
import { createProduct } from "../models/product.model"
import { publishEvent } from "../lib/kafka"

const products = [
  {
    name: "Monitor LG UltraGear 27''",
    description: "IPS, 144Hz, 1ms, QHD, HDR10",
    price: 379.99,
    category: "Tecnología",
    stock: 6,
  },
  {
    name: "Cámara Logitech C920 HD Pro",
    description: "Full HD 1080p, micrófono estéreo",
    price: 89.99,
    category: "Accesorios",
    stock: 14,
  },
  {
    name: "Router TP-Link Archer AX55",
    description: "Wi-Fi 6, 3000 Mbps, 4 antenas",
    price: 129.99,
    category: "Tecnología",
    stock: 9,
  },
  {
    name: "Soporte de laptop ergonómico",
    description: "Aluminio, ajustable, antideslizante",
    price: 29.99,
    category: "Accesorios",
    stock: 20,
  },
  {
    name: "Escritorio en L para oficina",
    description: "Madera negra, soporte metálico",
    price: 199.99,
    category: "Oficina",
    stock: 3,
  },
  {
    name: "Lámpara LED con brazo ajustable",
    description: "Brillo regulable, puerto USB",
    price: 49.99,
    category: "Oficina",
    stock: 18,
  },
  {
    name: "Tablet gráfica Wacom Intuos S",
    description: "Diseño digital, lápiz sin batería",
    price: 79.99,
    category: "Tecnología",
    stock: 11,
  },
  {
    name: "Cargador múltiple USB-C",
    description: "5 puertos, carga rápida PD 30W",
    price: 39.99,
    category: "Accesorios",
    stock: 22,
  },
  {
    name: "Archivador metálico de 3 cajones",
    description: "Con cerradura, ruedas, negro",
    price: 129.99,
    category: "Oficina",
    stock: 4,
  },
  {
    name: "Auriculares Logitech H390",
    description: "Con micrófono USB, cancelación de ruido",
    price: 49.99,
    category: "Accesorios",
    stock: 16,
  },
]


const seedDatabase = async () => {
  try {
    console.log("🌱 Starting new product seeding...")

    await initMongoDB()

    for (const productData of products) {
      const product = await createProduct(productData)
      console.log(`✔ Created product: ${product.name}`)

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

    console.log("✅ Seeding completed successfully.")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
  } finally {
    await closeMongoDB()
    process.exit(0)
  }
}

seedDatabase()
