import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

//! just reusable comp to delete pizza from two pages MenuItem and CartItem
function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => {
        console.log(pizzaId);
        dispatch(deleteItem(pizzaId));
      }}
      type="small"
    >
      Delete
    </Button>
  );
}

export default DeleteItem;
