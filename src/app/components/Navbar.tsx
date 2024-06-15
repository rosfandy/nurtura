

export default function Navbar() {
    return (
        <div className="bg-[#57B492]">
            <div className="flex w-full px-4 py-1 items-center justify-between">
                <div className="flex py-3 gap-x-2">
                    <div className="h-auto w-[5vh] ">
                        <img src="/logo.png" alt="" />
                    </div>
                    <div className="flex items-center">
                        <div className="font-bold text-lg">
                            <span className='text-white'>Nurtura</span>
                            <span className='text-[#002623] '>Grow</span>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="h-auto w-[5vh] ">
                        <img src="/profile.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}