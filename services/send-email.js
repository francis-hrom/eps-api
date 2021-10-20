require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const emailAddress = process.env.SENDGRID_EMAIL_ADDRESS;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (subject, body) => {
  const email = {
    to: emailAddress,
    from: emailAddress,
    subject: subject,
    text: body,
    html: body,
  };
  return sgMail.send(email);
};
