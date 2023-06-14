import React from 'react';
import { BILL_URLS, BANKS_URLS } from '../common/RssData/constants';
import api, { IResponseProp } from './baseService';

export const getList = async (filter: IBillPaymentFilterProps) => {
    try {
        const response = await api.get(BILL_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IBillPaymentDetailProps[];
    } catch {
        return [] as IBillPaymentDetailProps[];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(BILL_URLS.Get + '?id=' + id);
        return (response.data.result) as IBillPaymentProps;
    } catch {
        return {} as IBillPaymentProps;
    }
};

export const creatUpdate = async (testProp: IBillPaymentProps) => {
    try {
        const response = await api.post(BILL_URLS.CreatUpdate, testProp);
        return response.data as IResponseProp;
    } catch {
        return { success: false } as IResponseProp;
    }
};


export interface IBillPaymentDetailProps {
    id: number,
    billType: string,
    otherBillType: string,
    refNo: string,
    billAmount: number,
    billLastDate: Date,
    fees: number,
    billPaymentID: number,
    creationTime: Date,
}
export const initialDetailValues = {
    billAmount: 0,
    billLastDate: new Date(),
    billType: '',
    billPaymentID: 0,
    fees: 0,
    id: 0,
    otherBillType: '',
    refNo: ''
} as IBillPaymentDetailProps;

export interface IBillPaymentProps {
    id: number,
    cashReceived: number,
    cashReturn: number,
    notes: string,
    accountID: number,
    tenantId: number,
    creationTime: Date,
    detail: IBillPaymentDetailProps[]
}


export interface IBillPaymentFilterProps {
    refNo: string,
    accountID: number,
    startDate: Date,
    endDate: Date,
}



