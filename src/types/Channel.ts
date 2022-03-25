import { ChannelName, isChannelName, isNull, isNumber, isOneOf, isString, isUserId, optional, UserId, _validateObject } from "../commonInterface/kacheryTypes"

export type ChannelSettings = {
    ipfs?: {
        downloadGateway?: {
            hostName: string // e.g., 'ipfs.io'
        },
        uploadGateway?: {
            hostName: string, // e.g., 'web3.storage',
            authenticationToken?: string | null // null means hidden, undefined means not present
        }
    },
    bucketBaseUri?: string,
    googleCredentials?: string | null // null means hidden, undefined means not present
}

export const isStringOrNull = isOneOf([isString, isNull])

export const isChannelSettings = (y: any): y is ChannelSettings => (
    _validateObject(y, {
        ipfs: optional((z: any) => (
            _validateObject(z, {
                downloadGateway: optional((a: any) => (
                    _validateObject(a, {
                        hostName: isString
                    })
                )),
                uploadGateway: optional((a: any) => (
                    _validateObject(a, {
                        hostName: isString,
                        authenticationToken: optional(isStringOrNull)
                    })
                ))
            })
        )),
        bucketBaseUri: optional(isString),
        googleCredentials: optional(isStringOrNull)
    })
)

export type Channel = {
    channelName: ChannelName
    ownerId: UserId
    timestampCreated: number
    timestampLastModified: number
    settings: ChannelSettings
}

export const isChannel = (x: any): x is Channel => {
    return _validateObject(x, {
        channelName: isChannelName,
        ownerId: isUserId,
        timestampCreated: isNumber,
        timestampLastModified: isNumber,
        settings: isChannelSettings
    })
}