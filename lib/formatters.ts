export function getInitials(name: string | null | undefined): string {
    if (!name || typeof name !== 'string') {
        return "";
    }
    
    return name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function formatDateTime(date: string | Date): string {
    if (!date) {
        return "";
    }
    
    try {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
}

export function queryStringFormatter(searchParamsObj: { [key: string]: string | string[] | undefined }): string {
    if (!searchParamsObj || typeof searchParamsObj !== 'object') {
        return "";
    }
    
    let queryString = "";
    const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
        if (Array.isArray(value)) {
            return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        }
        else if (value !== undefined && value !== null && value !== "") {
            return `${key}=${encodeURIComponent(value.toString())}`;
        }
        return "";
    });
    queryString = queryArray.filter((q) => q !== "").join("&");
    return queryString;
}

