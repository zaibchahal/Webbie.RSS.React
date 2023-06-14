import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppConst } from '../../common/RssData/constants';

const InitialState = {
    SaleID: 0,

};
export const EditSlice = createSlice({
    name: AppConst.Slices.Bank,
    initialState: InitialState,
    reducers: {
        SetSaleID: (state, action) => {
            state.SaleID = action.payload;
        },
    }
});

// Action creators are generated for each case reducer function
export const { SetSaleID } = EditSlice.actions;
export default EditSlice.reducer;
