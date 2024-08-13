import React from 'react';

const Text = ({ type, children, classNames }) => {
    let Element;
    
    switch (type) {
        case 'heading':
            Element = 'h1';
            break;
        case 'subheading':
            Element = 'h2';
            break;
        case 'paragraph':
            Element = 'p';
            break;
        default:
            Element = 'p';
    }
    
    return <Element class={classNames}>{children}</Element>;
};

export default Text;