import React from 'react';
import { ACCTRANSACTION_URLS, BANKS_URLS } from '../common/RssData/constants';
import api, { IResponseProp } from './baseService';

export const getList = async (filter: IAccTransactionFilterProps) => {
    try {
        const response = await api.get(ACCTRANSACTION_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IAccTransactionProps[];
    } catch {
        return [] as IAccTransactionProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(ACCTRANSACTION_URLS.Get + '?id=' + id);
        return (response.data.result) as IAccTransactionProps;
    } catch {
        return {} as IAccTransactionProps;
    }
};

export const creatUpdate = async (testProp: IAccTransactionProps) => {
    try {
        const response = await api.post(ACCTRANSACTION_URLS.CreatUpdate, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IAccTransactionProps {

    tenantId: number,
    cashType: string,
    transType: string,
    tid: string,
    accountID: number,
    amount: number,
    netAmount: number,
    number: string,
    comm: number,
    profit: number,
    pay: number,
    collect: number,
    balance: number,
    notes: string,
    creationTime: Date,
    id: number


}
export interface IAccTransactionFilterProps {
    tid: string,
    accountID: number,
    number: string,
    startDate: Date,
    endDate: Date,
}



