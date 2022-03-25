import { UserId } from "../../src/commonInterface/kacheryTypes";
import { Channel } from "../../src/types/Channel";
import { AddChannelRequest, AddChannelResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const MAX_NUM_CHANNELS_PER_USER = 2

const addChannelHandler = async (request: AddChannelRequest, verifiedUserId: UserId): Promise<AddChannelResponse> => {
    const { channelName, ownerId } = request
    if (verifiedUserId !== ownerId) {
        throw Error('Not authorized')
    }

    const db = firestoreDatabase()
    const collection = db.collection('kacheryhub.channels')
    const docSnapshot = await collection.doc(channelName.toString()).get()
    if (docSnapshot.exists) {
        throw Error('Channel already exists')
    }
    const results = await collection.where('ownerId', '==', ownerId).get()
    if (results.docs.length >= MAX_NUM_CHANNELS_PER_USER) {
        throw Error(`User cannot own more than ${MAX_NUM_CHANNELS_PER_USER} channels`)
    }
    const channel: Channel = {
        channelName,
        ownerId,
        timestampCreated: Date.now(),
        timestampLastModified: Date.now(),
        settings: {}
    }
    await collection.doc(channelName.toString()).set(channel)
    return {
        type: 'addChannel'
    }
}

export default addChannelHandler