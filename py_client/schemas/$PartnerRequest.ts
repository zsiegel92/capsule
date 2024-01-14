/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PartnerRequest = {
    description: `Represents a PartnerRequest record`,
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        toEmail: {
            type: 'string',
            isRequired: true,
        },
        fromId: {
            type: 'number',
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        fromUser: {
            type: 'any-of',
            contains: [{
                type: 'User',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
