'use server';
import prisma from '@/lib/prisma';

import {
    UserWithPartnershipAndAuthoredCapsules,
    PartnershipIncludePayload,
} from '@/lib/types';

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
