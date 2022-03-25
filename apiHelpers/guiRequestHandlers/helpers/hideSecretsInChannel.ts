import { Channel } from "../../../src/types/Channel";

const hideSecretsInChannel = (x: Channel) => {
    if (x.settings.googleCredentials) {
        x.settings.googleCredentials = null
    }
    if (x.settings.ipfs?.uploadGateway?.authenticationToken) {
        x.settings.ipfs.uploadGateway.authenticationToken = null
    }
}

export default hideSecretsInChannel