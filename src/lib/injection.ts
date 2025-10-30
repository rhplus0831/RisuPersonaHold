import {useDisplayImage, useDisplayName} from "./configure";
import {SlicedChat} from "./database";

async function makeMutationObserver(callbacks: (() => Promise<void> | void)[], targetNode: HTMLElement | undefined = undefined, config: MutationObserverInit | undefined = undefined) {
    if (!targetNode) {
        targetNode = document.body
    }
    if (!config) {
        config = {attributes: true, childList: true, subtree: true};
    }
    // 1. innerCallback을 'async' 함수로 변경
    const innerCallback = async (_: any, observer: MutationObserver) => {
        observer.disconnect()

        // 2. 콜백 함수가 완료될 때까지 'await'로 기다림
        for (const callback of callbacks) {
            await callback() // putPersona()가 완전히 끝날 때까지 기다립니다.
        }

        // 3. 모든 비동기 작업이 끝난 후 관찰을 재시작
        observer.observe(targetNode, config);
    };
    const observer = new MutationObserver(innerCallback);
    observer.observe(targetNode, config);
    return observer;
}

async function putPersona() {
    if (!useDisplayName() && !useDisplayImage()) return;
    const textarea = document.querySelector('.text-input-area') as HTMLTextAreaElement | null;

    // 2. textarea 요소를 찾았는지 확인합니다.
    if (textarea) {
        textarea.style.marginLeft = '8px';
        let exceptedPlaceholder = ''
        const database = getDatabase();
        const char = getChar();
        const currentChat: SlicedChat = char.chats[char.chatPage];
        let currentPersona = database.personas[database.selectedPersona]

        if (currentChat.bindedPersona) {
            for (const dbPersona of database.personas) {
                if (dbPersona.id == currentChat.bindedPersona) {
                    currentPersona = dbPersona;
                    break
                }
            }
        }

        if (useDisplayName()) {
            exceptedPlaceholder = currentPersona.name + " 으(로) 채팅중..."
            if (exceptedPlaceholder != textarea.placeholder) {
                textarea.placeholder = exceptedPlaceholder;
            }
        }

        if (!useDisplayImage()) return;

        // // 3. 찾은 textarea의 부모 요소를 가져옵니다.
        const parentDiv = textarea.parentElement as HTMLDivElement | null;
        if (!parentDiv) return;

        const created = parentDiv.querySelector("#auto-persona-image-container");

        if (!currentPersona.icon) {
            if (created) {
                created.remove()
            }
            return;
        }

        if (created) {
            const createdImage = created.children[0] as HTMLImageElement;
            const src = await getFileSrc(currentPersona.icon)
            if (src != createdImage.src) {
                createdImage.src = src
            }
        } else {
            const element = document.createElement('div');
            element.id = "auto-persona-image-container"
            element.className = 'w-12 h-12 rounded-md overflow-hidden border border-darkborderc bg-darkbg flex items-center justify-center'
            element.style.height = '44px';
            element.style.width = '44px';
            element.style.minWidth = '44px';
            const image = document.createElement('img');
            image.id = "auto-persona-image-image"
            image.src = await getFileSrc(currentPersona.icon)
            element.appendChild(image)
            parentDiv.prepend(element)
        }
    }
}

makeMutationObserver([putPersona])