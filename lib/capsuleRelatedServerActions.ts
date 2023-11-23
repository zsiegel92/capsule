'use server';
import { revalidatePath } from 'next/cache';

import { User, PartnerRequest, Capsule } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';
import {
    UserWithPartnershipAndAuthoredCapsules,
    CapsuleWithUsers,
} from '@/lib/types';
import { getPartnerFromUser } from '@/lib/db_utils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';


export async function createCapsule(color: string | null, message: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const user = await getUserWithPartnershipByEmail(session.user.email);
    if (!user) {
        throw new Error(`No user found with email '${session.user.email}'`);
    }

    const data = {
        message: message,
        color: color || randColor(),
        nTimesOpened: 0,
        author: {
            connect: {
                id: user.id,
            },
        },
        open: true, //partnershipId == null, // "Seal & share"
    };
    const capsule = await prisma.capsule.create({
        data: data,
    });
    revalidatePath('/', 'layout');
}

export async function deleteCapsule(capsule: CapsuleWithUsers) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('No user found in session');
    }
    if (session.user.email !== capsule.author.email) {
        throw new Error(
            `User in session (${session.user.email}) does not match user in request (${capsule.author.email})`,
        );
    }
    console.log('DELETING CAPSULE: ', capsule);
    const response = await prisma.capsule.delete({
        where: {
            id: capsule.id,
        },
    });
    console.log('DELETION RESPONSE: ', response);
    revalidatePath('/', 'layout');
}

export async function updateCapsuleScalars(
    capsule: CapsuleWithUsers,
    color: string | null,
    message: string,
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('No user found in session');
    }
    if (session.user.email !== capsule.author.email) {
        throw new Error(
            `User in session (${session.user.email}) does not match user in request (${capsule.author.email})`,
        );
    }

    const data: any = {
        message: message,
        ...(!!color && { color: color }),
    };
    const response = await prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: data,
    });
    console.log('UPDATED WITH RESPONSE: ', response);
    revalidatePath('/', 'layout');
}

export async function updateCapsuleOpen(
    capsule: CapsuleWithUsers,
    open: boolean = true,
    revalidate: boolean = true,
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    const user = await getUserWithPartnershipByEmail(session.user.email);
    if (!user) {
        throw new Error(`No user found with email '${session.user.email}'`);
    }

    if (
        !(capsule?.partnership?.partners || []).some(
            (partner) => partner.email === user.email,
        )
    ) {
        throw new Error(
            `User ${user.email} is not a partner of capsule ${capsule.id}`,
        );
    }

    const response = await prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: {
            open: true,
            nTimesOpened: {
                increment: open ? 1 : 0,
            },
            lastOpened: open ? new Date() : null,
            openedBy: {
                connect: {
                    id: user.id,
                },
            },
        },
    });
    console.log('UPDATED WITH RESPONSE: ', response);
    if (revalidate) {
        revalidatePath('/', 'layout');
    }
}

export async function sealCapsule(capsule: CapsuleWithUsers) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('No user found in session');
    }
    if (!capsule.author.partnershipId) {
        throw new Error('Cannot seal a capsule without a partnership');
    }

    // const user = await getUserWithPartnershipByEmail(session.user.email);
    if (capsule.author.email !== session.user.email) {
        if (!capsule.partnershipId) {
            throw new Error(
                `User ${session?.user?.email} is not a author or in partnership of capsule ${capsule.id}`,
            );
        }
        if (
            !(capsule?.partnership?.partners || []).some(
                (partner) => partner.email === session?.user?.email,
            )
        ) {
            throw new Error(
                `User ${session?.user?.email} is not a partner of capsule ${capsule.id}`,
            );
        }
    }

    const response = await prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: {
            open: false,
            partnership: {
                connect: {
                    id: capsule.author.partnershipId,
                },
            },
        },
    });
    console.log('UPDATED WITH RESPONSE: ', response);
    revalidatePath('/', 'layout');
}