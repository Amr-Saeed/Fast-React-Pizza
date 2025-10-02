import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []

    // cart: [{
    //     pizzaId: 12,
    //     name: "pizzaila",
    //     quantity: 2,
    //     unitPrice: 16,
    //     totalPrice: 32,
    // }]
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            // payload = item (cart object)
            state.cart.push(action.payload) //! add to the array using push
        },
        deleteItem(state, action) {
            // payload = pizzaId
            state.cart = state.cart.filter(item => item.pizzaId !== action.payload) //! here we update the start.cart by adding to it the new array after removing the pizza
        },
        incrementQuantity(state, action) {
            // payload = pizzaId
            const pizzaObj = state.cart.find(item => item.pizzaId === action.payload) //! here we first need to find the pizza as we will send an id to the pizza we want to inc so we find this pizza obj
            pizzaObj.quantity++
            pizzaObj.totalPrice = pizzaObj.quantity * pizzaObj.unitPrice
        },
        decrementQuantity(state, action) {
            // payload = pizzaId
            const pizzaObj = state.cart.find(item => item.pizzaId === action.payload) //! here we first need to find the pizza as we will send an id to the pizza we want to inc so we find this pizza obj
            pizzaObj.quantity--
            pizzaObj.totalPrice = pizzaObj.quantity * pizzaObj.unitPrice

            //! here we want if quantity is 1 we click on - it will become aero so we need to delete the whole items
            //! so we called this caseReducers this caseReducers is in the real that contain all of out functions like addItem and so on
            //! we use it because it's used when we need To call one reducer from or inside another
            if (pizzaObj.quantity === 0) cartSlice.caseReducers.deleteItem(state, action)
        },
        clearCart(state, action) {
            state.cart = []
        },
    }
})

export const { addItem, deleteItem, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;




//----------------------------Selectors------------------------------------------------
//! also when Redux recommended to put the big selector functions here it says they will make performance issues because of re-renders and so on so they made a library that manages the selector called (Reselect)

export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
    state.cart.cart.reduce((sum, pizzaItem) => sum + pizzaItem.quantity, 0)
// state.cart.cart.length
export const getTotalCartPrice = (state) =>
    state.cart.cart.reduce((sum, pizzaItem) => sum + pizzaItem.totalPrice, 0)

//! here we are like have two functions one takes id return func2 that takes state and return quantity that is because useSelector expects func that take state
//! here if there is no quantity we make it with 0

//! look at this function that is the shorthand of the func down it just function that returns a function
export const getCurrentQuantityByID = (id) => (state) => state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;


// export function gsetCurrentQuantityByID(id) { return (state) => { state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0 } };
// export function gsetCurrentQuantityByID(id) { return function(state) { state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0 } };