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
    LowerRightIcon,
    SealButton,
    compareCapsulesOpenedDate,
    SealCapsuleButton,
} from '@/components/capsuleUiHelpers';
import { getPartnerFromUser } from '@/lib/db_utils';

export function CapsuleTodoList({
    capsules,
}: {
    capsules: CapsuleWithUsers[];
}) {
    if (capsules.length === 0) {
        return <></>;
    }
    return (
        <>
            <h2 className="mb-3 text-3xl leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                Open Capsules
            </h2>
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
                    onClickTable={() => setShowModal(true)}
                />
                <LowerRightIcon>
                    <span>Opened by {capsule.openedBy!.firstName}</span>
                </LowerRightIcon>
            </td>
            <td>
                <SealCapsuleButton capsule={capsule} />
            </td>
            <OpenCapsuleModal
                capsule={capsule}
                show={showModal}
                setShow={setShowModal}
                refreshOnClose={false}
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
    const partner = getPartnerFromUser(user);
    if (!partner) {
        return <></>;
    }
    return (
        <>
            <h2 className="mb-3 text-3xl leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                Sealed Capsules
            </h2>
            {capsules.map((capsule) => (
                <ShowCapsule key={capsule.id} capsule={capsule} />
            ))}
        </>
    );
}

function ShowCapsule({ capsule }: { capsule: CapsuleWithUsers }) {
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
                    updateCapsuleOpen(capsule, true, false).then((response) => {
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
    refreshOnClose = true,
}: {
    capsule: CapsuleWithUsers;
    show: boolean;
    setShow: Function;
    refreshOnClose?: boolean;
}) {
    const router = useRouter();
    return (
        <Modal
            show={show}
            onHide={() => {
                setShow(false);
                if (refreshOnClose) {
                    router.refresh();
                }
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
    onClickTable = undefined,
}: {
    capsule: CapsuleWithUsers;
    capsuleOnRight?: boolean;
    capsuleSize?: number;
    onClickRotatingCapsule?: () => void;
    onClickTable?: (() => void) | undefined;
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
        <table
            style={{
                width: '100%',
                marginBottom: '12px',
                // paddingBottom: '3px',
                ...(!!onClickTable && { cursor: 'pointer' }),
            }}
            onClick={onClickTable}
        >
            <tbody>
                <tr className="capsule-row">
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
