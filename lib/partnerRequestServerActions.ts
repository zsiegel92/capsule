'use server'
import { revalidatePath } from "next/cache";

import { User, PartnerRequest } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { UserWithPartnership, PartnershipIncludePayload } from '@/lib/types';
import { getPartnerFromUser } from '@/lib/db_utils';

export async function getUserWithPartnershipByEmail(email: string) {
    const user: UserWithPartnership | null = await prisma.user.findUnique({
        where: {
            email: email,
        },
        ...PartnershipIncludePayload,
    });
    return user;
}

export const acceptPartnerRequest = async (
    path: string,
    partnerRequest: PartnerRequest,
    user: User,
) => {
    'use server';
    // console.log('partnerRequest', partnerRequest)
    // console.log('user', user)
    // ${partnerRequest.from.email} wants to partner with you!
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
        throw new Error(`Error accepting partner request: '${e?.message}'.`);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const deletePartnership = async (
    path: string,
    user: UserWithPartnership,
) => {
    'use server';
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
        throw new Error(`Error deleting partnership: '${e?.message}'.`);
        // return { message: `Error cancelling partner request: '${e?.message}'.` }
    }
};

export const cancelPartnerRequest = async (path: string, partnerRequest: PartnerRequest) => {
	'use server'
	console.log('partnerRequest', partnerRequest)
	try {
		const response = await prisma.partnerRequest.delete({
			where: {
				id: partnerRequest.id,
			}
		})
		revalidatePath(path)
		return { message: `Deleted partner request to '${partnerRequest.toEmail}'!` }
	}
	catch (e: any) {

		throw new Error(`Error cancelling partner request: '${e?.message}'.`)
		// return { message: `Error cancelling partner request: '${e?.message}'.` }
	}
}

export const sendPartnerRequest = async (
    sending_user: User,
    path: string,
    formData: FormData,
) => {
    'use server';
    const email = formData.get('searchedForPartnerEmail') as string;
    if (!email) {
        throw new Error(`Error sending partner request: 'No email provided!'`);
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
            throw new Error(`Error sending partner request: '${e?.message}'.`);
        }
    }
};