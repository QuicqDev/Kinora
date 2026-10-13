import { mkdir, writeFile } from 'node:fs/promises';
import { Qloo } from '../server/qloo';
import { coverage } from '../server/catalog';
const qloo = new Qloo();
try {
  const tools = await qloo.tools();
  const selected = tools.filter((t) =>
    ['qloo_rank', 'qloo_describe', 'qloo_capabilities'].includes(t.name),
  );
  await mkdir('docs', { recursive: true });
  await writeFile(
    'docs/qloo-tool-schemas.json',
    JSON.stringify({ checked: '2026-10-04', harness: '0.1.26', tools: selected }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        schemas: selected.map((t) => t.name),
        coverage: coverage(),
        note: 'Schema inspection only. No paid API or live coverage calls.',
      },
      null,
      2,
    ),
  );
} finally {
  await qloo.close();
}
