import { createSlice } from '@reduxjs/toolkit';
import { initialSession, initialUser } from '../../common/RssData/userSessionService';

const InitialState = {
	isLoading: true,
	test: '',
	Session: initialSession,
	User: initialUser,
};
export interface ICategory {
	id: number;
	tenantId: number;
	title: string;
}

export const sessionSlice = createSlice({
	name: 'session',
	initialState: InitialState,
	reducers: {
		UpdateSession: (state, action) => {
			state.Session = action.payload;
		},
		UpdateUser: (state, action) => {
			state.User = action.payload;
		},
		UpdateTest: (state, action) => {
			state.test = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { UpdateSession, UpdateUser, UpdateTest } = sessionSlice.actions;
export default sessionSlice.reducer;
