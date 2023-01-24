import { opts, Receiver, VoiceMessageOpts } from "Receiver";
import { GuildMember } from "discord.js";
import { VoiceConnection } from "@discordjs/voice";
declare class VoiceMessage {
    constructor(opts: VoiceMessageOpts);
}
declare class VoiceCall implements Receiver {
    private channel;
    opts: opts;
    private connection_opts;
    connection: VoiceConnection;
    private userListeners;
    constructor(opts: opts);
    private get receiver();
    setUsers(...users: GuildMember[]): VoiceCall;
    removeUsers(...users: GuildMember[]): VoiceCall;
    private getStreams;
    receiveStreams(): AsyncGenerator<VoiceMessage>;
    destroy(): Promise<void>;
    record(): this;
    listen(callback: (audio: VoiceMessage) => void): Promise<void>;
}
export { VoiceCall };
//# sourceMappingURL=Receiver.d.ts.map