import axios from 'axios/index';
import WebSocketAsPromised from 'websocket-as-promised';

export const homeURL = (process.env.REACT_APP_DEBUG === 'True')
    ? `http://${window.location.host.split(':', 1)[0]}:8000`
    : '';

const instance = axios.create({
    baseURL: `${homeURL}/api/`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
        // 'Access-Control-Allow-Credentials': true,
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
export const getMessages = async (params) => {
    const data = await getList('/messages/', params);
    data.results = data.results.map(normalizeMessage);
    return data;
};

function normalizeMessage({created_at, ...others}) {
    return {
        created_at: new Date(created_at),
        ...others
    }
}

export function connectToChat() {
    const hostname = homeURL.replace('http://', 'ws://').replace('https://', 'wss://');
    const wsUrl = `${hostname}/ws/chat/`;
    return  new WebSocketAsPromised(wsUrl, {
        packMessage: data => JSON.stringify(data),
        unpackMessage: function (message) {
            const {payload} = JSON.parse(message);
            return normalizeMessage(payload);
        },
    });
}
