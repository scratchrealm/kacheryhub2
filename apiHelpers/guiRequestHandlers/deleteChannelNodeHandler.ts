import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannel } from "../../src/types/Channel";
import { DeleteChannelNodeRequest, DeleteChannelNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const deleteChannelNodeHandler = async (request: DeleteChannelNodeRequest, verifiedUserId: UserId): Promise<DeleteChannelNodeResponse> => {
    const { channelName, nodeId } = request

    const db = firestoreDatabase()

    const channelsCollection = db.collection('kacheryhub.channels')
    const channelDocSnapshot = await channelsCollection.doc(channelName.toString()).get()
    if (!channelDocSnapshot.exists) {
        throw Error('Channel node does not exists')
    }
    const channel = channelDocSnapshot.data()
    if (!isChannel(channel)) {
        throw Error('Invalid channel')
    }
    if (channel.ownerId !== verifiedUserId) {
        throw Error('Not authorized')
    }

    const collection = db.collection('kacheryhub.channelNodes')
    const docSnapshot = await collection.doc(channelName.toString() + '.' + nodeId.toString()).get()
    if (!docSnapshot.exists) {
        throw Error('Channel node does not exists')
    }
    await collection.doc(channelName.toString() + '.' + nodeId.toString()).delete()
    return {
        type: 'deleteChannelNode'
    }
}

export default deleteChannelNodeHandler