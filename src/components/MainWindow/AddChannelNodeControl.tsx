import { Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { ChannelName, isNodeId, NodeId } from 'commonInterface/kacheryTypes'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'

type Props = {
    channelName: ChannelName
    onClose?: () => void
    onAdd: (channelName: ChannelName, nodeId: NodeId) => void
}

const AddChannelNodeControl: FunctionComponent<Props> = ({channelName, onClose, onAdd}) => {
    const [editNodeId, setEditNodeId] = useState<string>('')
    
    const handleAdd = useCallback(() => {
        if (!isNodeId(editNodeId)) return
        onAdd(channelName, editNodeId)
        onClose && onClose()
    }, [onClose, channelName, editNodeId, onAdd])
    const okayToAdd = useMemo(() => {
        return isNodeId(editNodeId)
    }, [editNodeId])
    const handleChange = useCallback((event: any) => {
        setEditNodeId(event.target.value)
    }, [])
    return (
        <div>
            <Table style={{maxWidth: 400}}>
                <TableBody>
                    <TableRow>
                        <TableCell>Node ID</TableCell>
                        <TableCell>
                            <input type="text" value={editNodeId} onChange={handleChange} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button onClick={handleAdd} disabled={!okayToAdd}>Add</Button>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
        </div>
    )
}

export default AddChannelNodeControl