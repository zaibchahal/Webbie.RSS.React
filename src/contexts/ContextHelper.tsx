import React, { useEffect } from 'react';
import { ISessionProps } from '../common/RssData/userSessionService';
import { useDispatch } from 'react-redux';
import { UpdateSession } from '../@features/Authentication/auth.slice';

const ContextHelper = ({ data }: { data: ISessionProps }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(UpdateSession(data));
    }, [dispatch, data]);
    return <div></div>;
};

export default ContextHelper;
