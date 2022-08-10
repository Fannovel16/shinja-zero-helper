import { Database } from "$lib/nodejs/replit-db-esm"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const db = prisma.proxyServer

const oldDb = new Database()

const chunkSize = 10
export async function GET({ url, request }) {
    const proxyServers = await oldDb.get("TROYWELL-IPs")
    console.log(proxyServers)
    console.time("Total migrate time")
    for (let i = 0; i < proxyServers.length; i += chunkSize) {
        console.time("Transation migrate time")
        const serverChunk = proxyServers.slice(i, i + chunkSize)
        const promises = serverChunk.map(proxyServer => db.upsert({
            where: {
                ip: proxyServer.ip,
            },
            create: {
                ip: proxyServer.ip,
                port: Number(proxyServer.port),
                protocol: proxyServer.type,
                country: proxyServer.country,
                username: proxyServer.userPass.split(':')[0],
                password: proxyServer.userPass.split(':')[1],
                usages: {
                    connectOrCreate: (proxyServer.usedFor || []).length
                        ? proxyServer.usedFor.map(el => ({ where: { name: el }, create: { name: el } }))
                        : [{ where: { name: "none" }, create: { name: "none" } }]
                }
            },
            update: {}
        }))
        await prisma.$transaction(promises)
        console.timeEnd("Transation migrate time")
    }
    console.timeEnd("Total migrate time")
    return { status: 200, body: "Migration complete." }
}