import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  async askAI(api: string) {
    let apiUrl = '';
    let headers: HttpHeaders;
    let body = {};

    if (api === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers = new HttpHeaders({
        Authorization: `Bearer sk-proj-uc0Ul96cUL1Cb6MQ2H9DT3BlbkFJz1exhYCqTMo9Q8tBn5Th`,
        'Content-Type': 'application/json',
      });
      body = {
        model: 'gpt-4',
        messages: [{ role: 'user', content: this.question }],
        temperature: 0.7,
      };

      this.http.post(apiUrl, body, { headers }).subscribe(
        (response: any) => {
          this.responses[api] = response.choices
            ? response.choices[0].message.content
            : response;
        },
        (error) => console.error(`${api} API Error:`, error)
      );
    } else if (api === 'gemini') {
      apiUrl =
        'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const apiKey = 'AIzaSyB0wKdU7cug8j-opNKoVGuV9AB1q9vuZAc'; // Replace with your actual API key

      // Make sure to include these imports:
      // import { GoogleGenerativeAI } from "@google/generative-ai";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(this.question);

      this.responses[api] = result.response.text();
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
  }

  includeParagraph(paragraph: string) {
    this.paragraphSelected.emit(paragraph);
  }
}
