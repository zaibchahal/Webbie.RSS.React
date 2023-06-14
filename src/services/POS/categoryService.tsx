import React from 'react';
import Swal from 'sweetalert2';
import { CATEGORY_URLS } from '../../common/RssData/constants';
import api from '../baseService';

export const getList = async () => {
    try {
        const response = await api.get(CATEGORY_URLS.GetList);
        return (response.data.result.items || []) as ICategoryProps[];
    } catch {
        return [];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(CATEGORY_URLS.Get + '?id=' + id);
        return (response.data.result) as ICategoryProps;
    } catch {
        return [];
    }
};


export const creatUpdateCategory = async (testProp: ICategoryProps) => {
    try {
        const response = await api.post(CATEGORY_URLS.CreatUpdateCategory, testProp);
        return response.data.result;
    } catch {
        return 0;
    }
};

export interface ICategoryProps {
    code: string,
    name: string,
    slug: string,
    pic: string,
    notes: string,
    isActive: true,
    tenantId: number,
    parentCatID: number,
    parentCatName: number,
    id: number
}


