import axios from "axios"
import { GuiRequest, GuiResponse } from "../types/GuiRequest"
import { getReCaptchaToken } from "./reCaptcha"

const guiApiRequest = async (request: GuiRequest, opts: {reCaptcha: boolean}): Promise<GuiResponse> => {
    let request2: GuiRequest = request
    if (opts.reCaptcha) {
        const reCaptchaToken = await getReCaptchaToken()
        request2 = {...request, auth: {...request.auth, reCaptchaToken}}
    }
    try {
        const x = await axios.post('/api/gui', request2)
        return x.data
    }
    catch(err: any) {
        if (err.response) {
            console.log(err.response)
            throw Error(err.response.data)
        }
        else throw err
    }
}

export default guiApiRequest