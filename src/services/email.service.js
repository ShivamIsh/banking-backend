const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAUTH2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN // sometimes required

        
    }
})



// verify the connection configration


transporter.verify((error,success) => {
    if(error){
        console.log("error connecting to email server:", error);
    }else{
        console.log("email server is ready to send the message")
    }
});




// function to send the email
const sendEmail = async (to, subject, text, html)=>{
    try{
        const info = await transporter.sendMail({
            from:`"backend-banking" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        })
    }catch(error){
        console.log("error while sending the mail", error);
    }
}




async function sendRegistrationEmail(userEmail, name){
    const subject = "welcome to the backend-banking platform";
    const text = `Hello ${name}, \n\nThanks for registring`;


    const html = `<p> Hello ${name} </p>`

    await sendEmail(userEmail, subject, text, html);
}



module.exports = {sendRegistrationEmail}