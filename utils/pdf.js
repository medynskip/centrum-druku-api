const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = {
  formatDate: function (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
  },

  generateHr: function (doc, from, to, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(2)
      .moveTo(from, y)
      .lineTo(to, y)
      .stroke();
  },

  generateHeader: function (doc, data) {
    doc
      .image("./public/logo.png", 50, 45, { width: 80 })
      .fillColor("#444444")
      .fontSize(10)
      .text(`Miejsce wystawienia:`, 200, 50, { align: "right" });
    this.generateHr(doc, 460, 560, 65);
    doc
      .text(`Skarżysko-Kamienna`, 200, 70, { align: "right" })
      .text(`Data sprzedaży:`, 200, 90, { align: "right" });
    this.generateHr(doc, 460, 560, 105);
    doc
      .text(`${this.formatDate(data.placed)}`, 200, 110, { align: "right" })
      .moveDown();
    doc
      .fontSize(16)
      .font("./fonts/roboto/Roboto-Bold.ttf")
      .text(`FAKTURA PRO-FORMA NR 01/02/2021`, 50, 220, {
        width: 530,
        align: "center",
      });
  },

  generateCustomerInformation: function (doc, data) {
    doc
      .text(`Numer zamówienia: ${data._id}`, 50, 250)
      .text(`Data wystawienia: ${this.formatDate(new Date())}`, 50, 265)
      .text(`Do zapłaty: ${data.value * 1.23}`, 50, 280)
      .moveDown();
  },

  generateTableRow: function (doc, y, c1, c2, c3, c4, c5, c6, c7, c8) {
    doc
      .fontSize(10)
      .text(c1, 50, y) // LP
      .text(c2, 80, y) // Nazwa towaru
      .text(c3, 260, y, { width: 40, align: "right" }) // JM
      .text(c4, 300, y, { width: 40, align: "right" }) // Ilość
      .text(c5, 340, y, { width: 40, align: "right" }) //Cena netto
      .text(c6, 380, y, { width: 40, align: "right" }) //stawka vat
      .text(c7, 420, y, { width: 40, align: "right" }) //vat
      .text(c8, 0, y, { align: "right" }); //razem
  },

  generateInvoiceTable: function (doc, data) {
    doc.font("./fonts/roboto/Roboto-Bold.ttf");
    this.generateTableRow(
      doc,
      330,
      "LP.",
      "Nazwa produktu",
      "JM",
      "Ilość",
      "Kwota netto",
      "Stawka VAT",
      "Kwota VAT",
      "Kwota brutto"
    );
    this.generateHr(doc, 50, 560, 360);
    doc.font("./fonts/roboto/Roboto-Regular.ttf");
    this.generateTableRow(
      doc,
      370,
      1,
      data.product,
      "pakiet",
      1,
      data.value,
      "23%",
      data.value * 0.23,
      data.value * 1.23
    );
  },

  createInvoice: function (data, path) {
    let doc = new PDFDocument({ margin: 50 });
    doc.font("./fonts/roboto/Roboto-Regular.ttf");
    this.generateHeader(doc, data);
    doc.font("./fonts/roboto/Roboto-Regular.ttf").fontSize(10);
    this.generateCustomerInformation(doc, data);
    this.generateInvoiceTable(doc, data);
    doc.end();
    doc.pipe(fs.createWriteStream(`${path}/pro-forma.pdf`));
  },

  create: async function (data) {
    const dir = `./public/invoices/${data._id}/`;
    fs.promises
      .mkdir(dir, { recursive: true })
      .then(this.createInvoice(data, dir));
  },
};
