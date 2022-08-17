import Ajv from 'ajv'
import returnError from './returnError'
import "dotenv/config"

const validate = new Ajv().compile({
    type: "object",
    properties: {
        query: {
            type: ["object", "null"],
            properties: { limit: false, page: false, take: false, skip: false },
            additionalProperties: true
        },
        limit: { type: "integer", minimum: 1, maximum: Number(process.env.MAX_QUERY_LIMIT) || 500 },
        page: { type: "integer", minimum: 1 },
        select: { type: ["object", "null"], additionalProperties: true }
    }
})

function getPaginationInfo({ limit, page }) {
    return {
        skip: limit * (page - 1),
        take: limit
    }
}

export default async function (db, { query, select, limit = 1, page = 1 }) {
    const valid = validate({ query, select, limit, page })
    if (!valid) return returnError.json.failAjv(validate)
    try {
        return {
            status: 200,
            body: await db.findMany({ where: query || undefined, select: select || undefined, ...getPaginationInfo({ limit, page }) })
            //Prisma coi null là ko hợp lệ, undefined tương đương với ko tồn tại
        }
    } catch (e) {
        if (!query) return returnError.json.internalError(e)
        return returnError.json.badPrismaQuery(e)
    }
}