import React from 'react';
import Text from './Text';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ status, message, onConfirm }) => {
    let navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              {status}
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
                {message}
            </Text>
            <Button
              text="Close"
              onClick={() => {
                navigate(onConfirm);
              }}
            />
          </div>
        </div>
    );
};

export default ConfirmationModal;