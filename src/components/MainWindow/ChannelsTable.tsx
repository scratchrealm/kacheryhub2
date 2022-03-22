import { IconButton } from '@material-ui/core';
import { AddCircle, Refresh } from '@material-ui/icons';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'commonComponents/NiceTable/NiceTable';
import useVisible from 'commonComponents/useVisible';
import { isChannelName } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import AddChannelControl from './AddChannelControl';
import useChannelConfigs from './useChannelConfigs';

type Props = {
}

const ChannelsTable: FunctionComponent<Props> = () => {
    const addVisible = useVisible()

    const {setRoute} = useRoute()

    const { channelConfigs, refreshChannelConfigs, addChannel, deleteChannel } = useChannelConfigs()

    const columns = useMemo(() => ([
        {
            key: 'channelName',
            label: 'Channel'
        },
        {
            key: 'ownerId',
            label: 'Owner'
        },
        {
            key: 'bucketName',
            label: 'Bucket'
        },
        {
            key: 'googleCredentials',
            label: 'Google credentials'
        },
        {
            key: 'timestampCreated',
            label: 'Created'
        },
        {
            key: 'timestampLastModified',
            label: 'Modified'
        },
        {
            key: 'numNodes',
            label: 'Num. nodes'
        }
    ]), [])

    const rows = useMemo(() => (
        (channelConfigs || []).map((channelConfig) => ({
            key: channelConfig.channelName.toString(),
            columnValues: {
                channelName: {
                    text: channelConfig.channelName.toString(),
                    element: <Hyperlink onClick={() => {setRoute({page: 'channel', channelName: channelConfig.channelName})}}>{channelConfig.channelName}</Hyperlink>
                },
                ownerId: channelConfig.ownerId.toString(),
                bucketName: channelConfig.bucketName,
                googleCredentials: channelConfig.googleCredentials ? '**********' : '',
                timestampCreated: timeSince(channelConfig.timestampCreated),
                timestampLastModified: timeSince(channelConfig.timestampLastModified),
                numNodes: `${channelConfig.nodes.length}`
            }
        }))
    ), [channelConfigs, setRoute])

    const handleDeleteChannel = useCallback((channelName: string) => {
        if (!isChannelName(channelName)) return
        deleteChannel(channelName)
    }, [deleteChannel])

    if (!channelConfigs) {
        return <span>Loading channels...</span>
    }

    return (
        <div>
            <h3>Channels</h3>
            <IconButton onClick={refreshChannelConfigs} title="Refresh channels"><Refresh /></IconButton>
            <IconButton onClick={addVisible.show} title="Add channel"><AddCircle /></IconButton>
            {
                addVisible.visible && (
                    <AddChannelControl
                        onAdd={addChannel}
                        onClose={addVisible.hide}
                    />
                )
            }
            <NiceTable
                columns={columns}
                rows={rows}
                onDeleteRow={handleDeleteChannel}
            />
        </div>
    )
}

// thanks https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
function timeSince(date: number) {
    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export default ChannelsTable