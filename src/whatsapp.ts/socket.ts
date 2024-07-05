/*import pino, { Logger } from "pino";
import { makeCacheableSignalKeyStore, makeWASocketOther, useMultiFileAuthState} from "./baileysWrapper";

(async function autorun(){
    const loggerBaileys=pino({level:'debug'})
    const NAME_DIR_SESSION = "bot_sessions"
    const { state, saveCreds } = await useMultiFileAuthState(NAME_DIR_SESSION)
    const socket = makeWASocketOther({
      logger: pino({level:'fatal'}),
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys),
      },
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: true
    });
    
})()*/