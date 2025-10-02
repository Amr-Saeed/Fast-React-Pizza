import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./Features/User/userSlice" // ! we can name it anything
import cartReducer from "./Features/Cart/cartSlice" // ! we can name it anything
const store = configureStore(
    {
        reducer: {
            user: userReducer,
            cart: cartReducer,
        }
    }
)

export default store;