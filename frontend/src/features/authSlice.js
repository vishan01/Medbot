import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    showFitnessData: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{

        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
        setUserFitnessData: (state, action) => {
            state.showFitnessData = action.payload;
        },


    }
});

export default authSlice.reducer;

export const {login, logout, setUserFitnessData} = authSlice.actions;