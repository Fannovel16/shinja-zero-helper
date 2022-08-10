import accessAuth from '$lib/nodejs/accessAuth'
import handleQueryReq from '../../../lib/nodejs/handleQueryReq'
import db from './_db'


export async function GET({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error
    const queryParams = url.searchParams.get("query") || ''
    return {
        status: 200,
        body: await handleQueryReq(db, queryParams.length ? JSON.parse(queryParams) : null)
    }
}
export async function POST({ request, url }) {
    const authResult = accessAuth({ request, url }, "json")
    if (!authResult.result) return authResult.error
    return {
        status: 200,
        body: await handleQueryReq(db, await request.json())
    }
}