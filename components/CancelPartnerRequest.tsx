'use client'
import { use, useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import { BsXLg } from 'react-icons/bs';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';

export function CancelPartnerRequest({
    partnerRequest,
    user,
    cancelThisPartnerRequest,
}: {
    partnerRequest: any;
    user: User;
    cancelThisPartnerRequest: any;
}) {
    const [submitting, setSubmitting] = useState(false);

    let cancelThisPartnerRequestWithErrorHandlingAndToast =
        useCallback(async () => {
            setSubmitting(true);
            try {
                const response = await cancelThisPartnerRequest();
                setSubmitting(false);
                toast.success(response?.message);
            } catch (e: any) {
                setSubmitting(false);
                toast.error(
                    e?.message
                        ? `Error deleting partner request: '${e?.message}'.`
                        : 'Error deleting partner request.',
                );
            }
        }, [cancelThisPartnerRequest, setSubmitting]);

    return (
        <button
            onClick={cancelThisPartnerRequestWithErrorHandlingAndToast}
            style={{
                marginLeft: '10px',
            }}
        >
            {submitting ? <CapsuleSpinner /> : <BsXLg />}
        </button>
    );
}