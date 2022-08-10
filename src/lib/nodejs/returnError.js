export default {
    json: {
        badRequest: validate => ({
            status: 400,
            body: {
                errorType: "AJV_VALIDATION_FAILED",
                detail: validate.errors[0]
            }
        }),
        forbidden: () => ({
            status: 403,
            body: {
                errorType: "INVALID_TOKEN",
                detail: {
                    tokenName: "authToken",
                    message: "Your authToken is invalid, no access."
                }
            }
        }),
        badEncBic: () => ({
            status: 400,
            body: {
                errorType: "INVALID_TOKEN",
                detail: {
                    tokenName: "encBIC",
                    message: "Your encBIC is malformed, please check if you copied it correctly or authenticate again to recieve another one."
                }
            }
        }),
        internalError: e => ({
            status: 500,
            body: {
                errorType: "INTERNAL_ERROR",
                detail: { message: e.toString() }
            }
        }),
        badPrismaQuery: e => ({
            status: 400,
            body: {
                errorType: "INVALID_PRISMA_QUERY",
                detail: { message: e.toString() }
            }
        })
    },
    text: {
        badRequest: validate => ({
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