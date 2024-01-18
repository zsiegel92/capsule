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
     * Retuns a message depending on the message body.
     * @returns MessageData Successful Response
     * @throws ApiError
     */
    public hello({
        requestBody,
    }: {
        requestBody: MessageData,
    }): CancelablePromise<MessageData> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/hello',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Hello2
     * Retuns a message depending on the message body.
     * @returns MessageData Successful Response
     * @throws ApiError
     */
    public hello2({
        message,
    }: {
        message: string,
    }): CancelablePromise<MessageData> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/hello2',
            query: {
                'message': message,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Hello4
     * Retuns a hello message.
     * @returns string Successful Response
     * @throws ApiError
     */
    public hello4(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/hello4',
        });
    }

    /**
     * Getuser
     * Retuns the current user.
     * @returns User Successful Response
     * @throws ApiError
     */
    public getUser(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/getUser',
        });
    }

}
