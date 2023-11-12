import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
        this.log('command newline - Start');

        const position = editor.getCursor();
        this.log('command newline - %o', position);
        editor.exec('newlineAndIndent');

        this.log('command newline - End');
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: 'j'
      }]
    });

    this.log('onload() - End');
  }

  onunload() {
  }
}
