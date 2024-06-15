'use client'
import { useState } from 'react';
import fiturItems from './fiturItems';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Fitur() {
    const arrow =
        <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 1L8 8L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    const [activeCard, setActiveCard] = useState(null);
    const toggleActiveCard = (index: any) => {
        if (activeCard === index) {
            setActiveCard(null);
        } else {
            setActiveCard(index);
        }
    };
    const handleLastItemClick = () => {
        console.log("Item terakhir diklik");
    };


    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black py-4 px-8">
            <div className="font-bold text-[#57B492] py-2">Fitur Unggulan</div>
            <div className="flex flex-col gap-y-4">
                {fiturItems.map((item, index) => (
                    <div key={index} className="relative">
                        <div className="bg-white shadow rounded-xl p-4 z-20 relative cursor-pointer">
                            <div className="flex items-center justify-between" onClick={() => index === fiturItems.length - 1 ? handleLastItemClick() : toggleActiveCard(index)}>
                                <div>{item.svg('#57B492')}</div>
                                <div className="font-bold text-black">{item.label}</div>
                                <div>{arrow}</div>
                            </div>
                        </div>
                        {activeCard === index && (
                            <div className="px-2">
                                <div className="bg-[#57B492]  z-10 relative mt-[2px] rounded-b-lg flex flex-col gap-y-2 py-2 px-4 text-white">
                                    {item.additionalContent.map((item, index) =>
                                        <Link key={index} className="cursor-pointer flex" href={item.path}>
                                            <div className=" ">{item.svg}</div>
                                            <div className=" ">{item.label}</div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}