import { VercelRequest, VercelResponse } from '@vercel/node'
import verifyNodeHandler from '../apiHelpers/kacheryhubRequestHandlers/verifyNodeHandler'
import { hexToPublicKey, verifySignature } from '../src/commonInterface/crypto/signatures'
import { JSONValue, nodeIdToPublicKeyHex } from '../src/commonInterface/kacheryTypes'
import { isKacheryhubRequest } from '../src/types/KacheryhubRequest'

module.exports = (req: VercelRequest, res: VercelResponse) => {    
    const {body: request} = req
    if (!isKacheryhubRequest(request)) {
        console.warn('Invalid request', request)
        res.status(400).send(`Invalid request: ${JSON.stringify(request)}`)
        return
    }

    ;(async () => {
        const { payload, fromNodeId, signature } = request
        const { timestamp } = payload
        const elapsed = Date.now() - timestamp
        if ((elapsed > 30000) || (elapsed < -500)) {
            throw Error(`Invalid timestamp. ${timestamp} ${Date.now()} ${elapsed}`)
        }
        if (!await verifySignature(payload as any as JSONValue, hexToPublicKey(nodeIdToPublicKeyHex(fromNodeId)), signature)) {
            throw Error('Invalid signature')
        }
        const verifiedNodeId = fromNodeId

        if (payload.type === 'verifyNode') {
            return await verifyNodeHandler(request, verifiedNodeId)
        }
        else {
            throw Error(`Unexpected request type: ${payload.type}`)
        }
    })().then((result) => {
        res.json(result)
    }).catch((error: Error) => {
        res.status(500).send(`Error: ${error.message}`)
    })
}