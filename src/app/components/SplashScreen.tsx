// components/SplashScreen.js
import React from 'react';

const SplashScreen = () => {
    return (
        <div className='min-h-screen bg-[#57B492]'>
            <div className="flex flex-col items-center justify-center min-h-screen gap-y-4">
                <div className="w-[20vh]">
                    <img className='' src="/logo.png" alt="Logo" />
                </div>
                <div className="text-center">
                    <div className="font-bold text-3xl">
                        <span className='text-white'>Nurtura</span>
                        <span className='text-[#002623] '>Grow</span>
                    </div>
                    <div className="text-xl text-[#002623]">
                        By Mobile
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
