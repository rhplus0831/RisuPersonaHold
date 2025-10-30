// @ts-ignore
function getMyArgument(name: string) {
    // @ts-ignore
    return globalThis.__pluginApis__.getArg(`RisuPersonaPin::${name}`)
}

export function getDefaultEnabled(name: string) {
    const value = getMyArgument(name);
    // 값이 비어있으면 true
    if (!value) {
        return true;
    }

    return value == 1 || value == "1" || value.toString().toLowerCase() == "true";
}

export function useAutoPin(): boolean {
    return getDefaultEnabled('auto_pin')
}


export function useDisplayName(): boolean {
    return getDefaultEnabled('display_input')
}

export function useDisplayImage(): boolean {
    return getDefaultEnabled('display_image')
}