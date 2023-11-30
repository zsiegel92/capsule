import { Button } from '@react-email/button';
import { Html } from '@react-email/html';

// https://www.neorepo.com/blog/how-to-make-emails-with-nextjs-and-react-email#create-your-first-email
export default function HelloEmail() {
    return (
        <Html>
            <Button
                // pX={20}
                // pY={12}
                href={process.env.APP_URL}
                style={{ background: '#000', color: '#fff' }}
            >
                Hello!
            </Button>
        </Html>
    );
}
