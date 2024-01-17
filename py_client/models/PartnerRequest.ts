/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

/**
 * Represents a PartnerRequest record
 */
export type PartnerRequest = {
    id: number;
    toEmail: string;
    fromId: number;
    createdAt: string;
    fromUser?: (User | null);
};

