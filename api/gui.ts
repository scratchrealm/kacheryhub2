import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import googleVerifyIdToken from '../apiHelpers/common/googleVerifyIdToken'
import addChannelHandler from '../apiHelpers/guiRequestHandlers/addChannelHandler'
import addChannelNodeHandler from '../apiHelpers/guiRequestHandlers/addChannelNodeHandler'
import deleteChannelHandler from '../apiHelpers/guiRequestHandlers/deleteChannelHandler'
import deleteChannelNodeHandler from '../apiHelpers/guiRequestHandlers/deleteChannelNodeHandler'
import deleteNodeHandler from '../apiHelpers/guiRequestHandlers/deleteNodeHandler'
import getChannelsHandler from '../apiHelpers/guiRequestHandlers/getChannelsHandler'
import getNodesHandler from '../apiHelpers/guiRequestHandlers/getNodesHandler'
import addNodeHandler from '../apiHelpers/guiRequestHandlers/addNodeHandler'
import setChannelSettingsHandler from '../apiHelpers/guiRequestHandlers/setChannelSettingsHandler'
import { UserId } from '../src/commonInterface/kacheryTypes'
import { isGuiRequest } from '../src/types/GuiRequest'
import getChannelNodesHandler from '../apiHelpers/guiRequestHandlers/getChannelNodesHandler'

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
        const verifiedUserId = userId ? await googleVerifyIdToken(userId.toString(), googleIdToken) as any as UserId : undefined
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
        else if (request.type === 'getChannelNodes') {
            // no recaptcha required
            return await getChannelNodesHandler(request, verifiedUserId)
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
        else if (request.type === 'getChannels') {
            // no recaptcha required
            return await getChannelsHandler(request, verifiedUserId)
        }
        else if (request.type === 'setChannelSettings') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await setChannelSettingsHandler(request, verifiedUserId)
        }
        else if (request.type === 'addNode') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await addNodeHandler(request, verifiedUserId)
        }
        else if (request.type === 'deleteNode') {
            if (!verifiedReCaptchaInfo) {
                throw Error('ReCaptcha required')
            }
            return await deleteNodeHandler(request, verifiedUserId)
        }
        else if (request.type === 'getNodes') {
            // no recaptcha required
            return await getNodesHandler(request, verifiedUserId)
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