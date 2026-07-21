import { startServers } from "./serverProcesses.js";

/**
 * Start the backend and frontend before Playwright tests.
 */
export default async function globalSetup() {
  await startServers();
}
