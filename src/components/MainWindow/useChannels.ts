import guiApiRequest from "common/guiApiRequest"
import { ChannelName } from "commonInterface/kacheryTypes"
import { useSignedIn } from "components/googleSignIn/GoogleSignIn"
import useErrorMessage from "errorMessageContext/useErrorMessage"
import { useCallback, useEffect, useState } from "react"
import { Channel, ChannelSettings } from "types/Channel"
import { AddChannelRequest, DeleteChannelRequest, GetChannelsRequest, isAddChannelResponse, isDeleteChannelResponse, isGetChannelsResponse, isSetChannelSettingsResponse, SetChannelSettingsRequest } from "types/GuiRequest"

const useChannels = () => {
    const [channels, setChannels] = useState<Channel[] | undefined>(undefined)
    const { userId, googleIdToken } = useSignedIn()
    const [refreshCode, setRefreshCode] = useState<number>(0)
    const refreshChannels = useCallback(() => {
        setRefreshCode(c => (c + 1))
    }, [])
    const {setErrorMessage} = useErrorMessage()

    useEffect(() => {
        ; (async () => {
            setErrorMessage('')
            setChannels(undefined)
            if (!userId) return
            let canceled = false
            const req: GetChannelsRequest = {
                type: 'getChannels',
                userId,
                auth: { userId, googleIdToken }
            }
            const resp = await guiApiRequest(req, { reCaptcha: false, setErrorMessage })
            if (!resp) return
            if (!isGetChannelsResponse(resp)) {
                console.warn(resp)
                throw Error('Unexpected response')
            }
            console.log(resp)
            if (canceled) return
            setChannels(resp.channels)
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
                refreshChannels()
            })()
    }, [userId, googleIdToken, refreshChannels, setErrorMessage])

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
                refreshChannels()
            })()
    }, [userId, googleIdToken, refreshChannels, setErrorMessage])

    const setChannelSettings = useCallback((o: {channelName: ChannelName, channelSettings: ChannelSettings}) => {
        const {channelName, channelSettings} = o
        if (!userId) return
            ; (async () => {
                const req: SetChannelSettingsRequest = {
                    type: 'setChannelSettings',
                    channelName,
                    channelSettings,
                    auth: { userId, googleIdToken }
                }
                const resp = await guiApiRequest(req, { reCaptcha: true, setErrorMessage })
                if (!resp) return
                if (!isSetChannelSettingsResponse(resp)) {
                    throw Error('Unexpected response')
                }
                refreshChannels()
            })()
    }, [userId, googleIdToken, refreshChannels, setErrorMessage])

    return { channels, refreshChannels, addChannel, deleteChannel, setChannelSettings }
}

export default useChannels