import React from 'react';

const Container = ({children}) => {
    return (
        <div class="mx-64 my-12 h-full grid grid-cols-12">
            {children}
        </div>
    );
};

export default Container;