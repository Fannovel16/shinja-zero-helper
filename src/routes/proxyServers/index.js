import accessAuth from '$lib/nodejs/accessAuth'
import db from './_db'
import parseJson from "$lib/nodejs/noErrorThrowJsonParser"
import returnError from '$lib/nodejs/returnError'

async function getProxyServer(usage) {
    if (!usage || !usage.length) usage = "normal"
    const proxyServer = await db.findFirst({
        where: { usages: { none: { name: usage } } }
    })
    if (!proxyServer) return proxyServer
    //https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#disconnect-a-related-record
    return {
        status: 200,
        body: await db.update({
            where: { id: proxyServer.id },
            data: {
                usages: {
                    disconnect: [{ name: "none" }],
                    connectOrCreate: [{ where: { name: usage }, create: { name: usage } }]
                }
            }
        })
    }
}

export async function GET({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error
    return getProxyServer(url.searchParams.get("usage"))
}
export async function POST({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error
    const parsedInputRe = parseJson(await request.text())
    if (parsedInputRe.error) return returnError.json.jsonError(parsedInputRe.error)
    return await getProxyServer(parsedInputRe.data.usage)
}