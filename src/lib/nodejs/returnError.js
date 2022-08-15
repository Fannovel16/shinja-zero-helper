export default {
    json: {
        jsonError: e => ({
            status: 400,
            body: {
                errorCode: "JSON_PARSING_FAILED",
                detail: e.toString()
            }
        }),
        failAjv: validate => ({
            status: 400,
            body: {
                errorCode: "AJV_VALIDATION_FAILED",
                detail: validate.errors[0]
            }
        }),
        forbidden: () => ({
            status: 403,
            body: {
                errorCode: "INVALID_TOKEN",
                detail: {
                    tokenName: "authToken",
                    message: "Your authToken is invalid, no access."
                }
            }
        }),
        badEncBic: () => ({
            status: 400,
            body: {
                errorCode: "INVALID_TOKEN",
                detail: {
                    tokenName: "encBIC",
                    message: "Your encBIC is malformed, please check if you copied it correctly or authenticate again to recieve another one."
                }
            }
        }),
        internalError: e => ({
            status: 500,
            body: {
                errorCode: "INTERNAL_ERROR",
                detail: { message: e.toString() }
            }
        }),
        badPrismaQuery: e => ({
            status: 400,
            body: {
                errorCode: "INVALID_PRISMA_QUERY",
                detail: { message: e.toString() }
            }
        })
    },
    text: {
        failAjv: validate => ({
            status: 400,
            body: `Your input is invalid. Detail(s):${['', ...validate.errors.map(({ keyword, message }) => `${keyword} ${message}`)].join('\n\t')}`
        }),
        forbidden: () => ({
            status: 403,
            body: "Your authToken is invaild, no access."
        }),
        badEncBic: () => ({
            status: 400,
            body: "Your encBIC is malformed, please check if you copied it correctly or authenticate again to recieve another one."
        }),
        internalError: e => ({
            status: 500,
            body: `There is error which can only be handled if the server throws to you. Details: ${e.toString()}`
        })
    }
}