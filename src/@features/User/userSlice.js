import { createSlice } from '@reduxjs/toolkit'

const InitialState = {
  name: 'Aqib Ali',
  isLoading: true,
  users: [],
  loggedInUser: {},
  initialUser: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState: InitialState,
  reducers: {
    UpdateName: (state, action) => {
      state.name = action.payload
    },
    updateLoginUser: (state, action) => {
      state.loggedInUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    // .addCase(userLogin.pending, (state, {type, payload}) => {
    //   state.isLoading = true
    // })
    // .addCase(userLogin.fulfilled, (state, action) => {
    //   state.loggedInUser = action.payload.user
    //   state.isLoading = false
    // })
    // .addCase(userLogin.rejected, (state) => {
    //   state.isLoading = false
    // })
  },
})

// Action creators are generated for each case reducer function
export const { UpdateName, updateLoginUser } = userSlice.actions
export default userSlice.reducer
