declare function getDatabase(): SlicedDatabase;

declare function setDatabase(data: any): void;

declare function getChar(): SlicedCharacter;
declare function setChar(char: SlicedCharacter): void;

declare function addRisuScriptHandler(type: 'input' | 'output' | 'display', callback: (data: any) => void)

declare async function getFileSrc(loc: string): Promise<any>;