import {
  App,
  Editor,
  EditorPosition,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile
} from 'obsidian';

export default class EmacsLikeKeybindingsPlugin extends Plugin {
  private readonly pluginName = 'EmacsLikeKeybindingsPlugin';

  private log(message: string, param: any = undefined): void {
    param == undefined ?
      console.log(`${this.pluginName}: ${message}`) :
      console.log(`${this.pluginName}: ${message}`, param);
  }

  async onload() {
    this.log('onload() - Start');

    type Mark = {
      path: string;
      editorPosition: EditorPosition;
    };

    let marks: Mark[] = [];

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

    this.addCommand({
      id: 'yank',
      name: 'Yank',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const logPrefix: string = 'command yank';

        this.log(`${logPrefix} - Start`);

        // https://developer.mozilla.org/ja/docs/Web/API/Clipboard
        navigator.clipboard.readText().then((text) => {
          editor.replaceSelection(text);
        });

        this.log(`${logPrefix} - End`);
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: 'y'
      }]
    });

    this.addCommand({
      id: 'set-mark-command',
      name: 'Set mark command',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const logPrefix: string = 'command set-mark-command';

        this.log(`${logPrefix} - Start`);

        const activeFile: TFile | null = this.app.workspace.getActiveFile();
        this.log(`${logPrefix} - %o`, activeFile);

        if (!activeFile) {
          this.log(`${logPrefix} - End`);

          return;
        }

        const mark = marks.find((v: Mark) => v.path === activeFile.path);

        if (mark) {
          mark.editorPosition = editor.getCursor();
        } else {
          marks.push({
            path: activeFile.path,
            editorPosition: editor.getCursor()
          });
        }

        this.log(`${logPrefix} - %o`, marks);

        this.log(`${logPrefix} - End`);
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: ' '
      }]
    });

    this.addCommand({
      id: 'kill-region',
      name: 'Kill region',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const logPrefix: string = 'command kill-region';

        this.log(`${logPrefix} - Start`);

        const activeFile: TFile | null = this.app.workspace.getActiveFile();
        this.log(`${logPrefix} - %o`, activeFile);

        if (!activeFile) {
          this.log(`${logPrefix} - End`);

          return;
        }

        const mark = marks.find((v: Mark) => v.path === activeFile.path);

        if (!mark) {
          this.log(`${logPrefix} - This file has no marks`);
          this.log(`${logPrefix} - End`);

          return;
        }

        const position: EditorPosition = editor.getCursor();
        this.log(`${logPrefix} - %o`, mark);
        this.log(`${logPrefix} - %o`, position);

        const killedText: string = editor.getRange(mark.editorPosition, position);
        this.log(`${logPrefix} - %o`, killedText);
        // https://developer.mozilla.org/ja/docs/Web/API/Clipboard
        navigator.clipboard.writeText(killedText);
        editor.replaceRange('', mark.editorPosition, position);

        this.log(`${logPrefix} - End`);
      },
      hotkeys: [{
        modifiers: ['Ctrl'],
        key: 'w'
      }]
    });

    this.log('onload() - End');
  }

  onunload() {
  }
}
