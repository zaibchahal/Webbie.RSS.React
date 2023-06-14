import React from 'react';
import Swal from 'sweetalert2';
import { BRAND_URLS } from '../../common/RssData/constants';
import api from '../baseService';

export const getList = async () => {
    try {
        const response = await api.get(BRAND_URLS.GetList);
        return (response.data.result.items || []) as IBrandProps[];
    } catch {
        return [];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(BRAND_URLS.Get + '?id=' + id);
        return (response.data.result) as IBrandProps;
    } catch {
        return [];
    }
};


export const creatUpdateBrand = async (testProp: IBrandProps) => {
    try {
        const response = await api.post(BRAND_URLS.CreatUpdateBrand, testProp);
        return response.data.result;
    } catch {
        return 0;
    }
};

export interface IBrandProps {
    code: string,
    name: string,
    slug: string,
    pic: string,
    notes: string,
    isActive: true,
    tenantId: number,
    id: number
}


