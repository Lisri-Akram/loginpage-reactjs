const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to,subject,text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
   try{
      await transporter.sendMail(mailOptions);
      return  'Email sent successfully';
   } catch (error) {
      console.error('Error sending email:', error);
      return 'Failed to send email';
   }
  
};

const sendVerificationEmail = async (user, rawToken) => {
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${rawToken}`;
    const  html= `
            <h1>Hello, ${user.name}!</h1>
            <p>Click below to verify your email address and activate your account:</p>
            <a href="${verificationUrl}" style="background-color: #ff006e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
            <p>If you did not create an account, ignore this email.</p>
        `
    
    await sendEmail(
        
       user.email,
       'Aurora Auth: Verify Your Email',
        html
    );
};

const sendPasswordResetEmail = async (user, rawToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

   /* const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    }; */
   const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    }}};
    /* old one 
    await sendEmail({
        to: user.email,
        subject: 'Aurora Auth: Password Reset Request',
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click below to set a new password:</p>
            <a href="${resetUrl}" style="background-color: #3a86ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            <p>This link is valid for one hour. If you did not request a reset, ignore this email.</p>
        `
    });
}; */

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
};
