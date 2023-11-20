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
import { CapsuleServer } from '@/components/capsule_server';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
    acceptPartnerRequest,
    getUserWithPartnershipByEmail,
    deletePartnership,
} from '@/lib/partnerRequestServerActions';
import { shuffleArray } from '@/lib/utils';

import { OpenCapsules, CapsuleTodoList } from '@/components/OpenCapsules';

import {} from '@/lib/capsuleRelatedServerActions';

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

    // const authoredCapsules = user.authoredCapsules;

    // const partnership = user.partnership;
    // const partner = getPartnerFromUser(user);
    const partnershipCapsules = shuffleArray(user?.partnership?.capsules || []);
    const sealedCapsules = partnershipCapsules.filter(
        (capsule) => !capsule.open,
    );
    const unSealedCapsules = partnershipCapsules.filter(
        (capsule) => capsule.open,
    );
    return (
        <>
            <div style={{ padding: '20px' }} className="partnership-capsules">
                <h1 className="partnership-capsules-header">
                    Partnership Capsules
                </h1>
                <div
                    style={{ padding: '10px' }}
                    className="partnership-capsules-container"
                >
                    <OpenCapsules capsules={sealedCapsules} user={user} />
                    <div style={{ padding: '50px' }}>
                        <CapsuleTodoList
                            capsules={unSealedCapsules}
                            user={user}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

