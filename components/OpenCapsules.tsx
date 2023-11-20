'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Capsule } from '@/components/capsule';
import { updateCapsuleOpen } from '@/lib/capsuleRelatedServerActions';
import {
    CreateOrUpdateButton,
    DeleteButton,
    CapsuleOrTextButton,
    CapsuleForButton,
    LowerRightIcon,
    UpperRightIcon,
    SealButton,
    compareCapsulesByCreatedAt,
    compareCapsulesOpenedDate,
    UpdateCapsuleButton,
    SealCapsuleButton,
    DeleteCapsuleButton,
    CreateCapsuleButton,
} from '@/components/capsuleUiHelpers';

export function CapsuleTodoList({
    user,
    capsules,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
    capsules: CapsuleWithUsers[];
}) {
    if (capsules.length === 0) {
        return <></>;
    }
    return (
        <>
            <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Open Capsules
            </h1>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Capsule</th>
                        <th>
                            <ButtonGroup size="sm">
                                {/* <CreateOrUpdateButton
                                    useText={true}
                                    disabled={true}
                                /> */}
                                <SealButton useText={true} disabled={true} />
                                {/* <DeleteButton useText={true} disabled={true} /> */}
                            </ButtonGroup>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {capsules.sort(compareCapsulesOpenedDate).map((capsule) => (
                        <CapsuleTodoListRow
                            key={capsule.id}
                            capsule={capsule}
                        />
                    ))}
                </tbody>
            </Table>
        </>
    );
}

function CapsuleTodoListRow({ capsule }: { capsule: CapsuleWithUsers }) {
    const [showModal, setShowModal] = useState(false);
    return (
        <tr key={capsule.id}>
            <td
                style={{
                    position: 'relative',
                }}
            >
                <CapsuleMessageTable
                    capsule={capsule}
                    capsuleOnRight={false}
                    capsuleSize={0.75}
                    onClickRotatingCapsule={() => setShowModal(true)}
                />
                <LowerRightIcon>
                    <span style={{ margin: '5px' }}>
                        Opened by {capsule.openedBy!.firstName}
                    </span>
                </LowerRightIcon>
            </td>
            <td>
                <SealCapsuleButton path="/capsules" capsule={capsule} />
            </td>
            <OpenCapsuleModal
                capsule={capsule}
                show={showModal}
                setShow={setShowModal}
            />
        </tr>
    );
}

export function OpenCapsules({
    user,
    capsules,
}: {
    user: UserWithPartnershipAndAuthoredCapsules;
    capsules: CapsuleWithUsers[];
}) {
    if (capsules.length === 0) {
        return <></>;
    }
    return (
        <>
            <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Sealed Capsules
            </h1>
            {capsules.map((capsule) => (
                <ShowCapsule key={capsule.id} capsule={capsule} user={user} />
            ))}
        </>
    );
}

function ShowCapsule({
    capsule,
    user,
}: {
    capsule: CapsuleWithUsers;
    user: UserWithPartnershipAndAuthoredCapsules;
}) {
    const [show, setShow] = useState(false);
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ display: 'inline-block' }}
        >
            <Capsule
                key={capsule.id}
                useRandRotate={true}
                primary={capsule.color}
                onClick={() => {
                    updateCapsuleOpen(
                        '/capsules',
                        capsule,
                        user,
                        true,
                        false,
                    ).then((response) => {
                        setShow(true);
                    });
                }}
                open={hovered}
                hoverSeparationOffset={-1}
            />
            <OpenCapsuleModal capsule={capsule} show={show} setShow={setShow} />
        </div>
    );
}

function OpenCapsuleModal({
    capsule,
    show,
    setShow,
}: {
    capsule: CapsuleWithUsers;
    show: boolean;
    setShow: any;
}) {
    const router = useRouter();
    return (
        <Modal
            show={show}
            onHide={() => {
                setShow(false);
                router.refresh();
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {capsule.author.firstName}&lsquo;s message! ❤️
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CapsuleMessageTable capsule={capsule} />
            </Modal.Body>
            <Modal.Footer>
                <p>
                    This capsule is now <b>OPEN!</b>
                </p>
                <br />
                <p>Open capsules are shown below :)</p>
            </Modal.Footer>
        </Modal>
    );
}

function CapsuleMessageTable({
    capsule,
    capsuleOnRight = true,
    capsuleSize = 1,
    onClickRotatingCapsule = () => {},
}: {
    capsule: CapsuleWithUsers;
    capsuleOnRight?: boolean;
    capsuleSize?: number;
    onClickRotatingCapsule?: () => void;
}) {
    const capsuleTD = (
        <td>
            <Capsule
                useSpinner={true}
                spinnerSlow={true}
                useRandRotate={false}
                useRandColor={false}
                primary={capsule.color}
                open={true}
                size={capsuleSize}
                hoverSeparationOffset={-1}
                onClick={onClickRotatingCapsule}
            />
        </td>
    );
    return (
        <table style={{ width: '100%' }}>
            <tbody>
                <tr>
                    {!capsuleOnRight && capsuleTD}
                    <td style={{ width: '75%' }}>
                        <blockquote>
                            <div
                                style={{
                                    position: 'relative',
                                    padding: '15px',
                                    background: '#eee',
                                    borderRadius: '5px',
                                }}
                            >
                                {capsule.message}
                                <LowerRightIcon>
                                    <span>
                                        {capsule.author.firstName}{' '}
                                        {capsule.createdAt.toLocaleDateString()}
                                    </span>
                                </LowerRightIcon>
                            </div>
                        </blockquote>
                    </td>
                    {capsuleOnRight && capsuleTD}
                </tr>
            </tbody>
        </table>
    );
}
