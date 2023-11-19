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

import {} from '@/lib/capsuleRelatedServerActions';

export default async function Connect({}: {}) {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) {
        return <div>Not logged in!</div>;
    }
    const user = await getUserWithPartnershipByEmail(email);

    // console.log('user', user);
    if (!user) {
        return <div>Not logged in!</div>;
    }

    const authoredCapsules = user.authoredCapsules;

    const partnership = user.partnership;
    const partner = getPartnerFromUser(user);
    const partnershipCapsules = user?.partnership?.capsules || [];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <h3>
                <pre>user</pre>
            </h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <h3>
                <pre>partnership</pre>
            </h3>
            <pre>{JSON.stringify(partnership, null, 2)}</pre>
            <h3>
                <pre>partner</pre>
            </h3>
            <pre>{JSON.stringify(partner, null, 2)}</pre>
            <h3>
                <pre>authoredCapsules</pre>
            </h3>
            <pre>{JSON.stringify(authoredCapsules, null, 2)}</pre>
            <h3>
                <pre>partnershipCapsules</pre>
            </h3>
            <pre>{JSON.stringify(partnershipCapsules, null, 2)}</pre>
        </Suspense>
    );
}
