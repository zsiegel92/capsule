'use server'
import { revalidatePath } from "next/cache";
import { Prisma } from '@prisma/client';
import { User, PartnerRequest } from "@prisma/client"
import prisma from "@/lib/prisma"



export const accetPartnerRequest = async (path: string, partnerRequest: PartnerRequest, user: User) => {
	'use server'
	console.log('partnerRequest', partnerRequest)
	console.log('user', user)
	// ${partnerRequest.from.email} wants to partner with you!
	try {
		// const response = await prisma.partnerRequest.delete({
		// 	where: {
		// 		id: partnerRequest.id,
		// 	}
		// })
		revalidatePath(path)
		return { message: `Accepted partner request to '${partnerRequest.toEmail}'!` }
	}
	catch (e: any) {

		throw new Error(`Error cancelling partner request: '${e?.message}'.`)
		// return { message: `Error cancelling partner request: '${e?.message}'.` }
	}
}


export const cancelPartnerRequest = async (path: string, partnerRequest: PartnerRequest) => {
	'use server'
	console.log('partnerRequest', partnerRequest)
	try {
		const response = await prisma.partnerRequest.delete({
			where: {
				id: partnerRequest.id,
			}
		})
		revalidatePath(path)
		return { message: `Deleted partner request to '${partnerRequest.toEmail}'!` }
	}
	catch (e: any) {

		throw new Error(`Error cancelling partner request: '${e?.message}'.`)
		// return { message: `Error cancelling partner request: '${e?.message}'.` }
	}
}

export const sendPartnerRequest = async (sending_user: User, path: string, formData: FormData) => {
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