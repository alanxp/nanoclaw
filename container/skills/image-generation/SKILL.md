---
name: image-generation
description: Generate images from text prompts using FAL.AI
---

# Image Generation

You can generate images from text descriptions using the `mcp__nanoclaw__generate_image` tool.

## Usage

Call `generate_image` with a detailed prompt describing the image you want to create. The image will be sent to the chat automatically once generated (usually takes 3-10 seconds).

## Parameters

- **prompt** (required): Detailed description of the image. Be specific about subject, style, composition, lighting, colors, and mood.
- **caption** (optional): Text caption to display with the image in the chat.
- **model** (optional): FAL.AI model to use. Default: `fal-ai/flux-pro/v1.1`.
  - `fal-ai/flux-pro/v1.1` - High quality, best for detailed/photorealistic images
  - `fal-ai/flux/schnell` - Fast generation, good for quick iterations
  - `fal-ai/flux/dev` - Open-source development model
- **image_size** (optional): Size preset for the generated image.
  - `square_hd` - Square high definition
  - `square` - Square standard
  - `landscape_4_3` - Landscape 4:3 ratio
  - `landscape_16_9` - Landscape 16:9 ratio
  - `portrait_4_3` - Portrait 4:3 ratio
  - `portrait_16_9` - Portrait 16:9 ratio

## Tips for Good Prompts

- Be specific: "A golden retriever puppy playing in autumn leaves, soft natural lighting, shallow depth of field" instead of "a dog"
- Include style cues: "oil painting style", "photorealistic", "watercolor", "digital art", "cinematic"
- Mention composition: "close-up", "wide shot", "bird's eye view", "centered"
- Specify lighting: "golden hour", "studio lighting", "dramatic shadows", "soft diffused light"

## Important Notes

- Image generation is **asynchronous**: the image will appear in the chat a few seconds after you call the tool. You can continue your response while it generates.
- If the user asks for changes, generate a new image with a modified prompt.
- When the user asks to "generate an image" or "create a picture", use this tool.
