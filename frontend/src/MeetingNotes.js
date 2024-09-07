import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import Button from "./components/Button.jsx";

/*
    Data Needed:
    - Save Meeting Notes
  */

const MeetingNotes = () => {
  const handleSaveNotes = (
    //TODO: Save notes to the database
  ) => {};

  return (
    <Main>
      <div class="flex flex-col flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Meeting Notes
        </Text>
        <TextArea placeholder="Enter notes here" />
        <div class="flex flex-row gap-8 max-w-md">
        <Button text="Save" onClick={handleSaveNotes} />
        <Button text="Back" type="secondary" />
        </div>
      </div>
    </Main>
  );
};

export default MeetingNotes;
