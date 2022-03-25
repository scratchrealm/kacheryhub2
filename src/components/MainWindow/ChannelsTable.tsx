import { IconButton } from '@material-ui/core';
import { AddCircle, Refresh } from '@material-ui/icons';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'commonComponents/NiceTable/NiceTable';
import useVisible from 'commonComponents/useVisible';
import { isChannelName } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import AddChannelControl from './AddChannelControl';
import useChannelNodes from './useChannelNodes';
import useChannels from './useChannels';

type Props = {
}

const ChannelsTable: FunctionComponent<Props> = () => {
    const addVisible = useVisible()

    const {setRoute} = useRoute()

    const { channels, refreshChannels, addChannel, deleteChannel } = useChannels()
    const { channelNodes } = useChannelNodes()

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
        (channels || []).map((channel) => ({
            key: channel.channelName.toString(),
            columnValues: {
                channelName: {
                    text: channel.channelName.toString(),
                    element: <Hyperlink onClick={() => {setRoute({page: 'channel', channelName: channel.channelName})}}>{channel.channelName}</Hyperlink>
                },
                ownerId: channel.ownerId.toString(),
                timestampCreated: timeSince(channel.timestampCreated),
                timestampLastModified: timeSince(channel.timestampLastModified),
                numNodes: `${(channelNodes || []).filter(cn => (cn.channelName === channel.channelName)).length}`
            }
        }))
    ), [channels, channelNodes, setRoute])

    const handleDeleteChannel = useCallback((channelName: string) => {
        if (!isChannelName(channelName)) return
        deleteChannel(channelName)
    }, [deleteChannel])

    if (!channels) {
        return <span>Loading channels...</span>
    }

    return (
        <div>
            <h3>Channels</h3>
            <IconButton onClick={refreshChannels} title="Refresh channels"><Refresh /></IconButton>
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