import { GuildMember, Guild, VoiceBasedChannel } from "discord.js"
import { VoiceConnection, VoiceReceiver, AudioReceiveStream } from "@discordjs/voice"

declare interface VoiceMessageOpts {
    stream: AudioReceiveStream,
    user: GuildMember
    receiverData?: any
}

declare interface Receiver {
}

declare interface Listener {

}

declare interface ListenerOpts {
    receiver: VoiceReceiver,
    user: GuildMember
}

declare interface opts {
    user: GuildMember,
    guild: Guild,
    recordable?: Array<String>
    selfDeaf?: boolean,
    selfMute?: boolean
}
