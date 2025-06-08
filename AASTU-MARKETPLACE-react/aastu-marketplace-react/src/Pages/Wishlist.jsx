import "../CSS/Wishlist.css";

import WishlistHeader from "../Components/wishlist/wishlistheader";
import Wishlisted from "../Components/wishlist/wishlisted";

import ThisMonthHeader from "../Components/wishlist/header2";
const Wishlist = () => {
  return (
    <div className="">
      <WishlistHeader />
      <Wishlisted />
      <ThisMonthHeader />
      <Wishlisted />
    </div>
  );
};

export default Wishlist;
