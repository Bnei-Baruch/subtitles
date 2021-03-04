import ReconnectingWebSocket from 'reconnectingwebsocket';
import { WEB_SOCKET_WORKSHOP_QUESTION } from '../shared/env';
import { MSGS_TYPES } from './MessageManager';
import { exit, getMqttEmitter, join } from '../../helpers/send';

let currentMqttLang;
export const initWQ = async (onMessage) => {
  const ws     = new ReconnectingWebSocket(WEB_SOCKET_WORKSHOP_QUESTION);
  ws.onmessage = ({ data }) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      msg = buildClear();
    }

    if (msg.clear || msg.questions === null)
      msg = buildClear();
    msg.type = MSGS_TYPES.workshop;
    onMessage(dataToMsgAdapter(msg));
  };

  return new Promise((res, rej) => {
    ws.onopen = ({ data }) => {
      let msg;
      try {
        msg = JSON.parse(data);
      } catch (e) {
        msg = {};
      }
      const { questions } = msg;
      if (!questions) {
        const d = buildClear();
        onMessage({ ...d, type: MSGS_TYPES.workshop });
        return res();
      }
      questions
        .map(q => dataToMsgAdapter({ ...q, type: MSGS_TYPES.workshop }))
        .forEach(onMessage);
      return res();
    };
  });
};

export const initSubtitle = async (lang, onMessage) => {

  if (currentMqttLang === lang)
    return;

  currentMqttLang && await exit('subtitles/galaxy/' + currentMqttLang);
  await join('subtitles/galaxy/' + lang);
  currentMqttLang = lang;
  const mq        = await getMqttEmitter();
  mq.on('MqttSubtitlesEvent', (json) => {
    let msg = JSON.parse(json);
    if (msg.message === 'on_air')
      return;
    console.log('[mqtt] MqttSubtitlesEvent subtitle mqtt listener ', msg);
    if (msg.message === 'clear')
      msg = buildClear();
    msg.type = MSGS_TYPES.subtitle;
    onMessage(dataToMsgAdapter(msg));
  });
};

const dataToMsgAdapter = ({ message, language, type }) => {
  return { message, type, date: Date.now(), language };
};

const buildClear = (language = 'all') => {
  return dataToMsgAdapter({ message: 'clear', language });
};
