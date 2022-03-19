import { UserId } from "../../src/commonInterface/kacheryTypes";
import { isChannelConfig } from "../../src/types/ChannelConfig";
import { SetChannelNodeServiceConfigRequest, SetChannelNodeServiceConfigResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const setChannelNodeServiceConfigHandler = async (request: SetChannelNodeServiceConfigRequest, verifiedUserId: UserId): Promise<SetChannelNodeServiceConfigResponse> => {
    const { channelName, nodeId, serviceName, serviceConfig } = request

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
    const channelNodeConfig = channelConfig.nodes.filter(n => (n.nodeId === nodeId))[0]
    channelNodeConfig.serviceConfigs[serviceName] = serviceConfig
    await collection.doc(channelName.toString()).set(channelConfig)
    return {
        type: 'setChannelNodeServiceConfig'
    }
}

export default setChannelNodeServiceConfigHandler