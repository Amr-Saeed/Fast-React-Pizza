import { useFetcher } from "react-router-dom";
import Button from "../../Ui/Button";
import { updateOrder } from "../../Services/apiRestaurant";

function UpdateOrder() {
  //! here we need to write to the data that we have from the api we need to change the priority to true by clicking a button
  //! we will do this again using useFetcher but we will not use Load we will use Form to write on the data
  //! difference between this fetcher form and the form from react router is that this form will not cause a navigation to another page it just make re-validation
  //! what is meant by re-validation is that react router will know that the data has changed because of an action function that was called by this form
  //! so it will call the loader function (re-fetch data) again to get the updated data then it will re-render the component with the updated data
  const fetcher = useFetcher();

  return (
    //! diff between PUT and PATCH is that PUT will replace the whole object with the new one while PATCH will only update the fields that are sent in the request body
    //! like in PUT you must update the whole data like in PATCH you can update only the fields that you want to update
    <fetcher.Form method="PATCH" className="text-right">
      {/* //! name and type must be the same as the one we sent it to the data from the createOrder Page */}
      {/* <input type="tel" className="border p-1" name="phone" /> */}

      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;
//! ofc must named action
export async function action({ request, params }) {
  const data = { priority: true }; //! here we are hardcoding the priority to true because we want to make the order priority when the user clicks the button

  //---------here we are just practicing getting the form data and change the phone number--------------------
  //   const formData = await request.formData();
  //   const phone = formData.get("phone");
  //   const data = { priority: true, phone };
  //   if (phone) data.phone = phone; //! here we are adding the phone to the data object only if it is not empty
  //   console.log("New phone number:", phone);
  //---------here we are just practicing getting the form data and change the phone number--------------------

  await updateOrder(params.orderId, data); //! here we don't need to return anything because we don't need the updated data we just need to re-fetch the data using the loader function
  return null;
}

//! then ofc we need to put this action in the route that we want to use it in
//! in this case we will put it in the order route because we want to update the order
//! as this UpdateOrder is a child of the Order component
