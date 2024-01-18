'use server'
import { revalidatePath } from "next/cache";

import { User, PartnerRequest } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { getPartnerFromUser } from '@/lib/db_utils';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { getServerSession } from '@/auth';

export const acceptPartnerRequest = async (partnerRequest: PartnerRequest) => {
    ('use server');
    // console.log('partnerRequest', partnerRequest)
    // console.log('user', user)

    const session = await getServerSession();

    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const user = await getUserWithPartnershipByEmail(session.user.email);
    if (!user) {
        throw new Error('Session does not correspond to a real user!');
    }

    if (user.email !== partnerRequest.toEmail) {
        throw new Error(
            `User in session (${session.user.email}) does not match partnerRequest.toEmail (${partnerRequest.toEmail})`,
        );
    }

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
        revalidatePath('/', 'layout');
        return {
            message: `Accepted partner request to '${partnerRequest.toEmail}'!`,
        };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const deletePartnership = async () => {
    'use server';

    const session = await getServerSession();
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const user = await getUserWithPartnershipByEmail(session.user.email);
    if (!user) {
        throw new Error('Session does not correspond to a real user!');
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
        revalidatePath('/', 'layout');
        return { message: `Deleted partnership with '${partner.firstName}'!` };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const cancelPartnerRequest = async (partnerRequest: PartnerRequest) => {
    'use server';

    const session = await getServerSession();
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
        revalidatePath('/', 'layout');
        return {
            message: `Deleted partner request to '${partnerRequest.toEmail}'!`,
        };
    } catch (e: any) {
        throw new Error(e.message);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const sendPartnerRequest = async (email: string) => {
    ('use server');
    // const email = formData.get('searchedForPartnerEmail') as string;
    const session = await getServerSession();
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const sending_user = await getUserWithPartnershipByEmail(
        session.user.email,
    );
    if (!sending_user) {
        throw new Error(`No user found with email '${session.user.email}'`);
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
                fromUser: {
                    connect: {
                        id: sending_user.id,
                    },
                },
                toEmail: email,
            },
        });
        revalidatePath('/', 'layout');
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