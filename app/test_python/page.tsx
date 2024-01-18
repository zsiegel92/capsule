// import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import Link from 'next/link';

import { getPartnerFromUser } from '@/lib/db_utils';
import '@/styles/partnerStyles.css';
import { AuthoredCapsules } from '@/components/AuthoredCapsules';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { PythonClient } from '@/py_client/PythonClient';
import { MessageData } from '@/py_client/models/MessageData';
import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';
import { decode, encode, JWTEncodeParams } from 'next-auth/jwt';
import * as jose from 'jose';
var jwt = require('jsonwebtoken');

const secret = process.env.NEXTAUTH_SECRET || '';

const getServerSession = async () => {
    const tk = cookies().get('next-auth.session-token')?.value || '';
    let secret = process.env.NEXTAUTH_SECRET;

    const decodedToken = jwt.verify(tk, secret, {
        algorithms: ['HS256'],
    });
    return Promise.resolve(decodedToken);
};

async function testPython(): Promise<MessageData[]> {
    // const session = await decode({ token, secret });

    // const token2 = new jose.EncryptJWT({ session });
    // console.log(
    //     `Token2: ${await token2
    //         .setProtectedHeader({ alg: 'HSA256', enc: 'utf-8' })
    //         .encrypt('test-secret')}`,
    // );

    // const token_new = await encode({ session, secret });

    // console.log(`token_new: ${token_new}`);
    // const token = await getToken({ req, secret });
    // console.log('session\n');
    // console.log(session);

    // var base64Payload = token.split('.')[1];
    // var payload = Buffer.from(base64Payload, 'base64');
    // return JSON.parse(payload.toString());

    // TODO:
    // BASE comes from env variable OR header
    // TOKEN comes from header, FastAPI handles it as a dep.

    const session = await getServerSession();
    console.log(`session: ${JSON.stringify(session)}`);
    const py = new PythonClient({
        BASE: 'http://localhost:8000',
        TOKEN: '1234', //token, //'1234',
    }).default;

    let resps = [];
    let messageData: MessageData = { message: 'hello' };
    const response = await py.postHello({ requestBody: messageData });
    console.log(`Got response '${response.message}' from Python!`);
    resps.push(response);

    // const response2 = await py.postHello3({ message: 'hello2' });
    // console.log(`Got response '${response2.message}' from Python!`);
    // resps.push(response2);

    // const response3 = await py.postGetUser();
    // console.log(`Got response '${JSON.stringify(response3)}' from Python!`);
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
