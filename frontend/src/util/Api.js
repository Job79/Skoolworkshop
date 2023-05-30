export class API {
    /**
     * Req executes a http request and returns the response.
     * @param url http destination url
     * @param token bearer token
     * @param method http method (POST, PUT etc...)
     * @param body body of request
     * @param headers additional headers of request
     * @returns {Promise<{response: *, ok: boolean, status: number}>}
     */
    static async Req (method, url, { body = null, headers = new Headers() } = {}) {
        try {
            const response = await fetch(url, { headers, method, body })
            const contentType = response.headers.get('content-type')
    
            let parsedResponse;
            if (contentType && contentType.indexOf('application/json') !== -1) {
                parsedResponse = await response.json();
            } else {
                parsedResponse = await response.text();
            }
    
            return {
                response: parsedResponse,
                ok: response.ok,
                status: response.status
            }
        } catch (error) {
            console.error('Error during API request:', error);
            return {
                response: null,
                ok: false,
                status: 500,
                error: error.message,
            }
        }
    }
    
}
