import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, context: any) {
    // Extract the Authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    // Ensure the Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Additional context information
    const { params } = context;
    const { id_user } = params;

    const response = await axios.get(`http://103.183.75.231/sensor/data?id_user=${id_user}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        validateStatus: function (status) {
            return status >= 200 && status < 500; // Ini akan menangani semua status dari 200 hingga 499 sebagai respons yang valid
        }
    });

    if (response.status === 404) {
        return new NextResponse(JSON.stringify({ error: "Data not found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new NextResponse(JSON.stringify(response.data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
