import { writePipelineJson } from '../io';

export interface HuggingFaceModel {
  id: string;
  downloads: number;
  likes: number;
  pipeline_tag: string;
  lastModified: string;
}

interface HuggingFaceApiModel {
  id?: string;
  modelId?: string;
  downloads?: number;
  likes?: number;
  pipeline_tag?: string | null;
  lastModified?: string;
  createdAt?: string;
}

export async function fetchHuggingFaceModels(): Promise<HuggingFaceModel[]> {
  const urls = [
    'https://huggingface.co/api/models?sort=trending&limit=50',
    'https://huggingface.co/api/models?sort=trendingScore&limit=50&full=true',
  ];

  let response: Response | null = null;
  let lastError = '';
  for (const url of urls) {
    response = await fetch(url, {
      headers: { 'User-Agent': 'one9founders-pipeline' },
    });
    if (response.ok) break;
    lastError = `Hugging Face models request failed (${response.status}): ${response.statusText}`;
    response = null;
  }

  if (!response) {
    throw new Error(lastError || 'Hugging Face models request failed');
  }

  const data = (await response.json()) as HuggingFaceApiModel[];
  if (!Array.isArray(data)) {
    throw new Error('Hugging Face models response was not an array');
  }

  return data.map((model) => ({
    id: model.id || model.modelId || '',
    downloads: model.downloads ?? 0,
    likes: model.likes ?? 0,
    pipeline_tag: model.pipeline_tag || '',
    lastModified: model.lastModified || model.createdAt || '',
  }));
}

export async function runHuggingFaceSource(): Promise<HuggingFaceModel[]> {
  const models = await fetchHuggingFaceModels();
  await writePipelineJson('hf-models.json', models);
  return models;
}

if (process.argv[1]?.endsWith('huggingface.ts')) {
  runHuggingFaceSource()
    .then((models) => console.log(`huggingface: ${models.length} models`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
