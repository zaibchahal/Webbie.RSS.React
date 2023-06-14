import { createSlice } from '@reduxjs/toolkit';
import { AppConst } from '../../common/RssData/constants';
import { ITransTypeProp } from '../../common/RssData/TransTypes';

const InitialState = {
    Type: {} as ITransTypeProp,
};
export const transTypeSlice = createSlice({
    name: AppConst.Slices.TransType,
    initialState: InitialState,
    reducers: {
        UpdateType: (state, action) => {
            state.Type = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { UpdateType } = transTypeSlice.actions;
export default transTypeSlice.reducer;
