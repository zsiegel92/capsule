import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
    var prisma: PrismaClient | undefined;
}

function getNewPrismaClient() {
    let prismaClient = new PrismaClient().$extends(withAccelerate());
    return prismaClient;

    // The following enforces that all capsules are opened when removed from a partnership
    // return prismaClient.$extends({
    //     query: {
    //         capsule: {
    //             async update({ model, operation, args, query }) {
    //                 // take incoming `where` and set `age`
    //                 if (args.data.partnershipId == null) {
    //                     args.data = { ...args.data, open: true };
    //                 }
    //                 return query(args);
    //             },
    //         },
    //     },
    // });
}

const prisma = (global.prisma || getNewPrismaClient()) as PrismaClient;

if (process.env.NODE_ENV === 'development') global.prisma = prisma;



export default prisma;
