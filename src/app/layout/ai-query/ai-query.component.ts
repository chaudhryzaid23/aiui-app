import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ai-query',
  templateUrl: './ai-query.component.html',
  styleUrls: ['./ai-query.component.scss'],
})
export class AiQueryComponent {
  question: string = `
  The patient is a 55 year old male with type 2 diabetes for 20 years, BMI: 34, eGFR: 42, a1C: 9.3%.

  Give me a treatment plan in light of the above document I gave you in the beginning.
  `;

  responses: any = { openai: '', gemini: '', claude: '' };
  selectedTab: string = 'openai';
  @Output() paragraphSelected = new EventEmitter<string>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  askAI(api: string) {
    let apiUrl = '';
    let headers: HttpHeaders;
    let body = {};

    if (api === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers = new HttpHeaders({
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json',
      });
      body = {
        model: 'gpt-4',
        messages: [{ role: 'user', content: this.question }],
        temperature: 0.7,
      };
    } else if (api === 'gemini') {
      apiUrl =
        'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText';
      headers = new HttpHeaders({
        Authorization: `Bearer YOUR_GEMINI_API_KEY`,
        'Content-Type': 'application/json',
      });
      body = { prompt: { text: this.question }, temperature: 0.7 };
    } else {
      apiUrl = 'https://api.anthropic.com/v1/complete';
      headers = new HttpHeaders({
        Authorization: `Bearer YOUR_CLAUDE_API_KEY`,
        'Content-Type': 'application/json',
      });
      body = {
        model: 'claude-v1',
        prompt: this.question,
        max_tokens_to_sample: 300,
      };
    }

    this.http.post(apiUrl, body, { headers }).subscribe(
      (response: any) => {
        this.responses[api] = response.choices
          ? response.choices[0].message.content
          : response.candidates[0].output;
      },
      (error) => console.error(`${api} API Error:`, error)
    );
  }

  includeParagraph(paragraph: string) {
    this.paragraphSelected.emit(paragraph);
  }
}
