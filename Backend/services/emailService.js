const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"Gmail",
    host: "smtp.email.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

const sendEmail =async ({from,to,subject,text,html})=>{
    try {
        const info = await transporter.sendMail({
            from : `inShare <${from}`,
            to,
            subject, 
            text,
            html
          });
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = sendEmail