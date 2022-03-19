import { useSignedIn } from 'components/googleSignIn/GoogleSignIn';
import React, { FunctionComponent } from 'react';
import ChannelsTable from './ChannelsTable';

type Props = {
    width: number
    height: number
}

const HomePage: FunctionComponent<Props> = ({width, height}) => {
    const {signedIn} = useSignedIn()

    return (
        <div style={{margin: 20}}>
            <h2>Welcome to kacheryhub2</h2>
            {
                signedIn ? (
                    <ChannelsTable />
                ) : (
                    <span>Sign in above.</span>
                )
            }
        </div>
    )
}

export default HomePage