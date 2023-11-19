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

// TODO:
// in NoPartner, show a search box to send a partner request.
// In Partner, show a list of partner requests.
// In ShowPartner, show a "Leave Partner" if you have a partner.

export default async function Author() {
    // TODO:
    // - Component to edit authored posts that are not associated with their partnership, and add posts to their partnership
    // posts not associated with a partnership can be deleted by the author
    // "open" field on post - i.e., whether it is visible to the partners
    // A mini to-do app!
    // Button to close an opened capsule
    // opened posts can be edited by the author before they are put back.
    // posts that are disassociated from a partnership via cascade become opened

    // component to draw a capsule with a post! For the partnership. Time restriction?
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

    // console.log('user', user);
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
