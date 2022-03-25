import { Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { isNodeId, NodeId } from 'commonInterface/kacheryTypes'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'

type Props = {
    onClose?: () => void
    onAdd: (nodeId: NodeId, label: string) => void
}

const AddNodeControl: FunctionComponent<Props> = ({onClose, onAdd}) => {
    const [editNodeId, setEditNodeId] = useState<string>('')
    const [editLabel, setEditLabel] = useState<string>('')
    
    const handleAdd = useCallback(() => {
        if (!isNodeId(editNodeId)) return
        onAdd(editNodeId, editLabel)
        onClose && onClose()
    }, [onClose, editNodeId, editLabel, onAdd])
    const okayToAdd = useMemo(() => {
        return ((isNodeId(editNodeId)) && (editLabel.length >= 3))
    }, [editNodeId, editLabel])
    const handleNodeIdChange = useCallback((event: any) => {
        setEditNodeId(event.target.value)
    }, [])
    const handleLabelChange = useCallback((event: any) => {
        setEditLabel(event.target.value)
    }, [])
    return (
        <div>
            <Table style={{maxWidth: 400}}>
                <TableBody>
                    <TableRow>
                        <TableCell>Node ID</TableCell>
                        <TableCell>
                            <input type="text" value={editNodeId} onChange={handleNodeIdChange} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell>
                            <input type="text" value={editLabel} onChange={handleLabelChange} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button onClick={handleAdd} disabled={!okayToAdd}>Add</Button>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
        </div>
    )
}

export default AddNodeControl