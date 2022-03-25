import { IconButton } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'commonComponents/NiceTable/NiceTable';
import useVisible from 'commonComponents/useVisible';
import { ChannelName, isNodeId, NodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { ChannelNode } from 'types/ChannelNode';
import AddChannelNodeControl from './AddChannelNodeControl';
import ChannelNodePermissionsView from './ChannelNodePermissionsView';

type Props = {
    channelName: ChannelName
    channelNodes: ChannelNode[]
    addChannelNode: (channelName: ChannelName, nodeId: NodeId) => void
    deleteChannelNode: (channelName: ChannelName, nodeId: NodeId) => void
}

const ChannelNodesTable: FunctionComponent<Props> = ({channelName, channelNodes, addChannelNode, deleteChannelNode}) => {
    const addVisible = useVisible()
    const { setRoute } = useRoute()

    const columns = useMemo(() => ([
        {
            key: 'nodeId',
            label: 'Channel node'
        },
        {
            key: 'permissions',
            label: 'Permissions'
        }
    ]), [])

    const rows = useMemo(() => (
        channelNodes.map((channelNode) => ({
            key: channelNode.nodeId.toString(),
            columnValues: {
                nodeId: {
                    text: channelNode.nodeId,
                    element: <Hyperlink onClick={() => {setRoute({page: 'channelNode', channelName: channelNode.channelName, nodeId: channelNode.nodeId})}}>{channelNode.nodeId}</Hyperlink>
                },
                permissions: {
                    text: '',
                    element: <ChannelNodePermissionsView channelNode={channelNode} />
                }
            }
        }))
    ), [channelNodes, setRoute])

    const handleDeleteChannelNode = useCallback((nodeId: string) => {
        if (!isNodeId(nodeId)) return
        deleteChannelNode(channelName, nodeId)
    }, [channelName, deleteChannelNode])

    return (
        <div>
            <h3>Channel nodes</h3>
            <IconButton onClick={addVisible.show} title="Add channel node"><AddCircle /></IconButton>
            {
                addVisible.visible && (
                    <AddChannelNodeControl
                        channelName={channelName}
                        onAdd={addChannelNode}
                        onClose={addVisible.hide}
                    />
                )
            }
            <NiceTable
                columns={columns}
                rows={rows}
                onDeleteRow={handleDeleteChannelNode}
            />
        </div>
    )
}

export default ChannelNodesTable