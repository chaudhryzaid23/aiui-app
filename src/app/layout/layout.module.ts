import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AiQueryComponent } from './ai-query/ai-query.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { LayoutComponent } from './layout.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownModule } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [LayoutComponent, AiQueryComponent, MarkdownEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    provideHttpClient(), // Use instead of HttpClientModule
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
