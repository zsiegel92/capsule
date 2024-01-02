import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import Link from 'next/link';

import { getPartnerFromUser } from '@/lib/db_utils';
import '@/styles/partnerStyles.css';
import { AuthoredCapsules } from '@/components/AuthoredCapsules';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { py } from '@/py';
import { MessageData } from '@/py_client/models/MessageData';
import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET || '';

async function testPython(): Promise<MessageData[]> {
    let resps = [];
    let messageData: MessageData = { message: 'hello' };
    const response = await py.postHello({ requestBody: messageData });
    console.log(`Got response '${response.message}' from Python!`);
    resps.push(response);

    const response2 = await py.postHello3({ message: 'hello2' });
    console.log(`Got response '${response2.message}' from Python!`);
    resps.push(response2);
    return resps;
}

export default async function TestPython() {
    let messages = await testPython();
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) {
        return <div>Not logged in!</div>;
    }
    const user = await getUserWithPartnershipByEmail(email);
    if (!user) {
        return <div>Not logged in!</div>;
    }
    // console.log(secret);

    const token = cookies().get('next-auth.session-token')?.value || '';
    const session_diy = await decode({ token, secret });
    // const token = await getToken({ req, secret });
    console.log('session_diy\n');
    console.log(session_diy);

    // console.log('JSON Web Token', token);
    // const { Auth, API } = withSSRContext({ req });
    return (
        <>
            <h2>Responses from Python</h2>
            <pre>
                <code>{JSON.stringify(messages, null, 2)}</code>
            </pre>
        </>
    );
}
