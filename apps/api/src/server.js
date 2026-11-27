import mongoose from 'mongoose';
import { config } from './config.js';
import { createApp } from './app.js';

async function start() {
  try {
    await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    const serverErrors = error?.reason?.servers
      ? [...error.reason.servers.values()].map((server) => ({
        name: server.error?.name,
        code: server.error?.code,
        causeCode: server.error?.cause?.code,
      })).filter((entry) => entry.name || entry.code || entry.causeCode)
      : [];
    const diagnostics = [
      error?.name,
      error?.code ? `code=${error.code}` : '',
      error?.codeName ? `codeName=${error.codeName}` : '',
      error?.cause?.code ? `causeCode=${error.cause.code}` : '',
      error?.reason?.type ? `topology=${error.reason.type}` : '',
      serverErrors.length ? `servers=${JSON.stringify(serverErrors)}` : '',
    ].filter(Boolean).join(' ');
    process.stderr.write(`BridgeSync API could not connect to MongoDB${diagnostics ? ` (${diagnostics})` : ''}. Check local Atlas network access. No in-memory fallback is used.\n`);
    process.exitCode = 1;
    return;
  }

  const app = createApp();
  const host = config.isProduction ? '0.0.0.0' : '127.0.0.1';
  app.listen(config.PORT, host, () => {
    process.stdout.write(`BridgeSync API listening on ${host}:${config.PORT}\n`);
  });
}

start();
