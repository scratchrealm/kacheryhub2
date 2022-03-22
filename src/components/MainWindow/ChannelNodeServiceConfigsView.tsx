import React, { FunctionComponent } from 'react';
import { ChannelNodeConfig } from 'types/ChannelConfig';
import channelNodeServiceConfigSpecs from './channelNodeServiceConfigSpecs';

type Props = {
    channelNodeConfig: ChannelNodeConfig
}

const ChannelNodeServiceConfigsView: FunctionComponent<Props> = ({channelNodeConfig}) => {
    return (
        <div>
            {channelNodeServiceConfigSpecs.map(spec => (
                <div>
                    {spec.serviceName}:
                    {
                        spec.options.map(opt => (
                            opt.type === 'boolean' ? (
                                <span>
                                    {(channelNodeConfig.serviceConfigs[spec.serviceName] || {})[opt.key] ? opt.key : ''}
                                    &nbsp;
                                </span>
                            ) : <span />
                        ))
                    }
                </div>
            ))}
        </div>
    )
}

export default ChannelNodeServiceConfigsView