import { Editor } from "obsidian";

export async function delEmptyLine(editor:Editor)
{
    const cursorPosition = editor.getCursor();
    const fileContent = editor.getValue();
    let cleanedContent = fileContent.replace(/\n\s*\n\s*/g, '\n\n');
    if (!cleanedContent.endsWith('\n')) {
        cleanedContent += '\n';
  }
    if (cleanedContent === fileContent) {
        return;
    }
    editor.setValue(cleanedContent);
    editor.setCursor(cursorPosition);

}
