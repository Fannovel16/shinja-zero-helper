import Ajv from "ajv"
const ajv = new Ajv()
const validate = ajv.compile({
    type: "object",
    properties: {
        limit: false,
        page: false,
        take: false,
        skip: false
    }
})

export default function ({query}) {
    const valid = validate(query)
    if (!valid) return {
        result: validate,
        isError: true
    }
    return {
        result: query,
        isError: false
    }
}