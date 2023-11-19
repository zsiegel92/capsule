import { UserWithPartnershipAndAuthoredCapsules } from '@/lib/types';

export function getPartnerFromUser(
    user: UserWithPartnershipAndAuthoredCapsules,
) {
    const partner = user?.partnership?.partners.find(
        (partner) => partner.id !== user.id,
    );
    return partner;
}
