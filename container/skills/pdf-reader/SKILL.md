---
name: pdf-reader
description: Extract text from PDF files using pdftotext
---

# PDF Reader

You can read and extract text from PDF files using the `pdf-reader` CLI tool.

## Commands

### Extract text
```bash
pdf-reader extract <file> [--layout] [--pages N-M]
```
- `--layout`: Preserve original layout (columns, spacing)
- `--pages N-M`: Extract only pages N through M (e.g., `--pages 1-5`)

### Fetch and extract from URL
```bash
pdf-reader fetch <url> [filename]
```
Downloads a PDF from a URL, validates it, and extracts text.

### Get PDF info
```bash
pdf-reader info <file>
```
Shows metadata: page count, page size, creator, file size.

### List all PDFs
```bash
pdf-reader list
```
Recursively lists all PDF files with page counts and sizes.

## Usage Notes

- PDF files sent by users are saved to `attachments/` in the group directory and appear as `[Document: attachments/filename.pdf]` in messages.
- Use `pdf-reader extract attachments/filename.pdf` to read the content.
- For large PDFs, use `--pages` to extract specific sections.
- The `--layout` flag is useful for documents with tables or multi-column layouts.
