import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppConst } from '../../common/RssData/constants';
import { IBankAccountProps, IBankAccounts } from '../../services/bankAccountService';

const InitialState = {
    BankAccounts: {} as IBankAccounts,
    selectedAccount: {} as IBankAccountProps
};
export const bankAccountsSlice = createSlice({
    name: AppConst.Slices.BankAccount,
    initialState: InitialState,
    reducers: {
        selectAccount: (state, action) => {
            state.selectedAccount = action.payload;
        },
        LoadAccounts: (state, action) => {
            const { bankID, accounts } = action.payload;
            state.BankAccounts[bankID] = accounts;
        },
        ClearAccounts: (state, action) => {
            const bankID = action.payload;
            delete state.BankAccounts[bankID];
        },
    }
});

// Action creators are generated for each case reducer function
export const { LoadAccounts, ClearAccounts, selectAccount } = bankAccountsSlice.actions;
export default bankAccountsSlice.reducer;
