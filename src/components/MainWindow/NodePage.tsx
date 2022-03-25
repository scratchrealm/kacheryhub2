import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import { NodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import useNodes from './useNodes';

type Props = {
    nodeId: NodeId
}

const NodePage: FunctionComponent<Props> = ({nodeId}) => {
    const { nodes } = useNodes()
    const { setRoute } = useRoute()

    const node = useMemo(() => (
        (nodes || []).filter(node => (node.nodeId === nodeId))[0]
    ), [nodes, nodeId])

    const tableData = useMemo(() => {
        if (!node) return undefined
        return [
            { key: 'nodeId', label: 'Node ID', value: node.nodeId.toString() },
            { key: 'label', label: 'Label', value: node.label },
            { key: 'ownerId', label: 'Owner', value: node.ownerId.toString() },
            { key: 'timestampCreated', label: 'Created', value: `${new Date(node.timestampCreated)}` },
            {
                key: 'verified',
                label: 'Verified',
                value: node.verified ? (
                    <span style={{color: 'darkgreen'}}>VERIFIED</span>
                ) : (
                    <span>
                        <span style={{color: 'darkred'}}>NOT VERIFIED</span><br />
                        To prove that this node is controlled by you, run the following on the computer that is hosting the node. Then refresh this page.<br />
                        <pre><span style={{fontWeight: 'bold', color: 'rbg(22, 22, 22)'}}>kachery-verify-node --owner {node.ownerId}</span></pre>
                    </span>
                )
            }
        ]
    }, [node])

    const handleBack = useCallback(() => {
        setRoute({page: 'home'})
    }, [setRoute])

    if (!nodes) {
        return <span>Loading...</span>
    }

    if (!node) {
        return <span>node not found: {node}</span>
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
        </div>
    )
}

export default NodePage