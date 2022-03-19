import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannelConfig } from "../../src/types/ChannelConfig";
import { DeleteChannelNodeRequest, DeleteChannelNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const deleteChannelNodeHandler = async (request: DeleteChannelNodeRequest, verifiedUserId: UserId): Promise<DeleteChannelNodeResponse> => {
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
    if (!channelConfig.nodes.map(n => (n.nodeId)).includes(nodeId)) {
        throw Error('Channel does not include node as member')
    }
    channelConfig.nodes = channelConfig.nodes.filter(n => (n.nodeId !== nodeId))
    await collection.doc(channelName.toString()).set(channelConfig)
    return {
        type: 'deleteChannelNode'
    }
}

export default deleteChannelNodeHandler