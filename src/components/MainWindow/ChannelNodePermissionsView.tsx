import React, { FunctionComponent } from 'react';
import { ChannelNode } from 'types/ChannelNode';

type Props = {
    channelNode: ChannelNode
}

const ChannelNodePermissionsView: FunctionComponent<Props> = ({channelNode}) => {
    return (
        <div>
            <pre>{JSON.stringify(channelNode.permissions)}</pre>
        </div>
    )
}

export default ChannelNodePermissionsView