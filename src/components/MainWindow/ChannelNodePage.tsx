import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import { ChannelName, NodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useMemo } from 'react';
import { ChannelNode } from 'types/ChannelNode';
import ChannelNodePermissionsView from './ChannelNodePermissionsView';
import useChannelNodes from './useChannelNodes';

type Props = {
    channelName: ChannelName
    nodeId: NodeId
}

const ChannelNodePage: FunctionComponent<Props> = ({channelName, nodeId}) => {
    const { channelNodes } = useChannelNodes()
    const { setRoute } = useRoute()

    const channelNode: ChannelNode | undefined = useMemo(() => (
        channelNodes ? channelNodes.filter(n => (n.channelName === channelName) && (n.nodeId === nodeId))[0] : undefined
    ), [channelNodes, channelName, nodeId])

    const tableData = useMemo(() => {
        if (!channelNode) return undefined
        return [
            {
                key: 'channelName',
                label: 'Channel',
                value: <Hyperlink onClick={() => {setRoute({page: 'channel', channelName: channelNode.channelName})}}>{channelNode.channelName.toString()}</Hyperlink>
            },
            {
                key: 'nodeId',
                label: 'Node',
                value: <Hyperlink onClick={() => {setRoute({page: 'node', nodeId: channelNode.nodeId})}}>{channelNode.nodeId.toString()}</Hyperlink>
            },
            {
                key: 'permissions',
                label: 'Permissions',
                value: <ChannelNodePermissionsView channelNode={channelNode} />
            }
        ]
    }, [channelNode, setRoute])

    if (!channelNodes) {
        return <span>Loading...</span>
    }

    if (!channelNode) {
        return <span>Channel node not found: {channelName} {nodeId}</span>
    }

    if (!tableData) return <div />
    return (
        <div>
            <h3>Channel node</h3>
            <Table className="NiceTable2">
                <TableBody>
                    {
                        tableData.map(x => (
                            <TableRow key={x.key}>
                                <TableCell>{x.label}: </TableCell>
                                <TableCell>{x.value}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ChannelNodePage