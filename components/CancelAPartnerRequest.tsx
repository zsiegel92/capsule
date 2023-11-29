'use client'
import { use, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { cancelPartnerRequest } from '@/lib/partnerRequestServerActions';
import { BsXLg } from 'react-icons/bs';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { PartnerRequestWithFromUser } from '@/lib/types';

export function CancelPartnerRequest({
    partnerRequest,
}: {
    partnerRequest: PartnerRequestWithFromUser;
}) {
    const [submitting, setSubmitting] = useState(false);

    let cancelThisPartnerRequestWithErrorHandlingAndToast =
        useCallback(async () => {
            setSubmitting(true);
            try {
                const response = await cancelPartnerRequest(partnerRequest);
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
        }, [partnerRequest, setSubmitting]);

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