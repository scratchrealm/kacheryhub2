import { Button, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

type Props = {
    value: string
    onChange: (x: string) => void
    tooltip?: string
}

const EditableTextField: FunctionComponent<Props> = ({value, onChange, tooltip}) => {
    const [editing, setEditing] = useState<boolean>(false)
    if (editing) {
        return (
            <TextInput
                value={value}
                onChange={(x) => {
                    onChange(x)
                    setEditing(false)
                }}
                onCancel={() => setEditing(false)}
            />
        )
    }
    else {
        return (
            <span>
                {value}
                <EditButton
                    title={tooltip || ''}
                    onClick={() => setEditing(true)}
                />
            </span>
        )
    }
}

const TextInput: FunctionComponent<{value: string, onChange: (x: string) => void, onCancel: () => void}> = ({value, onChange, onCancel}) => {
    const [internalValue, setInternalValue] = useState<string>('')
    useEffect(() => {
        setInternalValue(value)
    }, [value])
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setInternalValue(e.target.value as string)
    }, [])
    const handleSubmit = useCallback(() => {
        onChange(internalValue)
    }, [onChange, internalValue])
    return (
        <div>
            <input type="text" value={internalValue} onChange={handleChange} />
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </div>
    )
}


const EditButton: FunctionComponent<{title: string, onClick: () => void}> = ({title, onClick}) => {
    return (
        <IconButton
            title={title}
            onClick={onClick}
        >
            <Edit />
        </IconButton>
    )
}

export default EditableTextField