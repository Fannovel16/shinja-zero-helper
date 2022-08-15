import parseJson from 'parse-json'
export default function (userStr) {
    try {
        return { data: parseJson(userStr), error: null }
    } catch (e) {
        return { data: null, error: e }
    }
}