import React from 'react';
import Swal from 'sweetalert2';
import { PRODUCT_URLS } from '../../common/RssData/constants';
import api from '../baseService';

export const getList = async (filter: IProductFilterProps) => {
    try {
        const response = await api.get(PRODUCT_URLS.GetList + "?" + new URLSearchParams(filter as any));
        return (response.data.result.items || []) as IProductListProps[];
    } catch {
        return [];
    }
};
export const getDetailList = async (filter: IProductFilterProps) => {
    try {
        const response = await api.get(PRODUCT_URLS.GetDetailList + "?" + new URLSearchParams(filter as any));
        return (response.data.result || []) as IProductProps[];
    } catch {
        return [];
    }
};
export const get = async (id: number) => {
    try {
        const response = await api.get(PRODUCT_URLS.Get + '?id=' + id);
        return (response.data.result) as IProductProps;
    } catch {
        return {} as IProductProps;
    }
};


export const creatUpdateProduct = async (testProp: IProductProps) => {
    try {
        const response = await api.post(PRODUCT_URLS.CreatUpdateProduct, testProp);
        return response.data.result;
    } catch {
        return 0;
    }
};


export interface IProductFilterProps {
    brandID: number,
    catID: number,
    subCatID: number,
    productID: number,
}
export interface IProductProps {
    name: string,
    barcode: string,
    type: string,
    pic: string,
    costPrice: number,
    salePrice: number,
    minInvLevel: number,
    brandID: number,
    catID: number,
    subCatID: number,
    supplierID: number,
    tenantId: number,
    notes: string,
    invNotes: string,
    hideInShop: boolean | undefined,
    nCategory: string,
    nSubCategory: string,
    nBrand: string,
    nSupplier: string,
    id: number | 0,

    balance: number | undefined,
}
export interface IProductListProps {
    name: string,
    barcode: string,
    type: string,
    pic: string,
    costPrice: number,
    salePrice: number,
    minInvLevel: number,
    brandID: number,
    catID: number,
    subCatID: number,
    supplierID: number,
    notes: string,
    invNotes: string,
    hideInShop: boolean | undefined,
    id: number | 0,
}
export interface IProduct {
    [type: string]: IProductProps[];
}



