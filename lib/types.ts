import { Prisma } from '@prisma/client';


// https://medium.com/@aliammariraq/prisma-exclude-with-typesafety-8484ea6d0c42
type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
    keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
    string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
    type: T,
    omit: K[],
) {
    type Key = Exclude<Keys<T>, K>;
    type TMap = Record<Key, true>;
    const result: TMap = {} as TMap;
    for (const key in Prisma[`${type}ScalarFieldEnum`]) {
        if (!omit.includes(key as K)) {
            result[key as Key] = true;
        }
    }
    return result;
}

const scalarsExcludingPassword = prismaExclude(Prisma.ModelName.User, [Prisma.UserScalarFieldEnum.password]);




const capsuleIncludes = {
    include: {
        author: {
            select: {
                ...scalarsExcludingPassword,
            },
        },
        openedBy: {
            select: {
                ...scalarsExcludingPassword,
            },
        },
        partnership: {
            include: {
                partners: {
                    select: {
                        ...scalarsExcludingPassword,
                    },
                },
            },
        },
    },
};
export type CapsuleWithUsers = Prisma.CapsuleGetPayload<typeof capsuleIncludes>;

const partnershipIncludes = {
    partnership: {
        include: {
            partners: {
                select: {
                    ...scalarsExcludingPassword,
                },
            },
            capsules: capsuleIncludes,
        },
    },
};

export const PartnershipIncludePayload = {
    select: {
        authoredCapsules: capsuleIncludes,
        ...scalarsExcludingPassword,
        ...partnershipIncludes,
    },
    // include: partnershipIncludes
};

export type UserWithPartnershipAndAuthoredCapsules = Prisma.UserGetPayload<
    typeof PartnershipIncludePayload
>;


export const PartnerRequestIncludeUserPayload = {
    include: {
        fromUser: {
            select: {
                ...scalarsExcludingPassword,
            },
        },
    },
};
export type PartnerRequestWithFromUser = Prisma.PartnerRequestGetPayload<
    typeof PartnerRequestIncludeUserPayload
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
