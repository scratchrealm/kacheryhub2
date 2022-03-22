import guiApiRequest from "common/guiApiRequest"
import { ChannelName, JSONValue, NodeId } from "commonInterface/kacheryTypes"
import { useSignedIn } from "components/googleSignIn/GoogleSignIn"
import useErrorMessage from "errorMessageContext/useErrorMessage"
import { useCallback, useEffect, useState } from "react"
import { ChannelConfig } from "types/ChannelConfig"
import { AddChannelNodeRequest, AddChannelRequest, DeleteChannelNodeRequest, DeleteChannelRequest, GetChannelConfigsRequest, isAddChannelNodeResponse, isAddChannelResponse, isDeleteChannelNodeResponse, isDeleteChannelResponse, isGetChannelConfigsResponse, isSetChannelInfoResponse, isSetChannelNodeServiceConfigResponse, SetChannelInfoRequest, SetChannelNodeServiceConfigRequest } from "types/GuiRequest"

const useChannelConfigs = () => {
    const [channelConfigs, setChannelConfigs] = useState<ChannelConfig[] | undefined>(undefined)
    const { userId, googleIdToken } = useSignedIn()
    const [refreshCode, setRefreshCode] = useState<number>(0)
    const refreshChannelConfigs = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])
    const {setErrorMessage} = useErrorMessage()

    useEffect(() => {
        ; (async () => {
            setErrorMessage('')
            setChannelConfigs(undefined)
            if (!userId) return
            let canceled = false
            const req: GetChannelConfigsRequest = {
                type: 'getChannelConfigs',
                userId,
                auth: { userId, googleIdToken }
            }
            const resp = await guiApiRequest(req, { reCaptcha: false, setErrorMessage })
            if (!resp) return
            if (!isGetChannelConfigsResponse(resp)) {
                console.warn(resp)
                throw Error('Unexpected response')
            }
            console.log(resp)
            if (canceled) return
            setChannelConfigs(resp.channelConfigs)
            return () => { canceled = true }
        })()
    }, [userId, googleIdToken, refreshCode, setErrorMessage])

    const addChannel = useCallback((channelName: ChannelName) => {
        if (!userId) return
            ; (async () => {
                const req: AddChannelRequest = {
                    type: 'addChannel',
                    channelName,
                    ownerId: userId,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isAddChannelResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    const deleteChannel = useCallback((channelName: ChannelName) => {
        if (!userId) return
            ; (async () => {
                const req: DeleteChannelRequest = {
                    type: 'deleteChannel',
                    channelName,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isDeleteChannelResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    const addChannelNode = useCallback((channelName: ChannelName, nodeId: NodeId) => {
        if (!userId) return
            ; (async () => {
                const req: AddChannelNodeRequest = {
                    type: 'addChannelNode',
                    channelName,
                    nodeId,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isAddChannelNodeResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    const deleteChannelNode = useCallback((channelName: ChannelName, nodeId: NodeId) => {
        if (!userId) return
            ; (async () => {
                const req: DeleteChannelNodeRequest = {
                    type: 'deleteChannelNode',
                    channelName,
                    nodeId,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isDeleteChannelNodeResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    const setChannelInfo = useCallback((o: {channelName: ChannelName, bucketName?: string, googleCredentials?: string}) => {
        const {channelName, bucketName, googleCredentials} = o
        if (!userId) return
            ; (async () => {
                const req: SetChannelInfoRequest = {
                    type: 'setChannelInfo',
                    channelName,
                    bucketName,
                    googleCredentials,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isSetChannelInfoResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    const setChannelNodeServiceConfig = useCallback((o: {channelName: ChannelName, nodeId: NodeId, serviceName: string, serviceConfig: JSONValue}) => {
        const {channelName, nodeId, serviceName, serviceConfig} = o
        if (!userId) return
            ; (async () => {
                const req: SetChannelNodeServiceConfigRequest = {
                    type: 'setChannelNodeServiceConfig',
                    channelName,
                    nodeId,
                    serviceName,
                    serviceConfig,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isSetChannelNodeServiceConfigResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelConfigs()
            })()
    }, [userId, googleIdToken, refreshChannelConfigs, setErrorMessage])

    return { channelConfigs, refreshChannelConfigs, addChannel, deleteChannel, addChannelNode, deleteChannelNode, setChannelInfo, setChannelNodeServiceConfig }
}

export default useChannelConfigs