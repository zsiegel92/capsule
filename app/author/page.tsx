import { getServerSession } from 'next-auth/next';
import { toast } from 'react-hot-toast';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';

import { CreatePartnerRequest } from '@/components/createPartnerRequest';
import { AcceptPartnerRequest } from '@/components/acceptPartnerRequest';
import { getPartnerFromUser } from '@/lib/db_utils';
import '@/styles/partnerStyles.css';
import { CancelPartnerRequest } from '@/components/CancelPartnerRequest';
import { DeletePartnership } from '@/components/DeletePartnership';
import { Capsule } from '@/components/capsule';
import { CapsuleServer, CapsuleServerGrid } from '@/components/capsule_server';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
    acceptPartnerRequest,
    getUserWithPartnershipByEmail,
    deletePartnership,
} from '@/lib/partnerRequestServerActions';
import { AuthoredCapsules } from '@/components/AuthoredCapsules';
import {} from '@/lib/capsuleRelatedServerActions';

export default async function Author() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserAuthoredCapsules />
        </Suspense>
    );
}

async function UserAuthoredCapsules() {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) {
        return <div>Not logged in!</div>;
    }
    const user = await getUserWithPartnershipByEmail(email);

    if (!user) {
        return <div>Not logged in!</div>;
    }

    const authoredCapsules = user.authoredCapsules;

    const partnership = user.partnership;
    const partner = getPartnerFromUser(user);
    const partnershipCapsules = user?.partnership?.capsules || [];
    return (
        <>
            <AuthoredCapsules user={user} />{' '}
        </>
    );
}
