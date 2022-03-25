import { UserId } from "../../src/commonInterface/kacheryTypes";
import { Node } from "../../src/types/Node"
import { AddNodeRequest, AddNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const MAX_NUM_NODES_PER_USER = 5

const addNodeHandler = async (request: AddNodeRequest, verifiedUserId: UserId): Promise<AddNodeResponse> => {
    const { nodeId, ownerId, label } = request

    if (ownerId !== verifiedUserId) {
        throw Error('Mismatch between ownerId and verifiedUserId')
    }

    const db = firestoreDatabase()
    const verifiedNodesCollection = db.collection('kacheryhub.nodes')
    const verifiedNodesResult = await verifiedNodesCollection.where('ownerId', '==', ownerId).where('nodeId', '==', nodeId).get()
    if (verifiedNodesResult.docs.length > 0) {
        throw Error('Verified node with this ownerId and nodeId already exists.')
    }

    const unverifiedNodesCollection = db.collection('kacheryhub.unverifiedNodes')
    const unverifiedNodesResult = await unverifiedNodesCollection.where('ownerId', '==', ownerId).where('nodeId', '==', nodeId).get()
    if (unverifiedNodesResult.docs.length > 0) {
        // somebody else added this but did not verify it
        await unverifiedNodesResult.docs[0].ref.delete()
    }

    const numOwnedNodes = (await verifiedNodesCollection.where('ownerId', '==', ownerId).get()).docs.length + (await unverifiedNodesCollection.where('ownerId', '==', ownerId).get()).docs.length
    if (numOwnedNodes >= MAX_NUM_NODES_PER_USER) {
        throw Error(`User cannot own more than ${MAX_NUM_NODES_PER_USER} nodes`)
    }

    const node: Node = {
        nodeId,
        ownerId,
        timestampCreated: Date.now(),
        label,
        verified: false
    }
    await unverifiedNodesCollection.add(node)
    return {
        type: 'addNode'
    }
}

export default addNodeHandler