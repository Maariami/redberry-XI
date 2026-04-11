"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");

const ROOT_DIR = __dirname;
const API_ORIGIN = "https://api.redclass.redberryinternship.ge";
const DEFAULT_PORT = 5500;
const MAX_PORT_ATTEMPTS = 25;
const REQUESTED_PORT = Number(process.env.PORT || DEFAULT_PORT);
const HAS_EXPLICIT_PORT = Boolean(process.env.PORT);
const LIVE_RELOAD_PATH = "/__live-reload";
const WATCHED_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
]);

const liveReloadClients = new Set();
const directoryWatchers = new Map();

let reloadTimer = null;
let activePort = REQUESTED_PORT;

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

function buildLiveReloadClientScript() {
  return `
<script>
(() => {
  const source = new EventSource("${LIVE_RELOAD_PATH}");
  source.addEventListener("reload", () => {
    window.location.reload();
  });
  source.onerror = () => {
    source.close();
    setTimeout(() => window.location.reload(), 1000);
  };
})();
</script>`;
}

function injectLiveReload(html) {
  const snippet = buildLiveReloadClientScript();
  if (html.includes("</body>")) {
    return html.replace("</body>", `${snippet}</body>`);
  }

  return `${html}${snippet}`;
}

function broadcastReload() {
  const payload = `event: reload\ndata: ${Date.now()}\n\n`;
  liveReloadClients.forEach((res) => {
    res.write(payload);
  });
}

function scheduleReload() {
  if (reloadTimer) {
    clearTimeout(reloadTimer);
  }

  reloadTimer = setTimeout(() => {
    reloadTimer = null;
    broadcastReload();
  }, 120);
}

function shouldWatchFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(ROOT_DIR, filePath);

  return (
    Boolean(relativePath) &&
    !relativePath.startsWith(".git") &&
    WATCHED_EXTENSIONS.has(extension)
  );
}

function watchDirectory(dirPath) {
  if (directoryWatchers.has(dirPath)) {
    return;
  }

  try {
    const watcher = fs.watch(dirPath, (_eventType, filename) => {
      if (!filename) {
        scheduleReload();
        return;
      }

      const changedPath = path.join(dirPath, filename.toString());
      if (shouldWatchFile(changedPath)) {
        scheduleReload();
      }

      fs.promises
        .stat(changedPath)
        .then((stats) => {
          if (stats.isDirectory()) {
            watchDirectoryTree(changedPath);
            scheduleReload();
          }
        })
        .catch(() => {
          scheduleReload();
        });
    });

    directoryWatchers.set(dirPath, watcher);
  } catch (error) {
    console.error(`Failed to watch directory ${dirPath}:`, error.message);
  }
}

function watchDirectoryTree(startPath) {
  if (!startPath.startsWith(ROOT_DIR)) {
    return;
  }

  watchDirectory(startPath);

  fs.readdirSync(startPath, { withFileTypes: true }).forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }

    if (entry.name === ".git") {
      return;
    }

    watchDirectoryTree(path.join(startPath, entry.name));
  });
}

function handleLiveReload(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Connection: "keep-alive",
  });
  res.write("retry: 1000\n\n");

  liveReloadClients.add(res);

  req.on("close", () => {
    liveReloadClients.delete(res);
  });
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

    if (extension === ".html") {
      fs.readFile(filePath, "utf8", (readError, html) => {
        if (readError) {
          sendResponse(res, 500, "Internal Server Error");
          return;
        }

        sendResponse(res, 200, injectLiveReload(html), {
          "Content-Type": contentType,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        });
      });
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
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
        "access-control-allow-origin": `http://localhost:${activePort}`,
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
  const pathname = new URL(req.url, `http://localhost:${activePort}`).pathname;

  if (pathname === LIVE_RELOAD_PATH) {
    handleLiveReload(req, res);
    return;
  }

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

watchDirectoryTree(ROOT_DIR);

function logServerStarted() {
  console.log(`Redberry XI server running at http://localhost:${activePort}`);
  console.log("Live reload enabled");
}

function startServer(port, attempts = 0) {
  activePort = port;

  server.removeAllListeners("error");
  server.removeAllListeners("listening");

  server.once("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      throw error;
    }

    if (HAS_EXPLICIT_PORT) {
      console.error(`Port ${port} is already in use.`);
      process.exit(1);
    }

    if (attempts >= MAX_PORT_ATTEMPTS - 1) {
      console.error(
        `No free port found between ${REQUESTED_PORT} and ${REQUESTED_PORT + MAX_PORT_ATTEMPTS - 1}.`,
      );
      process.exit(1);
    }

    startServer(port + 1, attempts + 1);
  });

  server.once("listening", () => {
    logServerStarted();
  });

  server.listen(port);
}

startServer(REQUESTED_PORT);
