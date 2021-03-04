import React, { useEffect, useState } from 'react';
import { MessageManager } from './MessageManager';
import { initSubtitle, initWQ } from './httpHelper';
import { SubtitlesView } from './SubtitlesView';

export const WQ_LANG       = 'wq-lang';
export const SUBTITLE_LANG = 'subtitle-lang';

const messageManager = new MessageManager();

export const SubtitlesContainer = ({ playerLang, layout }) => {
  const [last, setLast] = useState();
  const wqLang          = localStorage.getItem(WQ_LANG) || playerLang;
  const subtitleLang    = localStorage.getItem(SUBTITLE_LANG) || playerLang;

  const wqAvailable = messageManager.getAvailableLangs();

  const onMsgHandler = (data) => {
    let l;
    if (data.message === 'clear') {
      l = messageManager.clear(data);
    } else {
      l = messageManager.push(data, wqLang);
    }
    setLast(l);
  };

  useEffect(async () => {
    await initWQ(onMsgHandler);
  }, []);

  useEffect(async () => {
    subtitleLang && await initSubtitle(subtitleLang, onMsgHandler);
  }, [subtitleLang]);

  useEffect(async () => {
    wqLang && setLast(messageManager.getWQByLang(wqLang));
  }, [wqLang]);

  if (!last && wqAvailable.length === 0)
    return null;

  return (
    <SubtitlesView
      last={last}
      available={wqAvailable}
      layout={layout}
      getWQByLang={messageManager.getWQByLang}
    />
  );
};
