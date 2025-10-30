import * as fs from 'fs';
import * as path from 'path';

function main() {
    const filePath = path.join(__dirname, "..", "dist", "index.js")
    const content = fs.readFileSync(filePath, 'utf-8');
    const header = `//@name RisuPersonaPin
//@display-name 페르소나 바인드 헬퍼
//@arg auto_pin string
//@arg display_input string
//@arg display_image string

`
    const newContent = `${header}\n\n${content}`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Added header to ${filePath}`);
    console.log('\n✅ Done!');
}

main();