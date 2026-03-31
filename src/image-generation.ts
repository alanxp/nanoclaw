import { FAL_DEFAULT_MODEL, FAL_KEY } from './config.js';
import { logger } from './logger.js';

export interface GenerateImageOptions {
  model?: string;
  imageSize?: string;
}

export interface GenerateImageResult {
  imageBuffer: Buffer;
  url: string;
}

export async function generateImage(
  prompt: string,
  options?: GenerateImageOptions,
): Promise<GenerateImageResult> {
  if (!FAL_KEY) {
    throw new Error(
      'FAL_KEY not set. Add it to .env or OneCLI vault to enable image generation.',
    );
  }

  const model = options?.model || FAL_DEFAULT_MODEL;
  const url = `https://fal.run/${model}`;

  const body: Record<string, unknown> = { prompt };
  if (options?.imageSize) {
    body.image_size = options.imageSize;
  }

  logger.info(
    { model, promptLength: prompt.length },
    'Generating image via FAL.AI',
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error');
    throw new Error(`FAL.AI API error (${response.status}): ${errorText}`);
  }

  const result = (await response.json()) as { images?: Array<{ url: string }> };
  const imageUrl = result.images?.[0]?.url;

  if (!imageUrl) {
    throw new Error('FAL.AI returned no images');
  }

  logger.info({ imageUrl }, 'FAL.AI image generated, downloading');

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(
      `Failed to download generated image (${imageResponse.status})`,
    );
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  logger.info({ size: imageBuffer.length }, 'Image downloaded');

  return { imageBuffer, url: imageUrl };
}
