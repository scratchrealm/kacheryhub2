import { UserId } from "../../src/commonInterface/kacheryTypes";
import { GetNodesRequest, GetNodesResponse } from "../../src/types/GuiRequest";
import { isNode, Node } from "../../src/types/Node";
import firestoreDatabase from '../common/firestoreDatabase';
import isAdminUser from "./helpers/isAdminUser";

const getNodesHandler = async (request: GetNodesRequest, verifiedUserId: UserId): Promise<GetNodesResponse> => {
    const { userId } = request
    if (!userId) {
        if (!isAdminUser(verifiedUserId)) {
            throw Error('Not admin user.')
        }
    }
    if (verifiedUserId !== request.userId) {
        throw Error('Not authorized')
    }

    const nodes: Node[] = []

    const db = firestoreDatabase()
    const unverifiedNodesCollection = db.collection('kacheryhub.unverifiedNodes')
    const results = userId ?
        await unverifiedNodesCollection.where('ownerId', '==', userId).get() :
        await unverifiedNodesCollection.get()
    for (let doc of results.docs) {
        const x = doc.data()
        if (isNode(x)) {
            nodes.push(x)
        }
        else {
            console.warn('Invalid node', x)
            // await doc.ref.delete() // only do this during development
        }
    }

    const nodesCollection = db.collection('kacheryhub.nodes')
    const results2 = userId ?
        await nodesCollection.where('ownerId', '==', userId).get() :
        await nodesCollection.get()
    for (let doc of results2.docs) {
        const x = doc.data()
        if (isNode(x)) {
            nodes.push(x)
        }
        else {
            console.warn('Invalid node', x)
            // await doc.ref.delete() // only do this during development
        }
    }

    return {
        type: 'getNodes',
        nodes
    }
}

export default getNodesHandler