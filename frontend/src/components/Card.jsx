import React from "react";
import Text from "./Text";

const Card = ({ heading, info, side, classNames, active }) => {
  if (active) {
    return (
      <div
        class={`w-full h-24  p-4 flex flex-row justify-between rounded-2xl border-secondary border bg-secondary bg-opacity-5 shadow-lg ${classNames}`}
      >
        <div class="flex flex-col justify-between">
          <Text type="paragraph-strong">{heading}</Text>
          <Text type="paragraph">{info}</Text>
        </div>
        <Text type="paragraph">{side}</Text>
      </div>
    );
  } else {
    return (
      <div
        class={`w-full h-24  p-4 flex flex-row justify-between rounded-2xl  bg-white shadow-lg ${classNames}`}
      >
        <div class="flex flex-col justify-between">
          <Text type="paragraph-strong">{heading}</Text>
          <Text type="paragraph">{info}</Text>
        </div>
        <Text type="paragraph">{side}</Text>
      </div>
    );
  }
};

export default Card;
