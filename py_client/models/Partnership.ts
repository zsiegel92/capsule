/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Capsule } from './Capsule';
import type { User } from './User';

/**
 * Represents a Partnership record
 */
export type Partnership = {
    id: number;
    createdAt: string;
    capsules?: (Array<Capsule> | null);
    partners?: (Array<User> | null);
};

