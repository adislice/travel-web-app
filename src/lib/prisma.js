import { PrismaClient } from "@prisma/client"
import { DATABASE_URL } from "./configs"

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

export default db