import fs from 'fs';
const pdf = require('pdf-parse');

export class PdfService {
  static async parsePdf(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Could not parse PDF file.');
    }
  }
}
