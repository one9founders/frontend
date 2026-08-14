import { runArxivSource } from './sources/arxiv';
import { runGithubSource } from './sources/github';
import { runHackerNewsSource } from './sources/hackernews';
import { runHuggingFaceSource } from './sources/huggingface';
import { runRssSource } from './sources/rss';

type SourceRunner = () => Promise<unknown[]>;

const sources: { name: string; run: SourceRunner }[] = [
  { name: 'github', run: runGithubSource },
  { name: 'huggingface', run: runHuggingFaceSource },
  { name: 'arxiv', run: runArxivSource },
  { name: 'hackernews', run: runHackerNewsSource },
  { name: 'rss', run: runRssSource },
];

async function main() {
  const counts: Record<string, number | 'error'> = {};

  for (const source of sources) {
    try {
      const items = await source.run();
      counts[source.name] = items.length;
      console.log(`[${source.name}] wrote ${items.length} items`);
    } catch (error) {
      counts[source.name] = 'error';
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${source.name}] failed: ${message}`);
    }
  }

  console.log(
    `summary: github=${counts.github} huggingface=${counts.huggingface} arxiv=${counts.arxiv} hackernews=${counts.hackernews} rss=${counts.rss}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
