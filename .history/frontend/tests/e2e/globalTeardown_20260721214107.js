import { stopServers } from "./serverProcesses.js";

/**
 * Stop all servers created by the Playwright setup.
 */
export default async function globalTeardown() {
  await stopServers();
}
