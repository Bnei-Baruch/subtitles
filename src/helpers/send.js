import mqtt from 'mqtt';
import { MQTT_BASE, MQTT_TOPIC_BASE } from '../constants/consts';
import { kc } from '../components/UserManagement/UserManagement';
import { randomString } from '../gxy/shared/tools';

let mqttClient  = null;
let currentLang = null;

export const join = async (language) => {
  if (currentLang === language) return;
  if (!mqttClient?.connected) await initMqtt();

  currentLang && await exit();
  currentLang = null;
  return new Promise((res, rej) => {
    const options = { qos: 1, nl: true };
    const topic   = `${MQTT_TOPIC_BASE}${language}`;
    console.log('[mqtt] Before subscribe: ', topic);
    mqttClient.subscribe(topic, options, (err) => {
      console.log('[mqtt] On request from subscribe', err);
      if (!err) {
        currentLang = language;
        res();
      } else {
        rej(console.error('[mqtt] Error: ', err));
      }
    });
  });
};

export const exit = async () => {
  if (!currentLang) return;
  if (!mqttClient?.connected) await initMqtt();
  return new Promise((res, rej) => {

    const topic = `${MQTT_TOPIC_BASE}${currentLang}`;
    console.log('[mqtt] Before exit: ', topic);
    mqttClient.unsubscribe(topic, {}, (err) => {
      console.log('[mqtt] On request from exit', err);
      if (!err) {
        res();
      } else {
        rej(console.error('[mqtt] Error: ', err));
      }
    });
  });
};

export const send = async (msg, retain = true, language) => {
  if (!mqttClient?.connected) await initMqtt();
  await join(language);
  return new Promise((res, rej) => {
    let options = { qos: 1, retain };
    const data  = { 'message': msg, 'type': 'subtitles', language };

    const topic = `${MQTT_TOPIC_BASE}${language}`;
    console.log('[mqtt] Before send: ', topic);
    const json = JSON.stringify(data);
    //emit my message to player
    mqttClient.emit('MqttSubtitlesEvent', json);
    mqttClient.publish(topic, json, options, (err) => {
      console.log('[mqtt] On request from send', err);
      if (!err) {
        res({ msg, language });
      } else {
        rej(console.error('[mqtt] Error: ', err));
      }
    });
  });
};

export const getMqttEmitter = async () => {
  if (!mqttClient?.connected) await initMqtt();
  return mqttClient;

};

const initMqtt = async () => {
  const token              = kc.token;
  const { email, sub: id } = kc.tokenParsed;
  if (!email || !token)
    return Promise.reject(console.error('[mqtt] Error: connection was not initialized'));

  const transformWsUrl = (url, options, client) => {
    client.options.clientId = id + "-" + randomString(3);
    client.options.password = token;
    return url;
  };

  return new Promise((resolve, reject) => {
    console.log('[mqtt] on init promise start');

    const options = {
      keepalive: 10,
      connectTimeout: 10 * 1000,
      clientId: id + Date.now(),
      protocolId: 'MQTT',
      protocolVersion: 5,
      clean: true,
      username: email,
      password: token,
      transformWsUrl,
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

