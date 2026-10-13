import { config } from '../server/config';
import { DiscoveryService } from '../server/discovery';
if (!process.argv.includes('--live') || config.mode !== 'live')
  throw Error('Requires --live and HERITAGE_MODE=live');
const collection = process.argv.find((a) => a.startsWith('--collection='))?.split('=')[1];
if (collection && !['hindi', 'tamil', 'mexican'].includes(collection))
  throw Error('Unknown collection');
const service = new DiscoveryService();
try {
  const before = service.budget.count;
  console.log(
    JSON.stringify({ ...(await service.warm(collection)), charged: service.budget.count - before }),
  );
} finally {
  await service.close();
}
