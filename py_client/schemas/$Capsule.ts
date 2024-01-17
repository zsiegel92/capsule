/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Capsule = {
    description: `Represents a Capsule record`,
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        open: {
            type: 'boolean',
            isRequired: true,
        },
        openedBy: {
            type: 'any-of',
            contains: [{
                type: 'User',
            }, {
                type: 'null',
            }],
        },
        openedById: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        color: {
            type: 'string',
            isRequired: true,
        },
        message: {
            type: 'string',
            isRequired: true,
        },
        authorId: {
            type: 'number',
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
        lastOpened: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
        },
        nTimesOpened: {
            type: 'number',
            isRequired: true,
        },
        author: {
            type: 'any-of',
            contains: [{
                type: 'User',
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
    },
} as const;
