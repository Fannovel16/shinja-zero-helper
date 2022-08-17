import accessAuth from '$lib/nodejs/accessAuth'
import handleCommonIndex from '$lib/nodejs/handleCommonIndex'
import parseJson from '$lib/nodejs/noErrorThrowJsonParser'
import returnError from '$lib/nodejs/returnError'
import db from './_db'
import "dotenv/config"

export async function GET({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error

    const [parseQueryRe, parseSelectRe] = [parseJson(url.searchParams.get("query")), parseJson(url.searchParams.get("select"))]
    if (parseQueryRe.error || parseSelectRe.error) return returnError.json.jsonErrors([parseQueryRe, parseSelectRe])

    return await handleCommonIndex(db, {
        query: parseQueryRe.data,
        select: parseSelectRe.data,
        limit: Number(url.searchParams.get("limit") || process.env.DEFAULT_QUERY_LIMIT || 50),
        page: Number(url.searchParams.get("page") || 1)
    })
}
export async function POST({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error

    const parsedInputRe = parseJson(await request.text())
    if (parsedInputRe.error) return returnError.json.jsonErrors([parsedInputRe.error])

    return await handleCommonIndex(db, parsedInputRe.data)
}