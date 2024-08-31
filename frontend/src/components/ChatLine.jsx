import React from 'react';
import Text from './Text';

const ChatLine = ({text, type}) => {
    return (
        <div className={`h-fit w-fit py-2 px-4 flex flex-row justify-between rounded-2xl ${type === 'chat' ? 'bg-background-200' : type === 'user' ? 'bg-secondary text-white ml-auto' : 'border border-black ml-auto'}`}>
            <Text type="paragraph">{text}</Text>
        </div>
    );
};

export default ChatLine;