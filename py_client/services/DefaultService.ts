/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageData } from '../models/MessageData';
import type { User } from '../models/User';

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

    /**
     * Hello3
     * Retuns a message depending on the route.
     * @returns MessageData Successful Response
     * @throws ApiError
     */
    public postHello3({
        message,
    }: {
        message: string,
    }): CancelablePromise<MessageData> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/py/hello3',
            query: {
                'message': message,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Getuser
     * Retuns a message depending on the route.
     * @returns User Successful Response
     * @throws ApiError
     */
    public postGetUser(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/py/getUser',
        });
    }

}
