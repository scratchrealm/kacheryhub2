import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { ChannelName } from 'commonInterface/kacheryTypes';
import React, { FunctionComponent } from 'react';
import { ChannelSettings } from 'types/Channel';
import BucketBaseUriControl from './channelSettingsControls/BucketBaseUriControl';
import GoogleCredentialsControl from './channelSettingsControls/GoogleCredentialsControl';
import IPFSDownloadGatewayControl from './channelSettingsControls/IPFSDownloadGatewayControl';
import IPFSUploadGatewayControl from './channelSettingsControls/IPFSUploadGatewayControl';

type Props = {
    channelName: ChannelName
    channelSettings: ChannelSettings
    setChannelSettings?: (o: {channelName: ChannelName, channelSettings: ChannelSettings}) => void
}

const ChannelSettingsView: FunctionComponent<Props> = ({channelName, channelSettings, setChannelSettings}) => {
    return (
        <div>
            <h3>Channel settings</h3>
            <Table className="NiceTable2">
                <TableBody>
                    <TableRow>
                        <TableCell>Bucket base URI:</TableCell>
                        <TableCell><BucketBaseUriControl channelName={channelName} channelSettings={channelSettings} setChannelSettings={setChannelSettings} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>IPFS download gateway:</TableCell>
                        <TableCell><IPFSDownloadGatewayControl channelName={channelName} channelSettings={channelSettings} setChannelSettings={setChannelSettings} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>IPFS upload gateway:</TableCell>
                        <TableCell><IPFSUploadGatewayControl channelName={channelName} channelSettings={channelSettings} setChannelSettings={setChannelSettings} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Google credentials:</TableCell>
                        <TableCell><GoogleCredentialsControl channelName={channelName} channelSettings={channelSettings} setChannelSettings={setChannelSettings} /></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default ChannelSettingsView