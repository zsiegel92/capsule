'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
    acceptPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import { BsFillEmojiHeartEyesFill, BsFillHeartFill } from 'react-icons/bs';
import { Spinner } from 'react-bootstrap';
import LoadingDots from '@/components/loading-dots';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';

export function AcceptPartnerRequest({
    partnerRequest,
    user,
}: {
    partnerRequest: any;
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const [submitting, setSubmitting] = useState(false);
    let acceptThisPartnerRequestWithErrorHandlingAndToast =
        useCallback(async () => {
            setSubmitting(true);
            try {
                // await wait(5000);
                const response = await acceptPartnerRequest(
                    '/partner',
                    partnerRequest,
                    user,
                );
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
        }, [partnerRequest, user, setSubmitting]);

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
