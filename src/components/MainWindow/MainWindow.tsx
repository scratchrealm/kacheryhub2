import useErrorMessage from 'errorMessageContext/useErrorMessage';
import React, { FunctionComponent, useCallback } from 'react';
import ApplicationBar from '../ApplicationBar/ApplicationBar';
import useRoute from '../useRoute';
import ChannelNodePage from './ChannelNodePage';
import ChannelPage from './ChannelPage';
import HomePage from './HomePage';
import NodePage from './NodePage';

type Props = {

}

const MainWindow: FunctionComponent<Props> = () => {
    const {route, setRoute} = useRoute()
    // const {width, height} = useWindowDimensions()

    const handleHome = useCallback(() => {
        setRoute({page: 'home'})
    }, [setRoute])

    const {errorMessage} = useErrorMessage()

    return (
        <div>
            <div>
                <ApplicationBar
                    title={"kacheryhub2"}
                    onHome={handleHome}
                    logo={undefined}
                />
            </div>
            <div style={{margin: 20}}>
                {
                    errorMessage ? (
                        <span style={{color: 'red'}}>{errorMessage}</span>
                    ) : <span />
                }
                {
                    route.page === 'home' ? (
                        <HomePage />
                    ) : route.page === 'channel' ? (
                        <ChannelPage
                            channelName={route.channelName}
                        />
                    ) : route.page === 'channelNode' ? (
                        <ChannelNodePage
                            channelName={route.channelName}
                            nodeId={route.nodeId}
                        />
                    ) : route.page === 'node' ? (
                        <NodePage
                            nodeId={route.nodeId}
                        />
                    ) : <span />
                }
            </div>
        </div>
    )
}

export default MainWindow