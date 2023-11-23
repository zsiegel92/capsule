import {
    UserWithPartnershipAndAuthoredCapsules,
    CapsuleWithUsers,
} from '@/lib/types';
import { Session } from 'next-auth';

export function getPartnerFromUser(
    user: UserWithPartnershipAndAuthoredCapsules,
) {
    const partner = user?.partnership?.partners.find(
        (partner) => partner.id !== user.id,
    );
    return partner;
}
