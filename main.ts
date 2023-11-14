import { App, Editor, EditorPosition, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class EmacsLikeKeybindingsPlugin extends Plugin {
  private readonly pluginName = 'EmacsLikeKeybindingsPlugin';

  private log(message: string, param: any = null): void {
    param == null ?
      console.log(`${this.pluginName}: ${message}`) :
      console.log(`${this.pluginName}: ${message}`, param);
  }

  async onload() {
    this.log('onload() - Start');

    this.addCommand({
      id: 'newline',
      name: 'Newline',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const logPrefix: string = 'command newline';

        this.log(`${logPrefix} - Start`);

        editor.exec('newlineAndIndent');

        this.log(`${logPrefix} - End`);
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: 'j'
      }]
    });

    this.addCommand({
      id: 'kill-line',
      name: 'Kill line',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const logPrefix: string = 'command kill-line';

        this.log(`${logPrefix} - Start`);

        const position: EditorPosition = editor.getCursor();
        this.log(`${logPrefix} - %o`, position);
        const line: string = editor.getLine(position.line);
        const remainingText: string = line.slice(0, position.ch);
        const killedText: string = line.slice(position.ch);
        this.log(`${logPrefix} - ${remainingText}`);
        this.log(`${logPrefix} - ${killedText}`);
        // https://developer.mozilla.org/ja/docs/Web/API/Clipboard
        navigator.clipboard.writeText(killedText);
        editor.setLine(position.line, remainingText);
        editor.setCursor(position, position.ch);

        this.log(`${logPrefix} - End`);
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: 'k'
      }]
    });

    this.log('onload() - End');
  }

  onunload() {
  }
}
