import {SlicedChat} from "./lib/database";
import {useAutoPin} from "./lib/configure";
export * from './lib/injection'

globalThis.Buffer = Buffer;

addRisuScriptHandler('output', (data) => {
    if(!useAutoPin()) return;
    const database = getDatabase();
    const char = getChar();
    const currentChat: SlicedChat = char.chats[char.chatPage];

    if(!currentChat.bindedPersona) {
        const currentPersona = database.personas[database.selectedPersona]
        currentChat.bindedPersona = currentPersona.id

        for(let i = 0; i < database.characters.length; i++) {
            const dbChar = database.characters[i];
            if(dbChar.chaId == char.chaId) {
                database.characters[i].chats[char.chatPage] = currentChat
            }
        }

        console.log(`Auto bind: ${char.name}(${currentChat.name}) -> ${currentPersona.name}`)
        setDatabase(database)
    }
})