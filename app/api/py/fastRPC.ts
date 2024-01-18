import { headers, cookies } from 'next/headers';
import { PythonClient } from '@/py_client/PythonClient';
import { DefaultService } from '@/py_client/services/DefaultService';

export function getClient() {
    const py = new PythonClient({
        BASE:
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:8000'
                : '/api/',
        // TOKEN: await getEncodedPythonServerSession(),
        TOKEN: cookies().get('next-auth.session-token')?.value || '',
        // cookies().get('next-auth.session-token')?.value || '',
        // TOKEN: '1234',
    }).default;
    return py;
}
