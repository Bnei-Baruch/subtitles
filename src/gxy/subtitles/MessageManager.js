export const MSGS_TYPES = {
  subtitle: 'subtitle',
  workshop: 'workshop'
};

export class MessageManager {

  wqMsgs       = [];
  subtitleMsgs = [];

  push(data, lang) {
    const { message, language, type } = data;
    const msg                         = { message, type, language, addedAt: Date.now() };

    switch (type) {
    case MSGS_TYPES.subtitle:
      this.mqtt = [msg];
      break;
    case MSGS_TYPES.workshop:
      const i = this.wqMsgs.findIndex(m => m.language === lang);
      (i > -1) && this.wqMsgs.splice(i, 1);
      this.wqMsgs.push(msg);
      break;
    }
    return this.last(lang);
  }

  clear({ type, language }) {
    switch (type) {
    case MSGS_TYPES.subtitle:
      this.mqtt = [];
      break;
    case MSGS_TYPES.workshop:
      this.wqMsgs = [];
      break;
    }
    return this.last(language);
  }

  last(lang) {
    return [...this.subtitleMsgs, ...this.wqMsgs]
      .filter(m => m.language === lang)
      .sort((a, b) => b.addedAt - a.addedAt)
      [0];
  }

  getWQByLang(lang) {
    return this.wqMsgs.find(m => m.language === lang);
  }

  getAvailableLangs() {
    return this.wqMsgs.map(m => m.language);
  }
};
