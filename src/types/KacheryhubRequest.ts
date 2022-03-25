import { isEqualTo, isNodeId, isNumber, isOneOf, isSignature, isUserId, NodeId, Signature, UserId, _validateObject } from "../commonInterface/kacheryTypes"

//////////////////////////////////////////////////////////////////////////////////
// verifyNode

export type VerifyNodeRequest = {
    payload: {
        type: 'verifyNode'
        timestamp: number
        nodeId: NodeId
        ownerId: UserId
    }
    fromNodeId: NodeId
    signature: Signature
}

export const isVerifyNodeRequest = (x: any): x is VerifyNodeRequest => {
    const isPayload = (y: any) => {
        return _validateObject(y, {
            type: isEqualTo('verifyNode'),
            timestamp: isNumber,
            nodeId: isNodeId,
            ownerId: isUserId
        })
    }
    return _validateObject(x, {
        payload: isPayload,
        fromNodeId: isNodeId,
        signature: isSignature
    })
}

export type VerifyNodeResponse = {
    type: 'verifyNode'
}

export const isVerifyNodeResponse = (x: any): x is VerifyNodeResponse => {
    return _validateObject(x, {
        type: isEqualTo('verifyNode')
    })
}

//////////////////////////////////////////////////////////////////////////////////

export type KacheryhubRequest =
    VerifyNodeRequest

export const isKacheryhubRequest = (x: any): x is KacheryhubRequest => {
    return isOneOf([
        isVerifyNodeRequest
    ])(x)
}

export type KacheryhubResponse =
    VerifyNodeResponse

export const isKacheryhubResponse = (x: any): x is KacheryhubResponse => {
    return isOneOf([
        isVerifyNodeResponse
    ])(x)
}