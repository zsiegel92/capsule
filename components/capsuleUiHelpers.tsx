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

import { palette, randColor, randRotate } from '@/lib/capsule_utils';

export function CreateOrUpdateButton(props: any) {
    return (
        <CapsuleOrTextButton
            variant="outline-success"
            primary="green"
            icon={<BsFillSendPlusFill />}
            text="Create/Update"
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

function LowerRightIcon({ children }: { children: any }) {
    return (
        <span
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                fontSize: '0.9em',
                // display: 'block',
            }}
        >
            {children}
        </span>
    );
}
