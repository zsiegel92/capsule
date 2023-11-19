'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import {
    sendPartnerRequest,
    cancelPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import { BsXLg, BsFillHeartbreakFill } from 'react-icons/bs';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';

export function DeletePartnership({
    user,
    deleteThisPartnership,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
    deleteThisPartnership: any;
}) {
    const [submitting, setSubmitting] = useState(false);

    let deleteThisPartnershipWithErrorHandlingAndToast =
        useCallback(async () => {
            if (
                !confirm('Are you sure you want to delete this partnership? 💔')
            ) {
                return;
            }
            setSubmitting(true);
            try {
                const response = await deleteThisPartnership();
                setSubmitting(false);
                toast.success(response?.message);
            } catch (e: any) {
                setSubmitting(false);
                toast.error(
                    e?.message
                        ? `Error deleting partnership: '${e?.message}'.`
                        : 'Error deleting partnership.',
                );
            }
        }, [deleteThisPartnership, setSubmitting]);

    return (
        <button
            onClick={deleteThisPartnershipWithErrorHandlingAndToast}
            style={{
                marginLeft: '10px',
            }}
        >
            {submitting ? <CapsuleSpinner /> : '💔'}
            {/* <BsFillHeartbreakFill /> */}
        </button>
    );
}
