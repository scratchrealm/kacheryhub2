import { ChannelName, isArrayOf, isChannelName, isNodeId, isNumber, isString, isUserId, JSONValue, NodeId, UserId, _validateObject } from "../commonInterface/kacheryTypes"

export type ChannelNodeConfig = {
    nodeId: NodeId
    serviceConfigs: {[key: string]: {[key: string]: JSONValue}}
}

export const isChannelNodeConfig = (x: any): x is ChannelNodeConfig => {
    return _validateObject(x, {
        nodeId: isNodeId,
        serviceConfigs: () => (true)
    })
}

export type ChannelConfig = {
    channelName: ChannelName
    ownerId: UserId
    googleCredentials: string
    bucketName: string
    timestampCreated: number
    timestampLastModified: number
    nodes: ChannelNodeConfig[]
}

export const isChannelConfig = (x: any): x is ChannelConfig => {
    return _validateObject(x, {
        channelName: isChannelName,
        ownerId: isUserId,
        googleCredentials: isString,
        bucketName: isString,
        timestampCreated: isNumber,
        timestampLastModified: isNumber,
        nodes: isArrayOf(isChannelNodeConfig)
    })
}