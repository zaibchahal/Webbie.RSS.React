import React from 'react';
import { RETURN_URLS } from '../../common/RssData/constants';
import api, { IResponseProp } from '../baseService';

export const getList = async (filter: IReturnFilterProps) => {
    try {
        const response = await api.get(RETURN_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IReturnProps[];
    } catch {
        return [] as IReturnProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(RETURN_URLS.Get + '?id=' + id);
        return (response.data.result) as IReturnProps;
    } catch {
        return {} as IReturnProps;
    }
};

export const creatUpdate = async (testProp: IReturnProps) => {
    try {
        const response = await api.post(RETURN_URLS.CreatUpdateReturn, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IReturnDetailProps {
    productId: number,
    ReturnID: number,
    qty: number,
    returnPrice: number,
    productName: string,
    barcode: string,
    id: number
}

export interface IReturnProps {

    date: Date,
    refNo: string,
    tenantId: number,
    adjustment: number,
    grossAmount: number,
    totalAmount: number,
    notes: string,
    customerID: number,
    customerName: string,
    id: number,
    detail: IReturnDetailProps[]
}


export interface IReturnFilterProps {
    refNo: string,
    startDate: Date,
    endDate: Date,
}



