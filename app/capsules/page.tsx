import { getServerSession } from 'next-auth/next';
import { toast } from 'react-hot-toast';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';

import { CreatePartnerRequest } from '@/components/createPartnerRequest';
import { AcceptPartnerRequest } from '@/components/acceptPartnerRequest';
import { getPartnerFromUser, getPostsFromUser } from '@/lib/db_utils';
import { UserWithPartnership } from '@/lib/types';
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

// TODO:
// in NoPartner, show a search box to send a partner request.
// In Partner, show a list of partner requests.
// In ShowPartner, show a "Leave Partner" if you have a partner.

export default async function Capsules() {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) {
        return <div>Not logged in!</div>;
    }
    const user: UserWithPartnership | null =
        await getUserWithPartnershipByEmail(email);

    // console.log('user', user);
    if (!user) {
        return <div>Not logged in!</div>;
    }
    const partnership = user.partnership;
    const partner = getPartnerFromUser(user);
    const authoredPosts = user.authoredPosts;
    const partnershipPosts = user.partnership.posts;
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
                <pre>authoredPosts</pre>
            </h3>
            <pre>{JSON.stringify(authoredPosts, null, 2)}</pre>
            <h3>
                <pre>partnershipPosts</pre>
            </h3>
            <pre>{JSON.stringify(partnershipPosts, null, 2)}</pre>
        </Suspense>
    );
}

{
    /* 
export default async function UnUsedPosts({user} : {user: UserWithPartnership} ){ 
	const posts = getPostsFromUser(user);
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div>
				{user.partnership.posts.map((post) => (
					<div key={post.id}>{post.content}</div>
				))}
			</div>
		</Suspense>
	);
} */
}
