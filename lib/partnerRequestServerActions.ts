'use server'
import { revalidatePath } from "next/cache";

import { User, PartnerRequest } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import {
    UserWithPartnershipAndAuthoredCapsules,
    PartnershipIncludePayload,
} from '@/lib/types';
import { getPartnerFromUser } from '@/lib/db_utils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';

export async function getUserWithPartnershipByEmail(
    email: string,
): Promise<UserWithPartnershipAndAuthoredCapsules | null> {
    const user: UserWithPartnershipAndAuthoredCapsules | null =
        await prisma.user.findUnique({
            where: {
                email,
            },
            ...PartnershipIncludePayload,
        });
    return user;
}

export const acceptPartnerRequest = async (
    path: string,
    partnerRequest: PartnerRequest,
    user: UserWithPartnershipAndAuthoredCapsules,
) => {
    'use server';
    // console.log('partnerRequest', partnerRequest)
    // console.log('user', user)

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    if (session.user.email !== user.email) {
        throw new Error(
            `User in session (${session.user.email}) does not match user in request (${user.email})`,
        );
    }
    if (session.user.email !== partnerRequest.toEmail) {
        throw new Error(
            `User in session (${session.user.email}) does not match partnerRequest.toEmail (${partnerRequest.toEmail})`,
        );
    }

    console.log('user: ', user);
    console.log('partnerRequest: ', partnerRequest);

    try {
        const sendingUser = await prisma.user.findUnique({
            where: {
                id: partnerRequest.fromId,
            },
        });
        if (!sendingUser) {
            throw new Error(
                `Error accepting partner request: 'No sending user found!'`,
            );
        }
        if (sendingUser.partnershipId) {
            throw new Error(
                `Error accepting partner request: 'Sending user already has a partnership!'`,
            );
        }
        if (user.partnershipId) {
            throw new Error(
                `Error accepting partner request: 'You already have a partnership!'`,
            );
        }

        const partnership = await prisma.partnership.create({
            data: {
                partners: {
                    connect: [
                        {
                            id: sendingUser.id,
                        },
                        {
                            id: user.id,
                        },
                    ],
                },
            },
        });
        revalidatePath(path);
        return {
            message: `Accepted partner request to '${partnerRequest.toEmail}'!`,
        };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const deletePartnership = async (
    path: string,
    user: UserWithPartnershipAndAuthoredCapsules,
) => {
    'use server';

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    if (session.user.email !== user.email) {
        throw new Error(
            `User in session (${session.user.email}) does not match user in request (${user.email})`,
        );
    }

    console.log('user', user);
    if (!user.partnershipId) {
        throw new Error(`Error deleting partnership: 'No partnership found!'`);
    }
    try {
        const partner = getPartnerFromUser(user)!;
        const partnership = await prisma.partnership.delete({
            where: {
                id: user.partnershipId,
            },
        });
        revalidatePath(path);
        return { message: `Deleted partnership with '${partner.firstName}'!` };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const cancelPartnerRequest = async (
    path: string,
    partnerRequest: PartnerRequest,
) => {
    'use server';

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const user = await getUserWithPartnershipByEmail(session.user.email);
    if (!user) {
        throw new Error(`No user found with email '${session.user.email}'`);
    }
    if (user.id !== partnerRequest.fromId) {
        throw new Error(
            `User in session (${session.user.email}) does not match partnerRequest.fromId (${partnerRequest.fromId})`,
        );
    }

    console.log('partnerRequest', partnerRequest);
    try {
        const response = await prisma.partnerRequest.delete({
            where: {
                id: partnerRequest.id,
            },
        });
        revalidatePath(path);
        return {
            message: `Deleted partner request to '${partnerRequest.toEmail}'!`,
        };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const sendPartnerRequest = async (
    sending_user: UserWithPartnershipAndAuthoredCapsules,
    path: string,
    email: string,
) => {
    ('use server');
    // const email = formData.get('searchedForPartnerEmail') as string;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    if (sending_user.email !== session.user.email) {
        throw new Error(`User in session does not match sending user!`);
    }

    if (!email) {
        throw new Error(`No email provided!`);
    }
    if (sending_user.email === email) {
        throw new Error(`You cannot partner with yourself!`);
    }
    let partnerRequest;
    try {
        partnerRequest = await prisma.partnerRequest.create({
            data: {
                from: {
                    connect: {
                        id: sending_user.id,
                    },
                },
                toEmail: email,
            },
        });
        revalidatePath(path);
        return { message: `Partner request sent to '${email}'!` };
    } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message: `You have already sent a partner request to '${email}'!`,
            };
        } else {
            throw new Error(e.message);
        }
    }
};