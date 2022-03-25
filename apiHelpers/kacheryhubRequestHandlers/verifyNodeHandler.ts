import { NodeId } from "../../src/commonInterface/kacheryTypes";
import { VerifyNodeRequest, VerifyNodeResponse } from "../../src/types/KacheryhubRequest";
import { isNode, Node } from "../../src/types/Node";
import firestoreDatabase from '../common/firestoreDatabase';

const verifyNodeHandler = async (request: VerifyNodeRequest, verifiedNodeId: NodeId): Promise<VerifyNodeResponse> => {
    const { nodeId, ownerId } = request.payload
    if (verifiedNodeId !== nodeId) {
        throw Error('Mismatch between verifiedNodeId and nodeId')
    }

    const db = firestoreDatabase()
    const unverifiedNodeCollection = db.collection('kacheryhub.unverifiedNodes')
    const unverifiedNodeResult = await unverifiedNodeCollection.where('ownerId', '==', ownerId).where('nodeId', '==', nodeId).get()
    if (unverifiedNodeResult.docs.length === 0) {
        throw Error('Unverified node with nodeId not found for this ownerId.')
    }
    if (unverifiedNodeResult.docs.length > 1) {
        throw Error('Unexpected: more than one unverified node found.')
    }
    const unverifiedNodeDoc = unverifiedNodeResult.docs[0]
    const unverifiedNode = unverifiedNodeDoc.data()
    if (!isNode(unverifiedNode)) {
        throw Error('Invalid node in database')
    }

    const nodeCollection = db.collection('kacheryhub.nodes')
    const verifiedNode: Node = {...unverifiedNode}
    verifiedNode.verified = true
    await nodeCollection.doc(nodeId.toString()).set(verifiedNode)
    await unverifiedNodeDoc.ref.delete()
    return {
        type: 'verifyNode'
    }
}

export default verifyNodeHandler