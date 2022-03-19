import { UserId } from "../../src/commonInterface/kacheryTypes";
import { ChannelConfig, isChannelConfig } from "../../src/types/ChannelConfig";
import { GetChannelConfigsRequest, GetChannelConfigsResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';
import isAdminUser from "./helpers/isAdminUser";
import hideSecretsInChannelConfig from './helpers/hideSecretsInChannelConfig'

const getChannelConfigsHandler = async (request: GetChannelConfigsRequest, verifiedUserId: UserId): Promise<GetChannelConfigsResponse> => {
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
    const collection = db.collection('kacheryhub.channelConfigs')
    const results = userId ?
        await collection.where('ownerId', '==', userId).get() :
        await collection.get()
    const channelConfigs: ChannelConfig[] = []
    for (let doc of results.docs) {
        const x = doc.data()
        if (isChannelConfig(x)) {
            channelConfigs.push(
                hideSecretsInChannelConfig(x)
            )
        }
        else {
            console.warn(x)
            console.warn('Invalid channel congif in database')
            // await doc.ref.delete() // only delete if we are sure we want to -- don't risk losing data!
        }
    }
    return {
        type: 'getChannelConfigs',
        channelConfigs
    }
}

export default getChannelConfigsHandler