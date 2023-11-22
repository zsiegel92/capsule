'use client';
import { use, useState, useEffect, useCallback } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

import { Capsule } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { User } from '@prisma/client';
import { sendPartnerRequest } from '@/lib/partnerRequestServerActions';
import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';

const initialState = {
    message: null,
};

function FormSubmitButton() {
    const { pending, data, method, action } = useFormStatus();
    return (
        <>
            <Button
                variant="outline-secondary"
                type="submit"
                disabled={pending}
            >
                Send Partner Request
                <Capsule
                    // marginAndPadding={0.1}
                    // height={14}
                    // width={28}
                    // strokeWidth={0.5}
                    size={0.4}
                    useRandColor={true}
                    useRandRotate={!pending}
                    useRotateInterval={!pending}
                    useSpinner={pending}
                />
            </Button>
        </>
    );
}

export function CreatePartnerRequest({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const [searchedForPartnerEmail, setSearchedForPartnerEmail] = useState('');

    const sendPartnerRequestWithUserWithErrorHandlingAndToast = useCallback(
        async (formData: any) => {
            // await wait(5000);
            try {
                const response = await sendPartnerRequest(
                    user,
                    '/partner',
                    searchedForPartnerEmail,
                );
                toast.success(response?.message);
                setSearchedForPartnerEmail('');
            } catch (e: any) {
                toast.error(
                    e?.message
                        ? `Error sending partner request: '${e?.message}'.`
                        : 'Error sending partner request.',
                );
            }
        },
        [user, searchedForPartnerEmail, setSearchedForPartnerEmail],
    );

    // sendPartnerRequestWithUserWithErrorHandlingAndToast,
    return (
        <div>
            Search for a partner by email to send a partner request:
            <Form action={sendPartnerRequestWithUserWithErrorHandlingAndToast}>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email address"
                        name="searchedForPartnerEmail"
                        size="lg"
                        value={searchedForPartnerEmail}
                        onChange={(e) =>
                            setSearchedForPartnerEmail(e.target.value)
                        }
                        required
                    />
                    <FormSubmitButton />
                </InputGroup>
            </Form>
        </div>
    );
}
{
    /* <input type="submit" value="Send Partner Request" /> */
}
