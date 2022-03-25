import { ChannelName } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent, useCallback } from 'react';
import { ChannelSettings } from 'types/Channel';
import EditableTextField from '../EditableTextField';

type Props = {
    channelName: ChannelName
    channelSettings: ChannelSettings
    setChannelSettings?: (o: {channelName: ChannelName, channelSettings: ChannelSettings}) => void
}

const GoogleCredentialsControl: FunctionComponent<Props> = ({channelName, channelSettings, setChannelSettings}) => {
    const handleChange = useCallback((x: string) => {
        if (!setChannelSettings) return
        const newSettings: ChannelSettings = {
            ...channelSettings,
            googleCredentials: x
        }
        setChannelSettings({channelName, channelSettings: newSettings})
    }, [channelName, channelSettings, setChannelSettings])
    const googleCredentials = channelSettings.googleCredentials
    return (
        <div>
            <EditableTextField
                value={googleCredentials === null ? '*hidden*' : googleCredentials || ''}
                clearOnEdit={true}
                onChange={handleChange}
            /><br />
        </div>
    )
}

export default GoogleCredentialsControl