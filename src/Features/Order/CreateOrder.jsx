import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { createOrder } from "../../Services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Ui/Button";
import { clearCart, getCart, getTotalCartPrice } from "../Cart/cartSlice";
import { formatCurrency } from "../../Utils/helpers";
import EmptyCart from "../Cart/EmptyCart";
import store from "../../store";
import { fetchAddress } from "../User/userSlice";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigate = useNavigation();
  const formErrors = useActionData(); // to get the errors from the action function
  const {
    userName,
    status: addressStatus,
    position,
    address,
    error,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === "loading";
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const dispatch = useDispatch();
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const isSubmitting = navigate.state === "submitting";

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
      {/* //! this form comes from React Router here we don't need to handle
         //! everything by making a states we just need to provide name to each input
        //! and React Router will take care of everything for us */}
      {/* <Form method="post" action="/order/new"> */}
      <Form method="post">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>

          {/* // ! here we use defaultValue not value because if you used value you
              // ! can't change the name in the input field because value make it a
             // ! controlled input and the value will always be the same as the state
            // ! value but defaultValue make it an uncontrolled input and you can
            // ! change it // ! also we use userName from the redux store that we
           // ! created in the CreateUser component */}
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={userName}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              defaultValue={address}
              disabled={isLoadingAddress}
              className="input w-full"
              type="text"
              name="address"
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {error}
              </p>
            )}
            {!position.latitude && !position.longitude && (
              <span className="absolute right-[3px] top-[50%] z-50 md:right-[7px] md:top-[7px] cursor-pointer">
                <Button
                  disabled={isLoadingAddress}
                  type="small"
                  onClick={(e) => {
                    e.preventDefault(); //! as the button is in the form so if i clicked on it this will try to submit the form
                    dispatch(fetchAddress());
                  }}
                >
                  {isLoadingAddress ? "Loading Address..." : "Get Position"}
                </Button>
              </span>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)} //! e.target.checked will give true or false
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          {/* //! here we need to send cart details with the form but we don't need an input field to appear in the ui 
              //! so we can use hidden input field for that
              //! but cart is an array of objects so we need to  convert it to a string first we can't send an array or object directly             in a form or input
              //! so we can use JSON.stringify() to convert it to a string
           */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          {/* //! here also we need to send the position data while we are
          //!sending the order data */}
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

/*
! after submitting the form the action function will be called and it will have the request object that was submitted
! this request contain something called formData() that will return a promise that we can await and get the form data that was submitted
*/
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData); //convert it to object

  const order = {
    ...data,
    cart: JSON.parse(data.cart), //convert it back to array of objects
    priority: data.priority === "true", //!now we make it true because we have used the state with priority that will give ture or false before it the input checkBox gives on or of // true : false, //checkbox value is "on" when checked and undefined when not checked so we need to make it boolean
  };

  //now let's handle some error

  const errors = {}; //empty object we will put some keys and values in it
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please provide a valid phone number";
  }

  if (Object.keys(errors).length > 0) {
    // here checking that the error of phone have been added to the errors object or not
    return errors; //if there are errors return the errors object
  }

  const newOrder = await createOrder(order);

  //! here after creating the order we need to make the cart empty so we need to dispatch the clearCart action but we can't use useDispatch hook here because this is not a component it's a regular func
  //! so there is a hack but we can't overuse it because it will make performance issues
  //! hack to get the store itself here and dispatch the action

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`); //redirect to the order page with the new order id this (redirect comes from react-router-dom)
}

export default CreateOrder;
