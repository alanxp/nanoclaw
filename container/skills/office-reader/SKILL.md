---
name: office-reader
description: Extract text from Excel and Word files
---

# Office Reader

You can read and extract content from Microsoft Office files using the `office-reader` CLI tool.

## Supported Formats

- **Excel**: `.xls`, `.xlsx` (extracts as CSV or JSON)
- **Word**: `.docx` (extracts raw text)

## Commands

### Extract content
```bash
office-reader extract <file> [--sheet <name>] [--json]
```
- `--sheet <name>`: Extract a specific sheet (Excel only, defaults to first)
- `--json`: Output as JSON instead of CSV (Excel only)

### Get file info
```bash
office-reader info <file>
```
Shows sheet names, row/column counts (Excel) or file type and size (Word).

### List all Office files
```bash
office-reader list
```
Recursively lists all `.xls`, `.xlsx`, and `.docx` files.

## Usage Notes

- Office files sent by users are saved to `attachments/` in the group directory and appear as `[Document: attachments/filename.xlsx]` in messages.
- Use `office-reader extract attachments/filename.xlsx` to read the content.
- For Excel files with multiple sheets, use `office-reader info` first to see sheet names, then `--sheet` to target a specific one.
- The `--json` flag outputs structured data that's easier to process programmatically.
