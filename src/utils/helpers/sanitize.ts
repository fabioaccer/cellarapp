export const sanitizeString = (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

export const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
};