'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { deletePartnership } from '@/lib/partnerRequestServerActions';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';

export function DeletePartnership({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
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
                const response = await deletePartnership('/partner', user);
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
        }, [user, setSubmitting]);

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
