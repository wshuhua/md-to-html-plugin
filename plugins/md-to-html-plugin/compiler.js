const { randomNum } = require("./util");
const reg_mark = /^(.+?)\s/;
const reg_sharp = /^\#/;
const reg_crossbar = /^\-/;
const reg_number = /^\d/;

function createTree(_mdArr) {
  let _htmlPool = {};
  let _lastMark = ""; // 判连续性
  let _key = 0;
  _mdArr.forEach((mdFrgment) => {
    const matched = mdFrgment.match(reg_mark);

    if (matched) {
      const mark = matched[1];
      const input = matched["input"];

      // # 解析标题
      if (reg_sharp.test(mark)) {
        const tag = `h${mark.length}`;
        const tagContent = input.replace(reg_mark, "");

        const _htmlPoolHtml = `<${tag}>${tagContent}</${tag}>`;
        if (_lastMark === mark) {
          _htmlPool[`${tag}-${_key}`].tags = [
            ..._htmlPool[`${tag}-${_key}`].tags,
            _htmlPoolHtml,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`${tag}-${_key}`] = {
            type: "single",
            tags: [_htmlPoolHtml],
          };
        }
      }

      // - 解析无序列表
      if (reg_crossbar.test(mark)) {
        const tagContent = input.replace(reg_mark, "");
        const tag = "li";
        const _htmlPoolHtml = `<${tag}>${tagContent}</${tag}>`;

        if (reg_crossbar.test(_lastMark)) {
          _htmlPool[`ul-${_key}`].tags = [
            ..._htmlPool[`ul-${_key}`].tags,
            _htmlPoolHtml,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ul-${_key}`] = {
            type: "wrap",
            tags: [_htmlPoolHtml],
          };
        }
      }

      // 有序列表
      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_mark, "");
        const tag = "li";
        const _htmlPoolHtml = `<${tag}>${tagContent}</${tag}>`;
        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags = [
            ..._htmlPool[`ol-${_key}`].tags,
            _htmlPoolHtml,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ol-${_key}`] = {
            type: "wrap",
            tags: [_htmlPoolHtml],
          };
        }
      }
    }
  });
  return _htmlPool;
}
/**_htmlPool 数据结构
 * {
  'h1-1652634913656': { type: 'single', tags: [ '<h1>这是h1标题</h1>' ] },
  'ul-1652634914332': {
    type: 'wrap',
    tags: [
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>'
    ]
  },
  'h2-1652634913549': { type: 'single', tags: [ '<h2>这是h2标题</h2>' ] },
  'ol-1652634914180': {
    type: 'wrap',
    tags: [
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>',
      '<li>卡卡卡</li>'
    ]
  }
}
 * @param {*} _mdArr 
 * @returns 
 */
function compileHTML(_mdArr) {
  const _htmlPool = createTree(_mdArr);
  let _htmlStr = "";
  let item;

  for (let key in _htmlPool) {
    item = _htmlPool[key];
    if (item.type === "single") {
      item.tags.forEach((tag) => {
        _htmlStr += tag;
      });
    } else if (item.type === "wrap") {
      let _list = `<${key.split("-")[0]}>`;
      item.tags.forEach((tag) => {
        _list += tag;
      });
      _list += `</${key.split("-")[0]}>`;
      _htmlStr += _list;
    }
  }
  return _htmlStr;
}

module.exports = {
  compileHTML,
};
