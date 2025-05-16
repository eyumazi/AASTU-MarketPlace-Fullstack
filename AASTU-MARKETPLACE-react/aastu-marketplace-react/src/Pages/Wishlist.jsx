import "../CSS/Wishlist.css";

import ItemSales from "../Components/home/item";
import WishlistHeader from "../Components/wishlist/wishlistheader";
import ThisMonthHeader from "../Components/wishlist/header2";
const Wishlist = () => {
  return (
    <div className="">
      <WishlistHeader />
      <ItemSales />
      <ThisMonthHeader />
      <ItemSales />
    </div>
  );
};

export default Wishlist;
