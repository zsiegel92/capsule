import { getServerSession } from "next-auth/next"
import { toast } from 'react-hot-toast';
import { Prisma } from '@prisma/client';
import { User } from "@prisma/client"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { CreatePartnerRequest } from "@/components/createPartnerRequest";

// TODO:
// in NoPartner, show a search box to send a partner request.
// In Partner, show a list of partner requests.
// In ShowPartner, show a "Leave Partner" if you have a partner.



const sendPartnerRequest = async (sending_user: User, path: string, formData: FormData) => {
	'use server'
	const email = formData.get('searchedForPartnerEmail')
	let partnerRequest
	try {
		partnerRequest = await prisma.partnerRequest.create({
			data: {
				from: {
					connect: {
						id: sending_user.id
					}
				},
				toEmail: email,
			}
		})
		revalidatePath(path)
		return { message: `Partner request sent to '${email}'!` }
	} catch (e: any) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return { message: `You have already sent a partner request to '${email}'!` }
		}
		else {
			throw new Error(`Error sending partner request: '${e?.message}'.`)
		}

	}
}



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
		<div style={{ padding: '10px' }}>
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
		<ul className="list-disc">
			{
				incomingPartnerRequests.map((partnerRequest) => (
					<li
						key={partnerRequest.id}
					>
						{partnerRequest.from.email} wants to be your partner!
					</li>
				)
				)
			}
		</ul>
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
		<ul className="list-disc">
			{
				outgoingPartnerRequests.map((partnerRequest) => (
					<li
						key={partnerRequest.id}
					>
						You have invited <code>{partnerRequest.toEmail}</code> to be your partner!
					</li>
				)
				)
			}
		</ul>
	)
}
