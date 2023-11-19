'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import {
    BsFillEmojiHeartEyesFill,
    BsFillHeartFill,
    BsLink45Deg,
    BsXLg,
    BsArrowUpRight,
} from 'react-icons/bs';
import { Spinner } from 'react-bootstrap';

import '@/styles/partnerStyles.css';
import LoadingDots from '@/components/loading-dots';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { getPartnerFromUser } from '@/lib/db_utils';
import { UserWithPartnership } from '@/lib/types';
import { Capsule as CapsuleType } from '@prisma/client';

import { CapsuleServer, CapsuleServerGrid } from '@/components/capsule_server';
import { palette, randColor, randRotate } from '@/lib/capsule_utils';

import {
    sendPartnerRequest,
    cancelPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import {
    editCapsuleOpen,
    editCapsuleMessage,
    deleteCapsule,
    updateCapsule,
    createCapsule,
} from '@/lib/capsuleRelatedServerActions';

export function AuthoredCapsules({ user }: { user: UserWithPartnership }) {
    const partner = getPartnerFromUser(user);
    // const authoredCapsulesWithPartnership = user.authoredCapsules.filter(
    //     (capsule) => capsule.partnershipId === user.partnershipId,
    // );
    // const authoredCapsulesWithoutPartnership = user.authoredCapsules.filter(
    //     (capsule) => capsule.partnershipId !== user.partnershipId,
    // );
    const nonAuthoredCapsulesInPartnership = user.partnership?.capsules.filter(
        (capsule) => capsule.authorId !== user.id,
    );

    return (
        <>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Message</th>
                        <th>
                            {partner ? (
                                <>
                                    Partnership <br />
                                    with {partner.firstName}
                                </>
                            ) : (
                                <>(No partner)</>
                            )}
                        </th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <CreateCapsuleRow user={user} />
                    {user.authoredCapsules
                        .sort((capsule) => Number(!capsule.partnershipId))
                        .map((capsule) => (
                            <CapsuleRow
                                key={capsule.id}
                                capsule={capsule}
                                user={user}
                            />
                        ))}
                </tbody>
            </Table>
        </>
    );
}

function CapsuleRow({
    capsule,
    user,
}: {
    capsule: CapsuleType;
    user: UserWithPartnership;
}) {
    const [editedCapsuleColor, setEditedCapsuleColor] = useState(capsule.color);
    const [editedCapsuleMessage, setEditedCapsuleMessage] = useState(
        capsule.message,
    );
    const [editedCapsulePartnershipStatus, setEditedCapsulePartnershipStatus] =
        useState(!!capsule.partnershipId);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const dirty =
        editedCapsuleMessage !== capsule.message ||
        editedCapsulePartnershipStatus !== !!capsule.partnershipId ||
        editedCapsuleColor !== capsule.color;

    const sealed = !capsule.open && !!capsule.partnershipId;
    const canEdit = !sealed && dirty;
    const editMessage = sealed ? 'Sealed!' : '';
    useState(false);
    return (
        <tr>
            <td>
                <Capsule
                    primary={editedCapsuleColor}
                    size={0.5}
                    open={!sealed}
                    onClick={() => {
                        if (sealed) {
                            alert('This capsule is sealed!');
                            return;
                        }
                        setShowColorPicker(true);
                    }}
                />
                {/* {JSON.stringify(capsule, null, 2)} */}
            </td>
            <td>
                {!sealed ? (
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedCapsuleMessage}
                        onChange={(e) =>
                            setEditedCapsuleMessage(e.target.value)
                        }
                        placeholder={`Edit: "${capsule.message}"`}
                    />
                ) : (
                    <>...</>
                )}
            </td>
            <td>
                <CapsulePartneringButton
                    user={user}
                    capsule={capsule}
                    editedCapsulePartnershipStatus={
                        editedCapsulePartnershipStatus
                    }
                    setEditedCapsulePartnershipStatus={
                        setEditedCapsulePartnershipStatus
                    }
                />
            </td>
            <td>
                <Button
                    variant="outline-secondary"
                    disabled={!canEdit}
                    onClick={() => {
                        setSubmitting(true);
                        const x = {
                            capsule: capsule,
                            color: editedCapsuleColor,
                            message: editedCapsuleMessage,
                            partnershipId: editedCapsulePartnershipStatus
                                ? user.partnershipId
                                : null,
                        };
                        console.log(x);
                        updateCapsule(
                            '/author',
                            capsule,
                            editedCapsuleColor,
                            editedCapsuleMessage,
                            editedCapsulePartnershipStatus
                                ? user.partnershipId
                                : null,
                        )
                            .then((response) => {
                                setSubmitting(false);
                                console.log('Updated capsule: ', capsule);
                            })
                            .catch((e) => {
                                setSubmitting(false);
                                console.error('Error updating capsule: ', e);
                            });
                    }}
                >
                    {editMessage}
                    {!sealed && (
                        <Capsule
                            // marginAndPadding={0.1}
                            // height={14}
                            // width={28}
                            // strokeWidth={0.5}
                            size={0.4}
                            primary={editedCapsuleColor}
                            useRandColor={false}
                            useRandRotate={!submitting}
                            useRotateInterval={!submitting}
                            useSpinner={submitting}
                        />
                    )}
                </Button>
            </td>
            <td>
                <DeleteCapsuleButton capsule={capsule} />
            </td>
            <UpdateColorModal
                color={editedCapsuleColor}
                setColor={setEditedCapsuleColor}
                show={showColorPicker}
                setShow={setShowColorPicker}
            />
        </tr>
    );
}

function DeleteCapsuleButton({ capsule }: { capsule: CapsuleType }) {
    const [submitting, setSubmitting] = useState(false);
    if (capsule.partnershipId) {
        return <></>;
    }
    return (
        <Button
            variant="outline-danger"
            onClick={() => {
                if (
                    !window.confirm(
                        'Are you sure you want to delete this capsule?',
                    )
                ) {
                    return;
                }
                setSubmitting(true);
                deleteCapsule('/author', capsule)
                    .then((response) => {
                        console.log('DELETED CAPSULE!');
                    })
                    .then((response) => {
                        setSubmitting(false);
                    })
                    .catch((e) => {
                        console.error('Error deleting capsule: ', e);
                    });
            }}
        >
            <Capsule
                // marginAndPadding={0.1}
                // height={14}
                // width={28}
                // strokeWidth={0.5}
                size={0.4}
                primary={'red'}
                useRandColor={false}
                useRandRotate={!submitting}
                useRotateInterval={!submitting}
                useSpinner={submitting}
            />
        </Button>
    );
}

function CreateCapsuleRow({ user }: { user: UserWithPartnership }) {
    const [newCapsuleColor, setNewCapsuleColor] = useState(randColor());
    const [newCapsuleMessage, setNewCapsuleMessage] = useState('');
    const [newCapsuleAddToPartnership, setNewCapsuleAddToPartnership] =
        useState(true);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState(false);

    const partner = getPartnerFromUser(user);

    useEffect(() => {
        setNewCapsuleAddToPartnership(user.partnershipId ? true : false);
    }, [user.partnershipId]);
    return (
        <>
            <tr>
                <td>
                    <Capsule
                        primary={newCapsuleColor}
                        size={0.5}
                        open={true}
                        onClick={() => {
                            setShowColorPicker(true);
                            setTouched(true);
                        }}
                    />
                </td>
                <td>
                    <Form.Group className="position-relative mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newCapsuleMessage}
                            onChange={(e) => {
                                setTouched(true);
                                setNewCapsuleMessage(e.target.value);
                            }}
                            isInvalid={touched && newCapsuleMessage.length == 0}
                            placeholder="Write a message for your partner :)"
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                            Please enter a message.
                        </Form.Control.Feedback>
                    </Form.Group>
                </td>
                <td>
                    <Form.Check
                        type="checkbox"
                        label={partner ? `Seal & share?` : ''}
                        checked={newCapsuleAddToPartnership}
                        onChange={(e) => {
                            setNewCapsuleAddToPartnership(e.target.checked);
                            setTouched(true);
                        }}
                        disabled={user.partnershipId ? false : true}
                    />
                </td>
                <td colSpan={2}>
                    <Button
                        variant="outline-success"
                        onClick={() => {
                            setTouched(true);
                            if (newCapsuleMessage.length == 0) {
                                return;
                            }
                            setSubmitting(true);
                            createCapsule(
                                '/author',
                                user,
                                newCapsuleColor,
                                newCapsuleMessage,
                                newCapsuleAddToPartnership
                                    ? user.partnershipId
                                    : null,
                            )
                                .then((response) => {
                                    setTouched(false);
                                    setSubmitting(false);
                                    console.log('Created capsule!');
                                    setNewCapsuleAddToPartnership(true);
                                    setNewCapsuleColor(randColor());
                                    setNewCapsuleMessage('');
                                })
                                .catch((e) => {
                                    setSubmitting(false);
                                    setTouched(false);
                                    console.error(
                                        'Error creating capsule: ',
                                        e,
                                    );
                                });
                        }}
                    >
                        <Capsule
                            // marginAndPadding={0.1}
                            // height={14}
                            // width={28}
                            // strokeWidth={0.5}
                            size={0.4}
                            primary={'green'}
                            useRandColor={false}
                            useRandRotate={!submitting}
                            useRotateInterval={!submitting}
                            useSpinner={submitting}
                        />
                    </Button>
                </td>
            </tr>
            <UpdateColorModal
                color={newCapsuleColor}
                setColor={setNewCapsuleColor}
                show={showColorPicker}
                setShow={setShowColorPicker}
            />
        </>
    );
}

function UpdateColorModal({
    color,
    setColor,
    show,
    setShow,
}: {
    color: string;
    setColor: any;
    show: boolean;
    setShow: any;
}) {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Update Color</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {palette.map((newColor) => (
                    <div
                        key={newColor}
                        onClick={() => {
                            setColor(newColor);
                            setShow(false);
                        }}
                    >
                        <Capsule primary={newColor} size={0.5} open={true} />
                    </div>
                ))}
            </Modal.Body>
        </Modal>
    );
}

function CapsulePartneringButton({
    user,
    capsule,
    editedCapsulePartnershipStatus,
    setEditedCapsulePartnershipStatus,
}: {
    user: UserWithPartnership;
    capsule: CapsuleType;
    editedCapsulePartnershipStatus: boolean;
    setEditedCapsulePartnershipStatus: any;
}) {
    if (!user.partnershipId) {
        return (
            <Form.Check
                type="checkbox"
                // label="Add to partnership?"
                checked={false}
                // onChange={}
                disabled={true}
            />
        );
    }
    let partneringMessage;
    if (!!capsule.partnershipId) {
        partneringMessage = capsule.open ? 'Shared?' : '';
    } else {
        partneringMessage = 'Seal & Share?';
    }

    return (
        <Form.Check
            type="checkbox"
            label={partneringMessage}
            checked={!!editedCapsulePartnershipStatus}
            onChange={(e) =>
                setEditedCapsulePartnershipStatus(e.target.checked)
            }
            disabled={!!capsule.partnershipId && !capsule.open}
        />
    );
}
