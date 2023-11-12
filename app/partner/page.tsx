import { getServerSession } from "next-auth/next"
import { toast } from 'react-hot-toast';
import { Prisma } from '@prisma/client';
import { User } from "@prisma/client"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { CreatePartnerRequest } from "@/components/createPartnerRequest";
import { AcceptPartnerRequest } from "@/components/acceptPartnerRequest";
import { sendPartnerRequest, cancelPartnerRequest, acceptPartnerRequest } from "@/lib/partnerRequestServerActions";

import "@/styles/partnerStyles.css";
import { CancelPartnerRequest } from "@/components/CancelPartnerRequest";
// TODO:
// in NoPartner, show a search box to send a partner request.
// In Partner, show a list of partner requests.
// In ShowPartner, show a "Leave Partner" if you have a partner.







export default async function Partner() {
	const session = await getServerSession()
	const user = await prisma.user.findUnique({
		where: {
			email: session?.user?.email,
		},
		select: {
			id: true,
			email: true,
		}
		// include: {
		// 	id: true,
		// 	email: true,
		// }
	})
	// const user = session?.user

	return (
		<div style={{ padding: '10px' }}>
			<div>
				Welcome to CAPSULE, {user?.email}
			</div>

			<ShowPartner user={user} />
		</div>
	);
}

function ShowPartner({ user }: { user: User }) {
	const partner: User = null; // { email: 'someone special!' } // todo: find partner in database!
	if (!partner) {
		return <NoPartner user={user} />
	}
	return (
		<div style={{ padding: '10px' }}>
			<div>
				Your partner is {partner?.email}!
			</div>
		</div>
	)
}

async function NoPartner({ user }: { user: User }) {
	const sendPartnerRequestWithUser = async (formData: FormData) => {
		'use server'
		return sendPartnerRequest(user, '/app/partner', formData)
	}
	// revalidatePath('/app/partner')
	return (
		<div style={{ padding: '10px', width: '30%' }}>
			<div>
				You do not have a partner, yet!
			</div>
			<PartnerRequests user={user} />
			<CreatePartnerRequest sendPartnerRequestWithUser={sendPartnerRequestWithUser} />
		</div>
	)
}

async function PartnerRequests({ user }: { user: User }) {
	return (
		<div>
			<IncomingPartnerRequests user={user} />
			<OutgoingPartnerRequests user={user} />
		</div>

	)
}

async function IncomingPartnerRequests({ user }: { user: User }) {
	const incomingPartnerRequests = await prisma.partnerRequest.findMany({
		where: {
			toEmail: user.email,
		},
		include: {
			from: true,
		}
	})
	// console.log('incomingPartnerRequests', incomingPartnerRequests)
	if (incomingPartnerRequests.length === 0) {
		return (
			<div>
				No incoming partner requests.
			</div>
		)
	}

	return (

		<table
			className="table table-hover"
		>
			<tbody>
			{
				incomingPartnerRequests.map((partnerRequest) => (
					<IncomingPartnerRequest
						key={partnerRequest.id} 
						partnerRequest={partnerRequest}
						user={user}
					/>
				)
					)
				}
			</tbody>
		</table>
	)
}

// return <li
// key={partnerRequest.id}
// >
// {partnerRequest.from.email} wants to be your partner!
// </li>
async function IncomingPartnerRequest({ partnerRequest, user }: { partnerRequest: any, user: User }) {

	const acceptThisPartnerRequest = async () => {
		'use server'
		return acceptPartnerRequest('/app/partner', partnerRequest, user)
		return
	}

	return (

		<tr>
			<td>
				<p
					style={{
						border: '1px solid black',
						padding: '5px',
						borderRadius: '5px',
					}}
				><code>{partnerRequest.from.email}</code> wants to be your partner!</p>

			</td>
			<td>
				<AcceptPartnerRequest acceptThisPartnerRequest={acceptThisPartnerRequest} partnerRequest={partnerRequest} user={user} />
			</td>
		</tr>

	)
}



async function OutgoingPartnerRequests({ user }: { user: User }) {
	const outgoingPartnerRequests = await prisma.partnerRequest.findMany({
		where: {
			from: {
				email: user.email,
			}
		}
		// include: {
		// 	toEmail: true,
		// }
	})
	// console.log('outgoingPartnerRequests', outgoingPartnerRequests)
	return (
		<table
			className="table table-hover"
		>
			<tbody>
			{
				outgoingPartnerRequests.map((partnerRequest) => (
					<OutgoingPartnerRequest
						key={partnerRequest.id} 
						partnerRequest={partnerRequest}
						user={user}
					/>

				)
					)
				}
			</tbody>
		</table>
	)
}

function OutgoingPartnerRequest({ partnerRequest, user }: { partnerRequest: any, user: User }) {
	const cancelThisPartnerRequest = async () => {
		'use server'
		return cancelPartnerRequest('/app/partner', partnerRequest)
	}
	return (

		<tr>
			<td>
				<p
					style={{
						border: '1px solid black',
						padding: '5px',
						borderRadius: '5px',
					}}
				>You have invited <code>{partnerRequest.toEmail}</code> to be your partner!</p>

			</td>
			<td>
				<CancelPartnerRequest cancelThisPartnerRequest={cancelThisPartnerRequest} partnerRequest={partnerRequest} user={user} />
			</td>
		</tr>

	)
}

