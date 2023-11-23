import { getServerSession } from 'next-auth/next';
import { toast } from 'react-hot-toast';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import Link from 'next/link';

import { CreatePartnerRequest } from '@/components/createPartnerRequest';
import { AcceptPartnerRequest } from '@/components/acceptPartnerRequest';
import { getPartnerFromUser } from '@/lib/db_utils';
import '@/styles/partnerStyles.css';
import '@/styles/globals.css';
import { CancelPartnerRequest } from '@/components/CancelPartnerRequest';
import { DeletePartnership } from '@/components/DeletePartnership';
import { Capsule } from '@/components/capsule';
import { CapsuleServer } from '@/components/capsule_server';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
    acceptPartnerRequest,
    deletePartnership,
} from '@/lib/partnerRequestServerActions';
import { shuffleArray } from '@/lib/utils';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { OpenCapsules, CapsuleTodoList } from '@/components/OpenCapsules';

import {} from '@/lib/capsuleRelatedServerActions';
import { redirect } from 'next/navigation';

export default async function Connect({}: {}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShowPartnershipCapsules />
        </Suspense>
    );
}

async function ShowPartnershipCapsules() {
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
    const partner = getPartnerFromUser(user);
    if (!partner) {
        // redirect('/author');
        return (
            <div
                style={{
                    margin: '50px',
                    padding: '50px',
                }}
            >
                <Link
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="/partner"
                >
                    Find a partner
                </Link>{' '}
                to seal capsules!
            </div>
        );
    }
    // const authoredCapsules = user.authoredCapsules;

    // const partnership = user.partnership;

    const partnershipCapsules = user?.partnership?.capsules || [];
    if (partnershipCapsules.length === 0) {
        return (
            <div
                style={{
                    margin: '50px',
                    padding: '50px',
                }}
            >
                <Link
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="/author"
                >
                    <i>Author</i> and <i>seal</i> capsules
                </Link>{' '}
                then interact with them here!
            </div>
        );
    }

    const sealedCapsules = shuffleArray(
        partnershipCapsules.filter((capsule) => !capsule.open),
    );
    const unSealedCapsules = partnershipCapsules.filter(
        (capsule) => capsule.open,
    );

    return (
        <div>
            <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Capsules Shared by you and {partner!.firstName}{' '}
            </h1>
            <div>
                <OpenCapsules capsules={sealedCapsules} user={user} />
                <div>
                    <CapsuleTodoList capsules={unSealedCapsules} user={user} />
                </div>
            </div>
        </div>
    );
}

