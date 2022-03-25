import { UserId } from "../../src/commonInterface/kacheryTypes";
import { Channel, isChannel } from "../../src/types/Channel";
import { GetChannelsRequest, GetChannelsResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';
import isAdminUser from "./helpers/isAdminUser";
import hideSecretsInChannel from './helpers/hideSecretsInChannel'

const getChannelsHandler = async (request: GetChannelsRequest, verifiedUserId: UserId): Promise<GetChannelsResponse> => {
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
    const collection = db.collection('kacheryhub.channels')
    const results = userId ?
        await collection.where('ownerId', '==', userId).get() :
        await collection.get()
    const channels: Channel[] = []
    for (let doc of results.docs) {
        const x = doc.data()
        if (isChannel(x)) {
            channels.push(x)
        }
        else {
            console.warn(x)
            console.warn('Invalid channel in database')
            // await doc.ref.delete() // only delete if we are sure we want to -- don't risk losing data!
        }
    }
    for (let channel of channels) {
        hideSecretsInChannel(channel)
    }
    return {
        type: 'getChannels',
        channels
    }
}

export default getChannelsHandler