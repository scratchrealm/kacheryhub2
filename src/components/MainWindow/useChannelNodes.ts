import guiApiRequest from "common/guiApiRequest"
import { ChannelName, NodeId } from "commonInterface/kacheryTypes"
import { useSignedIn } from "components/googleSignIn/GoogleSignIn"
import useErrorMessage from "errorMessageContext/useErrorMessage"
import { useCallback, useEffect, useState } from "react"
import { ChannelNode, ChannelNodePermissions } from "types/ChannelNode"
import { AddChannelNodeRequest, DeleteChannelNodeRequest, GetChannelNodesRequest, isAddChannelNodeResponse, isDeleteChannelNodeResponse, isGetChannelNodesResponse, isSetChannelNodePermissionsResponse, SetChannelNodePermissionsRequest } from "types/GuiRequest"

const useChannelNodes = () => {
    const [channelNodes, setChannelNodes] = useState<ChannelNode[] | undefined>(undefined)
    const { userId, googleIdToken } = useSignedIn()
    const [refreshCode, setRefreshCode] = useState<number>(0)
    const refreshChannelNodes = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])
    const {setErrorMessage} = useErrorMessage()

    useEffect(() => {
        ; (async () => {
            setErrorMessage('')
            setChannelNodes(undefined)
            if (!userId) return
            let canceled = false
            const req: GetChannelNodesRequest = {
                type: 'getChannelNodes',
                userId,
                auth: { userId, googleIdToken }
            }
            const resp = await guiApiRequest(req, { reCaptcha: false, setErrorMessage })
            if (!resp) return
            if (!isGetChannelNodesResponse(resp)) {
                console.warn(resp)
                throw Error('Unexpected response')
            }
            if (canceled) return
            setChannelNodes(resp.channelNodes)
            return () => { canceled = true }
        })()
    }, [userId, googleIdToken, refreshCode, setErrorMessage])

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
                refreshChannelNodes()
            })()
    }, [userId, googleIdToken, refreshChannelNodes, setErrorMessage])

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
                refreshChannelNodes()
            })()
    }, [userId, googleIdToken, refreshChannelNodes, setErrorMessage])

    const setChannelNodePermissions = useCallback((o: {channelName: ChannelName, nodeId: NodeId, channelNodePermissions: ChannelNodePermissions}) => {
        const {channelName, nodeId, channelNodePermissions} = o
        if (!userId) return
            ; (async () => {
                const req: SetChannelNodePermissionsRequest = {
                    type: 'setChannelNodePermissions',
                    channelName,
                    nodeId,
                    channelNodePermissions,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isSetChannelNodePermissionsResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannelNodes()
            })()
    }, [userId, googleIdToken, refreshChannelNodes, setErrorMessage])

    return { channelNodes, refreshChannelNodes, addChannelNode, deleteChannelNode, setChannelNodePermissions }
}

export default useChannelNodes