import { execFileSync, spawn } from "node:child_process";

import { readFile, rm, writeFile } from "node:fs/promises";

import net from "node:net";
import path from "node:path";
import process from "node:process";

import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);

const e2eDirectory = path.dirname(currentFile);

const frontendDirectory = path.resolve(e2eDirectory, "../..");

const backendDirectory = path.resolve(frontendDirectory, "../backend");

const processFile = path.join(e2eDirectory, ".server-processes.json");

const frontendLogFile = path.join(e2eDirectory, "frontend-e2e.log");

const backendLogFile = path.join(e2eDirectory, "backend-e2e.log");

const BACKEND_HOST = "127.0.0.1";

const BACKEND_PORT = 3000;

const FRONTEND_HOST = "127.0.0.1";

const FRONTEND_PORT = 5173;

const servers = [
  {
    key: "backendPid",

    name: "Backend",

    cwd: backendDirectory,

    command: process.execPath,

    args: ["server.js"],

    host: BACKEND_HOST,

    port: BACKEND_PORT,

    logFile: backendLogFile,

    env: {
      PORT: String(BACKEND_PORT),

      NODE_ENV: "e2e",

      E2E_TEST: "true",
    },
  },

  {
    key: "frontendPid",

    name: "Frontend",

    cwd: frontendDirectory,

    command: process.execPath,

    args: [
      "node_modules/vite/bin/vite.js",

      "--host",
      FRONTEND_HOST,

      "--port",
      String(FRONTEND_PORT),

      "--strictPort",
    ],

    host: FRONTEND_HOST,

    port: FRONTEND_PORT,

    logFile: frontendLogFile,

    env: {
      /**
       * The browser will call /api instead of an absolute
       * localhost URL. Vite will proxy it to the backend.
       */
      VITE_API_URL: "/api",

      E2E_API_TARGET: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
    },
  },
];

/**
 * Check whether a TCP port is available.
 */
const isPortReachable = ({ host, port, timeoutMs = 1_000 }) =>
  new Promise((resolve) => {
    const socket = net.createConnection({
      host,
      port,
    });

    let completed = false;

    const finish = (result) => {
      if (completed) {
        return;
      }

      completed = true;

      socket.destroy();

      resolve(result);
    };

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      finish(true);
    });

    socket.once("timeout", () => {
      finish(false);
    });

    socket.once("error", () => {
      finish(false);
    });
  });

/**
 * Wait until a server port becomes reachable.
 */
const waitForServer = async ({ server, child, timeoutMs = 120_000 }) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `${server.name} exited before becoming ready.

Host: ${server.host}
Port: ${server.port}
Exit code: ${child.exitCode}
Log: ${server.logFile}`,
      );
    }

    const reachable = await isPortReachable({
      host: server.host,

      port: server.port,
    });

    if (reachable) {
      console.log(`${server.name} is ready at ${server.host}:${server.port}`);

      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  throw new Error(
    `Timed out waiting for ${server.name}.

Host: ${server.host}
Port: ${server.port}
Log: ${server.logFile}`,
  );
};

/**
 * Stop a process and its child processes.
 */
const stopProcess = (pid) => {
  if (!pid) {
    return;
  }

  try {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
        stdio: "ignore",

        windowsHide: true,
      });

      return;
    }

    /**
     * Negative PID terminates the detached process group,
     * including Vite or Node child processes.
     */
    process.kill(-pid, "SIGTERM");
  } catch {
    /**
     * The process may already have stopped.
     * Teardown must remain safe to run more than once.
     */
  }
};

/**
 * Start the backend and frontend.
 */
export const startServers = async () => {
  const processIds = {};

  await rm(processFile, {
    force: true,
  });

  await rm(frontendLogFile, {
    force: true,
  });

  await rm(backendLogFile, {
    force: true,
  });

  try {
    for (const server of servers) {
      const alreadyRunning = await isPortReachable({
        host: server.host,

        port: server.port,
      });

      if (alreadyRunning) {
        console.log(
          `${server.name} is already running at ${server.host}:${server.port}`,
        );

        processIds[server.key] = null;

        continue;
      }

      console.log(`Starting ${server.name} at ${server.host}:${server.port}`);

      const child = spawn(server.command, server.args, {
        cwd: server.cwd,

        detached: process.platform !== "win32",

        env: {
          ...process.env,
          ...server.env,

          BROWSER: "none",
        },

        /**
         * GitHub Actions should display the logs.
         * Local runs stay quieter.
         */
        stdio: process.env.CI ? "inherit" : "ignore",

        windowsHide: true,
      });

      child.unref();

      if (!child.pid) {
        throw new Error(`Unable to obtain the process ID for ${server.name}.`);
      }

      processIds[server.key] = child.pid;

      await waitForServer({
        server,
        child,
      });
    }

    await writeFile(processFile, JSON.stringify(processIds, null, 2), "utf8");

    console.log("Playwright E2E servers started successfully.");
  } catch (error) {
    stopProcess(processIds.frontendPid);

    stopProcess(processIds.backendPid);

    await rm(processFile, {
      force: true,
    });

    throw error;
  }
};

/**
 * Stop the backend and frontend started by Playwright.
 */
export const stopServers = async () => {
  let processIds;

  try {
    const contents = await readFile(processFile, "utf8");

    processIds = JSON.parse(contents);
  } catch {
    console.log("No Playwright server process file was found.");

    return;
  }

  stopProcess(processIds.frontendPid);

  stopProcess(processIds.backendPid);

  await rm(processFile, {
    force: true,
  });

  console.log("Playwright E2E servers stopped.");
};
