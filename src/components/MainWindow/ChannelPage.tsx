import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import { ChannelName } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import ChannelNodesTable from './ChannelNodesTable';
import ChannelSettingsView from './ChannelSettingsView';
import useChannelNodes from './useChannelNodes';
import useChannels from './useChannels';

type Props = {
    channelName: ChannelName
}

const ChannelPage: FunctionComponent<Props> = ({channelName}) => {
    const { channels, setChannelSettings } = useChannels()
    const { channelNodes, addChannelNode, deleteChannelNode } = useChannelNodes()
    const { setRoute } = useRoute()

    const channel = useMemo(() => (
        (channels || []).filter(channel => (channel.channelName === channelName))[0]
    ), [channels, channelName])

    const channelNodesForChannel = useMemo(() => (
        channel ? (
            (channelNodes || []).filter(cn => (cn.channelName === channel.channelName))
        ) : undefined
    ), [channelNodes, channel])

    const tableData = useMemo(() => {
        if (!channel) return undefined
        return [
            { key: 'channelName', label: 'Channel', value: channel.channelName.toString() },
            { key: 'ownerId', label: 'Owner', value: channel.ownerId.toString() },
            { key: 'timestampCreated', label: 'Created', value: `${new Date(channel.timestampCreated)}` },
            { key: 'timestampLastModified', label: 'Modified', value: `${new Date(channel.timestampLastModified)}` }
        ]
    }, [channel])

    const handleBack = useCallback(() => {
        setRoute({page: 'home'})
    }, [setRoute])

    if (!channels) {
        return <span>Loading...</span>
    }

    if (!channelNodes) {
        return <span>Loading...</span>
    }

    if (!channel) {
        return <span>channel not found: {channelName}</span>
    }

    if (!channelNodesForChannel) {
        return <span>Unexpected, no channelNodesForChannel</span>
    }


    if (!tableData) return <div />
    return (
        <div>
            <Hyperlink onClick={handleBack}>Back</Hyperlink>
            <Table className="NiceTable2">
                <TableBody>
                    {
                        tableData.map(x => (
                            <TableRow key={x.key}>
                                <TableCell>{x.label}: </TableCell>
                                <TableCell style={{wordBreak: 'break-word'}}>{x.value}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <ChannelSettingsView
                channelName={channel.channelName}
                channelSettings={channel.settings}
                setChannelSettings={setChannelSettings}
            />
            <ChannelNodesTable
                channelName={channel.channelName}
                channelNodes={channelNodes}
                addChannelNode={addChannelNode}
                deleteChannelNode={deleteChannelNode}
            />
        </div>
    )
}

export default ChannelPage