const config = window['runConfig'] || { apiUrl: 'http://localhost:8080/circulyapp' };
export const apiUrl = config.apiUrl;

export async function callApi(serviceName, options = {}) {
    return await _callApi(serviceName, options);
}

async function _callApi(serviceName, options) {
    let method = options.method || 'GET';
    let headers = {};

    if (!serviceName.startsWith("auth")) {
        const storageData = localStorage.getItem('AuthStorage');
        if (storageData) {
            const userData = JSON.parse(storageData);
            const token = userData?.user?.token;
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
    }

    if (options.contentType === "form-data") {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (options.contentType !== "multipart") {
        headers["Content-Type"] = "application/json";
    }

    const requestOptions = {
        method: method,
        headers: headers,
        body: options.data
    };

    try {
        const response = await fetch(`${apiUrl}/${serviceName}`, requestOptions);

        if (response.status === 204) return Promise.resolve(true);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('AuthStorage');
                window.location.href = '/auth';
                return Promise.reject({ message: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.' });
            }

            const errorText = await response.text();
            let errorData;
            try { errorData = errorText ? JSON.parse(errorText) : {}; } catch(e) { errorData = errorText; }
            return Promise.reject(errorData);
        }

        const text = await response.text();
        let data = {};
        if (text) {
            try {
                data = JSON.parse(text);
            } catch(e) {
                data = text;
            }
        }
        return Promise.resolve(data);

    } catch (err) {
        return Promise.reject(err.message || 'Network error');
    }
}