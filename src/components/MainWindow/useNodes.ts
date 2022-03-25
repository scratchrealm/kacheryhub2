import guiApiRequest from "common/guiApiRequest"
import { NodeId } from "commonInterface/kacheryTypes"
import { useSignedIn } from "components/googleSignIn/GoogleSignIn"
import useErrorMessage from "errorMessageContext/useErrorMessage"
import { useCallback, useEffect, useState } from "react"
import { DeleteNodeRequest, GetNodesRequest, isDeleteNodeResponse, isGetNodesResponse, isAddNodeResponse, AddNodeRequest } from "types/GuiRequest"
import { Node } from "types/Node"

const useNodes = () => {
    const [nodes, setNodes] = useState<Node[] | undefined>(undefined)
    const { userId, googleIdToken } = useSignedIn()
    const [refreshCode, setRefreshCode] = useState<number>(0)
    const refreshNodes = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])
    const {setErrorMessage} = useErrorMessage()

    useEffect(() => {
        ; (async () => {
            setErrorMessage('')
            setNodes(undefined)
            if (!userId) return
            let canceled = false
            const req: GetNodesRequest = {
                type: 'getNodes',
                userId,
                auth: { userId, googleIdToken }
            }
            const resp = await guiApiRequest(req, { reCaptcha: false, setErrorMessage })
            if (!resp) return
            if (!isGetNodesResponse(resp)) {
                console.warn(resp)
                throw Error('Unexpected response')
            }
            console.log(resp)
            if (canceled) return
            setNodes(resp.nodes)
            return () => { canceled = true }
        })()
    }, [userId, googleIdToken, refreshCode, setErrorMessage])

    const addNode = useCallback((nodeId: NodeId, label: string) => {
        if (!userId) return
            ; (async () => {
                const req: AddNodeRequest = {
                    type: 'addNode',
                    nodeId,
                    ownerId: userId,
                    label,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isAddNodeResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshNodes()
            })()
    }, [userId, googleIdToken, refreshNodes, setErrorMessage])

    const deleteNode = useCallback((nodeId: NodeId) => {
        if (!userId) return
            ; (async () => {
                const req: DeleteNodeRequest = {
                    type: 'deleteNode',
                    nodeId,
                    ownerId: userId,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isDeleteNodeResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshNodes()
            })()
    }, [userId, googleIdToken, refreshNodes, setErrorMessage])

    return { nodes, refreshNodes, addNode, deleteNode }
}

export default useNodes