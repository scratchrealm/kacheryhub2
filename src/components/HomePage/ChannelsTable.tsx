import guiApiRequest from 'common/guiApiRequest';
import { useSignedIn } from 'components/googleSignIn/GoogleSignIn';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ChannelConfig } from 'types/ChannelConfig';
import { GetChannelConfigsRequest, isGetChannelConfigsResponse } from 'types/GuiRequest';

type Props = {

}

const ChannelsTable: FunctionComponent<Props> = () => {
    const {userId, googleIdToken, signedIn} = useSignedIn()
    console.log('---- a', userId, signedIn)
    const [channelConfigs, setChannelConfigs] = useState<ChannelConfig[] | undefined>(undefined)

    useEffect(() => {
        ;(async () => {
            console.log('---', userId)
            setChannelConfigs(undefined)
            if (!userId) return
            let canceled = false
            const req: GetChannelConfigsRequest = {
                type: 'getChannelConfigs',
                userId,
                auth: {userId, googleIdToken}
            }
            console.log('--- a1')
            const resp = await guiApiRequest(req, {reCaptcha: false})
            if (!isGetChannelConfigsResponse(resp)) {
                throw Error('Unexpected response')
            }
            console.log(resp)
            if (canceled) return
            setChannelConfigs(resp.channelConfigs)
            return () => {canceled = true}
        })()
    }, [userId, googleIdToken])

    if (!channelConfigs) {
        return <span>Loading channels...</span>
    }

    return (
        <pre>{JSON.stringify(channelConfigs)}</pre>
    )
}

export default ChannelsTable