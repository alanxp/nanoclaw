/**
 * Image processing for NanoClaw vision support.
 * Handles image resizing, saving, and reference parsing.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { logger } from './logger.js';
import { NewMessage } from './types.js';

const MAX_DIMENSION = 1024;
const MIN_FILE_SIZE = 1024; // bytes — reject trivially small output
const JPEG_QUALITY = 85;

/**
 * Matches image references embedded in message text:
 *   [Image: attachments/filename.jpg]
 *   [Sticker: attachments/filename.jpg]
 */
const IMAGE_REF_PATTERN = /\[(Image|Sticker):\s*([\w./-]+)\]/g;

export interface ImageAttachment {
  relativePath: string;
  mediaType: string;
}

export interface ProcessedImage {
  /** Text reference to embed in message content, e.g. "[Image: attachments/img-xxx.jpg] caption" */
  content: string;
  /** Path relative to group dir, e.g. "attachments/img-xxx.jpg" */
  relativePath: string;
}

/**
 * Resize an image buffer to fit within MAX_DIMENSION, convert to JPEG,
 * save to the group's attachments directory, and return a text reference.
 */
export async function processImage(
  buffer: Buffer,
  groupDir: string,
  caption?: string,
): Promise<ProcessedImage | null> {
  try {
    const resized = await sharp(buffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();

    // Validate output is a valid JPEG above minimum size
    if (resized.length < MIN_FILE_SIZE) return null;
    if (resized[0] !== 0xff || resized[1] !== 0xd8) return null;

    const attachmentsDir = path.join(groupDir, 'attachments');
    fs.mkdirSync(attachmentsDir, { recursive: true });

    const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`;
    const filePath = path.join(attachmentsDir, filename);
    fs.writeFileSync(filePath, resized);

    const relativePath = `attachments/${filename}`;
    const ref = `[Image: ${relativePath}]`;
    const content = caption ? `${ref} ${caption}` : ref;

    return { content, relativePath };
  } catch (err) {
    logger.warn({ err }, 'Failed to process image');
    return null;
  }
}

/**
 * Scan messages for [Image: ...] and [Sticker: ...] references
 * and return the list of image attachments for multimodal input.
 */
export function parseImageReferences(
  messages: NewMessage[],
): ImageAttachment[] {
  const attachments: ImageAttachment[] = [];

  for (const msg of messages) {
    IMAGE_REF_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = IMAGE_REF_PATTERN.exec(msg.content)) !== null) {
      attachments.push({
        relativePath: match[2],
        mediaType: 'image/jpeg',
      });
    }
  }

  return attachments;
}
