import { UserId } from "../../src/commonInterface/kacheryTypes";
import { ChannelNodeConfig, isChannelConfig } from "../../src/types/ChannelConfig";
import { AddChannelNodeRequest, AddChannelNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const addChannelNodeHandler = async (request: AddChannelNodeRequest, verifiedUserId: UserId): Promise<AddChannelNodeResponse> => {
    const { channelName, nodeId } = request

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
    if (channelConfig.nodes.map(n => (n.nodeId)).includes(nodeId)) {
        throw Error('Channel already includes node as member')
    }
    const channelNodeConfig: ChannelNodeConfig = {
        nodeId,
        serviceConfigs: {}
    }
    channelConfig.nodes.push(channelNodeConfig)
    channelConfig.timestampLastModified = Date.now()
    await collection.doc(channelName.toString()).set(channelConfig)
    return {
        type: 'addChannelNode'
    }
}

export default addChannelNodeHandler