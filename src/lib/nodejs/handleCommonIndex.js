import Ajv from 'ajv'
import parseJson from './noErrorThrowJsonParser'
import returnError from './returnError'

const validate = new Ajv().compile({
    type: "object",
    properties: {
        query: {
            type: "object",
            properties: { limit: false, page: false, take: false, skip: false },
            additionalProperties: true
        },
        limit: { type: "integer", minimum: 1, maximum: Number(process.env.MAX_QUERY_LIMIT) || 500 },
        page: { type: "integer", minimum: 1 }
    },
    required: ["query", "limit", "page"]
})

function getPaginationInfo({ limit, page }) {
    return {
        skip: limit * (page - 1),
        take: limit
    }
}

export default async function (db, { query, limit, page }) {
    const parseQueryRe = parseJson(query)
    if (parseQueryRe.error) return returnError.json.jsonError(parseQueryRe.error)
    const parsedParams = {
        query: parseQueryRe.data || {},
        limit: Number(limit) || process.env.DEFAULT_LIMIT || 200,
        page: Number(page) || 1
    }
    const valid = validate(parsedParams)
    if (!valid) return returnError.json.failAjv(validate)
    try {
        return {
            status: 200,
            body: await db.findMany({ where: parsedParams.query, ...getPaginationInfo(parsedParams) })
        }
    } catch (e) {
        if (!query) return returnError.json.internalError(e)
        return returnError.json.badPrismaQuery(e)
    }
}