import React from 'react';
import { PURCHASE_URLS } from '../../common/RssData/constants';
import api, { IResponseProp } from '../baseService';

export const getList = async (filter: IPurchaseFilterProps) => {
    try {
        const response = await api.get(PURCHASE_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IPurchaseProps[];
    } catch {
        return [] as IPurchaseProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(PURCHASE_URLS.Get + '?id=' + id);
        return (response.data.result) as IPurchaseProps;
    } catch {
        return {} as IPurchaseProps;
    }
};

export const creatUpdate = async (testProp: IPurchaseProps) => {
    try {
        const response = await api.post(PURCHASE_URLS.CreatUpdatePurchase, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IPurchaseDetailProps {
    productId: number,
    purchaseID: number,
    qty: number,
    costPrice: number,
    productName: string,
    barcode: string,
    id: number
}

export interface IPurchaseProps {

    date: Date,
    refNo: string,
    tenantId: number,
    adjustment: number,
    grossAmount: number,
    totalAmount: number,
    notes: string,
    supplierID: number,
    supplierName: string,
    id: number,
    detail: IPurchaseDetailProps[]
}


export interface IPurchaseFilterProps {
    refNo: string,
    startDate: Date,
    endDate: Date,
}



