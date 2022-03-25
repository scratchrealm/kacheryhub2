import { ChannelName } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent, useCallback } from 'react';
import { ChannelSettings } from 'types/Channel';
import EditableTextField from '../EditableTextField';

type Props = {
    channelName: ChannelName
    channelSettings: ChannelSettings
    setChannelSettings?: (o: {channelName: ChannelName, channelSettings: ChannelSettings}) => void
}

const IPFSDownloadGatewayControl: FunctionComponent<Props> = ({channelName, channelSettings, setChannelSettings}) => {
    const handleChange = useCallback((x: string) => {
        if (!setChannelSettings) return
        const newSettings: ChannelSettings = {
            ...channelSettings,
            ipfs: {
                ...(channelSettings.ipfs || {}),
                downloadGateway: {
                    ...(channelSettings.ipfs?.downloadGateway || {}),
                    hostName: x || ''
                }
            }
        }
        setChannelSettings({channelName, channelSettings: newSettings})
    }, [channelName, channelSettings, setChannelSettings])
    return (
        <div>
            <span style={{color: 'blue'}}>Hostname:</span>
            <EditableTextField
                value={channelSettings.ipfs?.downloadGateway?.hostName || ''}
                onChange={handleChange}
            />
        </div>
    )
}

export default IPFSDownloadGatewayControl