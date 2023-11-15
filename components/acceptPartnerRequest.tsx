'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import { BsFillEmojiHeartEyesFill, BsFillHeartFill } from 'react-icons/bs';
import { Spinner } from 'react-bootstrap';
import LoadingDots from '@/components/loading-dots';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';

export function AcceptPartnerRequest({
    partnerRequest,
    user,
    acceptThisPartnerRequest,
}: {
    partnerRequest: any;
    user: any;
    acceptThisPartnerRequest: any;
}) {
    const [submitting, setSubmitting] = useState(false);
    let acceptThisPartnerRequestWithErrorHandlingAndToast =
        useCallback(async () => {
            setSubmitting(true);
            try {
                // await wait(5000);
                const response = await acceptThisPartnerRequest();
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
        }, [acceptThisPartnerRequest, setSubmitting]);

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
