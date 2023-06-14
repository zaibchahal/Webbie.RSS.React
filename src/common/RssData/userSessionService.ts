import React, { useState, useContext, ReactNode } from 'react';
import { TColor } from '../../type/color-type';
import UserImage from '../../assets/img/wanna/wanna1.png';
import UserImageWebp from '../../assets/img/wanna/wanna1.webp';
import { IServiceProps } from '../data/serviceDummyData';

export interface IUserProps {
    id: string;
    name: string;
    surname: string;
    userName: string;
    password: string;
    emailAddress: string;
    phoneNumber: string;
    isPhoneNumberConfirmed: boolean;
    timezone: string;
    qrCodeSetupImageUrl: string;
    isGoogleAuthenticatorEnabled: boolean;

    src: '';
    srcSet: string;
    isOnline: boolean;
    isReply?: boolean;
    color: TColor;
    username: string;
    address: string;
    position: string;
    email?: string;
    fullImage?: string;
    services?: IServiceProps[];
}
export interface ISessionProps {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    shouldResetPassword: boolean;
    passwordResetCode: string;
    userId: number;
    requiresTwoFactorVerification: boolean;
    twoFactorRememberClientToken: string;
    returnUrl: string;
    refreshToken: string;
    refreshTokenExpireInSeconds: number;
    twoFactorAuthProviders: string[];
}


//#region Dummy
const john: IUserProps = {
    id: '1',
    userName: 'admin',
    name: 'Admin',
    surname: 'Doe',
    emailAddress: 'john@omtanke.studio',
    isPhoneNumberConfirmed: true,
    isGoogleAuthenticatorEnabled: true,
    timezone: 'New Yark',
    phoneNumber: '+3645868455',
    qrCodeSetupImageUrl: '',
    password: '123qwe',

    username: 'admin',
    position: 'CEO, Founder',
    email: 'john@omtanke.studio',
    src: UserImage,
    srcSet: UserImageWebp,
    isOnline: true,
    isReply: true,
    color: 'primary',
    address: 'New Yark',
};

const grace: IUserProps = {
    id: '2',
    userName: 'user',
    name: 'Grace',
    surname: 'Buckland',
    emailAddress: 'john@omtanke.studio',
    isPhoneNumberConfirmed: true,
    isGoogleAuthenticatorEnabled: true,
    timezone: 'New Yark',
    phoneNumber: '+3645868455',
    qrCodeSetupImageUrl: '',
    password: '123qwe',

    username: 'admin',
    position: 'CEO, Founder',
    email: 'john@omtanke.studio',
    src: UserImage,
    srcSet: UserImageWebp,
    isOnline: true,
    isReply: true,
    color: 'primary',
    address: 'New Yark',
};

const USERS: { [key: string]: IUserProps } = {
    JOHN: john,
    GRACE: grace,
    CHLOE: john,
    JANE: john,
    RYAN: john,
    ELLA: john,
    SAM: john,
};

export function getUserDataWithuserName(userName: string): IUserProps {
    // @ts-ignore
    return USERS[Object.keys(USERS).filter((f) => USERS[f].userName.toString() === 'admin')];
}

export function getUserDataWithId(id?: string): IUserProps {
    // @ts-ignore
    return USERS[Object.keys(USERS).filter((f) => USERS[f].id.toString() === '1')];
}
export default USERS;

//#endregion
