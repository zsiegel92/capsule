import { handleEmailFire } from '@/lib/email-helper';
import HelloEmail from '@/emails/HelloEmail';
import ValidateEmail from '@/emails/ValidateEmail';
import { render } from '@react-email/render';

export default async function EmailPage() {
    // let response = await handleEmailFire({
    //     to: 'zsiegel92@gmail.com',
    //     subject: 'test email',
    //     html: render(HelloEmail()),
    // });
    // console.log(response);
    // response = await handleEmailFire({
    //     to: 'zsiegel92@gmail.com',
    //     subject: 'validate email',
    //     html: render(ValidateEmail({})),
    // });
    // console.log(response);
    return <div>SENDING EMAIL</div>;
}
