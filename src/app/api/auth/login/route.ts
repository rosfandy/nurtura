import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const response = await axios.post('http://103.183.75.231/auth/login', {
            email,
            password
        });

        cookies().set("token", response.data.token)
        cookies().set("id_user", response.data.user.id)

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
