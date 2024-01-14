/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $User = {
    description: `Represents a User record`,
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        email: {
            type: 'string',
            isRequired: true,
        },
        password: {
            type: 'string',
            isRequired: true,
        },
        firstName: {
            type: 'string',
            isRequired: true,
        },
        partnershipId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        authoredCapsules: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'Capsule',
                },
            }, {
                type: 'null',
            }],
        },
        partnerRequests: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'PartnerRequest',
                },
            }, {
                type: 'null',
            }],
        },
        partnership: {
            type: 'any-of',
            contains: [{
                type: 'Partnership',
            }, {
                type: 'null',
            }],
        },
        openedCapsules: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'Capsule',
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
