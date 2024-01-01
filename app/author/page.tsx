import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import Link from 'next/link';

import { getPartnerFromUser } from '@/lib/db_utils';
import '@/styles/partnerStyles.css';
import { AuthoredCapsules } from '@/components/AuthoredCapsules';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { py } from '@/py';

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
            <h2 className="mb-3 text-3xl leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                Author Capsules
            </h2>
            {partner && (
                <h3 className="mb-2 text-2xl leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
                    Seal a capsule to share it with {partner.firstName}!
                </h3>
            )}
            <AuthoredCapsules user={user} />{' '}
            {authoredCapsules?.length &&
            authoredCapsules.length > 0 &&
            !partnership ? (
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
                    to seal your capsules!
                </div>
            ) : (
                <></>
            )}
            {partnershipCapsules?.length && partnershipCapsules.length > 0 ? (
                <div
                    style={{
                        margin: '50px',
                        padding: '50px',
                    }}
                >
                    <Link
                        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        href="/capsules"
                    >
                        Interact with sealed capsules
                    </Link>{' '}
                    when you are ready :)
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
