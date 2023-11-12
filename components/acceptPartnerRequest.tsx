'use client'
import { use, useEffect, useCallback } from 'react'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-hot-toast';
import { sendPartnerRequest, cancelPartnerRequest } from "@/lib/partnerRequestServerActions";
import { BsFillEmojiHeartEyesFill, BsFillHeartFill } from 'react-icons/bs'

export function AcceptPartnerRequest({ partnerRequest, user, acceptThisPartnerRequest }: { partnerRequest: any, user: any, acceptThisPartnerRequest: any }) {


	let acceptThisPartnerRequestWithErrorHandlingAndToast = useCallback(
		async () => {
			try {
				const response = await acceptThisPartnerRequest()
				toast.success(response?.message)
			}
			catch (e: any) {
				toast.error(e?.message ? `Error accepting partner request: '${e?.message}'.` : 'Error accepting partner request.')
			}
		},
		[acceptThisPartnerRequest]
	)

	return (
		<button
			onClick={acceptThisPartnerRequestWithErrorHandlingAndToast}
			style={{
				marginLeft: '10px',
			}}
		>
			<BsFillHeartFill />
		</button>
	)
}

