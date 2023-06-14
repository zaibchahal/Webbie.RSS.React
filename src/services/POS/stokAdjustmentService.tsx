import React from 'react';
import { STOCKADJUST_URLS } from '../../common/RssData/constants';
import api, { IResponseProp } from '../baseService';

export const getList = async (filter: IStockAdjustFilterProps) => {
    try {
        const response = await api.get(STOCKADJUST_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IStockAdjustProps[];
    } catch {
        return [] as IStockAdjustProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(STOCKADJUST_URLS.Get + '?id=' + id);
        return (response.data.result) as IStockAdjustProps;
    } catch {
        return {} as IStockAdjustProps;
    }
};

export const creatUpdate = async (testProp: IStockAdjustProps) => {
    try {
        const response = await api.post(STOCKADJUST_URLS.CreatUpdateStockAdjustment, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IStockAdjustDetailProps {
    productId: number,
    qty: number,
    productName: string,
    description: string,
    adjustID: number,
    id: number,

    type: number,
}

export interface IStockAdjustProps {
    id: number,
    refNo: string,
    date: Date,
    tenantId: 0,
    file: string,
    notes: string,
    detail: IStockAdjustDetailProps[]
}


export interface IStockAdjustFilterProps {
    refNo: string,
    startDate: string,
    endDate: string,
}



