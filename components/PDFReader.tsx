import React, { useEffect, useState } from 'react';
import { getDocument } from 'pdfjs-dist';

const PDFReader = ({ file }: { file: File | null }) => {
  const [text, setText] = useState('');

  const extractTextFromPdf = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target && event.target.result instanceof ArrayBuffer) {
        const arrayBuffer = event.target.result;
        const loadingTask = getDocument(arrayBuffer);

        const pdf = await loadingTask.promise;
        let allText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str || '');
          allText += strings.join(' ') + ' ';
        }

        setText(allText);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (file) {
      extractTextFromPdf(file);
    }
  }, [file]);

  return (
    <textarea
      value={text}
      readOnly
      style={{ width: '100%', height: '200px' }}
    />
  );
};

export default PDFReader;
