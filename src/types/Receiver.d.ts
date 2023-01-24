import { GuildMember, Guild, VoiceBasedChannel } from "discord.js"
import { VoiceConnection } from "@discordjs/voice"

declare interface Receiver {
    channel: VoiceBasedChannel,

}

declare interface Listener {
    
}

declare interface opts {
    user: GuildMember,
    guild: Guild,
    recordable?: Array<String>
    selfDeaf?: boolean,
    selfMute?: boolean
}
