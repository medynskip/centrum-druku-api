// const PDFDocument = require("pdfkit");

import * as PDFDocument from 'pdfkit';
// const fs = require("fs");
import * as fs from 'fs';
// const Configuration = require("../models/Configuration");
import ConfigurationSchema from "../models/Configuration.js";

const pdf = {
  formatDate: function (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + ("0" + (month + 1)).slice(-2) + "/" + year;
  },

  generateHr: function (doc, from, to, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(from, y)
      .lineTo(to, y)
      .stroke();
  },

  getNumber: function (type) {
    return new Promise(function (resolve, reject) {
      let number = type == "VAT" ? `Faktura VAT nr ` : `Faktura PRO-FORMA nr `;
      let typeConvert = type == "VAT" ? `lastInvoice` : `lastTempInvoice`;
      let temp;
      ConfigurationSchema.find({}, (err, data) => {
        if (err) return console.log(err);
        temp = type == "VAT" ? data[0].lastInvoice : data[0].lastTempInvoice;
        let month = new Date().getMonth() + 1;
        if (temp.month == month) {
          temp.id += 1;
          number += `${temp.id}/${temp.month}/${temp.year}/CD`;
        } else {
          temp.id = 1;
          temp.month += 1;
          number += `${temp.id}/${temp.month + 1}/${temp.year}/CD`;
        }
      }).then((obj) => {
        ConfigurationSchema.findByIdAndUpdate(
          obj[0]._id,
          {
            [typeConvert]: {
              id: temp.id,
              month: temp.month,
              year: temp.year,
            },
          },
          {
            new: true,
            useFindAndModify: false,
          },
          (err, data) => {
            if (err) return console.log(err);
          }
        );
        resolve(number);
      });
    });
  },

  generateHeader: function (doc, data, id) {
    // const id = type == "VAT" ? this.getVatNumber() : this.getTempNumber();
    doc
      .image("./public/logo.png", 50, 45, { width: 120 })
      .fillColor("#444444")
      .fontSize(10)
      .text(`Data wystawienia:`, 200, 50, { align: "right" });
    this.generateHr(doc, 460, 560, 65);
    doc
      .text(`${this.formatDate(new Date())}`, 200, 70, { align: "right" })
      .text(`Data sprzedaży:`, 200, 90, { align: "right" });
    this.generateHr(doc, 460, 560, 105);
    doc
      .text(`${this.formatDate(data.placed)}`, 200, 110, { align: "right" })
      .moveDown();
    doc
      .fontSize(16)
      .font("./fonts/Roboto/Roboto-Bold.ttf")
      .text(`${id}`, 50, 160, {
        width: 530,
        align: "center",
      });
  },

  generateCustomerInformation: function (doc, data) {
    // SPRZEDAWCA
    doc.text(`Sprzedawca:`, 50, 195, { width: 200, align: "center" });
    this.generateHr(doc, 50, 250, 210);
    doc.text(`Centrum druku`, 50, 215);
    doc.text(`ul. Pułaskiego 1/9`, 50, 230);
    doc.text(`26-110 Skarżysko-Kamienna`, 50, 245);
    doc.text(`NIP: 663-135-27-63`, 50, 260);
    // NABYWCA
    doc.text(`Nabywca:`, 350, 195, { width: 200, align: "center" });
    this.generateHr(doc, 350, 550, 210);
    doc.text(`${data.client.name}`, 350, 215);
    doc.text(`${data.client.street}`, 350, 230);
    doc.text(`${data.client.postal} ${data.client.city}`, 350, 245);
    doc.text(`NIP: ${data.client.nip ? data.client.nip : "n/d"}`, 350, 260);
  },

  generateTableRow: function (doc, y, c1, c2, c3, c4, c5, c6, c7, c8) {
    doc
      .fontSize(10)
      .text(c1, 50, y) // LP
      .text(c2, 70, y, { width: 240, align: "left" }) // Nazwa towaru
      .text(c3, 310, y, { width: 20, align: "center" }) // JM
      .text(c4, 330, y, { width: 30, align: "center" }) // Ilość
      .text(c5, 360, y, { width: 50, align: "center" }) // Cena netto
      .text(c6, 410, y, { width: 40, align: "center" }) // stawka vat
      .text(c7, 450, y, { width: 50, align: "center" }) // kwota vat
      .text(c8, 510, y, { width: 50, align: "center" }); // razem
  },

  generateInvoiceTable: function (doc, data) {
    doc.font("./fonts/Roboto/Roboto-Bold.ttf");
    this.generateTableRow(
      doc,
      330,
      "Lp.",
      "Nazwa produktu",
      "Jm.",
      "Ilość",
      "Kwota netto",
      "Stawka VAT",
      "Kwota VAT",
      "Kwota brutto"
    );
    this.generateHr(doc, 50, 560, 360);
    doc.font("./fonts/Roboto/Roboto-Regular.ttf");
    this.generateTableRow(
      doc,
      370,
      1,
      `Zamówienie: ${data._id}`,
      "kpl.",
      1,
      `${data.value}.00`,
      "23%",
      data.value * 0.23,
      data.value * 1.23
    );
    doc
      .fontSize(8)
      .text(`SZCZEGÓŁY: ${data.product}, ${data.volume} sztuk`, 70, 385);
    this.generateHr(doc, 50, 560, 400);
    doc
      .fontSize(10)
      .font("./fonts/Roboto/Roboto-Bold.ttf")
      .text("Razem:", 320, 405);
    doc
      .font("./fonts/Roboto/Roboto-Regular.ttf")
      .text(`${data.value}.00`, 360, 405, { width: 50, align: "center" }) //Cena netto
      .text(`---`, 410, 405, { width: 40, align: "center" }) // stawka vat
      .text(data.value * 0.23, 450, 405, { width: 50, align: "center" }) //vat
      .text(data.value * 1.23, 510, 405, { width: 50, align: "center" }); //razem
  },

  generateSummary: function (doc, data) {
    this.generateHr(doc, 50, 200, 430);
    doc
      .fontSize(12)
      .font("./fonts/Roboto/Roboto-Bold.ttf")
      .text("Do zapłaty:", 50, 435)
      .text(`${data.value * 1.23}`, 150, 435);
    this.generateHr(doc, 50, 200, 455);

    doc
      .fontSize(10)
      .font("./fonts/Roboto/Roboto-Regular.ttf")
      .text(`Sposób płatności:`, 50, 460)
      .text(`Przelew`, 150, 460)
      .text(`Termin płatności:`, 50, 475)
      .text(`14 dni`, 150, 475)
      .text(`Numer konta:`, 50, 490)
      .text(`30 1050 1461 1000 0091 3992 9534`, 150, 490);
  },

  generateSignatures: function (doc) {
    doc.fontSize(8);
    this.generateHr(doc, 50, 250, 560);
    doc.text(`Podpis osoby upoważnionej do wystawienia`, 50, 565, {
      width: 200,
      align: "center",
    });
    this.generateHr(doc, 350, 550, 560);
    doc.text(`Podpis osoby upoważnionej do odbioru`, 350, 565, {
      width: 200,
      align: "center",
    });
  },

  createInvoice: function (data, path, type, id) {
    let doc = new PDFDocument({ margin: 50 });
    doc.font("./fonts/Roboto/Roboto-Regular.ttf");
    this.generateHeader(doc, data, id);
    doc.font("./fonts/Roboto/Roboto-Regular.ttf").fontSize(10);
    this.generateCustomerInformation(doc, data);
    this.generateInvoiceTable(doc, data);
    this.generateSummary(doc, data);
    this.generateSignatures(doc);
    doc.end();
    if (type == "VAT") {
      doc.pipe(fs.createWriteStream(`${path}/faktura-VAT.pdf`));
    } else {
      doc.pipe(fs.createWriteStream(`${path}/pro-forma.pdf`));
    }
  },

  create: async function (data, type) {
    const dir = `./public/invoices/${data._id}/`;
    await this.getNumber(type).then((number) => {
      // console.log(number);
      fs.promises.mkdir(dir, { recursive: true }).then(() => {
        this.createInvoice(data, dir, type, number);
      });
    });
  },
};

export default pdf;