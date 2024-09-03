import React from 'react';

const Container = ({children}) => {
    return (
        <div class="mx-64 h-screen grid grid-cols-12 gap-8">
            {children}
        </div>
    );
};

export default Container;