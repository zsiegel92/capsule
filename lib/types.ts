import { Prisma } from '@prisma/client';

export type UserWithPartnership = Prisma.UserGetPayload<{
    include: {
        partnership: {
            include: {
                partners: true;
            };
        };
    };
}>;
