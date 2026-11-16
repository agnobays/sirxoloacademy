const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");

// Ensure environment is production
process.env.NODE_ENV = "production";

// Safe require for next
let next;
try {
  next = require("next");
} catch (e) {
  console.error("Could not require next:", e);
}

const dev = false;
const dir = __dirname;
const port = parseInt(process.env.PORT, 10) || 3000;

function startFallback(msg) {
  const fallback = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>SIR XOLO ACADEMY — Launching Soon</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
          .card { padding: 40px 24px; max-width: 500px; border-radius: 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
          h1 { font-size: 28px; font-weight: 900; margin-bottom: 8px; color: #f8fafc; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: #fbbf24; color: #451a03; font-weight: 900; font-size: 12px; margin-bottom: 16px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">📢 Official Announcement</div>
          <h1>SIR XOLO ACADEMY</h1>
          <p>Foundation Phase Mastery (Ages 4–9)<br/>English Literacy • Mathematics • isiZulu Ulwimi</p>
          <p style="font-size: 13px; color: #38bdf8;">Application server initializing. Please refresh in a moment.</p>
        </div>
      </body>
      </html>
    `);
  });

  if (typeof PhusionPassenger !== "undefined") {
    fallback.listen("passenger");
  } else {
    fallback.listen(port);
  }
}

if (!next) {
  startFallback("Next package loading");
} else {
  const app = next({ dev, dir, hostname: "localhost", port });
  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      const server = createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error("Error handling request:", req.url, err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });

      if (typeof PhusionPassenger !== "undefined") {
        server.listen("passenger");
      } else {
        server.listen(port, (err) => {
          if (err) throw err;
          console.log(`> Sir Xolo Academy listening on port ${port}`);
        });
      }
    })
    .catch((err) => {
      console.error("app.prepare() failed, starting fallback:", err);
      startFallback(err.message);
    });
}
