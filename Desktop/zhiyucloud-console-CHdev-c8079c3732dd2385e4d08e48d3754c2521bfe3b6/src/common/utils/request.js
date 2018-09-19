import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';

import reAuthorize from '@/common/widgets/re-authorize';
import expireConfirm from '@/common/widgets/expire-confirm';

const DEFAULT_OPTIONS = {
    timeout: 20000,
};

const GET_DEFAULT_OPTIONS = {
};

const POST_DEFAULT_OPTIONS = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};

export default function request(options = {}) {
    return new Promise((resolve, reject) => {
        const { method } = options;
        const mergedOptions = { };

        const identity = JSON.parse(localStorage.getItem('CONSOLE_USER_IDENTITY'));
        if (identity && identity.token) {
            mergedOptions.headers = {
                // 需要加上 Bearer前缀，遵循OAuth 2.0协议，否则服务器不认
                Authorization: `Bearer ${identity.token}`,
            };
        }

        if (method && method.toLowerCase() === 'get') {
            _.merge(mergedOptions, DEFAULT_OPTIONS, GET_DEFAULT_OPTIONS, options);
        } else if (method && method.toLowerCase() === 'post') {
            _.merge(mergedOptions, DEFAULT_OPTIONS, POST_DEFAULT_OPTIONS, options);
            if (mergedOptions.data && typeof mergedOptions.data === 'object') {
                mergedOptions.data = qs.stringify(mergedOptions.data);
            }
        } else {
            _.merge(mergedOptions, DEFAULT_OPTIONS, options);
        }


        axios(mergedOptions).then(({ data }) => {
            if (data.code === 4) {
                return new Promise(reAuthorize).then(() => request(options).then((value) => {
                    resolve(value);
                }).catch((error) => {
                    reject(error);
                }));
            }

            if (data.code === 0) {
                resolve(data);
            } else if (mergedOptions.url !== '/auth/user/checkInSession' && data.code === 13) {
                // 超时
                expireConfirm();
                reject(new Error(data.msg));
            } else {
                reject(new Error(data.msg));
            }
            return data;
        }).catch((error) => {
            let reason = null;
            if (error.response) {
                reason = `${error.response.status}: ${error.response.statusText}`;
            } else if (error.request && error.request.status !== 0) {
                reason = `${error.request.status}: ${error.request.statusText}`;
            } else {
                reason = error.message;
            }
            reject(new Error(reason));
        });
    });
}
