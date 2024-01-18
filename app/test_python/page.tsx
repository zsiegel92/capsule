import '@/styles/partnerStyles.css';
import { headers, cookies } from 'next/headers';
import { getServerSession } from '@/auth';

import { PythonClient } from '@/py_client/PythonClient';
import { MessageData } from '@/py_client/models/MessageData';
import { getClient } from '@/fastRPC';


async function testPython(): Promise<any[]> {
    // TODO:
    // BASE comes from env variable OR header
    // TOKEN comes from header, FastAPI handles it as a dep.
    // let secret = process.env.NEXTAUTH_SECRET;

    // const decodedToken = jwt.verify(tk, secret, {
    //     algorithms: ['HS256'],
    // });
    // return Promise.resolve(decodedToken);
    const py = getClient();

    let resps: any[] = [];
    let messageData: MessageData = { message: 'hello' };
    const response = await py.hello({ requestBody: messageData });
    console.log(`Got response '${response.message}' from Python!`);
    resps.push(response);

    const response2 = await py.hello2({ message: 'hello2' });
    console.log(`Got response '${response2.message}' from Python!`);
    resps.push(response2);

    const response3 = await py.getUser();
    console.log(`Got response '${response3}' from Python!`);
    resps.push(response3);
    return resps;
}

export default async function TestPython() {
    let messages = await testPython();
    // let messages: any[] = [];
    const session = await getServerSession();
    const email = session?.user?.email;
    console.log('LOGGING SESSION FROM test_python');
    console.log(session);
    // if (!email) {
    //     return <div>Not logged in!</div>;
    // }
    // const user = await getUserWithPartnershipByEmail(email);
    // if (!user) {
    //     return <div>Not logged in!</div>;
    // }
    // console.log(secret);

    // const token = cookies().get('next-auth.session-token')?.value || '';
    // const session_diy = await decode({ token, secret });
    // const token = await getToken({ req, secret });
    // console.log('session_diy\n');
    // console.log(session_diy);

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
