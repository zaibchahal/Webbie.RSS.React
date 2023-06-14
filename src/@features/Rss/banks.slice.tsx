import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppConst } from '../../common/RssData/constants';
import { IBankProps, IBanks } from '../../services/bankService';

const InitialState = {
    Banks: {} as IBanks,
    selectedBank: {} as IBankProps
};
export const banksSlice = createSlice({
    name: AppConst.Slices.Bank,
    initialState: InitialState,
    reducers: {
        selectBank: (state, action) => {
            state.selectedBank = action.payload;
        },
        LoadBanks: (state, action) => {
            const { type, banks } = action.payload;
            state.Banks[type] = banks;
        },
        ClearBanks: (state, action) => {
            const type = action.payload;
            delete state.Banks[type];
        },
    }
});

// Action creators are generated for each case reducer function
export const { LoadBanks, ClearBanks, selectBank } = banksSlice.actions;
export default banksSlice.reducer;
