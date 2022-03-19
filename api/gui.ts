import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import googleVerifyIdToken from '../apiHelpers/common/googleVerifyIdToken'
import addChannelHandler from '../apiHelpers/guiRequestHandlers/addChannelHandler'
import addChannelNodeHandler from '../apiHelpers/guiRequestHandlers/addChannelNodeHandler'
import deleteChannelHandler from '../apiHelpers/guiRequestHandlers/deleteChannelHandler'
import deleteChannelNodeHandler from '../apiHelpers/guiRequestHandlers/deleteChannelNodeHandler'
import getChannelConfigsHandler from '../apiHelpers/guiRequestHandlers/getChannelConfigsHandler'
import setChannelInfoHandler from '../apiHelpers/guiRequestHandlers/setChannelInfoHandler'
import setChannelNodeServiceConfigHandler from '../apiHelpers/guiRequestHandlers/setChannelNodeServiceConfigHandler'
import { UserId } from '../src/commonInterface/kacheryTypes'
import { isGuiRequest } from '../src/types/GuiRequest'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

const verifyReCaptcha = async (token: string | undefined) => {
    if (!RECAPTCHA_SECRET_KEY) return undefined
    if (!token) return undefined

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    const x = await axios.post(url)
    return x.data
}

export type VerifiedReCaptchaInfo = {
    success: boolean,
    challenge_ts: string,
    hostname: string,
    score: number,
    action: string
}

module.exports = (req: VercelRequest, res: VercelResponse) => {    
    const {body: request} = req
    if (!isGuiRequest(request)) {
        res.status(400).send(`Invalid request: ${JSON.stringify(request)}`)
        return
    }

    const auth = request.auth
    const {userId, googleIdToken, reCaptchaToken} = auth
    if ((userId) && (!googleIdToken)) throw Error('No google id token')

    ;(async () => {
        const verifiedUserId = userId ? await googleVerifyIdToken(userId, googleIdToken) as any as UserId : undefined
        const verifiedReCaptchaInfo: VerifiedReCaptchaInfo | undefined = await verifyReCaptcha(reCaptchaToken)
        if (verifiedReCaptchaInfo) {
            if (!verifiedReCaptchaInfo.success) {
                throw Error('Error verifying reCaptcha token')
            }
            if (verifiedReCaptchaInfo.score < 0.4) {
                throw Error(`reCaptcha score is too low: ${verifiedReCaptchaInfo.score}`)
            }
        }
        if (request.type === 'addChannel') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await addChannelHandler(request, verifiedUserId)
        }
        else if (request.type === 'addChannelNode') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await addChannelNodeHandler(request, verifiedUserId)
        }
        else if (request.type === 'deleteChannel') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await deleteChannelHandler(request, verifiedUserId)
        }
        else if (request.type === 'deleteChannelNode') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await deleteChannelNodeHandler(request, verifiedUserId)
        }
        else if (request.type === 'getChannelConfigs') {
            // no recaptcha required
            return await getChannelConfigsHandler(request, verifiedUserId)
        }
        else if (request.type === 'setChannelInfo') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await setChannelInfoHandler(request, verifiedUserId)
        }
        else if (request.type === 'setChannelNodeServiceConfig') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await setChannelNodeServiceConfigHandler(request, verifiedUserId)
        }
        else {
            throw Error(`Unexpected request type: ${request.type}`)
        }
    })().then((result) => {
        res.json(result)
    }).catch((error: Error) => {
        console.warn(error.message)
        res.status(500).send(`Error: ${error.message}`)
    })
}