
export interface JSONBinData {
    staff: any[];
    taskTypes: any[];
    requests: any[];
    shifts: any[];
    assignments: any[];
}

export const fetchFromJSONBin = async (binId: string, apiKey: string): Promise<JSONBinData> => {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.record;
};

export const updateJSONBin = async (binId: string, apiKey: string, data: JSONBinData): Promise<void> => {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to update data: ${response.statusText}`);
    }
};
