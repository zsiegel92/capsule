import { PythonClient } from '@/py_client/PythonClient';

// TODO:
// ```
//  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/py/:path*' : '/api/',
// ```


export const py = new PythonClient({
    BASE: 'http://localhost:8000',
    TOKEN: '1234',
}).default;

