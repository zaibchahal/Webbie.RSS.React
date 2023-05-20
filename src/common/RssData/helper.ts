




export const getCookie = (name: string) => {
    const cookies = document.cookie.split('; ');
    const cookieName = `${name}=`;
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith(cookieName)) {
            return cookies[i].substring(cookieName.length);
        }
    }
    return '';
};


export const setCookie = (name: any, value: any, days: number) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};