import React from "react";
import Menu from "../components/Menu";

const Main = ({ children, userType, activeMenuItem }) => {
  return (
    <div class="flex m-10 gap-10 my-auto py-10 h-svh">
      <div class="col-span-2 row-span-10 max-w-80">
        <Menu userType={userType} activeMenuItem={activeMenuItem} />
      </div>
      <div class="w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Main;
