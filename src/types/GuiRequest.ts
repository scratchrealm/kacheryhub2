import { ChannelName, isArrayOf, isChannelName, isEqualTo, isNodeId, isOneOf, isString, isUserId, NodeId, optional, UserId, _validateObject } from "../commonInterface/kacheryTypes"
import { Auth, isAuth } from "./Auth"
import { Channel, ChannelSettings, isChannel, isChannelSettings } from "./Channel"
import { ChannelNode, ChannelNodePermissions, isChannelNode, isChannelNodePermissions } from "./ChannelNode"
import { isNode, Node } from "./Node"

//////////////////////////////////////////////////////////////////////////////////
// getChannels

export type GetChannelsRequest = {
    type: 'getChannels'
    userId?: UserId
    auth: Auth
}

export const isGetChannelsRequest = (x: any): x is GetChannelsRequest => {
    return _validateObject(x, {
        type: isEqualTo('getChannels'),
        userId: optional(isUserId),
        auth: isAuth
    })
}

export type GetChannelsResponse = {
    type: 'getChannels'
    channels: Channel[]
}

export const isGetChannelsResponse = (x: any): x is GetChannelsResponse => {
    return _validateObject(x, {
        type: isEqualTo('getChannels'),
        channels: isArrayOf(isChannel)
    })
}

//////////////////////////////////////////////////////////////////////////////////
// addChannel

export type AddChannelRequest = {
    type: 'addChannel'
    channelName: ChannelName
    ownerId: UserId
    auth: Auth
}

export const isAddChannelRequest = (x: any): x is AddChannelRequest => {
    return _validateObject(x, {
        type: isEqualTo('addChannel'),
        channelName: isChannelName,
        ownerId: isUserId,
        auth: isAuth
    })
}

export type AddChannelResponse = {
    type: 'addChannel'
}

export const isAddChannelResponse = (x: any): x is AddChannelResponse => {
    return _validateObject(x, {
        type: isEqualTo('addChannel')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// deleteChannel

export type DeleteChannelRequest = {
    type: 'deleteChannel'
    channelName: ChannelName
    auth: Auth
}

export const isDeleteChannelRequest = (x: any): x is DeleteChannelRequest => {
    return _validateObject(x, {
        type: isEqualTo('deleteChannel'),
        channelName: isChannelName,
        auth: isAuth
    })
}

export type DeleteChannelResponse = {
    type: 'deleteChannel'
}

export const isDeleteChannelResponse = (x: any): x is DeleteChannelResponse => {
    return _validateObject(x, {
        type: isEqualTo('deleteChannel')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// setChannelSettings

export type SetChannelSettingsRequest = {
    type: 'setChannelSettings'
    channelName: ChannelName
    channelSettings: ChannelSettings
    auth: Auth
}

export const isSetChannelSettingsRequest = (x: any): x is SetChannelSettingsRequest => {
    return _validateObject(x, {
        type: isEqualTo('setChannelSettings'),
        channelName: isChannelName,
        channelSettings: isChannelSettings,
        auth: isAuth
    })
}

export type SetChannelSettingsResponse = {
    type: 'setChannelSettings'
}

export const isSetChannelSettingsResponse = (x: any): x is SetChannelSettingsResponse => {
    return _validateObject(x, {
        type: isEqualTo('setChannelSettings')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// getChannelNodes

export type GetChannelNodesRequest = {
    type: 'getChannelNodes'
    userId?: UserId
    auth: Auth
}

export const isGetChannelNodesRequest = (x: any): x is GetChannelNodesRequest => {
    return _validateObject(x, {
        type: isEqualTo('getChannelNodes'),
        userId: optional(isUserId),
        auth: isAuth
    })
}

export type GetChannelNodesResponse = {
    type: 'getChannelNodes'
    channelNodes: ChannelNode[]
}

export const isGetChannelNodesResponse = (x: any): x is GetChannelNodesResponse => {
    return _validateObject(x, {
        type: isEqualTo('getChannelNodes'),
        channelNodes: isArrayOf(isChannelNode)
    })
}

//////////////////////////////////////////////////////////////////////////////////
// addChannelNode

export type AddChannelNodeRequest = {
    type: 'addChannelNode'
    channelName: ChannelName
    nodeId: NodeId
    auth: Auth
}

export const isAddChannelNodeRequest = (x: any): x is AddChannelNodeRequest => {
    return _validateObject(x, {
        type: isEqualTo('addChannelNode'),
        channelName: isChannelName,
        nodeId: isNodeId,
        auth: isAuth
    })
}

export type AddChannelNodeResponse = {
    type: 'addChannelNode'
}

export const isAddChannelNodeResponse = (x: any): x is AddChannelNodeResponse => {
    return _validateObject(x, {
        type: isEqualTo('addChannelNode')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// deleteChannelNode

export type DeleteChannelNodeRequest = {
    type: 'deleteChannelNode'
    channelName: ChannelName
    nodeId: NodeId
    auth: Auth
}

export const isDeleteChannelNodeRequest = (x: any): x is DeleteChannelNodeRequest => {
    return _validateObject(x, {
        type: isEqualTo('deleteChannelNode'),
        channelName: isChannelName,
        nodeId: isNodeId,
        auth: isAuth
    })
}

export type DeleteChannelNodeResponse = {
    type: 'deleteChannelNode'
}

export const isDeleteChannelNodeResponse = (x: any): x is DeleteChannelNodeResponse => {
    return _validateObject(x, {
        type: isEqualTo('deleteChannelNode')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// setChannelNodePermissions

export type SetChannelNodePermissionsRequest = {
    type: 'setChannelNodePermissions'
    channelName: ChannelName
    nodeId: NodeId
    channelNodePermissions: ChannelNodePermissions
    auth: Auth
}

export const isSetChannelNodePermissionsRequest = (x: any): x is SetChannelNodePermissionsRequest => {
    return _validateObject(x, {
        type: isEqualTo('setChannelNodePermissions'),
        channelName: isChannelName,
        nodeId: isNodeId,
        channelNodePermissions: isChannelNodePermissions,
        auth: isAuth
    })
}

export type SetChannelNodePermissionsResponse = {
    type: 'setChannelNodePermissions'
}

export const isSetChannelNodePermissionsResponse = (x: any): x is SetChannelNodePermissionsResponse => {
    return _validateObject(x, {
        type: isEqualTo('setChannelNodePermissions')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// addNode

export type AddNodeRequest = {
    type: 'addNode'
    nodeId: NodeId
    label: string
    ownerId: UserId
    auth: Auth
}

export const isAddNodeRequest = (x: any): x is AddNodeRequest => {
    return _validateObject(x, {
        type: isEqualTo('addNode'),
        nodeId: isNodeId,
        label: isString,
        ownerId: isUserId,
        auth: isAuth
    })
}

export type AddNodeResponse = {
    type: 'addNode'
}

export const isAddNodeResponse = (x: any): x is AddNodeResponse => {
    return _validateObject(x, {
        type: isEqualTo('addNode')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// deleteNode

export type DeleteNodeRequest = {
    type: 'deleteNode'
    nodeId: NodeId
    ownerId: UserId
    auth: Auth
}

export const isDeleteNodeRequest = (x: any): x is DeleteNodeRequest => {
    return _validateObject(x, {
        type: isEqualTo('deleteNode'),
        nodeId: isNodeId,
        ownerId: isUserId,
        auth: isAuth
    })
}

export type DeleteNodeResponse = {
    type: 'deleteNode'
}

export const isDeleteNodeResponse = (x: any): x is DeleteNodeResponse => {
    return _validateObject(x, {
        type: isEqualTo('deleteNode')
    })
}

//////////////////////////////////////////////////////////////////////////////////
// getNodes

export type GetNodesRequest = {
    type: 'getNodes'
    userId?: UserId
    auth: Auth
}

export const isGetNodesRequest = (x: any): x is GetNodesRequest => {
    return _validateObject(x, {
        type: isEqualTo('getNodes'),
        userId: optional(isUserId),
        auth: isAuth
    })
}

export type GetNodesResponse = {
    type: 'getNodes'
    nodes: Node[]
}

export const isGetNodesResponse = (x: any): x is GetNodesResponse => {
    return _validateObject(x, {
        type: isEqualTo('getNodes'),
        nodes: isArrayOf(isNode)
    })
}

//////////////////////////////////////////////////////////////////////////////////

export type GuiRequest =
    GetChannelsRequest |
    AddChannelRequest |
    DeleteChannelRequest |
    SetChannelSettingsRequest |
    GetChannelNodesRequest |
    AddChannelNodeRequest |
    DeleteChannelNodeRequest |
    SetChannelNodePermissionsRequest |
    AddNodeRequest |
    DeleteNodeRequest |
    GetNodesRequest

export const isGuiRequest = (x: any): x is GuiRequest => {
    return isOneOf([
        isGetChannelsRequest,
        isAddChannelRequest,
        isDeleteChannelRequest,
        isSetChannelSettingsRequest,
        isGetChannelNodesRequest,
        isAddChannelNodeRequest,
        isDeleteChannelNodeRequest,
        isSetChannelNodePermissionsRequest,
        isAddNodeRequest,
        isDeleteNodeRequest,
        isGetNodesRequest
    ])(x)
}

export type GuiResponse =
    GetChannelsResponse |
    AddChannelResponse |
    DeleteChannelResponse |
    SetChannelSettingsResponse |
    GetChannelNodesResponse |
    AddChannelNodeResponse |
    DeleteChannelNodeResponse |
    SetChannelNodePermissionsResponse |
    AddNodeResponse |
    DeleteNodeResponse |
    GetNodesResponse

export const isGuiResponse = (x: any): x is GuiResponse => {
    return isOneOf([
        isGetChannelsResponse,
        isAddChannelResponse,
        isDeleteChannelResponse,
        isSetChannelSettingsResponse,
        isGetChannelNodesResponse,
        isAddChannelNodeResponse,
        isDeleteChannelNodeResponse,
        isSetChannelNodePermissionsResponse,
        isAddNodeResponse,
        isDeleteNodeResponse,
        isGetNodesResponse
    ])(x)
}