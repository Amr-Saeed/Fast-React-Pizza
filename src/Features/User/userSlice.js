import { getAddress } from "../../Services/apiGeocoding";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


//! this function takes two arguments first is the action name second is the async function
//! it gves us three states pending, fulfilled, rejected that we need to handle them down with our reducers
export const fetchAddress = createAsyncThunk("user/fetchAddress", async function () {
  //! 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  //! 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  //! 3) Then we return an object with the data that we are interested in
  // this is the payload of the FULLFILLED state
  return { position, address };
})



// ! here we will make a slice from Redux toolkit as this user will be a GLOBAL UI STATE it will be used in many components


const initialState = {
  userName: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.userName = action.payload
    }
  },
  //! here this is the states that comes from the CreateAsyncFunction

  //! this add case takes two argument first the state second the action function
  //! and here we make a chain of addCase
  extraReducers: (builder) => builder.addCase(fetchAddress.pending, (state) => { state.status = "loading" })
    .addCase(fetchAddress.fulfilled, (state, action) => {
      state.position = action.payload.position
      state.address = action.payload.address
      state.status = "idle"
    }).addCase(fetchAddress.rejected, (state, action) => {
      state.status = "error"
      state.error = `${action.error.message}. Please allow location access and enter address manually.`
    })

})

export default userSlice.reducer;

export const { updateName } = userSlice.actions;