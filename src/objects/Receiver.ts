import { opts, Receiver, Listener } from "Receiver"
import { joinVoiceChannel } from "@discordjs/voice"
import { GuildMember, VoiceBasedChannel, User } from "discord.js"
import { VoiceConnection, CreateVoiceConnectionOptions, JoinVoiceChannelOptions, VoiceReceiver } from "@discordjs/voice"

class ListenUser implements Listener {
    constructor() {

    }
}

class VoiceCall implements Receiver {
    
    private channel: VoiceBasedChannel
    opts: opts


    private connection_opts: CreateVoiceConnectionOptions & JoinVoiceChannelOptions
    private connection: VoiceConnection
    usersBeingRecorded: {[userId: string]: GuildMember}

    constructor(opts: opts) {

        this.opts = {
            selfMute: false,
            selfDeaf: false,
            ...opts
        }

        this.channel = opts.user.voice.channel
        
        this.connection_opts = {
            selfDeaf: this.opts.selfDeaf,
            selfMute: this.opts.selfMute,
            guildId: this.opts.guild.id,
            channelId: this.channel.id,
            adapterCreator: this.opts.guild.voiceAdapterCreator
        }
        
        this.connection = joinVoiceChannel(this.connection_opts)

    }

    private get receiver(): VoiceReceiver {
        return this.connection.receiver
    }

    setUsers(...args: GuildMember[]) {
        for (let user of args) {
            this.usersBeingRecorded[user.id] = this.opts.guild.members.cache.get(user.id)
        }
        return this
    }

    *receiveStreams() {

    }


}


export default Receiver