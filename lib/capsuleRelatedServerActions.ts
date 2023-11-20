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
// import { getUserWithPartnershipByEmail } from '@/lib/capsuleRelatedServerActions';

export async function createCapsule(
    path: string,
    user: UserWithPartnershipAndAuthoredCapsules,
    color: string | null,
    message: string,
) {
    const data = {
        message: message,
        color: color || randColor(),
        nTimesOpened: 0,
        // lastOpened:  null,
        // authorId: user.id, // not necessary with connect
        author: {
            connect: {
                id: user.id,
            },
        },
        // ...(partnershipId && {
        //     partnership: {
        //         connect: {
        //             id: partnershipId,
        //         },
        //     },
        // }),
        open: true, //partnershipId == null, // "Seal & share"
    };
    const capsule = await prisma.capsule.create({
        data: data,
    });
    revalidatePath(path);
}

export async function deleteCapsule(path: string, capsule: Capsule) {
    console.log('DELETING CAPSULE: ', capsule);
    const response = await prisma.capsule.delete({
        where: {
            id: capsule.id,
        },
    });
    console.log('DELETION RESPONSE: ', response);
    revalidatePath(path);
}

export async function updateCapsuleScalars(
    path: string,
    capsule: Capsule,
    color: string | null,
    message: string,
) {
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
    revalidatePath(path);
}

export async function updateCapsuleOpen(
    path: string,
    capsule: Capsule,
    user: UserWithPartnershipAndAuthoredCapsules,
    open: boolean = true,
    revalidate: boolean = true,
) {
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
        revalidatePath(path);
    }
}

export async function sealCapsule(path: string, capsule: CapsuleWithUsers) {
    if (!capsule.author.partnershipId) {
        throw new Error('Cannot seal a capsule without a partnership');
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
    revalidatePath(path);
}