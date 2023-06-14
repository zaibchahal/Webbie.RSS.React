import React from 'react';
import { BANKS_ACCOUNT_URLS, BANKS_URLS } from '../common/RssData/constants';
import api from './baseService';

export const getList = async (BankID: number) => {
    try {
        const response = await api.get(BANKS_ACCOUNT_URLS.GetList + '?BankID=' + BankID);
        return (response.data.result.items || []) as IBankAccountProps[];
    } catch {
        return [];
    }
};
export const getDetailList = async (BankID: number) => {
    try {
        const response = await api.get(BANKS_ACCOUNT_URLS.GetDetailList + '?BankID=' + BankID);
        return (response.data.result || []) as IBankAccountDetailProps[];
    } catch {
        return [];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(BANKS_ACCOUNT_URLS.Get + '?id=' + id);
        return (response.data.result) as IBankAccountDetailProps;
    } catch {
        return {} as IBankAccountDetailProps;
    }
};

export const creatUpdate = async (testProp: IBankAccountProps) => {
    try {
        const response = await api.post(BANKS_ACCOUNT_URLS.CreatUpdateBankAccounts, testProp);
        return response.data.result;
    } catch {
        return 0;
    }
};


export interface IBankAccountProps {

    title: string,
    bankID: number,
    currency: string,
    bankName: string,
    ownerID: number,
    openingBalance: number | string,
    pic: string,
    id: number

}


export interface IBankAccountDetailProps extends IBankAccountProps {

    balance: number,
    lastCashIn: number,
    lastCashOut: number,
    lastTransaction: Date,
}


export interface IBankAccounts {
    [bankID: number]: IBankAccountDetailProps[];
}



