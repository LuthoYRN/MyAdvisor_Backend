import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";

/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const AppointmentDetails = () => {
  const [showRecordingModal, setShowRecordingModal] = React.useState(false);

  const handleRecordMeeting = () => {
    setShowRecordingModal(true);
  };

  const handleCloseModal = () => {
    setShowRecordingModal(false);
  };

  return (
    <Main>
      <div className="flex flex-col flex-auto">
        <Text type="heading" classNames="mb-16">
          Appointment Details
        </Text>
        <div class="flex gap-72 flex-auto">
          <div class="flex flex-col w-1/2 justify-between">
            <div>
              <Text type="sm-heading" classNames="mb-4">
                Student
              </Text>
              <Text type="paragraph" classNames="mb-8">
                {/* Replace the placeholder tex with the actual name*/}
                John Doe
              </Text>
              <div className="flex flex-row gap-4 justify-between">
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Date
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {/* Replace the placeholder tex with the actual date*/}
                    12th August 2021
                  </Text>
                </div>
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Time
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {/* Replace the placeholder tex with the actual time*/}
                    12:00 PM
                  </Text>
                </div>
              </div>
              <Text type="sm-heading" classNames="mb-4">
                Reason for Appointment
              </Text>
              <Text type="paragraph" classNames="mb-8">
                {/* Replace the placeholder tex with the actual text*/}
                I’m in my third year, and I’m starting to feel a bit overwhelmed
                with course selection for next semester. I want to make sure I’m
                choosing the right courses that will keep me on track for
                graduation, especially since I need to meet all the
                prerequisites for my major. I’m also interested in exploring
                some elective courses that could help me with my future career
                plans, but I’m not sure which ones would be the best fit. I
                really need some advice on how to balance my workload and manage
                my time better
              </Text>
            </div>
            <div>
              <Button text="Record Meeting" onClick={handleRecordMeeting} />
              <Button text="Back" type="secondary" />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Uploaded Documents
            </Text>
            <div class="flex gap-4 mb-8">
              {/* Replace the placeholder image with the actual document image*/}
              <div>
                <img src="https://via.placeholder.com/150" alt="Student" />
                <Text type="paragraph" classNames="text-center mt-2">
                  Document 1
                </Text>
              </div>
              <div>
                <img src="https://via.placeholder.com/150" alt="Student" />
                <Text type="paragraph" classNames="text-center mt-2">
                  Document 2
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRecordingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Recording Options
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Select which format you would like to record in.
            </Text>
            <div className="flex gap-8 mb-4">
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Video
                </Text>
                <img class="cursor-pointer" src={video} alt="video" />
              </div>
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Text
                </Text>
                <img class="cursor-pointer" src={video} alt="video" />
              </div>
            </div>
            <Button text="Close" onClick={handleCloseModal} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDetails;
