const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: "retha.johnson@ethereal.email",
            pass: "6QUvndBtac3CvU72HJ",
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"Phong Test" <retha.johnson@ethereal.email>',  // phải khớp với user phía trên
            to: email,
            subject: subject, 
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
