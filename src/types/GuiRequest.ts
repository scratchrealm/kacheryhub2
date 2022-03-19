import { ChannelName, isArrayOf, isChannelName, isEqualTo, isJSONValue, isNodeId, isOneOf, isString, isUserId, JSONValue, NodeId, optional, UserId, _validateObject } from "../commonInterface/kacheryTypes"
import { Auth, isAuth } from "./Auth"
import { ChannelConfig, isChannelConfig } from "./ChannelConfig"

//////////////////////////////////////////////////////////////////////////////////
// getChannelConfigs

export type GetChannelConfigsRequest = {
    type: 'getChannelConfigs'
    userId?: UserId
    auth: Auth
}

export const isGetChannelConfigsRequest = (x: any): x is GetChannelConfigsRequest => {
    return _validateObject(x, {
        type: isEqualTo('getChannelConfigs'),
        userId: optional(isUserId),
        auth: isAuth
    })
}

export type GetChannelConfigsResponse = {
    type: 'getChannelConfigs'
    channelConfigs: ChannelConfig[]
}

export const isGetChannelConfigsResponse = (x: any): x is GetChannelConfigsResponse => {
    return _validateObject(x, {
        type: isEqualTo('getChannelConfigs'),
        channelConfigs: isArrayOf(isChannelConfig)
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
// setChannelInfo

export type SetChannelInfoRequest = {
    type: 'setChannelInfo'
    channelName: ChannelName
    bucketName?: string
    googleCredentials?: string
    auth: Auth
}

export const isSetChannelInfoRequest = (x: any): x is SetChannelInfoRequest => {
    return _validateObject(x, {
        type: isEqualTo('setChannelInfo'),
        channelName: isChannelName,
        bucketName: optional(isString),
        googleCredentials: optional(isString),
        auth: isAuth
    })
}

export type SetChannelInfoResponse = {
    type: 'setChannelInfo'
}

export const isSetChannelInfoResponse = (x: any): x is SetChannelInfoResponse => {
    return _validateObject(x, {
        type: isEqualTo('setChannelInfo')
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
// setChannelNodeServiceConfig

export type SetChannelNodeServiceConfigRequest = {
    type: 'setChannelNodeServiceConfig'
    channelName: ChannelName
    nodeId: NodeId
    serviceName: string
    serviceConfig: JSONValue
    auth: Auth
}

export const isSetChannelNodeServiceConfigRequest = (x: any): x is SetChannelNodeServiceConfigRequest => {
    return _validateObject(x, {
        type: isEqualTo('setChannelNodeServiceConfig'),
        channelName: isChannelName,
        nodeId: isNodeId,
        serviceName: isString,
        serviceConfig: isJSONValue,
        auth: isAuth
    })
}

export type SetChannelNodeServiceConfigResponse = {
    type: 'setChannelNodeServiceConfig'
}

export const isSetChannelNodeServiceConfigResponse = (x: any): x is SetChannelNodeServiceConfigResponse => {
    return _validateObject(x, {
        type: isEqualTo('setChannelNodeServiceConfig')
    })
}


//////////////////////////////////////////////////////////////////////////////////

export type GuiRequest =
    GetChannelConfigsRequest |
    AddChannelRequest |
    DeleteChannelRequest |
    SetChannelInfoRequest |
    AddChannelNodeRequest |
    DeleteChannelNodeRequest |
    SetChannelNodeServiceConfigRequest

export const isGuiRequest = (x: any): x is GuiRequest => {
    return isOneOf([
        isGetChannelConfigsRequest,
        isAddChannelRequest,
        isDeleteChannelRequest,
        isSetChannelInfoRequest,
        isAddChannelNodeRequest,
        isDeleteChannelNodeRequest,
        isSetChannelNodeServiceConfigRequest
    ])(x)
}

export type GuiResponse =
    GetChannelConfigsResponse |
    AddChannelResponse |
    DeleteChannelResponse |
    SetChannelInfoResponse |
    AddChannelNodeResponse |
    DeleteChannelNodeResponse |
    SetChannelNodeServiceConfigResponse

export const isGuiResponse = (x: any): x is GuiResponse => {
    return isOneOf([
        isGetChannelConfigsResponse,
        isAddChannelResponse,
        isDeleteChannelResponse,
        isSetChannelInfoResponse,
        isAddChannelNodeResponse,
        isDeleteChannelNodeResponse,
        isSetChannelNodeServiceConfigResponse
    ])(x)
}