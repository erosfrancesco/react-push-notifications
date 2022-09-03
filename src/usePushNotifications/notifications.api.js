import axios from 'axios';

const host = process.env.REACT_APP_NOTIFICATIONS_URL;

const post = (path, body) => {
    return axios.post(`${host}${path}`, JSON.stringify(body))
    .then(res => res.data);
}

// API calls
export const subscribeTo = (sub, topic) => post(`/subscribe/${topic}`, sub);
export const sendNotificationTo = (topic, message) => post(`/send/${topic}`, message);