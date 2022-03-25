import { ChannelName } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent, useCallback } from 'react';
import { ChannelSettings } from 'types/Channel';
import EditableTextField from '../EditableTextField';

type Props = {
    channelName: ChannelName
    channelSettings: ChannelSettings
    setChannelSettings?: (o: {channelName: ChannelName, channelSettings: ChannelSettings}) => void
}

const IPFSUploadGatewayControl: FunctionComponent<Props> = ({channelName, channelSettings, setChannelSettings}) => {
    const handleChange = useCallback((x: string) => {
        if (!setChannelSettings) return
        const newSettings: ChannelSettings = {
            ...channelSettings,
            ipfs: {
                ...(channelSettings.ipfs || {}),
                uploadGateway: {
                    ...(channelSettings.ipfs?.uploadGateway || {}),
                    hostName: x || ''
                }
            }
        }
        setChannelSettings({channelName, channelSettings: newSettings})
    }, [channelName, channelSettings, setChannelSettings])
    const handleChangeAuth = useCallback((x: string) => {
        if (!setChannelSettings) return
        const newSettings: ChannelSettings = {
            ...channelSettings,
            ipfs: {
                ...(channelSettings.ipfs || {}),
                uploadGateway: {
                    ...(channelSettings.ipfs?.uploadGateway || {hostName: ''}),
                    authenticationToken: x || undefined
                }
            }
        }
        setChannelSettings({channelName, channelSettings: newSettings})
    }, [channelName, channelSettings, setChannelSettings])
    const authToken = channelSettings.ipfs?.uploadGateway?.authenticationToken
    return (
        <div>
            <span style={{color: 'blue'}}>Hostname:</span>
            <EditableTextField
                value={channelSettings.ipfs?.uploadGateway?.hostName || ''}
                onChange={handleChange}
            /><br />
            <span style={{color: 'blue'}}>Authentication token:</span>
            <EditableTextField
                value={authToken === null ? '*hidden*' : authToken || ''}
                clearOnEdit={true}
                onChange={handleChangeAuth}
            /><br />
        </div>
    )
}

export default IPFSUploadGatewayControl