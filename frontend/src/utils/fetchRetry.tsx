function wait(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function fetchRetry(
    url: string,
    delay: number,
    tries: number,
    fetchOptions: RequestInit = {}
): Promise<Response> {
    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (err) {
        const triesLeft = tries - 1;
        if (!triesLeft) {
            throw err;
        }
        await wait(delay);
        return fetchRetry(url, delay, triesLeft, fetchOptions);
    }
};