import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import * as jose from 'jose';
import { EncryptJWT, jwtDecrypt } from 'jose';
import type {
    JWT,
    JWTDecodeParams,
    JWTEncodeParams,
    JWTOptions,
} from 'next-auth/jwt';
import { v4 as uuid } from 'uuid';
import hkdf from '@panva/hkdf';
var jwt = require('jsonwebtoken');

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const now = () => (Date.now() / 1000) | 0;

async function getDerivedEncryptionKey(
    keyMaterial: string | Buffer,
    salt: string,
) {
    return await hkdf(
        'sha256',
        keyMaterial,
        salt,
        `NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ''}`,
        32,
    );
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {};
                if (!email || !password) {
                    throw new Error('Missing username or password');
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                // if user doesn't exist or password doesn't match
                if (!user || !(await compare(password, user.password))) {
                    throw new Error('Invalid username or password');
                }
                return user;
            },
        }),
    ],
    jwt: {
        async encode(params: JWTEncodeParams) {
            console.log('ENCODE');
            console.log(JSON.stringify(params));
            const {
                token = {},
                secret,
                maxAge = DEFAULT_MAX_AGE,
                salt = '',
            } = params;
            const jwtClaims = {
                // sub: token?.id?.toString(),
                // user: {
                //     name: token.name,
                //     email: token.email,
                // },
                user: token,
                iat: Date.now() / 1000,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                // 'https://hasura.io/jwt/claims': {
                //     'x-hasura-allowed-roles': ['user'],
                //     'x-hasura-default-role': 'user',
                //     'x-hasura-role': 'user',
                //     'x-hasura-user-id': token.id,
                // },
            };
            const encodedToken = jwt.sign(jwtClaims, secret, {
                algorithm: 'HS256',
            });
            console.log('ENCODED TOKEN');
            console.log(encodedToken);
            return encodedToken;
        },
        async decode(params: JWTDecodeParams) {
            console.log('DECODE');
            console.log(JSON.stringify(params));
            const { token, secret, salt = '' } = params;
            const decodedToken = jwt.verify(token, secret, {
                algorithms: ['HS256'],
            });
            return decodedToken;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// let defaults = {
//     async encode(params: JWTEncodeParams) {
//         /** @note empty `salt` means a session token. See {@link JWTEncodeParams.salt}. */
//         const {
//             token = {},
//             secret,
//             maxAge = DEFAULT_MAX_AGE,
//             salt = '',
//         } = params;
//         const encryptionSecret = await getDerivedEncryptionKey(secret, salt);
//         return await new EncryptJWT(token)
//             .setProtectedHeader({
//                 alg: 'dir',
//                 // alg: 'RS256', //regquires a different KeyObject or CryptoKey somewhere...
//                 // enc: 'A256GCM',
//                 // enc: 'A128CBC-HS256',
//                 // alg: 'RSA-OAEP',
//                 // alg: 'HS256',
//                 enc: 'A256GCM',
//             })
//             .setIssuedAt() // sets iat - optional
//             .setExpirationTime(now() + maxAge) // sets exp - optional
//             .setJti(uuid()) // sets jti - optional
//             .encrypt(encryptionSecret);
//     },

//     /** Decodes a NextAuth.js issued JWT. */
//     async decode(params: JWTDecodeParams): Promise<JWT | null> {
//         /** @note empty `salt` means a session token. See {@link JWTDecodeParams.salt}. */
//         const { token, secret, salt = '' } = params;
//         if (!token) return null;
//         const encryptionSecret = await getDerivedEncryptionKey(secret, salt);
//         const { payload } = await jwtDecrypt(token, encryptionSecret, {
//             clockTolerance: 15,
//         });
//         return payload;
//     },
// };