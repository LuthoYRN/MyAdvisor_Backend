import React from 'react';
import Text from './Text';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const ConfirmationModal = ({ status, message, onConfirm, close }) => {
    let navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              {status}
            </Text>
            <div className="flex max-w-64 flex-wrap">
            <Text  classNames="mb-8">
                {message}
            </Text>
            </div>
            <Button
              text="Close"
              onClick={() => {
                navigate(onConfirm);
                close();
              }}
            />
          </div>
        </div>
    );
};

export default ConfirmationModal;