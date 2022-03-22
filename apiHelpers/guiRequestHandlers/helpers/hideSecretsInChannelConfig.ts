import { ChannelConfig } from "../../../src/types/ChannelConfig";

const hideSecretsInChannelConfig = (x: ChannelConfig): ChannelConfig => {
    const ret = {...x}
    ret.googleCredentials = ret.googleCredentials ? '*' : ''
    return ret
}

export default hideSecretsInChannelConfig