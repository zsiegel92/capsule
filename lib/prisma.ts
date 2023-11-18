import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient().$extends(withAccelerate());


if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
