import React, { FunctionComponent } from 'react';
import ChannelsTable from './ChannelsTable';

type Props = {
}

const HomePage: FunctionComponent<Props> = () => {
    return (
        <div>
            <h3>Welcome to kacheryhub2</h3>
            <ChannelsTable />
        </div>
    )
}

export default HomePage