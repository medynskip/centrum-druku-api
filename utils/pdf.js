const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");

// const pdfLib = require("pdf-lib");

module.exports = {
  create: async function (data) {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 20;
    page.drawText(`Faktura PRO FORMA do zamówienia ${data._id}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    const dir = `./public/invoices/${data._id}/`;
    const newDir = await fs.promises.mkdir(dir, { recursive: true });
    fs.writeFileSync(`${dir}/pro-forma.pdf`, await pdfDoc.save());
  },
};
