import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <mat-toolbar color="primary">AI Query Interface</mat-toolbar>
    <div class="layout-container">
      <app-ai-query
        (paragraphSelected)="onParagraphSelected($event)"
      ></app-ai-query>
      <app-markdown-editor
        [markdownText]="markdownContent"
      ></app-markdown-editor>
    </div>
  `,
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  markdownContent: string = '';

  onParagraphSelected(paragraph: string) {
    this.markdownContent += `\n\n${paragraph}`;
  }
}
