import React, { FunctionComponent } from 'react';
import ChannelsTable from './ChannelsTable';
import NodesTable from './NodesTable';

type Props = {
}

const HomePage: FunctionComponent<Props> = () => {
    return (
        <div>
            <h3>Welcome to kacheryhub2</h3>
            <NodesTable />
            <ChannelsTable />
        </div>
    )
}

export default HomePage