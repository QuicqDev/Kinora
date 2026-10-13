import { createApp } from './app';
import { config, mode } from './config';
import { DiscoveryService } from './discovery';
const service = new DiscoveryService();
const server = createApp(service).listen(config.port, config.host, () =>
  console.log(`Kinora backend ready on ${config.host}:${config.port} (${mode()})`),
);
for (const signal of ['SIGTERM', 'SIGINT'] as const)
  process.once(signal, () =>
    server.close(async () => {
      await service.close();
      process.exit(0);
    }),
  );
