# DocuElevator

A lightweight, browser-based utility tool for previewing, processing, converting, and managing documents. Everything is handled fully locally in your browser. 

## Features

- PDF preview and page navigation
- PDF merging
- Page extraction
- PDF → TXT
- Images → PDF
- Text and image preview
- Multi-file workspace
- Document statistics
- Search
- Dark mode
- Drag-and-drop uploads

## Tech Stack

- HTML5
- CSS3
- JavaScript
- PDF.js
- PDF-Lib
- Browser File API
- Canvas API
- Local Storage

## Project Structure

```text
DocuElevator/
├── index.html
├── styles.css
└── script.js
```

## Description

- DocuElevator is intentionally built as a simple three-file application.
Document processing happens directly in the browser, keeping the project
lightweight and avoiding unnecessary backend infrastructure.

- The application provides common document utilities through a single workspace
while keeping the interface minimal and focused.

## Run Locally
```
python -m http.server 5500
```
Then open:
```
http://localhost:5500
```

## External Libraries

DocuElevator uses:

- PDF.js: PDF rendering and text extraction
- PDF-Lib: PDF creation and manipulation

