import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { Suspense } from 'react';
import Link from 'next/link';

import { User, PartnerRequest } from '@prisma/client';

import { CreatePartnerRequest } from '@/components/CreateAPartnerRequest';
import { AcceptPartnerRequest } from '@/components/AcceptAPartnerRequest';
import { getPartnerFromUser } from '@/lib/db_utils';
import {
    UserWithPartnershipAndAuthoredCapsules,
    PartnerRequestWithFromUser,
    PartnerRequestIncludeUserPayload,
} from '@/lib/types';
import '@/styles/partnerStyles.css';
import { CancelPartnerRequest } from '@/components/CancelAPartnerRequest';
import { DeletePartnership } from '@/components/DeleteAPartnership';
import { CapsuleServerGrid } from '@/components/capsule_server';
import { getUserWithPartnershipByEmail } from '@/lib/dbActions';
import { authOptions } from '@/auth';
// TODO:
// in NoPartner, show a search box to send a partner request.
// In Partner, show a list of partner requests.
// In ShowPartner, show a "Leave Partner" if you have a partner.

export default async function Partner() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserPartner />
        </Suspense>
    );
}

async function UserPartner() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return <div>Not logged in!</div>;
    }
    const user: UserWithPartnershipAndAuthoredCapsules | null =
        await getUserWithPartnershipByEmail(email);

    // console.log('user', user);
    if (!user) {
        return <div>Not logged in!</div>;
    }
    return (
        <div className="flex h-screen w-screen justify-center">
            <div style={{ padding: '10px' }}>
                <div>Welcome to CAPSULE, {user?.email}</div>
                {user.partnership ? (
                    <ShowPartner user={user} />
                ) : (
                    <NoPartner user={user} />
                )}
                <div style={{ padding: '25px' }}>
                    <CapsuleServerGrid n={100} />
                </div>
            </div>
        </div>
    );
}

async function ShowPartner({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const partner = getPartnerFromUser(user);

    if (!partner) {
        return <div>Partner not found! (this is an error)</div>;
    }

    // console.log(partner);

    return (
        <div style={{ padding: '10px' }}>
            <table className="table table-hover">
                <tbody>
                    <tr style={{ backgroundColor: 'rgba(0,0,0,0,0.5)' }}>
                        <td>
                            <p
                                style={{
                                    border: '1px solid black',
                                    padding: '5px',
                                    borderRadius: '5px',
                                }}
                            >
                                Your partner is {partner.firstName}!
                            </p>
                        </td>
                        <td>
                            <DeletePartnership />
                        </td>
                    </tr>
                </tbody>
            </table>
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
                    Author capsules
                </Link>{' '}
                then{' '}
                <Link
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="/capsules"
                >
                    interact with them
                </Link>
                !
            </div>
        </div>
    );
}

async function NoPartner({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    // revalidatePath('/app/partner')
    return (
        <div style={{ padding: '10px', minWidth: '300px', maxWidth: '800px' }}>
            <div>You do not have a partner, yet!</div>
            <IncomingPartnerRequests user={user} />
            <OutgoingPartnerRequests user={user} />
            <CreatePartnerRequest />
        </div>
    );
}

async function IncomingPartnerRequests({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const incomingPartnerRequests = await prisma.partnerRequest.findMany({
        where: {
            toEmail: user.email,
        },
        ...PartnerRequestIncludeUserPayload,
    });
    // console.log('incomingPartnerRequests', incomingPartnerRequests)
    if (incomingPartnerRequests.length === 0) {
        return <div>No incoming partner requests.</div>;
    }

    return (
        <table className="table table-hover">
            <tbody>
                {incomingPartnerRequests.map((partnerRequest) => (
                    <IncomingPartnerRequest
                        key={partnerRequest.id}
                        partnerRequest={partnerRequest}
                    />
                ))}
            </tbody>
        </table>
    );
}

async function IncomingPartnerRequest({
    partnerRequest,
}: {
    partnerRequest: PartnerRequestWithFromUser;
}) {
    // const acceptThisPartnerRequest = async () => {
    //     'use server';
    //     console.log('ACCEPT ACTION');
    //     console.log(user);
    //     return acceptPartnerRequest('/app/partner', partnerRequest, user);
    // };

    return (
        <tr style={{ backgroundColor: 'rgba(0,0,0,0,0.5)' }}>
            <td>
                <p
                    style={{
                        border: '1px solid black',
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                >
                    <code>
                        {partnerRequest.fromUser.firstName} (
                        {partnerRequest.fromUser.email})
                    </code>{' '}
                    wants to be your partner!
                </p>
            </td>
            <td>
                <AcceptPartnerRequest partnerRequest={partnerRequest} />
            </td>
        </tr>
    );
}

async function OutgoingPartnerRequests({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const outgoingPartnerRequests = await prisma.partnerRequest.findMany({
        where: {
            fromUser: {
                email: user.email,
            },
        },
        ...PartnerRequestIncludeUserPayload,
    });
    // console.log('outgoingPartnerRequests', outgoingPartnerRequests)
    return (
        <table className="table table-hover">
            <tbody>
                {outgoingPartnerRequests.map((partnerRequest) => (
                    <OutgoingPartnerRequest
                        key={partnerRequest.id}
                        partnerRequest={partnerRequest}
                    />
                ))}
            </tbody>
        </table>
    );
}

function OutgoingPartnerRequest({
    partnerRequest,
}: {
    partnerRequest: PartnerRequestWithFromUser;
}) {
    return (
        <tr>
            <td>
                <p
                    style={{
                        border: '1px solid black',
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                >
                    You have invited <code>{partnerRequest.toEmail}</code> to be
                    your partner!
                </p>
            </td>
            <td>
                <CancelPartnerRequest partnerRequest={partnerRequest} />
            </td>
        </tr>
    );
}
