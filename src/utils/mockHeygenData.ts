export function getMockData(key: string, content: string) {
    console.log(key, content);
    return Promise.resolve({data: content});
}

export function mockHeygenToken(data: any) {
    console.log(data);
    return Promise.resolve({token: data})
}