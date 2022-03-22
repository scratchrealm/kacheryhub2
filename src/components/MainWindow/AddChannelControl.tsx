import { Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { ChannelName, isChannelName } from 'commonInterface/kacheryTypes'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'

type Props = {
    onClose?: () => void
    onAdd: (channelName: ChannelName) => void
}

const AddChannelControl: FunctionComponent<Props> = ({onClose, onAdd}) => {
    const [editChannelName, setEditChannelName] = useState<string>('')
    
    const handleAdd = useCallback(() => {
        if (!isChannelName(editChannelName)) return
        onAdd(editChannelName)
        onClose && onClose()
    }, [onClose, editChannelName, onAdd])
    const okayToAdd = useMemo(() => {
        return isChannelName(editChannelName)
    }, [editChannelName])
    const handleChange = useCallback((event: any) => {
        setEditChannelName(event.target.value)
    }, [])
    return (
        <div>
            <Table style={{maxWidth: 400}}>
                <TableBody>
                    <TableRow>
                        <TableCell>Channel name</TableCell>
                        <TableCell>
                            <input type="text" value={editChannelName} onChange={handleChange} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button onClick={handleAdd} disabled={!okayToAdd}>Add</Button>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
        </div>
    )
}

export default AddChannelControl