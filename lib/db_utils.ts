import { UserWithPartnership } from '@/lib/types';

export function getPartnerFromUser(user: UserWithPartnership) {
    const partner = user?.partnership?.partners.find(
        (partner) => partner.id !== user.id,
    );
    return partner;
}