import moment from "moment";
import { Editor, EditorPosition } from "obsidian";
import { MyPluginSettings } from "src/settings";

export async function addTaskWithDate(editor:Editor,settings:MyPluginSettings)
{            
  const cursorPosition: EditorPosition = editor.getCursor();
  const currentLine: number = cursorPosition.line;
  const lineText: string = editor.getLine(currentLine).trim();
  let addTaskDate = ` @ ${moment().format(settings.taskDateFormat)}`
  if (settings.addTaskDate == false){
    addTaskDate = ""
  }
  // 检查当前行是否已经有任务框
  const checkboxText = lineText.startsWith("- [ ] ") ? "- [x] " : "- [ ] ";

  // 如果当前行已经有任务框，则切换状态；如果没有，则添加任务框和日期
  const newLineText = checkboxText + (lineText.startsWith("- [ ] ") || lineText.startsWith("- [x] ") ? lineText.substring(6) : lineText) + addTaskDate;

  // 替换当前行的内容，从行首开始
  editor.replaceRange(newLineText, { line: currentLine, ch: 0 }, { line: currentLine, ch: lineText.length });

  // 如果当前行是最后一行，添加一个新行
  if (currentLine === editor.lineCount() - 1) {
    editor.replaceRange("\n", { line: currentLine+1, ch: 0 }, { line: currentLine+1, ch: 0 });
  } 
  // 移动光标到下一行的开始位置
  editor.setCursor({ line: currentLine + 1, ch: 0 });
}

