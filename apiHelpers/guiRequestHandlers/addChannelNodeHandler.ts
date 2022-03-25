import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannel } from "../../src/types/Channel";
import { ChannelNode } from "../../src/types/ChannelNode";
import { AddChannelNodeRequest, AddChannelNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const addChannelNodeHandler = async (request: AddChannelNodeRequest, verifiedUserId: UserId): Promise<AddChannelNodeResponse> => {
    const { channelName, nodeId } = request

    const db = firestoreDatabase()

    const channelsCollection = db.collection('kacheryhub.channels')
    const channelDocSnapshot = await channelsCollection.doc(channelName.toString()).get()
    if (!channelDocSnapshot.exists) {
        throw Error('Channel node does not exist.')
    }
    const channel = channelDocSnapshot.data()
    if (!isChannel(channel)) {
        throw Error('Invalid channel')
    }
    if (channel.ownerId !== verifiedUserId) {
        throw Error('Not authorized')
    }

    const nodesCollection = db.collection('kacheryhub.nodes')
    const nodeDocSnapshot = await nodesCollection.doc(nodeId.toString()).get()
    if (!nodeDocSnapshot.exists) {
        throw Error('Node does not exist or has not been verified.')
    }

    const collection = db.collection('kacheryhub.channelNodes')
    const docSnapshot = await collection.doc(channelName.toString() + '.' + nodeId.toString()).get()
    if (docSnapshot.exists) {
        throw Error('Channel node already exists')
    }
    
    const channelNode: ChannelNode = {
        channelName,
        nodeId,
        permissions: {
            read: true,
            write: false
        }
    }
    await collection.doc(channelName.toString() + '.' + nodeId.toString()).set(channelNode)
    return {
        type: 'addChannelNode'
    }
}

export default addChannelNodeHandler