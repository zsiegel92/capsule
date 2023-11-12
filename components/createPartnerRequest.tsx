'use client'
import { use, useEffect, useCallback } from 'react'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-hot-toast';


export function CreatePartnerRequest({
	sendPartnerRequestWithUser,
}: {
	sendPartnerRequestWithUser: any,
}) {
	// console.log("CLIENT LOGGING!")
	let sendPartnerRequestWithUserWithErrorHandlingAndToast = useCallback(
		async (formData: any) => {
			try {
				const response = await sendPartnerRequestWithUser(formData)
				toast.success(response?.message)
			}
			catch (e: any) {
				toast.error(e?.message ? `Error sending partner request: '${e?.message}'.` : 'Error sending partner request.')
			}
		},
		[sendPartnerRequestWithUser]
	)
	return (
		<div>
			Search for a partner by email to send a partner request:
			<Form
				action={sendPartnerRequestWithUserWithErrorHandlingAndToast}
			>
				<Form.Control
					type="email"
					placeholder="Normal text"
					name="searchedForPartnerEmail"
					size="lg"
					required
				/>
				<Button
					variant='primary'
					type='submit'
				>
					Send Partner Request
				</Button>
			</Form>

		</div>
	)
}
{/* <input type="submit" value="Send Partner Request" /> */ }