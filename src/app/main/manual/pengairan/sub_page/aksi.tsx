import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';

export default function AksiPengairan(param: any) {
    const { id_penanaman } = param
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const id_user = Cookies.get('id_user');
        const token = Cookies.get('token');
        if (!id_user || !token) {
            console.log('Authentication details are missing');
            return;
        }

        const axiosConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: (status: any) => status < 500
        };

        try {
            const response = await axios.get(`/api/pengairan/sop/${parseInt(id_penanaman)}`, axiosConfig);
            if (response.status === 200) {
                console.log(response.data.data);
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="">
            <div className="">{id_penanaman}</div>
        </div>
    )
}