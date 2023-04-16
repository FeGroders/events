// OAuth2 GMAIL
// https://nodemailer.com/usage/using-gmail/

var nodemailer = require("nodemailer");
require("dotenv").config();

const emailSender = {
  sendEmail: function (
    from: string,
    to: string,
    subject: string,
    text: string
  ) {
    var remetente = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var emailASerEnviado = {
      from: from,
      to: to,
      subject: subject,
      text: text,
    };

    remetente.sendMail(emailASerEnviado, function (error: any) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent!");
      }
    });
  },
};

export default emailSender;
