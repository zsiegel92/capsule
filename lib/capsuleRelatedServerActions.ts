'use server';
import { revalidatePath } from 'next/cache';

import { User, PartnerRequest, Capsule } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';
import { UserWithPartnership } from '@/lib/types';
import { getPartnerFromUser } from '@/lib/db_utils';
// import { getUserWithPartnershipByEmail } from '@/lib/capsuleRelatedServerActions';

export async function editCapsuleOpen(
    path: string,
    capsule: Capsule,
    open: boolean = true,
) {
    prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: {
            open: true,
            nTimesOpened: {
                increment: open ? 1 : 0,
            },
            lastOpened: open ? new Date() : null,
        },
    });
    revalidatePath(path);
}

export async function editCapsuleMessage(
    path: string,
    capsule: Capsule,
    message: string,
) {
    prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: {
            message: message,
        },
    });
    revalidatePath(path);
}

export async function createCapsule(
    path: string,
    user: UserWithPartnership,
    color: string | null,
    message: string,
    partnershipId: number | null,
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
        ...(partnershipId && {
            partnership: {
                connect: {
                    id: partnershipId,
                },
            },
        }),
        open: partnershipId == null, // "Seal & share"
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

export async function updateCapsule(
    path: string,
    capsule: Capsule,
    color: string | null,
    message: string,
    partnershipId: number | null,
) {
    let data: any = {};
    data['partnershipId'] = partnershipId;
    if (!!partnershipId) {
        data['open'] = false; // If editing a capsule in a partnership, seal it! This should only happen in "Capsules", not "Author"
    }
    if (color) {
        data['color'] = color;
    }
    if (message) {
        data['message'] = message;
    }

    const response = await prisma.capsule.update({
        where: {
            id: capsule.id,
        },
        data: data,
    });
    console.log('UPDATED WITH: ', data);
    revalidatePath(path);
}