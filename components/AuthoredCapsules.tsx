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

import '@/styles/partnerStyles.css';
import '@/styles/globals.css';
import { Capsule, CapsuleSpinner } from '@/components/capsule';
import {
    UserWithPartnershipAndAuthoredCapsules,
    CapsuleWithUsers,
} from '@/lib/types';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';
import { createCapsule } from '@/lib/capsuleRelatedServerActions';
import {
    CreateOrUpdateButton,
    DeleteButton,
    CapsuleOrTextButton,
    CapsuleForButton,
    SealButton,
    compareCapsulesByCreatedAt,
    UpdateCapsuleButton,
    SealCapsuleButton,
    DeleteCapsuleButton,
    CreateCapsuleButton,
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
    const editableCapsules = user.authoredCapsules
        .filter((capsule) => !capsule.partnershipId)
        .sort(compareCapsulesByCreatedAt);
    return (
        <>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Message</th>
                        <th>
                            <ButtonGroup size="sm">
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
                    {editableCapsules.length > 0 && (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>
                                <b>
                                    <i>Edit</i>
                                </b>
                            </td>
                        </tr>
                    )}
                    {editableCapsules.map((capsule) => (
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
    const [dirty, setDirty] = useState(false);
    const [toastId, setToastId] = useState<string | null>(null);

    useEffect(() => {
        setDirty(
            editedCapsuleMessage !== capsule.message ||
                editedCapsuleColor !== capsule.color,
        );
    }, [
        editedCapsuleMessage,
        editedCapsuleColor,
        capsule.message,
        capsule.color,
    ]);

    useEffect(() => {
        if (dirty) {
            const content = (
                <div>
                    Click the
                    <CapsuleForButton primary="green" submitting={false} />
                    to save
                    <blockquote>
                        <div
                            style={{
                                padding: '15px',
                                background: '#eee',
                                borderRadius: '5px',
                            }}
                        >
                            <CapsuleForButton
                                primary={editedCapsuleColor}
                                submitting={false}
                            />
                            {editedCapsuleMessage}
                        </div>
                    </blockquote>
                </div>
            );
            if (!!toastId) {
                toast.loading(content, { id: toastId });
            } else {
                setToastId(toast.loading(content));
            }
        } else {
            if (toastId) {
                toast.dismiss(toastId);
                setToastId(null);
            }
        }
    }, [dirty, editedCapsuleMessage, editedCapsuleColor, toastId, setToastId]);
    const formInvalid = dirty && editedCapsuleMessage.length == 0;
    return (
        <tr className="capsule-row">
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
                <Form.Group className="position-relative mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedCapsuleMessage}
                        onChange={(e) => {
                            setEditedCapsuleMessage(e.target.value);
                        }}
                        isInvalid={formInvalid}
                        placeholder={`Edit: "${capsule.message}"`}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                        Please enter a message to save!
                    </Form.Control.Feedback>
                </Form.Group>
            </td>
            <td>
                <ButtonGroup>
                    {dirty && (
                        <UpdateCapsuleButton
                            capsule={capsule}
                            color={editedCapsuleColor}
                            message={editedCapsuleMessage}
                            path="/author"
                            // @ts-ignore
                            disabled={formInvalid}
                        />
                    )}
                    {!dirty && !!user.partnershipId && (
                        <SealCapsuleButton capsule={capsule} path="/author" />
                    )}
                    {!dirty && (
                        <DeleteCapsuleButton capsule={capsule} path="/author" />
                    )}
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
    const formInvalid = newCapsuleMessage.length == 0;
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
                            isInvalid={touched && formInvalid}
                            placeholder="New message :)"
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                            Please enter a message.
                        </Form.Control.Feedback>
                    </Form.Group>
                </td>
                <td>
                    <CreateCapsuleButton
                        submitting={submitting}
                        onClick={() => {
                            setTouched(true);
                            if (newCapsuleMessage.length == 0) {
                                return;
                            }
                            setSubmitting(true);
                            createCapsule(newCapsuleColor, newCapsuleMessage)
                                .then((response) => {
                                    setTouched(false);
                                    setSubmitting(false);
                                    console.log('Created capsule!');
                                    setNewCapsuleColor(randColor());
                                    setNewCapsuleMessage('');
                                    toast.success('Created capsule!');
                                })
                                .catch((e) => {
                                    setSubmitting(false);
                                    setTouched(false);
                                    console.error(
                                        'Error creating capsule: ',
                                        e,
                                    );
                                    toast.error('Error creating capsule');
                                });
                        }}
                        // disabled={formInvalid} // This is actually more confusing because it prevents the button click from showing validation warnings
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
