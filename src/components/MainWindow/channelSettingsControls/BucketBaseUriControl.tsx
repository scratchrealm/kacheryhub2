import { ChannelName } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent, useCallback } from 'react';
import { ChannelSettings } from 'types/Channel';
import EditableTextField from '../EditableTextField';

type Props = {
    channelName: ChannelName
    channelSettings: ChannelSettings
    setChannelSettings?: (o: {channelName: ChannelName, channelSettings: ChannelSettings}) => void
}

const BucketBaseUriControl: FunctionComponent<Props> = ({channelName, channelSettings, setChannelSettings}) => {
    const handleChange = useCallback((x: string) => {
        if (!setChannelSettings) return
        const newSettings: ChannelSettings = {
            ...channelSettings,
            bucketBaseUri: x || undefined
        }
        setChannelSettings({channelName, channelSettings: newSettings})
    }, [channelName, channelSettings, setChannelSettings])
    return (
        <div>
            <EditableTextField
                value={channelSettings.bucketBaseUri || ''}
                onChange={handleChange}
            />
        </div>
    )
}

export default BucketBaseUriControl