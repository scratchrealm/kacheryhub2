import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannelConfig } from "../../src/types/ChannelConfig";
import { SetChannelInfoRequest, SetChannelInfoResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const setChannelInfoHandler = async (request: SetChannelInfoRequest, verifiedUserId: UserId): Promise<SetChannelInfoResponse> => {
    const { channelName, bucketName, googleCredentials } = request

    const db = firestoreDatabase()
    const collection = db.collection('kacheryhub.channelConfigs')
    const docSnapshot = await collection.doc(channelName.toString()).get()
    if (!docSnapshot.exists) {
        throw Error('Channel does not exists')
    }
    const channelConfig = docSnapshot.data()
    if (!isChannelConfig(channelConfig)) {
        throw Error('Invalid channel config')
    }
    if (bucketName !== undefined) {
        channelConfig.bucketName = bucketName
    }
    if (googleCredentials !== undefined) {
        channelConfig.googleCredentials = googleCredentials
    }
    await collection.doc(channelName.toString()).set(channelConfig)
    return {
        type: 'setChannelInfo'
    }
}

export default setChannelInfoHandler