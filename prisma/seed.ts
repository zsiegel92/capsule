import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
	
    const testUserPassword = process.env.TESTUSERPASSWORD || 'testPassword';
    const hashedTestUserPassword = await hash(testUserPassword, 10);

    const email1 = process.env.EMAIL1 || 'test@test.com';
    const testUser1 = await prisma.user.upsert({
        where: { email: email1 },
        update: {},
        create: {
            email: email1,
            firstName: 'Zach',
            password: hashedTestUserPassword,
        },
    });

    const email2 = process.env.EMAIL2 || 'test@test.com';
    const testUser2 = await prisma.user.upsert({
        where: { email: email2 },
        update: {},
        create: {
            email: email2,
            firstName: 'Zach2',
            password: hashedTestUserPassword,
        },
    });

    console.log({ testUser1, testUser2 });
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
