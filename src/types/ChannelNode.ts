import { ChannelName, isBoolean, isChannelName, isNodeId, NodeId, _validateObject } from "../commonInterface/kacheryTypes"

export type ChannelNodePermissions = {
    read: boolean
    write: boolean
}

export const isChannelNodePermissions = (x: any) : x is ChannelNodePermissions => {
    return _validateObject(x, {
        read: isBoolean,
        write: isBoolean
    })
}

export type ChannelNode = {
    channelName: ChannelName,
    nodeId: NodeId
    permissions: ChannelNodePermissions
}

export const isChannelNode = (x: any): x is ChannelNode => {
    return _validateObject(x, {
        channelName: isChannelName,
        nodeId: isNodeId,
        permissions: isChannelNodePermissions
    })
}