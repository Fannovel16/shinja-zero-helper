import accessAuth from '$lib/nodejs/accessAuth'
import handleCommonIndex from '$lib/nodejs/handleCommonIndex'
import parseJson from '$lib/nodejs/noErrorThrowJsonParser'
import db from './_db'

export async function GET({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error
    return await handleCommonIndex(db, {
        query: url.searchParams.get("query"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page")
    })
}
export async function POST({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error

    const parsedInputRe = parseJson(await request.text())
    if (parsedInputRe.error) return returnError.json.jsonError(parsedInputRe.error)

    return await handleCommonIndex(db, parsedInputRe.data)
}