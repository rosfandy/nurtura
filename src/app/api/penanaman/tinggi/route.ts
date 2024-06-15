import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    // Check for proper authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const token = authHeader.split(' ')[1];

    // Get the JSON body from the request
    const bodyData = await request.json();
    console.log(bodyData)
    // Post the data to the external API
    const response = await axios.put(`http://103.183.75.231/penanaman/tinggi`, bodyData, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        validateStatus: function (status) {
            return status >= 200 && status < 500; // Handle all statuses from 200 to 499 as valid responses
        }
    });

    // Handle specific response scenarios
    if (response.status === 404) {
        return new NextResponse(JSON.stringify({ error: "Data not found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Return the response from the external API
    return new NextResponse(JSON.stringify(response.data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
