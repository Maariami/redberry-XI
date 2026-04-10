"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");

const ROOT_DIR = __dirname;
const API_ORIGIN = "https://api.redclass.redberryinternship.ge";
const PORT = Number(process.env.PORT || 5500);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

function sendResponse(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function getFilePath(requestPathname) {
  const normalizedPath = decodeURIComponent(requestPathname.split("?")[0]);
  const requestedPath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const absolutePath = path.normalize(path.join(ROOT_DIR, requestedPath));

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

function serveStatic(req, res, pathname) {
  const filePath = getFilePath(pathname);
  if (!filePath) {
    sendResponse(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendResponse(res, 404, "Not Found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function proxyApi(req, res) {
  const upstreamUrl = new URL(req.url, API_ORIGIN);
  const headers = { ...req.headers };

  delete headers.host;
  delete headers.origin;
  delete headers.referer;

  const proxyReq = https.request(
    upstreamUrl,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, {
        ...proxyRes.headers,
        "access-control-allow-origin": `http://localhost:${PORT}`,
      });
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", () => {
    sendResponse(
      res,
      502,
      JSON.stringify({ message: "Proxy request failed." }),
      { "Content-Type": "application/json; charset=utf-8" },
    );
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;

  if (pathname.startsWith("/api/")) {
    proxyApi(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendResponse(res, 405, "Method Not Allowed");
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Redberry XI server running at http://localhost:${PORT}`);
});
