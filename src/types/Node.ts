import { isBoolean, isNodeId, isNumber, isString, isUserId, NodeId, UserId, _validateObject } from "../commonInterface/kacheryTypes"

export type Node = {
    nodeId: NodeId
    ownerId: UserId
    timestampCreated: number
    label: string
    verified: boolean
}

export const isNode = (x: any): x is Node => {
    return _validateObject(x, {
        nodeId: isNodeId,
        ownerId: isUserId,
        timestampCreated: isNumber,
        label: isString,
        verified: isBoolean
    })
}