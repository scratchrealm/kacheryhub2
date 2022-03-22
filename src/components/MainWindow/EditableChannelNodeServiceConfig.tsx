import { Checkbox, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { ChannelName, JSONValue, NodeId } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { ChannelNodeConfig } from 'types/ChannelConfig';
import channelNodeServiceConfigSpecs from './channelNodeServiceConfigSpecs';

type Props = {
    channelName: ChannelName
    channelNodeConfig: ChannelNodeConfig
    serviceName: string
    setChannelNodeServiceConfig: (o: {channelName: ChannelName, nodeId: NodeId, serviceName: string, serviceConfig: JSONValue}) => void
}

const EditableChannelNodeServiceConfig: FunctionComponent<Props> = ({channelName, channelNodeConfig, serviceName, setChannelNodeServiceConfig}) => {
    const spec = useMemo(() => (
        channelNodeServiceConfigSpecs.filter(spec => (spec.serviceName === serviceName))[0]
    ), [serviceName])
    const serviceConfig = useMemo(() => (
        channelNodeConfig.serviceConfigs[serviceName] || {}
    ), [channelNodeConfig, serviceName])
    const [editServiceConfig, setEditServiceConfig] = useState<{[key: string]: JSONValue}>({})
    const [editing, setEditing] = useState<boolean>(false)
    useEffect(() => {
        if (!editing) {
            setEditServiceConfig({...serviceConfig})
        }
    }, [serviceConfig, editing])
    const handleSetValue = useCallback((key: string, value: any) => {
        const x = {...editServiceConfig}
        x[key] = value
        setEditServiceConfig(x)
    }, [editServiceConfig])
    const handleSave = useCallback(() => {
        setChannelNodeServiceConfig({channelName, nodeId: channelNodeConfig.nodeId, serviceName, serviceConfig: editServiceConfig})
    }, [channelName, channelNodeConfig, editServiceConfig, serviceName, setChannelNodeServiceConfig])
    return (
        <div>
            {
                editing ? (
                    <span>
                        <IconButton onClick={handleSave}>Save</IconButton>
                        <IconButton onClick={() => {setEditing(false)}}>Cancel</IconButton>
                    </span>
                ) : (
                    <IconButton onClick={() => {setEditing(true)}}><Edit /></IconButton>
                )
            }
            {
                spec.options.map(opt => (
                    opt.type === 'boolean' ? (
                        <BooleanOpt
                            key={opt.key}
                            label={opt.key}
                            value={editServiceConfig[opt.key] ? true : false}
                            setValue={editing ? handleSetValue : undefined}
                        />
                    ) : <div>{opt.key} - unrecognized type {opt.type}</div>
                ))
            }
        </div>
    )
}

const BooleanOpt: FunctionComponent<{label: string, value: boolean, setValue?: (key: string, value: boolean) => void}> = ({label, value, setValue}) => {
    const disabled = setValue ? false : true
    const handleClick = useCallback(() => {
        if (!setValue) return
        setValue(label, !value)
    }, [label, value, setValue])
    return (
        <div>
            <Checkbox checked={value} disabled={disabled} onClick={handleClick} /> <span>{label}</span>
        </div>
    )
}

export default EditableChannelNodeServiceConfig