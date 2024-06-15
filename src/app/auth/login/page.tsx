'use client'
import LoginForm from "@/app/components/Form/LoginForm"
import { AuthProvider } from "../AuthContext"

export default function login() {
    return (
        <div className='min-h-screen bg-[#57B492] '>
            <div className="min-h-screen flex justify-center items-center">
                <div className="">
                    <div className="flex justify-center items-center gap-x-2">
                        <div className="w-[8vh]">
                            <img className='' src="/logo.png" alt="Logo" />
                        </div>
                        <div className="font-bold text-2xl">
                            <span className='text-white'>Nurtura</span>
                            <span className='text-[#002623] '>Grow</span>
                        </div>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}