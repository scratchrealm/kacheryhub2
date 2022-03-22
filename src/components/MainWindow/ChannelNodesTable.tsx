import { IconButton } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'commonComponents/NiceTable/NiceTable';
import useVisible from 'commonComponents/useVisible';
import { ChannelName, isNodeId, NodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { ChannelConfig } from 'types/ChannelConfig';
import AddChannelNodeControl from './AddChannelNodeControl';
import ChannelNodeServiceConfigsView from './ChannelNodeServiceConfigsView';

type Props = {
    channelConfig: ChannelConfig
    addChannelNode: (channelName: ChannelName, nodeId: NodeId) => void
    deleteChannelNode: (channelName: ChannelName, nodeId: NodeId) => void
}

const ChannelNodesTable: FunctionComponent<Props> = ({channelConfig, addChannelNode, deleteChannelNode}) => {
    const addVisible = useVisible()
    const { setRoute } = useRoute()

    const columns = useMemo(() => ([
        {
            key: 'nodeId',
            label: 'Node'
        },
        {
            key: 'serviceConfigs',
            label: 'Service configs'
        }
    ]), [])

    const rows = useMemo(() => (
        (channelConfig.nodes || []).map((channelNodeConfig) => ({
            key: channelNodeConfig.nodeId.toString(),
            columnValues: {
                nodeId: {
                    text: channelNodeConfig.nodeId,
                    element: <Hyperlink onClick={() => {setRoute({page: 'channelNode', channelName: channelConfig.channelName, nodeId: channelNodeConfig.nodeId})}}>{channelNodeConfig.nodeId}</Hyperlink>
                },
                serviceConfigs: {
                    text: '',
                    element: <ChannelNodeServiceConfigsView channelNodeConfig={channelNodeConfig} />
                }
            }
        }))
    ), [channelConfig, setRoute])

    const handleDeleteChannelNode = useCallback((nodeId: string) => {
        if (!isNodeId(nodeId)) return
        deleteChannelNode(channelConfig.channelName, nodeId)
    }, [channelConfig, deleteChannelNode])

    return (
        <div>
            <h3>Channel nodes</h3>
            <IconButton onClick={addVisible.show} title="Add channel"><AddCircle /></IconButton>
            {
                addVisible.visible && (
                    <AddChannelNodeControl
                        channelName={channelConfig.channelName}
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