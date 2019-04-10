import axios from 'axios/index';

export const homeURL = (process.env.REACT_APP_DEBUG === 'True')
    ? `http://${window.location.host.split(':', 1)[0]}:8000`
    : '';

const instance = axios.create({
    baseURL: `${homeURL}/api/`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        // 'Access-Control-Allow-Credentials': true
        // 'Access-Control-Allow-Headers': '*',
        // 'Access-Control-Allow-Methods': '*'
    },
    credentials: 'same-origin'
});

/**
 * Return result of API call or raise error with JSON response data
 * @param  {Function} wrapped Async API call.
 * @return {Array, Object} Parsed JSON data.
 */
function call(wrapped) {
    return async function () {
        try {
            const result = await wrapped.apply(this, arguments);
            return result.data;
        } catch (e) {
            const {response} = e;
            if (response && /json/i.test(response.headers['content-type'])) {
                e.data = response.data;
            }
            throw e;
        }
    }
}

// base API methods
export const get = (url, params) => call(instance.get)(url, {params});
const getList = (url, {filters = {}, search = null, ...others}) => get(url, {...filters, ...others, search});
const post = (url, params) => call(instance.post)(url, params);
const patch = (url, params) => call(instance.patch)(url, params);
const del = (url, params = {}) => call(instance.delete)(url, {params});

// messages
export const getMessages = (params) => getList('/messages/', {params});


export function connectToChat(onOpen = console.log, onMessage, onError, onClose) {
    const path = `${homeURL}/chat_ws`;
    const socketRef = new WebSocket(path);
    socketRef.onopen = onOpen;
    socketRef.onmessage = m => {
        const parsedData = JSON.parse(m.data);
        onMessage(parsedData);
    };
    socketRef.onerror = e => {
        onError(e.message);
    };
    socketRef.onclose = () => {
        onClose();
    };
    return socketRef;
}
