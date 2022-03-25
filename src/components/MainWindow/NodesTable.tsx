import { IconButton } from '@material-ui/core';
import { AddCircle, Refresh } from '@material-ui/icons';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'commonComponents/NiceTable/NiceTable';
import useVisible from 'commonComponents/useVisible';
import { isNodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import AddNodeControl from './AddNodeControl';
import useNodes from './useNodes';

type Props = {
}

const NodesTable: FunctionComponent<Props> = () => {
    const addVisible = useVisible()

    const {setRoute} = useRoute()

    const { nodes, refreshNodes, addNode, deleteNode } = useNodes()

    const columns = useMemo(() => ([
        {
            key: 'nodeId',
            label: 'Node ID'
        },
        {
            key: 'label',
            label: 'Label'
        },
        {
            key: 'ownerId',
            label: 'Owner'
        },
        {
            key: 'verified',
            label: 'Verified'
        }
    ]), [])

    const rows = useMemo(() => (
        (nodes || []).map((node) => ({
            key: node.nodeId.toString(),
            columnValues: {
                nodeId: {
                    text: node.nodeId.toString(),
                    element: <Hyperlink onClick={() => {setRoute({page: 'node', nodeId: node.nodeId})}}>{node.nodeId}</Hyperlink>
                },
                label: {
                    text: node.label,
                    element: <Hyperlink onClick={() => {setRoute({page: 'node', nodeId: node.nodeId})}}>{node.label}</Hyperlink>
                },
                ownerId: node.ownerId.toString(),
                verified: {
                    text: node.verified ? 'YES' : 'NO',
                    element: node.verified ? (
                        <span style={{color: 'darkgreen'}}>YES</span>
                    ) : (
                        <Hyperlink onClick={() => {setRoute({page: 'node', nodeId: node.nodeId})}}><span style={{color: 'darkred', fontWeight: 'bold'}}>NO</span></Hyperlink>
                    )
                }
            }
        }))
    ), [nodes, setRoute])

    const handleDeleteNode = useCallback((nodeId: string) => {
        if (!isNodeId(nodeId)) return
        deleteNode(nodeId)
    }, [deleteNode])

    if (!nodes) {
        return <span>Loading nodes...</span>
    }

    return (
        <div>
            <h3>Nodes</h3>
            <IconButton onClick={refreshNodes} title="Refresh nodes"><Refresh /></IconButton>
            <IconButton onClick={addVisible.show} title="Add node"><AddCircle /></IconButton>
            {
                addVisible.visible && (
                    <AddNodeControl
                        onAdd={addNode}
                        onClose={addVisible.hide}
                    />
                )
            }
            <NiceTable
                columns={columns}
                rows={rows}
                onDeleteRow={handleDeleteNode}
            />
        </div>
    )
}

export default NodesTable