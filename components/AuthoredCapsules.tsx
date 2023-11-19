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
} from 'react-icons/bs';
import { Spinner } from 'react-bootstrap';

import '@/styles/partnerStyles.css';
import LoadingDots from '@/components/loading-dots';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import { wait } from '@/lib/wait';
import { getPartnerFromUser } from '@/lib/db_utils';
import {
    UserWithPartnershipAndAuthoredCapsules,
    CapsuleWithUsers,
} from '@/lib/types';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';

import {
    sendPartnerRequest,
    cancelPartnerRequest,
} from '@/lib/partnerRequestServerActions';
import {
    // updateCapsuleOpen,
    deleteCapsule,
    updateCapsuleScalars,
    createCapsule,
    sealCapsule,
} from '@/lib/capsuleRelatedServerActions';
import {
    CreateOrUpdateButton,
    DeleteButton,
    CapsuleOrTextButton,
    SealButton,
} from '@/components/capsuleUiHelpers';

export function AuthoredCapsules({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    // const partner = getPartnerFromUser(user);
    // const nonAuthoredCapsulesInPartnership = user.partnership?.capsules.filter(
    //     (capsule) => capsule.authorId !== user.id,
    // );

    return (
        <>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Message</th>
                        <th>
                            <ButtonGroup>
                                <CreateOrUpdateButton
                                    useText={true}
                                    disabled={true}
                                />
                                <SealButton useText={true} disabled={true} />
                                <DeleteButton useText={true} disabled={true} />
                            </ButtonGroup>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <CreateCapsuleRow user={user} />
                    {user.authoredCapsules
                        .filter((capsule) => !capsule.partnershipId)
                        .sort(compareCapsulesByCreatedAt)
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

const compareCapsulesByCreatedAt = (a: CapsuleWithUsers, b: CapsuleWithUsers) =>
    a.createdAt > b.createdAt ? 1 : -1;

function CapsuleRow({
    capsule,
    user,
}: {
    capsule: CapsuleWithUsers;
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const [editedCapsuleColor, setEditedCapsuleColor] = useState(capsule.color);
    const [editedCapsuleMessage, setEditedCapsuleMessage] = useState(
        capsule.message,
    );
    const [showColorPicker, setShowColorPicker] = useState(false);

    const dirty =
        editedCapsuleMessage !== capsule.message ||
        editedCapsuleColor !== capsule.color;

    const sealed = !capsule.open && !!capsule.partnershipId;

    return (
        <tr>
            <td>
                <Capsule
                    primary={editedCapsuleColor}
                    size={0.5}
                    open={true}
                    onClick={() => {
                        setShowColorPicker(true);
                    }}
                />
                {/* {JSON.stringify(capsule, null, 2)} */}
            </td>
            <td>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={editedCapsuleMessage}
                    onChange={(e) => setEditedCapsuleMessage(e.target.value)}
                    placeholder={`Edit: "${capsule.message}"`}
                />
            </td>
            <td>
                <ButtonGroup>
                    {dirty && (
                        <UpdateCapsuleButton
                            capsule={capsule}
                            color={editedCapsuleColor}
                            message={editedCapsuleMessage}
                        />
                    )}
                    {!dirty && !!user.partnershipId && (
                        <SealCapsuleButton capsule={capsule} />
                    )}
                    {!dirty && <DeleteCapsuleButton capsule={capsule} />}
                </ButtonGroup>
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

function SealCapsuleButton({ capsule }: { capsule: CapsuleWithUsers }) {
    const [submitting, setSubmitting] = useState(false);
    return (
        <SealButton
            onClick={() => {
                setSubmitting(true);
                sealCapsule('/author', capsule)
                    .then((response) => {
                        setSubmitting(false);
                        console.log('Sealed capsule: ', capsule);
                    })
                    .catch((e) => {
                        setSubmitting(false);
                        console.error('Error sealing capsule: ', e);
                    });
            }}
            submitting={submitting}
        />
    );
}

function UpdateCapsuleButton({
    capsule,
    color,
    message,
}: {
    capsule: CapsuleWithUsers;
    color: string;
    message: string;
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
                updateCapsuleScalars('/author', capsule, color, message)
                    .then((response) => {
                        setSubmitting(false);
                        console.log('Updated capsule: ', capsule);
                    })
                    .catch((e) => {
                        setSubmitting(false);
                        console.error('Error updating capsule: ', e);
                    });
            }}
            submitting={submitting}
        />
    );
}

function DeleteCapsuleButton({ capsule }: { capsule: CapsuleWithUsers }) {
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
            submitting={submitting}
        />
    );
}

function CreateCapsuleRow({
    user,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const [newCapsuleColor, setNewCapsuleColor] = useState(randColor());
    const [newCapsuleMessage, setNewCapsuleMessage] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState(false);

    const partner = getPartnerFromUser(user);

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
                {/* <td>
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
                </td> */}
                <td>
                    <CreateCapsuleButton
                        submitting={submitting}
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
                            )
                                .then((response) => {
                                    setTouched(false);
                                    setSubmitting(false);
                                    console.log('Created capsule!');
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
                    />
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

function CreateCapsuleButton({
    onClick,
    submitting,
}: {
    submitting: boolean;
    onClick: any;
}) {
    return <CreateOrUpdateButton onClick={onClick} submitting={submitting} />;
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
    user: UserWithPartnershipAndAuthoredCapsules;
    capsule: CapsuleWithUsers;
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