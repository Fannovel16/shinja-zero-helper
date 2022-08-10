import returnError from "$lib/nodejs/returnError"
import getQueryInfo from "$lib/nodejs/getQueryInfo"
import getPaginationInfo from "$lib/nodejs/getPaginationInfo"

export default async function (modelDelegate, userSrc) {
    if (!userSrc) {
        try { return await modelDelegate.findMany() }
        catch (e) {
            return returnError.json.internalError(e)
        }
    }
    const queryInfo = getQueryInfo(userSrc)
    if (queryInfo.isError) return returnError.json.badRequest(queryInfo.result) 
    const paginationInfo = getPaginationInfo(userSrc)
    if (paginationInfo.isError) return returnError.json.badRequest(paginationInfo.result) 

    try {
        return await modelDelegate.findMany({ ...queryInfo.result, ...paginationInfo.result })
    } catch (e) {
        return returnError.json.badPrismaQuery(e)
    }
}