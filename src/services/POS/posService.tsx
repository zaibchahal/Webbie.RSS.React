import React from 'react';
import { SALE_URLS } from '../../common/RssData/constants';
import api, { IResponseProp } from '../baseService';

export const getList = async (filter: ISaleFilterProps) => {
    try {
        const response = await api.get(SALE_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as ISaleProps[];
    } catch {
        return [] as ISaleProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(SALE_URLS.Get + '?id=' + id);
        return (response.data.result) as ISaleProps;
    } catch {
        return {} as ISaleProps;
    }
};

export const creatUpdate = async (testProp: ISaleProps) => {
    try {
        const response = await api.post(SALE_URLS.CreatUpdateSale, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface ISaleDetailProps {
    productId: number,
    salePrice: number,
    qty: number,
    productName: string,
    barcode: string,
    description: string,
    CountID: number,
    id: number,

}

export interface ISaleProps {
    date: Date,
    refNo: string,
    tenantId: number,
    adjustment: number,
    grossAmount: number,
    totalAmount: number,
    totalQty: number,
    notes: string,
    customerID: number,
    customerName: string,
    id: number,
    detail: ISaleDetailProps[]
}


export interface ISaleFilterProps {
    refNo: string,
    startDate: string,
    endDate: string,
}



