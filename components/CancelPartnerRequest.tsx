'use client'
import { use, useEffect, useCallback } from 'react'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-hot-toast';
import { sendPartnerRequest, cancelPartnerRequest } from "@/lib/partnerRequestServerActions";
import { BsXLg } from 'react-icons/bs'

export function CancelPartnerRequest({ partnerRequest, user, cancelThisPartnerRequest }: { partnerRequest: any, user: User, cancelThisPartnerRequest: any }) {

	let cancelThisPartnerRequestWithErrorHandlingAndToast = useCallback(
		async () => {
			try {
				const response = await cancelThisPartnerRequest()
				toast.success(response?.message)
			}
			catch (e: any) {
				toast.error(e?.message ? `Error deleting partner request: '${e?.message}'.` : 'Error deleting partner request.')
			}
		},
		[cancelThisPartnerRequest]
	)

	return (
		<button
			onClick={cancelThisPartnerRequestWithErrorHandlingAndToast}
			style={{
				marginLeft: '10px',
			}}
		>
			<BsXLg />
		</button>
	)
}