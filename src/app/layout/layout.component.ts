import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  markdownContent: string = '';

  // renumberText() {
  //   // Split the text into sections based on a number, period, and space pattern
  //   const sections = this.markdownContent.split(/\n\n\d+\.\s/).filter(Boolean);

  //   // Renumber the sections, starting from 1 and incrementing by 1
  //   this.markdownContent = sections
  //     .map((section, index) => `${index + 1}. ${section.trim()}`)
  //     .join('\n\n'); // Join the sections back with a new line separator
  // }

  onParagraphSelected(paragraph: string) {
    this.markdownContent += `\n\n${paragraph}`;
    this.markdownContent = this.renumberText();
  }

  renumberText() {
    // Trim leading whitespace and check if the text starts with two new lines
    this.markdownContent = `\n\n${this.markdownContent.trimStart()}`;
    const trimmedText = this.markdownContent;

    // Split the text into sections based on the sequence pattern (number + period + space)
    const sections = trimmedText.split(/\n\n[\d+\.]+\s/).filter(Boolean);

    // Renumber the sections starting from 1 and remove the number and dot from each section
    const renumberedText = sections
      .map((section, index) => `${index + 1}. ${section.trim()}`) // Renumber the sections
      .join('\n\n'); // Join the sections back with a new line separator

    console.log(renumberedText);

    return renumberedText;
  }
}
