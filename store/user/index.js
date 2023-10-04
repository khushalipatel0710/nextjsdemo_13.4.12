
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



export const fetchData = createAsyncThunk('appUser/fetchData', async data => {
    console.log("data__________",data);
 

  return {
      data: data,
    
  }
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    
   
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      console.log(action.payload,"Dfdsds")
      state.data = action.payload?.data
      
    })
     
  }
})


export default appUsersSlice.reducer
