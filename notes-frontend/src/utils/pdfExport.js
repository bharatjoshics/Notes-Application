import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { marked } from "marked";

const removeEmojis = (text = "") => {
  return text
    // remove emojis
    .replace(/[\p{Extended_Pictographic}]/gu, "")
    // remove variation selectors (like ️)
    .replace(/\uFE0F/g, "")
    // remove any leftover non-ASCII chars (final safety)
    .replace(/[^\x00-\x7F]/g, "");
}

const renderMarkdownToPDF = (pdf, markdown, margin, y, textWidth, pageHeight) => {

  const tokens = marked.lexer(markdown);

  tokens.forEach(token => {

    if (token.type === "heading") {

      const size = token.depth === 1 ? 18 :
                   token.depth === 2 ? 16 :
                   token.depth === 3 ? 14 : 12;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(size);

      const cleanHeading = removeEmojis(token.text);
      const lines = pdf.splitTextToSize(cleanHeading, textWidth);

      lines.forEach(line => {

        if (y > pageHeight - 15) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(line, margin, y);
        y += 8;
      });

      y += 4;
    }

    else if (token.type === "paragraph") {

      pdf.setFontSize(12);

      const inlineTokens = marked.lexer(token.raw)[0].tokens;

      let x = margin;

      inlineTokens.forEach(part => {

        let fontStyle = "normal";

        if (part.type === "strong") {
          fontStyle = "bold";
        }

        if (part.type === "codespan") {
          pdf.setFont("courier", "normal");
        } else {
          pdf.setFont("helvetica", fontStyle);
        }

        const text = removeEmojis(part.text || part.raw);

        const words = text.split(" ");

        words.forEach(word => {

          const wordWidth =
            pdf.getTextWidth(word + " ");

          if (x + wordWidth > margin + textWidth) {
            y += 7;
            x = margin;
          }

          if (y > pageHeight - 15) {
            pdf.addPage();
            y = 20;
            x = margin;
          }

          pdf.text(word + " ", x, y);
          x += wordWidth;

        });

      });

      y += 10;
    }

    else if (token.type === "list") {

      pdf.setFontSize(12);

      token.items.forEach(item => {

        const bullet = token.ordered ? `${item.index + 1}.` : "•";

        const cleanItem = removeEmojis(item.text);
        const lines = pdf.splitTextToSize(cleanItem, textWidth - 10);

        lines.forEach((line, i) => {

          if (y > pageHeight - 15) {
            pdf.addPage();
            y = 20;
          }

          const text = i === 0 ? `${bullet} ${line}` : `   ${line}`;

          pdf.text(text, margin, y);
          y += 7;
        });

      });

      y += 4;
    }

    else if (token.type === "code") {

      pdf.setFont("courier", "normal");
      pdf.setFontSize(11);

      const cleanCode = removeEmojis(token.text);
      const lines = pdf.splitTextToSize(cleanCode, textWidth - 4);

      lines.forEach(line => {

        if (y > pageHeight - 15) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(line, margin + 2, y);
        y += 7;
      });

      y += 6;
    }

  });

  return y;
};

const createStyledHTML = (title, date, markdown) => {

  return `
  <div style="
      font-family: Arial, sans-serif;
      padding:40px;
      max-width:800px;
      line-height:1.6;
      color:#111;
  ">

    <h1 style="font-size:32px;margin-bottom:10px;">
      ${removeEmojis(title)}
    </h1>

    <p style="color:gray;font-size:14px;margin-bottom:20px;">
      Created: ${date}
    </p>

    <hr/>

    <div style="margin-top:20px;font-size:16px;">

      ${marked(removeEmojis(markdown))}

    </div>

  </div>

  <style>

    h1 { font-size:28px; margin-top:25px; }

    h2 { font-size:24px; margin-top:20px; }

    h3 { font-size:20px; margin-top:18px; }

    p { margin:12px 0; }

    ul {
      margin:12px 0;
      padding-left:20px;
      list-style-type: disc;
    }

    ol {
      margin:12px 0;
      padding-left:20px;
      list-style-type: decimal;
    }

    li {
      margin:6px 0;
    }

    code {
      background:#f4f4f4;
      padding:3px 6px;
      border-radius:4px;
      font-family:monospace;
      font-size:14px;
    }

    pre {
      background:#f4f4f4;
      padding:12px;
      border-radius:6px;
      overflow:auto;
    }

  </style>
  `;
};

export const exportNoteToPDF = (note) => {

  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const textWidth = pageWidth - margin * 2;

  let y = 20;

  pdf.setFontSize(20);
  pdf.text(removeEmojis(note.title), pageWidth / 2, y, { align: "center" });

  y += 10;

  pdf.setFontSize(10);
  pdf.text(
    `Created: ${new Date(note.createdAt).toLocaleString()}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 10;

  pdf.line(margin, y, pageWidth - margin, y);

  y += 10;

  y = renderMarkdownToPDF(
    pdf,
    removeEmojis(note.content),
    margin,
    y,
    textWidth,
    pageHeight
  );

  pdf.save(`${removeEmojis(note.title)}.pdf`);
};

export const exportAllNotesToPDF = (notes) => {

  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const textWidth = pageWidth - margin * 2;

  let y = 20;

  pdf.setFontSize(20);
  pdf.text("My Notes Notebook", pageWidth / 2, y, { align: "center" });

  y += 20;

  notes.forEach((note, index) => {

    if (y > pageHeight - 30) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(`${index + 1}. ${removeEmojis(note.title)}`, margin, y);

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(
      `Created: ${new Date(note.createdAt).toLocaleString()}`,
      margin,
      y
    );

    y += 6;

    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;

    y = renderMarkdownToPDF(
      pdf,
      removeEmojis(note.content),
      margin,
      y,
      textWidth,
      pageHeight
    );

    y += 10;

  });

  pdf.save("My_Notes_Notebook.pdf");
};