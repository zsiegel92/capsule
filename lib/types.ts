import { Prisma } from '@prisma/client';


export const PartnershipIncludePayload = {
    include: {
        partnership: {
            include: {
                partners: true,
                posts: true,
            },
        },
    },
};

export type UserWithPartnership = Prisma.UserGetPayload<
    typeof PartnershipIncludePayload
>;


// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types 
// for improved `select` type safety, may want to use
// const Prisma.validator<Prisma.UserDefaultArgs>()({
// 	include: {
// 		partnership : {
// 			incldue : {
// 				partners: true,
// 				posts: true
// 			}
// 		}
// 	}
// })
