'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { acceptPartnerRequest } from '@/lib/partnerRequestServerActions';
import { BsFillHeartFill } from 'react-icons/bs';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import {
    UserWithPartnershipAndAuthoredCapsules,
    PartnerRequestWithFromUser,
    PartnerRequestIncludeUserPayload,
} from '@/lib/types';

export function AcceptPartnerRequest({
    partnerRequest,
}: {
    partnerRequest: PartnerRequestWithFromUser;
}) {
    const [submitting, setSubmitting] = useState(false);
    let acceptThisPartnerRequestWithErrorHandlingAndToast =
        useCallback(async () => {
            setSubmitting(true);
            try {
                // await wait(5000);
                const response = await acceptPartnerRequest(partnerRequest);
                setSubmitting(false);
                toast.success(response?.message);
            } catch (e: any) {
                setSubmitting(false);
                toast.error(
                    e?.message
                        ? `Error accepting partner request: '${e?.message}'.`
                        : 'Error accepting partner request.',
                );
            }
        }, [partnerRequest, setSubmitting]);

    return (
        <button
            onClick={acceptThisPartnerRequestWithErrorHandlingAndToast}
            style={{
                marginLeft: '10px',
            }}
        >
            {submitting ? <CapsuleSpinner /> : <BsFillHeartFill />}
        </button>
    );
}
