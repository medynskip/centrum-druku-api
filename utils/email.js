// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
import Email from 'email-templates';
// const Email = require("email-templates");

const email = {
  // generateMailOptions: (email, order_id) => {
  //   return {
  //     from: "Powiadomienie Centrum Druku <notyfikacje@centrumdruku.online>",
  //     to: `${email}`,
  //     subject: `Przyjęliśmy do realizacji zamówienie nr: ${order_id}`,
  //     text: `Twoje zamówienie nr ${order_id} zostało przyjęte do realizacji. `,
  //     html: `<img src="cid:unique@kreata.ee"/><br />
  //     <b>Twoje zamówienie nr ${order_id} zostało przyjęte do realizacji.</b><br />
  //     Przejdz na strone http://centrumdruku.online/zamowienie/wyszukaj aby sprawdzic jego status.`,
  //     attachments: [
  //       {
  //         filename: "logo.png",
  //         path: "./public/logo.png",
  //         cid: "unique@kreata.ee", //same cid value as in the html img src
  //       },
  //     ],
  //   };
  // },

  sendConfirmationEmail: (data) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "centrumdruku.online@gmail.com",
        pass: process.env.APP_PASSWORD,
      },
    });

    const email = new Email({
      transport: transporter,
      send: true,
      preview: false,
    });

    email
      .send({
        template: "newOrder",
        message: {
          from: "Powiadomienie Centrum Druku <notyfikacje@centrumdruku.online>",
          to: data.client.email,
          attachments: [
            {
              filename: "logo.png",
              path: "./public/logo.png",
              cid: "logo@png.file",
            },
          ],
        },
        locals: {
          orderID: data._id,
          email: data.client.email,
          //   url: `http://druk.piotrmedynski.pl/zamowienie/szczegoly?id=${data._id}&email=${data.client.email}`,
        },
      })
      .then(() => console.log("email has been send!"));

    //   const mailOptions = this.generateMailOptions(data.client.email, data._id);
    //   transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Email sent: " + info.response);
    //     }
    //   });
  },
};

export default email;