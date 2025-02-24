import { parseRequest } from "./_lib/parser"
import { getScreenshot } from "./_lib/chromium"
import { getHtml } from "./_lib/template"

const isDev = !process.env.AWS_REGION
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1"

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*")
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  )
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function handler(req, res) {
  try {
    const parsedReq = parseRequest(req)
    const html = getHtml(parsedReq)
    if (isHtmlDebug) {
      res.setHeader("Content-Type", "text/html")
      res.end(html)
      return
    }
    // const { fileType } = parsedReq
    // force as jpeg
    let fileType = 'jpeg'
    const file = await getScreenshot(html, fileType, isDev)
    res.statusCode = 200
    res.setHeader("Content-Type", `image/${fileType}`)
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader("Content-Type", "text/html")
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>")
    console.error(e)
  }
}

export default allowCors(handler)
