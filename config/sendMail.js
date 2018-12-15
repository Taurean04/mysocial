const nodemailer = require('nodemailer');
function sendMail(address, message){
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        requireTLS: true,
        auth: {
            user: "623cdd12894d23",
            pass: "6d49a01b7aa9c1"
        }
    });

    let mailOptions = {
        from: '"Taurean" <DevTee>',
        to: address,
        subject: 'New User Register',
        html:message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else{
            console.log(`Email sent ${info.response}`);
        }
    });
}
module.exports = {sendMail};