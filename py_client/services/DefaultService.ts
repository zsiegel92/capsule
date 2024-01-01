/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageData } from '../models/MessageData';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Hello
     * Retuns a message depending on the route.
     * @returns MessageData Successful Response
     * @throws ApiError
     */
    public postHello({
        requestBody,
    }: {
        requestBody: MessageData,
    }): CancelablePromise<MessageData> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/py/hello',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Hello2
     * Retuns a message depending on the route.
     * @returns MessageData Successful Response
     * @throws ApiError
     */
    public postHello2({
        requestBody,
    }: {
        requestBody: MessageData,
    }): CancelablePromise<MessageData> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/py/hello2',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
