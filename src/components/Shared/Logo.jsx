import React from 'react';

const Logo = () => {
    return (
        <div className='flex items-center md:relative justify-center'>
            <img className='w-22 h-22 hidden md:block' src="https://i.ibb.co.com/bMgyZ3YD/Chat-GPT-only-Image-Dec-7-2025-10-42-20-AM.png" alt="" />
            <h2 className='text-4xl font-bold md:absolute md:left-18 md:top-5'>StyleDecor</h2>
        </div>
    );
};

export default Logo;