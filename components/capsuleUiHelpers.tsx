'use client';
import { use, useEffect, useState, useCallback } from 'react';
import {
    Form,
    Button,
    Table,
    Modal,
    Row,
    Col,
    ButtonGroup,
} from 'react-bootstrap';
import {
    UserWithPartnershipAndAuthoredCapsules,
    CapsuleWithUsers,
} from '@/lib/types';
import { toast } from 'react-hot-toast';
import {
    BsFillEmojiHeartEyesFill,
    BsFillHeartFill,
    BsLink45Deg,
    BsXLg,
    BsArrowUpRight,
    BsFillSendPlusFill,
    BsFillTrash3Fill,
    BsEnvelopeHeartFill,
} from 'react-icons/bs';
import { Spinner } from 'react-bootstrap';

import '@/styles/partnerStyles.css';
import LoadingDots from '@/components/loading-dots';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { getPartnerFromUser } from '@/lib/db_utils';
import { Capsule as CapsuleType } from '@prisma/client';
import {
    // updateCapsuleOpen,
    deleteCapsule,
    updateCapsuleScalars,
    createCapsule,
    sealCapsule,
} from '@/lib/capsuleRelatedServerActions';
import { palette, randColor, randRotate } from '@/lib/capsule_utils';

export function CreateOrUpdateButton(props: any) {
    return (
        <CapsuleOrTextButton
            variant="outline-success"
            primary="green"
            icon={<BsFillSendPlusFill />}
            text="Save"
            {...props}
        />
    );
}

export function DeleteButton(props: any) {
    return (
        <CapsuleOrTextButton
            variant="outline-danger"
            primary="red"
            icon={<BsFillTrash3Fill />}
            text="Delete"
            {...props}
        />
    );
}

export function SealButton(props: any) {
    return (
        <CapsuleOrTextButton
            variant="outline-info"
            primary="#32CAF0"
            icon={<BsEnvelopeHeartFill />}
            text="Seal"
            {...props}
        />
    );
}

export function CapsuleOrTextButton({
    useText = false,
    text = null,
    submitting = false,
    primary = 'green',
    icon = null,
    style = null,
    ...buttonProps
}: {
    useText?: boolean;
    text?: string | null;
    submitting?: boolean;
    primary?: string;
    icon?: any;
    style?: any;
    buttonProps?: any;
}) {
    let children;
    if (useText && !!text) {
        children = text;
    } else {
        children = (
            <CapsuleForButton submitting={submitting} primary={primary} />
        );
    }
    return (
        <Button style={{ position: 'relative', ...style }} {...buttonProps}>
            {children}
            {!!icon ? <LowerRightIcon>{icon}</LowerRightIcon> : <></>}
        </Button>
    );
}

export function CapsuleForButton({
    submitting = false,
    primary = 'green',
}: {
    submitting?: boolean;
    primary?: string;
}) {
    return (
        <Capsule
            size={0.3}
            primary={primary}
            useRandColor={false}
            useRandRotate={!submitting}
            useRotateInterval={!submitting}
            useSpinner={submitting}
        />
    );
}

export function LowerRightIcon({ children }: { children: any }) {
    return (
        <span
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                fontSize: '0.75em',
                // display: 'block',
            }}
        >
            {children}
        </span>
    );
}

export function UpperRightIcon({ children }: { children: any }) {
    return (
        <span
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.75em',
                // display: 'block',
            }}
        >
            {children}
        </span>
    );
}

// LIFO
export const compareCapsulesByCreatedAt = (
    a: CapsuleWithUsers,
    b: CapsuleWithUsers,
) => (a.createdAt < b.createdAt ? 1 : -1);

// FIFO
export const compareCapsulesOpenedDate = (
    a: CapsuleWithUsers,
    b: CapsuleWithUsers,
) => {
    if (!a.lastOpened) {
        return -1;
    }
    if (!b.lastOpened) {
        return 1;
    }
    return a.lastOpened < b.lastOpened ? -1 : 1;
};

export function UpdateCapsuleButton({
    capsule,
    color,
    message,
    path,
}: {
    capsule: CapsuleWithUsers;
    color: string;
    message: string;
    path: string;
}) {
    const [submitting, setSubmitting] = useState(false);

    return (
        <CreateOrUpdateButton
            onClick={() => {
                setSubmitting(true);
                const x = {
                    capsule: capsule,
                    color: color,
                    message: message,
                };
                console.log(x);
                updateCapsuleScalars(path, capsule, color, message)
                    .then((response) => {
                        setSubmitting(false);
                        console.log('Updated capsule: ', capsule);
                        toast.success('Updated capsule!');
                    })
                    .catch((e) => {
                        setSubmitting(false);
                        console.error('Error updating capsule: ', e);
                        toast.error('Error updating capsule');
                    });
            }}
            submitting={submitting}
        />
    );
}

export function DeleteCapsuleButton({
    capsule,
    path,
}: {
    capsule: CapsuleWithUsers;
    path: string;
}) {
    const [submitting, setSubmitting] = useState(false);
    if (capsule.partnershipId) {
        return <></>;
    }
    return (
        <DeleteButton
            onClick={() => {
                if (
                    !window.confirm(
                        'Are you sure you want to delete this capsule?',
                    )
                ) {
                    return;
                }
                setSubmitting(true);
                deleteCapsule(path, capsule)
                    .then((response) => {
                        console.log('DELETED CAPSULE!');
                        setSubmitting(false);
                        toast.success('Deleted capsule!');
                    })
                    .catch((e) => {
                        console.error('Error deleting capsule: ', e);
                        toast.error('Error deleting capsule');
                    });
            }}
            submitting={submitting}
        />
    );
}

export function CreateCapsuleButton({
    onClick,
    submitting,
}: {
    submitting: boolean;
    onClick: any;
}) {
    return <CreateOrUpdateButton onClick={onClick} submitting={submitting} />;
}

export function SealCapsuleButton({
    capsule,
    path,
}: {
    capsule: CapsuleWithUsers;
    path: string;
}) {
    const [submitting, setSubmitting] = useState(false);
    return (
        <SealButton
            onClick={() => {
                setSubmitting(true);
                sealCapsule(path, capsule)
                    .then((response) => {
                        setSubmitting(false);
                        // console.log('Sealed capsule: ', capsule);
                        toast.success(
                            'Sealed capsule! Visit "Capsules" to open it up :)',
                        );
                    })
                    .catch((e) => {
                        setSubmitting(false);
                        console.error('Error sealing capsule: ', e);
                        toast.error('Error sealing capsule');
                    });
            }}
            submitting={submitting}
        />
    );
}