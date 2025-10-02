import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../Utils/helpers";

function CartOverview() {
  // ! redux recommend to write this big selector function inside the cart slice so we will move it there
  // const totalCartQuantity = useSelector((state) =>
  //   state.cart.cart.reduce((sum, pizzaItem) => sum + pizzaItem.quantity, 0)
  // );

  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  console.log("totalCartQuantity", totalCartQuantity);

  if (!totalCartQuantity) return; //! need to remove this black bottom bar if there is no pizza in the cart
  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
