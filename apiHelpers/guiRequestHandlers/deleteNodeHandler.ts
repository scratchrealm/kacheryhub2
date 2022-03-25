import { UserId } from "../../src/commonInterface/kacheryTypes";
import { DeleteNodeRequest, DeleteNodeResponse } from "../../src/types/GuiRequest";
import firestoreDatabase from '../common/firestoreDatabase';

const deleteNodeHandler = async (request: DeleteNodeRequest, verifiedUserId: UserId): Promise<DeleteNodeResponse> => {
    const { nodeId, ownerId } = request

    if (ownerId !== verifiedUserId) {
        throw Error('Mismatch between ownerId and verifiedUserId')
    }

    const db = firestoreDatabase()

    const batch = db.batch();

    const channelNodesCollection = db.collection('kacheryhub.channelNodes')
    const channelNodesSnapshot = await channelNodesCollection.where('nodeId', '==', nodeId).get()
    channelNodesSnapshot.forEach(doc => {
        batch.delete(doc.ref)
    })

    const unverifiedNodesCollection = db.collection('kacheryhub.unverifiedNodes')
    const unverifiedNodesResult = await unverifiedNodesCollection.where('ownerId', '==', ownerId).where('nodeId', '==', nodeId).get()
    if (unverifiedNodesResult.docs.length > 0) {
        for (let doc of unverifiedNodesResult.docs) {
            batch.delete(doc.ref)
        }
        return {
            type: 'deleteNode'
        }
    }
    const nodesCollection = db.collection('kacheryhub.nodes')
    batch.delete(nodesCollection.doc(nodeId.toString()))

    await batch.commit()

    return {
        type: 'deleteNode'
    }
}

export default deleteNodeHandler