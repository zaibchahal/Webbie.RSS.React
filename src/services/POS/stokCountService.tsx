import React from 'react';
import { STOCKCOUNT_URLS } from '../../common/RssData/constants';
import api, { IResponseProp } from '../baseService';

export const getList = async (filter: IStockCountFilterProps) => {
    try {
        const response = await api.get(STOCKCOUNT_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IStockCountProps[];
    } catch {
        return [] as IStockCountProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(STOCKCOUNT_URLS.Get + '?id=' + id);
        return (response.data.result) as IStockCountProps;
    } catch {
        return {} as IStockCountProps;
    }
};

export const creatUpdate = async (testProp: IStockCountProps) => {
    try {
        const response = await api.post(STOCKCOUNT_URLS.CreatUpdateStockCount, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IStockCountDetailProps {
    productId: number,
    expected: 0,
    counted: 0,
    productName: string,
    description: string,
    CountID: number,
    id: number,

}

export interface IStockCountProps {
    id: number,
    refNo: string,
    date: Date,
    tenantId: 0,
    file: string,
    notes: string,
    detail: IStockCountDetailProps[]
}


export interface IStockCountFilterProps {
    refNo: string,
    startDate: Date,
    endDate: Date,
}



