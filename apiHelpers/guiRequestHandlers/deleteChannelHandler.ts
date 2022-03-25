import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannel } from "../../src/types/Channel";
import { DeleteChannelRequest, DeleteChannelResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const deleteChannelHandler = async (request: DeleteChannelRequest, verifiedUserId: UserId): Promise<DeleteChannelResponse> => {
    const { channelName } = request

    const db = firestoreDatabase()

    const batch = db.batch();

    const channelNodesCollection = db.collection('kacheryhub.channelNodes')
    const channelNodesSnapshot = await channelNodesCollection.where('channelName', '==', channelName).get()
    channelNodesSnapshot.forEach(doc => {
        batch.delete(doc.ref)
    })

    const collection = db.collection('kacheryhub.channels')
    const docSnapshot = await collection.doc(channelName.toString()).get()
    if (!docSnapshot.exists) {
        throw Error('Channel does not exists')
    }
    const channel = docSnapshot.data()
    if (!isChannel(channel)) {
        throw Error('Invalid channel')
    }
    if (channel.ownerId !== verifiedUserId) {
        throw Error('Not authorized')
    }
    batch.delete(collection.doc(channelName.toString()))
    
    await batch.commit()
    
    return {
        type: 'deleteChannel'
    }
}

export default deleteChannelHandler