export const parseFile = (text) => {

  let parsed = {
    id: Math.floor(Math.random() * 10000),
    title: '',
    createdAt: Date.now(),
    content: [],
  }, err     = [];

  let page         = 0;
  let letter       = 0;
  let revert       = 0;
  let subLetter    = 0;
  let slideContent = [];
  let slideLines   = 0;
  let slides       = [];
  let hasAuthor    = false;
  let hasTitle     = false;
  let checkLineno  = false;
  let firstBreak   = true;
  let isH          = false;

  let match;

  text.split(/\n|\r\n/).forEach((line) => {
    if (/^\s*$/.test(line)) { // comment
      return;
    } else if (/^%author\s+(.+)/.test(line)) {
      hasAuthor = true;
      return;
    } else if (/^%book\s+(.*)$/.test(line)) {
      hasTitle = true;
      match    = /^%book\s+(.*)$/.exec(line);
      if (match[1].length === 0) {
        err.push(`There is empty title`);
        return;
      }
      parsed.title = match[1];
      return;
    } else if (/^%revert\s*$/.test(line)) {
      revert = 1;
      return;
    } else if (/^%page\s*(.*)$/.test(line)) {
      match = /^%page\s*(.*)$/.exec(line);
      if (match[1].length === 0) {
        err.push(`There is no page number around ${page} letter ${letter}-${subLetter}`);
        return;
      }
      if (slideContent.length > 0) {
        subLetter++;
        slides.push({
          page,
          letter,
          subletter: subLetter,
          revert,
          isH,
          content: slideContent.join('<br/>'),
        });
        slideContent = [];
        slideLines   = 0;
        isH          = false;
      }
      page = match[1];
      return;
    } else if (/^%letter\s*(.*)$/.test(line)) {
      match = /^%letter\s*(.*)$/.exec(line);
      if (match[1].length === 0) {
        err.push(`There is no letter on ${page} after ${letter}-${subLetter}`);
        return;
      }
      if (slideContent.length !== 0) {
        subLetter++;
        slides.push({
          page,
          letter,
          subletter: subLetter,
          revert,
          isH,
          content: slideContent.join('<br/>'),
        });
        slideContent = [];
        slideLines   = 0;
        isH          = false;
      }
      letter      = match[1];
      subLetter   = 0;
      checkLineno = true;
      return;
    } else if (/^%break\s*$/.test(line)) {
      if (!firstBreak && slideContent.length === 0) {
        err.push(`There is no content on ${page} after ${letter}-${subLetter}`);
        return;
      }
      firstBreak = false;
      if (slideContent.length > 0) {
        slides.push({
          page,
          letter,
          subletter: subLetter,
          revert,
          isH,
          content: slideContent.join('<br/>'),
        });
        slideContent = [];
        slideLines   = 0;
        isH          = false;
      }
      subLetter++;
      return;
    }

    if (checkLineno) {
      if (!(new RegExp('^' + letter).test(line))) {
        err.push(`Line number is not consistent on ${page} after ${letter}-${subLetter}`);
        return;
      }
      checkLineno = false;
    }
    line = line.replaceAll('\'', '&#39;').replaceAll(/^(\.\d+(\/\d+)*)\s/g, '<bdi dir="ltr">\\1</bdi>&nbsp;');
    if (/^%H\s+(.+)\s*$/.test(line)) {
      match = /^%H\s+(.+)\s*$/.exec(line);
      line  = `<h3>${match[1]}</h3>`;
      isH   = true;
    } else if (/^%H(\d)\s+(.+)$/.test(line)) {
      match = /^%H(\d)\s+(.+)$/.exec(line);
      line  = `<h${match[1]}>${match[2]}</h${match[1]}>`;
      isH   = true;
    } else if (/^%S\s+(.+)$/.test(line)) {
      match = /^%S\s+(.+)$/.exec(line);
      line  = `<div class="source">${match[1]}</div>`;
    }
    slideContent.push(line);
    slideLines++;
    if (slideLines > 4) {
      err.push(`Too many lines on ${page} after ${letter}-${subLetter}`);
    }
  });
  if (slideContent.length !== 0) {
    slides.push({
      page,
      letter,
      subletter: subLetter,
      revert,
      isH,
      content: slideContent.join('<br/>'),
    });
  }
  if (!hasAuthor) {
    err.push(`There is no name of author (%author)`);
  }
  if (!hasTitle) {
    err.push(`There is no title of the book (%title)`);
  }

  parsed.content = slides;

  return [parsed, err.join('\n')];
};

