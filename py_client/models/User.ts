/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Capsule } from './Capsule';
import type { PartnerRequest } from './PartnerRequest';
import type { Partnership } from './Partnership';

/**
 * Represents a User record
 */
export type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    partnershipId?: (number | null);
    authoredCapsules?: (Array<Capsule> | null);
    partnerRequests?: (Array<PartnerRequest> | null);
    partnership?: (Partnership | null);
    openedCapsules?: (Array<Capsule> | null);
};

