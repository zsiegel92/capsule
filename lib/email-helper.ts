import nodemailer from 'nodemailer';

// https://www.neorepo.com/blog/how-to-make-emails-with-nextjs-and-react-email#create-your-first-email
type Payload = {
    recipient: string;
    subject: string;
    html: string;
};

const smtpSettings = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

export const handleEmailFire = async (data: Payload) => {
    const transporter = nodemailer.createTransport({
        ...smtpSettings,
    });

    return await transporter.sendMail({
        from: process.env.SMTP_FROM,
        ...data,
    });
};
