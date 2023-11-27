'use server';
import prisma from '@/lib/prisma';

import {
    UserWithPartnershipAndAuthoredCapsules,
    PartnershipIncludePayload,
} from '@/lib/types';

// do not need to annotate return value of
// `: Promise<UserWithPartnershipAndAuthoredCapsules | null>`
// nor user type of `: UserWithPartnershipAndAuthoredCapsules | null`
// thanks to Prisma type safety.
export async function getUserWithPartnershipByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        ...PartnershipIncludePayload,
    });
    return user;
}
