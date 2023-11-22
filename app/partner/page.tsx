import { getServerSession } from "next-auth/next"
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
import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';
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
    const session = await getServerSession();
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
                            <DeletePartnership user={user} />
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
            <CreatePartnerRequest user={user} />
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
        include: {
            from: true,
        },
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
                        user={user}
                    />
                ))}
            </tbody>
        </table>
    );
}

async function IncomingPartnerRequest({
    partnerRequest,
    user,
}: {
    partnerRequest: any;
    user: UserWithPartnershipAndAuthoredCapsules;
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
                    <code>{partnerRequest.from.email}</code> wants to be your
                    partner!
                </p>
            </td>
            <td>
                <AcceptPartnerRequest
                    partnerRequest={partnerRequest}
                    user={user}
                />
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
            from: {
                email: user.email,
            },
        },
        // include: {
        // 	toEmail: true,
        // }
    });
    // console.log('outgoingPartnerRequests', outgoingPartnerRequests)
    return (
        <table className="table table-hover">
            <tbody>
                {outgoingPartnerRequests.map((partnerRequest) => (
                    <OutgoingPartnerRequest
                        key={partnerRequest.id}
                        partnerRequest={partnerRequest}
                        user={user}
                    />
                ))}
            </tbody>
        </table>
    );
}

function OutgoingPartnerRequest({
    partnerRequest,
    user,
}: {
    partnerRequest: any;
    user: UserWithPartnershipAndAuthoredCapsules;
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
                <CancelPartnerRequest
                    partnerRequest={partnerRequest}
                    user={user}
                />
            </td>
        </tr>
    );
}

