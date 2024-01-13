import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
    const z1password = process.env.Z1PASSWORD || 'testPassword';
    const hashed = await hash(z1password, 10);
    console.log(`Seeding with password ${z1password} hashed to ${hashed}`);
    const z1 = await prisma.user.upsert({
        where: { email: 'zsiegel92@gmail.com' },
        update: {},
        create: {
            email: 'zsiegel92@gmail.com',
            firstName: 'Zach',
            password: hashed,
        },
    });

    console.log({ z1 });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
