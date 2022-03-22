import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import { ChannelName } from 'commonInterface/kacheryTypes';
import useRoute from 'components/useRoute';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import ChannelNodesTable from './ChannelNodesTable';
import EditableTextField from './EditableTextField';
import useChannelConfigs from './useChannelConfigs';

type Props = {
    channelName: ChannelName
}

const ChannelPage: FunctionComponent<Props> = ({channelName}) => {
    const { channelConfigs, addChannelNode, deleteChannelNode, setChannelInfo } = useChannelConfigs()
    const { setRoute } = useRoute()

    const channelConfig = useMemo(() => (
        (channelConfigs || []).filter(channelConfig => (channelConfig.channelName === channelName))[0]
    ), [channelConfigs, channelName])

    const handleChangeBucketName = useCallback((bucketName: string) => {
        setChannelInfo({channelName, bucketName})
    }, [channelName, setChannelInfo])

    const handleChangeGoogleCredentials = useCallback((googleCredentials: string) => {
        setChannelInfo({channelName, googleCredentials})
    }, [channelName, setChannelInfo])

    const tableData = useMemo(() => {
        if (!channelConfig) return undefined
        return [
            { key: 'channelName', label: 'Channel', value: channelConfig.channelName.toString() },
            { key: 'ownerId', label: 'Owner', value: channelConfig.ownerId.toString() },
            { 
                key: 'bucketName',
                label: 'Bucket',
                value: <EditableTextField value={channelConfig.bucketName || ''} onChange={handleChangeBucketName} tooltip="Edit bucket name" />
            },
            { 
                key: 'googleCredentials',
                label: 'Google credentials',
                value: <EditableTextField value={channelConfig.googleCredentials ? '****************' : ''} onChange={handleChangeGoogleCredentials} tooltip="Edit Google credentials" />
            },
            { key: 'timestampCreated', label: 'Created', value: `${new Date(channelConfig.timestampCreated)}` },
            { key: 'timestampLastModified', label: 'Modified', value: `${new Date(channelConfig.timestampLastModified)}` }
        ]
    }, [channelConfig, handleChangeBucketName, handleChangeGoogleCredentials])

    const handleBack = useCallback(() => {
        setRoute({page: 'home'})
    }, [setRoute])

    if (!channelConfigs) {
        return <span>Loading...</span>
    }

    if (!channelConfig) {
        return <span>Channel not found: {channelName}</span>
    }

    if (!tableData) return <div />
    return (
        <div>
            <Hyperlink onClick={handleBack}>Back to all channels</Hyperlink>
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
            <ChannelNodesTable
                channelConfig={channelConfig}
                addChannelNode={addChannelNode}
                deleteChannelNode={deleteChannelNode}
            />
        </div>
    )
}

export default ChannelPage