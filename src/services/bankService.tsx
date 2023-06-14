import React from 'react';
import Swal from 'sweetalert2';
import { BANKS_URLS } from '../common/RssData/constants';
import { store } from '../store';
import api from './baseService';

export const getList = async (type: string) => {
    try {
        const response = await api.get(BANKS_URLS.GetList + '?type=' + type);
        return (response.data.result.items || []) as IBankProps[];
    } catch {
        return [];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(BANKS_URLS.Get + '?id=' + id);
        return (response.data.result) as IBankProps;
    } catch {
        return [];
    }
};


export const creatUpdateBanks = async (testProp: IBankProps) => {
    try {
        const response = await api.post(BANKS_URLS.CreatUpdateBanks, testProp);
        return response.data.result;
    } catch {
        return 0;
    }
};


export interface IBankProps {
    name: string,
    pic: string,
    type: string,
    id: number
}
export interface IBanks {
    [type: string]: IBankProps[];
}



