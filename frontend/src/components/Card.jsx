import React from 'react';
import Text from './Text';

const Card = ({heading, info, side}) => {
    return (
        <div class="w-full h-24  p-4 flex flex-row justify-between rounded-2xl shadow-lg">
            <div class="flex flex-col justify-between">
            <Text type="paragraph-strong">{heading}</Text>
            <Text type="paragraph">{info}</Text>
            </div>
            <Text type="paragraph">{side}</Text>
        </div>
    );
};

export default Card;