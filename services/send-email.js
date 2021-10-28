require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const emailAddress = process.env.SENDGRID_EMAIL_ADDRESS;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (subject, body) => {
  if (!subject) throw new Error('Subject is missing.');
  if (typeof subject !== 'string')
    throw new TypeError(`${subject} is not a string.`);

  if (!body) throw new Error('Body is missing.');
  if (typeof body !== 'string') throw new TypeError(`${body} is not a string.`);

  const email = {
    to: emailAddress,
    from: emailAddress,
    subject: subject,
    text: body,
    html: body,
  };

  return (async () => {
    await sgMail.send(email);
  })();
};
