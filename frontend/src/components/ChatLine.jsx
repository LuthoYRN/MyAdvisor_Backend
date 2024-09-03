import React from 'react';
import Text from './Text';

const ChatLine = ({text, type}) => {
    return (
        <div className={`h-fit w-fit py-2 px-4 mb-4 flex flex-row justify-between rounded-2xl ${type === 'chat' ? 'bg-background-200' : type === 'user' ? 'bg-secondary text-white ml-auto' : 'border border-black ml-4 hover:bg-secondary hover:text-white ease-in-out duration-300 hover:border-none cursor-pointer'}`}>
            <Text type="paragraph">{text}</Text>
        </div>
    );
};

export default ChatLine;