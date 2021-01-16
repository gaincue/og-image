import { readFileSync } from "fs"
import { sanitizeHtml } from "./sanitizer"
// const chromium = require('chrome-aws-lambda');
// await chromium.font('https://example.com/googlei18n/noto-emoji/fonts/NotoColorEmoji.ttf');

const rglr = readFileSync(`${__dirname}/../_fonts/Leitura-Roman-3.woff`).toString("base64")
const bold = readFileSync(`${__dirname}/../_fonts/Leitura-Roman-4.woff`).toString("base64")
// const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString("base64")

function getCss(fontSize) {
  let foreground = "black"

  return `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&display=swap');

    @font-face {
        font-family: 'Leitura';
        font-weight: 500;
        src: url(data:font/woff;charset=utf-8;base64,${rglr}) format('woff');
    }

    @font-face {
        font-family: 'Leitura';
        font-weight: 700;
        src: url(data:font/woff;charset=utf-8;base64,${bold}) format('woff');
    }

    body {
        background-position: left;
        background-repeat: no-repeat;
        background-size: contain;        
        height: 360px;
        width: 360px;
        display: flex;
        text-align: center;
        align-items: flex-start;
        justify-content: center;
        margin: 0;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }
    
    .message {
        width: 216px;
        font-family: 'Leitura', serif;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: 1.5;
        white-space: break-spaces;
        text-transform: uppercase;
    }

    .messageCn {
        width: 216px;
        font-family: 'Noto Serif SC', serif;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: 1.5;
        white-space: break-spaces;
    }
    `
}

export function getHtml(parsedReq) {
  const { recipient, sender, lang = "en", greeting = "love", bg = "bird" } = parsedReq

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss()}
    </style>
    <body style="background-image: url('https://cny.8conlay.com/images/${bg}.jpg');">
        <div>
            <div class=${lang == "en" ? "message" : "messageCn"}>${
    lang == "en" ? greetingEn.dear : greetingCn.dear
  } ${sanitizeHtml(recipient)}</div>
            <br />
            <div class=${lang == "en" ? "message" : "messageCn"}>${
    lang == "en" ? greetingEn[greeting] : greetingCn[greeting]
  }</div>
            <br />
            <div class=${lang == "en" ? "message" : "messageCn"}>${
    lang == "cn" ? sanitizeHtml(sender) : ""
  }${lang == "en" ? greetingEn.from : greetingCn.from}${
    lang == "en" ? sanitizeHtml(sender) : ""
  }</div>
        </div>
    </body>
</html>`
}

const greetingEn = {
  dear: `\nDear`,
  love: "Wishing you a year filled with warmth, joy and endearing moments.",
  prosperity: "Wishing you a year filled with goodwill and success.",
  health: "Wishing you a year with optimal health and vitalty.",
  wish: "\n\nHappy Chinese New Year! \n\n",
  from: `From `,
}

const greetingCn = {
  dear: `\n亲爱的`,
  love: "祝愿你在新的一年温馨幸福，\n天天都愉快，日日有笑声。",
  prosperity: "祝愿你在新的一年里事业步步高升，\n欣欣向荣。",
  health: "祝愿你在新的一年里身体健康，\n活力四射。",
  wish: "\n新年快乐。\n\n",
  from: `上`,
}
