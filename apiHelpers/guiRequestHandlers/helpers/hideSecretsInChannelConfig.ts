import { ChannelConfig } from "../../../src/types/ChannelConfig";

const hideSecretsInChannelConfig = (x: ChannelConfig): ChannelConfig => {
    const ret = {...x}
    ret.googleCredentials = ret.googleCredentials ? '*' : undefined
    return ret
}

export default hideSecretsInChannelConfig