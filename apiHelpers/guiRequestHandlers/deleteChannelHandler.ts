import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannelConfig } from "../../src/types/ChannelConfig";
import { DeleteChannelRequest, DeleteChannelResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const deleteChannelHandler = async (request: DeleteChannelRequest, verifiedUserId: UserId): Promise<DeleteChannelResponse> => {
    const { channelName } = request

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
    if (channelConfig.ownerId !== verifiedUserId) {
        throw Error('Not authorized')
    }
    await collection.doc(channelName.toString()).delete()
    return {
        type: 'deleteChannel'
    }
}

export default deleteChannelHandler