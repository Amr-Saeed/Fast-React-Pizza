import { useDispatch, useSelector } from "react-redux";
import Button from "../../Ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityByID } from "../Cart/cartSlice";
import DeleteItem from "../Cart/DeleteItem";
import UpdateItemQuantity from "../Cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  //! what he wants here is to show the delete button in the menuItem if it's quantity is zero otherwise show the AD to Cart button
  //! but we only in cart slice have an action that gives us the whole totat quantity of the cart so now we need to get the quantity of each item by ID

  //! both of those are to render the buttons of delete and add to cart conditionally
  const currentQuantity = useSelector(getCurrentQuantityByID(id));
  const isInCart = currentQuantity > 0;

  const dispatch = useDispatch();
  function handleAddToCart() {
    // ! always when you need to add something to the cart you need to send data to an array of objects so you need to make this object by exactly the same shape and name where it comes from the api

    const newPizza = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };

    dispatch(addItem(newPizza)); //! now i passed this action.payload which is the new pizza we got to add it to the cart array
  }

  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? "opacity-70 grayscale" : ""}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {isInCart && (
            <div className="flex items-center gap-3 sm:gap-8">
              <UpdateItemQuantity pizzaId={id} />
              <DeleteItem pizzaId={id} />
            </div>
          )}

          {!soldOut && !isInCart && (
            <Button onClick={handleAddToCart} type="small">
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
