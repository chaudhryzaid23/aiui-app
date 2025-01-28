import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Anthropic } from '@anthropic-ai/sdk';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ai-query',
  templateUrl: './ai-query.component.html',
  styleUrls: ['./ai-query.component.scss'],
})
export class AiQueryComponent {
  question: string = `
  The patient is a 55 year old male with type 2 diabetes for 20 years, BMI: 34, eGFR: 42, a1C: 9.3%.

  Give me a treatment plan in light of the above document I gave you in the beginning.

  Have three exclamation marks followed by a numeric number and a dot before each heading.
  `;

  responses: any = { openai: '', gemini: '', claude: '' };
  paras: any = { openai: [], gemini: [], claude: [] };
  selectedTab: string = 'openai';
  isOpenAILoading: boolean = false;
  isGeminiLoading: boolean = false;
  isClaudeLoading: boolean = false;
  @Output() paragraphSelected = new EventEmitter<string>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  async askAI(api: string) {
    let apiUrl = '';
    let headers: HttpHeaders;
    let body = {};

    console.log('isOpenAILoading: ', this.isOpenAILoading);

    if (api === 'openai') {
      this.isOpenAILoading = true;
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers = new HttpHeaders({
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
      });
      body = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: this.question }],
        temperature: 0.7,
      };

      try {
        console.log(this.isOpenAILoading);
        await this.http.post(apiUrl, body, { headers }).subscribe(
          (response: any) => {
            this.responses[api] = response.choices
              ? (response.choices[0].message.content.toString() as string)
              : response;
            this.paras[api] = this.responses[api].split('!!!');
            this.isOpenAILoading = false;
          },
          (error) => {
            console.error(`${api} API Error:`, error);
            this.isOpenAILoading = false;
          }
        );
      } catch (e) {}
    } else if (api === 'gemini') {
      this.isGeminiLoading = true;
      const apiKey = 'AIzaSyB0wKdU7cug8j-opNKoVGuV9AB1q9vuZAc'; // Replace with your actual API key

      // Make sure to include these imports:
      // import { GoogleGenerativeAI } from "@google/generative-ai";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      try {
        const result = await model.generateContent(this.question, {});

        this.responses[api] = result.response.text().toString() as string;

        this.paras[api] = this.responses[api].split('!!!');
      } catch (e) {}
      this.isGeminiLoading = false;
    } else {
      this.isClaudeLoading = true;
      console.log('api: ', api);
      const anthropic = new Anthropic({
        apiKey:
          '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',
        dangerouslyAllowBrowser: true,
      });

      try {
        const msg: any = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          temperature: 0,
          system: 'You are a healthcare assistant.',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: this.question,
                },
              ],
            },
          ],
        });
        this.responses[api] = msg[0].text.toString() as string;

        this.paras[api] = this.responses[api].split('!!!');
      } catch (e) {
        console.log('caught');
      }
      this.isClaudeLoading = false;
    }
  }

  includeParagraph(paragraph: string) {
    this.paragraphSelected.emit(paragraph);
  }
}
