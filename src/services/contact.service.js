import { callApi } from './base.service';

export const contactService = {
    sendContactForm,
    getMessages,
    getMessageDetail,
    deleteMessage
};

async function sendContactForm(formData) {
    return await callApi('public/contact', {
        method: 'POST',
        data: JSON.stringify(formData)
    });
}

async function getMessages(page = 0, size = 10) {
    return await callApi(`admin/messages?page=${page}&size=${size}`, { method: 'GET' });
}

async function getMessageDetail(id) {
    return await callApi(`admin/messages/${id}`, { method: 'GET' });
}

async function deleteMessage(id) {
    return await callApi(`admin/messages/${id}`, { method: 'DELETE' });
}