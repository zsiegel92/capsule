'use client'
import { use, useState, useEffect, useCallback } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { toast } from 'react-hot-toast';


export function CreatePartnerRequest({
	sendPartnerRequestWithUser,
}: {
	sendPartnerRequestWithUser: any,
}) {
	const [searchedForPartnerEmail, setSearchedForPartnerEmail] = useState('')
	// console.log("CLIENT LOGGING!")
	let sendPartnerRequestWithUserWithErrorHandlingAndToast = useCallback(
		async (formData: any) => {
			try {
				const response = await sendPartnerRequestWithUser(formData)
				toast.success(response?.message)
				setSearchedForPartnerEmail('')
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
				<InputGroup className="mb-3">
					<Form.Control
						type="email"
						placeholder="Normal text"
						name="searchedForPartnerEmail"
						size="lg"
						value={searchedForPartnerEmail}
						onChange={(e) => setSearchedForPartnerEmail(e.target.value)}
						required
					/>
					<Button
						variant='outline-secondary'
						type='submit'
					>
						Send Partner Request
					</Button>
				</InputGroup>


			</Form>

		</div>
	)
}
{/* <input type="submit" value="Send Partner Request" /> */ }