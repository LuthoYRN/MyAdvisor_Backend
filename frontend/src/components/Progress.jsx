import React from 'react';

const Progress = ({classNames}) => {
    return (
        <div class={"flex " + classNames}>
            <div class="flex w-12 h-12 rounded-full bg-blue-950 justify-center items-center text-white text-center">1</div>
            <div class="w-12 h-[2px] bg-gray-500 my-auto"></div>
            <div  class="flex w-12 h-12 rounded-full border border-gray-500 justify-center items-center text-center">2</div>
            <div class="w-12  h-[2px] bg-gray-500 my-auto"></div>
            <div  class="flex w-12 h-12 rounded-full border border-gray-500 justify-center items-center  text-center">3</div>
        </div>
    );
};


export default Progress;