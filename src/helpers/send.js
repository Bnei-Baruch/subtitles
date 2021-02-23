import mqtt from 'mqtt';
import { MQTT_BASE, MQTT_TOPIC_BASE } from '../constants/consts';
import { kc } from '../components/UserManagement/UserManagement';

let mqttClient  = null;
let currentLang = null;

export const join = async (lang) => {
  if (currentLang === lang) return;
  if (!mqttClient?.connected) await initMqtt();

  currentLang && await exit();
  currentLang = null;
  return new Promise((res, rej) => {
    const options = { qos: 1, nl: true };
    console.log('[mqtt] Before subscribe: ', lang);
    mqttClient.subscribe(`${MQTT_TOPIC_BASE}${lang}`, options, (err) => {
      console.log('[mqtt] On request from subscribe', err);
      if (!err) {
        currentLang = lang;
        return res();
      }
      rej(console.error('[mqtt] Error: ', err));
    });
  });
};

export const exit = async () => {
  if (!currentLang) return;
  if (!mqttClient?.connected) await initMqtt();
  return new Promise((res, rej) => {
    console.log('[mqtt] Before exit: ', currentLang);
    mqttClient.unsubscribe(`${MQTT_TOPIC_BASE}${currentLang}`, {}, (err) => {
      console.log('[mqtt] On request from exit', err);
      if (!err)
        return res();
      rej(console.error('[mqtt] Error: ', err));
    });
  });
};

export const send = async (msg, retain = true, lang) => {
  if (!mqttClient?.connected) await initMqtt();
  await join(lang);
  return new Promise((res, rej) => {
    let options = { qos: 1, retain };
    const data  = { 'message': msg, 'type': 'subtitles', 'language': lang };
    console.log('[mqtt] Before send: ', lang);
    mqttClient.publish(`${MQTT_TOPIC_BASE}${lang}`, JSON.stringify(data), options, (err) => {
      console.log('[mqtt] On request from send', err);
      if (!err)
        return res({ msg, lang });
      return rej(console.error('[mqtt] Error: ', err));
    });
  });
};

const initMqtt = async () => {
  const token              = kc.token;
  const { email, sub: id } = kc.tokenParsed;
  if (!email || !token)
    return Promise.reject(console.error('[mqtt] Error: connection was not initialized'));

  return new Promise((resolve, reject) => {
    console.log('[mqtt] on init promise start');

    const options = {
      keepalive: 10,
      connectTimeout: 10 * 1000,
      clientId: id,
      protocolId: 'MQTT',
      protocolVersion: 5,
      clean: true,
      username: email,
      password: token,
      properties: {
        sessionExpiryInterval: 5,
        maximumPacketSize: 10000,
        requestResponseInformation: true,
        requestProblemInformation: true,
      }
    };

    mqttClient = mqtt.connect(`${MQTT_BASE}`, options);

    mqttClient.on('connect', async (data) => {
        console.log('[mqtt] Connected to server: ', data);
        resolve(mqttClient);
      }
    );
    mqttClient.on('error', data => {
      console.error('[mqtt] Error: ', data);
      reject(mqttClient);
    });

    mqttClient.on('disconnect', data => console.error('[mqtt] Error: ', data));
  });
};
