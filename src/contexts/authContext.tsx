import React, { createContext, FC, ReactNode, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IUserProps, ISessionProps } from '../common/RssData/userSessionService';
import { AppConst, PROFILE_URLS } from '../common/RssData/constants';
import axios from 'axios';
import { store } from '../store';
import { UpdateSession, clearSession, UpdateUser, UpdatePic } from '../@features/Authentication/auth.slice';
import { Api } from '../components/icon/material-icons';
import api from '../services/baseService';

export interface IAuthContextProps {
    handleSetSession: (data: ISessionProps, dispatch: any) => void;
    handleSetProfileData: (token: string, dispatch: any) => void;
    handleSetProfilePicture: (token: string | undefined, dispatch: any) => void;
    handleLogout: (dispatch: any) => void;

}
const AuthContext = createContext<Partial<IAuthContextProps>>({});

interface IAuthContextProviderProps {
    children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
    const handleSetSession = useCallback((data: ISessionProps, dispatch: any) => {
        dispatch(UpdateSession(data));
    }, []);

    const handleLogout = (dispatch: any) => {
        dispatch(clearSession());
    };

    const handleSetProfilePicture = useCallback(async (dispatch: any) => {
        try {
            const response = await api.get(PROFILE_URLS.GetProfilePicture);
            var data = `data:image/png;base64,${response.data.result.profilePicture}`;
            dispatch(UpdatePic(data));
        } catch {

        }
    }, []);

    const handleSetProfileData = useCallback(async (token: string, dispatch: any) => {
        try {
            if (!token) {
                token = store.getState().session.Session.accessToken;
            }
            handleSetProfilePicture(dispatch);
            const response = await api.get(PROFILE_URLS.GetCurrentUserProfileForEdit);
            var data = response.data.result;
            dispatch(UpdateUser(data));
        } catch {

        }
    }, [handleSetProfilePicture]);


    const value = useMemo(
        () => ({
            handleSetSession,
            handleSetProfileData,
            handleSetProfilePicture,
            handleLogout
        }),
        [handleSetSession, handleSetProfileData, handleSetProfilePicture],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
