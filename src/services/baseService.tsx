import axios, { AxiosRequestHeaders } from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL, AppConst } from '../common/RssData/constants';
import { getCookie, jzSwal } from '../common/RssData/helper';
import { store } from '../store';

const api = axios.create({
    baseURL: API_BASE_URL,
});


// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code && error.code === "ERR_NETWORK") {
            jzSwal.error('Server is not available');
        }
        if (error.response.status === 401) {
            jzSwal.error('Need To Login Again');
        }
        if (error.response.status === 500) {
            console.log(error.response.data);
        }
        return Promise.reject(error);
    }
);
// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().session.Session.accessToken;
        const tenantId = getCookie(AppConst.TenantID);

        if (config.headers) {
            config.headers = {
                ...config.headers,
                Accept: 'text/plain',
                "Abp.TenantId": tenantId,
                "Content-Type": 'application/json-patch+json',
                "X-XSRF-TOKEN": 'null',
                Authorization: `Bearer ${accessToken}`,
            } as unknown as AxiosRequestHeaders;
        }
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;


export interface IResponseProp {
    error: any,
    result: any,
    success: boolean,
    targetUrl: string,
    unAuthorizedRequest: boolean,
    __abp: boolean
}



export const Delete = async (url: string): Promise<boolean> => {
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const response = await api.delete(url);
            return response.data.success;
        }

        return false;
    } catch {
        return false;
    }
};