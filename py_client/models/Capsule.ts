/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Partnership } from './Partnership';
import type { User } from './User';

/**
 * Represents a Capsule record
 */
export type Capsule = {
    id: number;
    createdAt: string;
    open: boolean;
    openedBy?: (User | null);
    openedById?: (number | null);
    color: string;
    message: string;
    authorId: number;
    partnershipId?: (number | null);
    lastOpened?: (string | null);
    nTimesOpened: number;
    author?: (User | null);
    partnership?: (Partnership | null);
};

