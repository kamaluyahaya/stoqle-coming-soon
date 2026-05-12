const nodemailer = require('nodemailer');

const config = {
  host: 'mail.aksoft.com.ng',
  port: 465,
  secure: true,
  auth: {
    user: 'aksoft@aksoft.com.ng',
    pass: 'KiN[QJ]wJn*IqIdv',
  },
  connectionTimeout: 10000,
};

async function test() {
  console.log("Testing SMTP connection...");
  const transporter = nodemailer.createTransport(config);
  try {
    await transporter.verify();
    console.log("Connection successful!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

test();
