import { UserId } from "../../src/commonInterface/kacheryTypes";
import { ChannelSettings, isChannel } from "../../src/types/Channel";
import { SetChannelSettingsRequest, SetChannelSettingsResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const setChannelSettingsHandler = async (request: SetChannelSettingsRequest, verifiedUserId: UserId): Promise<SetChannelSettingsResponse> => {
    const { channelName, channelSettings } = request

    const db = firestoreDatabase()
    const collection = db.collection('kacheryhub.channels')
    const docSnapshot = await collection.doc(channelName.toString()).get()
    if (!docSnapshot.exists) {
        throw Error('Channel does not exists')
    }
    const channel = docSnapshot.data()
    if (!isChannel(channel)) {
        throw Error('Invalid channel')
    }
    copyHiddenFields(channelSettings, channel.settings)
    channel.settings = channelSettings
    channel.timestampLastModified = Date.now()
    await collection.doc(channelName.toString()).set(channel)
    return {
        type: 'setChannelSettings'
    }
}

const copyHiddenFields = (target: ChannelSettings, source: ChannelSettings) => {
    if (target.googleCredentials === null) {
        target.googleCredentials = source.googleCredentials || undefined
    }
    if (target.ipfs?.uploadGateway?.authenticationToken === null) {
        target.ipfs = target.ipfs || {}
        target.ipfs.uploadGateway = target.ipfs.uploadGateway || {hostName: ''}
        target.ipfs.uploadGateway.authenticationToken = source.ipfs?.uploadGateway?.authenticationToken
    }
}

export default setChannelSettingsHandler