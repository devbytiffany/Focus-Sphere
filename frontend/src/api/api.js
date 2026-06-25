const API_URL='https://focus-sphere.onrender.com';
export async function apiRequest(endpoint, method ='GET', body = null, toke = null){
    const headers={'Content-Type': 'application/json'};

    if(token) headers.Authorization= `Bearer ${token}`;

    const response = await fetch(`${API_URL}${ENDPOINT}`, {
        method,
        headers,
        body: body?JSON.stringify(body):null,
    });

    const data= await response.json();
    if(!response.ok){
        throw new Error(data.error || ' Something went wrong');
    }
    return data;
}