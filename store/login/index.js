
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



export const login = createAsyncThunk('appLogin/fetchData', async data => {
    console.log("data",data);
//   const response = await axios.post('/api/login', {
//     params
//   })
//   console.log('response', response)

  return {
      data: data,
    
  }
})

export const appLoginSlice = createSlice({
  name: 'appLogin',
  initialState: {
    data: {},
   
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action, 'action')
      state.data = action.payload?.data
    
    })
  }
})

export default appLoginSlice.reducer
