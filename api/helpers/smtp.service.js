const nodemailer = require('nodemailer');

const smtpService = () => {
  const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
      let smtpTransort = {
        host: process.env.SMTP_SERVER_NAME,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      const transporter = nodemailer.createTransport(smtpTransort);

      /**
       * Message configuration (mailOptions)
       * {
       *   from: "sender@server.com",
       *   to: "receiver@sender.com",
       *   subject: "Message title",
       *   text: "Plaintext version of the message",
       *   html: "<p>HTML version of the message</p>"
       * };
       * https://nodemailer.com/message/
       */

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(`smtpService Error: ${err}`);
          resolve(false);
        } else {
          console.log(`smtpService Response: ${info.response}`);
          resolve(true);
        }
      });
    });
  };

  return {
    sendMail,
  };
};

module.exports = smtpService;
