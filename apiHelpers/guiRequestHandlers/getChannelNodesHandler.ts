import { UserId } from "../../src/commonInterface/kacheryTypes";
import { Channel, isChannel } from "../../src/types/Channel";
import { ChannelNode, isChannelNode } from "../../src/types/ChannelNode";
import { GetChannelNodesRequest, GetChannelNodesResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';
import isAdminUser from "./helpers/isAdminUser";

const getChannelNodesHandler = async (request: GetChannelNodesRequest, verifiedUserId: UserId): Promise<GetChannelNodesResponse> => {
    const { userId } = request
    if (!userId) {
        if (!isAdminUser(verifiedUserId)) {
            throw Error('Not admin user.')
        }
    }
    if (verifiedUserId !== request.userId) {
        throw Error('Not authorized')
    }

    const db = firestoreDatabase()

    const channelCollection = db.collection('kacheryhub.channels')
    const channelResults = userId ?
        await channelCollection.where('ownerId', '==', userId).get() :
        await channelCollection.get()
    const channels: Channel[] = []
    for (let doc of channelResults.docs) {
        const x = doc.data()
        if (isChannel(x)) {
            channels.push(x)
        }
        else {
            console.warn(x)
            console.warn('Invalid channel in database')
        }
    }
    const channelNames = channels.map(ch => (ch.channelName))

    const collection = db.collection('kacheryhub.channelNodes')
    const results = userId ?
        await collection.where('channelName', 'in', channelNames).get() :
        await collection.get()
    const channelNodes: ChannelNode[] = []
    for (let doc of results.docs) {
        const x = doc.data()
        if (isChannelNode(x)) {
            channelNodes.push(x)
        }
        else {
            console.warn(x)
            console.warn('Invalid channel node in database')
            // await doc.ref.delete() // only delete if we are sure we want to -- don't risk losing data!
        }
    }
    return {
        type: 'getChannelNodes',
        channelNodes
    }
}

export default getChannelNodesHandler