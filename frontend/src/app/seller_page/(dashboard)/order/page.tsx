import React from "react";
import Image from 'next/image'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Tab from "./tab";
import SearchBar from "./searchbar";
import OrderList from "./order_list";

function SellerPageOrder() {
  return (
    <>
      <div className="sticky mx-auto w-1/2 mt-5 overflow-x-auto flex-1">
        <SearchBar />
        <Tab />
      </div>
      <div className="mx-auto w-1/2 mt-5">
        0 Orders
      </div>
    </>
  );
}
export default SellerPageOrder;