import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent {
  @Input() markdownText: string = '';

  formatText(style: string) {
    switch (style) {
      case 'bold':
        this.markdownText += '**bold** ';
        break;
      case 'italic':
        this.markdownText += '*italic* ';
        break;
      case 'heading':
        this.markdownText += '# Heading ';
        break;
    }
  }
}
