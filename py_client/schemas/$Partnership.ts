/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Partnership = {
    description: `Represents a Partnership record`,
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
        capsules: {
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
        partners: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'User',
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
