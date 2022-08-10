import Ajv from "ajv"
import 'dotenv/config'

const defaultQueryLimit = Number(process.env.DEFAULT_QUERY_RECORD_LIMIT) || 50
const maxLimit = Number(process.env.MAX_QUERY_LIMIT) || 100

const ajv = new Ajv()

const validate = ajv.compile({
    type: "object",
    properties: {
        limit: {
            type: "integer",
            minimum: 1,
            maximum: maxLimit
        },
        page: {
            type: "integer",
            minimum: 1,
        }
    },
    required: ["limit", "page"]
})

export default function ({limit, page}) {
    limit = Number(limit || defaultQueryLimit)
    page = Number(page || 1)
    const valid = validate({limit, page})
    if (!valid) return {
        result: validate,
        isError: true
    }
    return {
        result: {
            skip: limit * (page - 1),
            take: limit
        },
        isError: false
    }
}