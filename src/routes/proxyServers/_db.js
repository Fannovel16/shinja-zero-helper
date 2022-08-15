import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default prisma.proxyServer
export const proxyUsage = prisma.proxyUsage