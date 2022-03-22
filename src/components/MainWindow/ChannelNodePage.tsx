import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import { ChannelName, NodeId } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useMemo } from 'react';
import channelNodeServiceConfigSpecs from './channelNodeServiceConfigSpecs';
import ChannelNodeServiceConfigsView from './ChannelNodeServiceConfigsView';
import EditableChannelNodeServiceConfig from './EditableChannelNodeServiceConfig';
import useChannelConfigs from './useChannelConfigs';

type Props = {
    channelName: ChannelName
    nodeId: NodeId
}

const ChannelNodePage: FunctionComponent<Props> = ({channelName, nodeId}) => {
    const { channelConfigs, setChannelNodeServiceConfig } = useChannelConfigs()
    const { setRoute } = useRoute()

    const channelConfig = useMemo(() => (
        (channelConfigs || []).filter(channelConfig => (channelConfig.channelName === channelName))[0]
    ), [channelConfigs, channelName])

    const channelNodeConfig = useMemo(() => (
        channelConfig ? channelConfig.nodes.filter(n => (n.nodeId === nodeId))[0] : undefined
    ), [channelConfig, nodeId])

    const tableData = useMemo(() => {
        if (!channelConfig) return undefined
        if (!channelNodeConfig) return undefined
        return [
            { key: 'channelName', label: 'Channel', value: <Hyperlink onClick={() => {setRoute({page: 'channel', channelName: channelConfig.channelName})}}>{channelConfig.channelName.toString()}</Hyperlink> },
            { key: 'nodeId', label: 'Node', value: channelNodeConfig.nodeId },
            {
                key: 'serviceConfigs',
                label: 'Service configs',
                value: <ChannelNodeServiceConfigsView channelNodeConfig={channelNodeConfig} />
            }
        ]
    }, [channelConfig, channelNodeConfig, setRoute])

    if (!channelConfigs) {
        return <span>Loading...</span>
    }

    if (!channelConfig) {
        return <span>Channel not found: {channelName}</span>
    }

    if (!channelNodeConfig) {
        return <span>Channel node not found: {channelName} {nodeId}</span>
    }

    if (!tableData) return <div />
    return (
        <div>
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
            {
                channelNodeServiceConfigSpecs.map(spec => (
                    <div>
                        <h3>{spec.serviceName}</h3>
                        <EditableChannelNodeServiceConfig
                            channelName={channelName}
                            channelNodeConfig={channelNodeConfig}
                            serviceName={spec.serviceName}
                            setChannelNodeServiceConfig={setChannelNodeServiceConfig}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default ChannelNodePage