import axios from 'axios/index';
import ReconnectingWebSocket from 'reconnectingwebsocket';

const DEBUG = process.env.REACT_APP_DEBUG === 'True';

const instance = axios.create({
    baseURL: buildURL({pathname: `/api/`}),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
export const getByURL = (url) => call(instance.get)(url);


// messages
export const getMessages = async (params) => {
    const data = await getList('/messages/', params);
    data.results = data.results.map(normalizeMessage);
    return data;
};
export const getMessagesByURL = async url => {
    const data = await getByURL(url);
    data.results = data.results.map(normalizeMessage);
    return data;
};

function normalizeMessage({created_at, ...others}) {
    return {
        created_at: new Date(created_at),
        ...others
    }
}

export function connectToChat({onOpen = console.log, onClose = console.log, onMessage = console.log, onError = console.log}) {
    const chatURL = buildURL({
        protocol: (window.location.protocol === 'https:') ? 'wss://' : 'ws://',
        pathname: '/ws/chat/'
    });

    const ws = new ReconnectingWebSocket(chatURL, null, {debug: DEBUG});
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onerror = onError;
    ws.onmessage = function (message) {
        const data = JSON.parse(message.data);
        onMessage(normalizeMessage(data.payload))
    };
    return ws;
}


function buildURL(
    {
        protocol = window.location.protocol,
        hostname = window.location.hostname,
        port = DEBUG ? '8000' : window.location.port,
        pathname = '/'
    }) {
    const portPrefix = port.length ? ':' : '';
    return `${protocol}//${hostname}${portPrefix}${port}${pathname}`
}
