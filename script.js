/* =========================================================
   DOCUELEVATOR
   Browser-based document utility
   ========================================================= */

import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

/* =========================================================
   STATE
   ========================================================= */

const state = {
  file: null,
  type: null,

  pdf: null,
  currentPage: 1,
  totalPages: 1,

  text: "",
  pageTexts: [],

  imageUrl: null,

  theme: localStorage.getItem("docuelevator-theme") || "light",
};

/* =========================================================
   DOM
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const fileInput = $("#fileInput");
const openFileButton = $("#openFileButton");
const browseButton = $("#browseButton");

const dropZone = $("#dropZone");
const emptyState = $("#emptyState");
const workspace = $("#workspace");

const loadingOverlay = $("#loadingOverlay");
const loadingText = $("#loadingText");

const toast = $("#toast");
const toastMessage = $("#toastMessage");

const pdfCanvas = $("#pdfCanvas");
const pdfPageWrapper = $("#pdfPageWrapper");
const imagePreview = $("#imagePreview");
const txtPreview = $("#txtPreview");

const extractedText = $("#extractedText");

const pageIndicator = $("#pageIndicator");
const prevPage = $("#prevPage");
const nextPage = $("#nextPage");

const searchInput = $("#searchInput");
const searchResults = $("#searchResults");
const searchCount = $("#searchCount");

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  bindEvents();
});

/* =========================================================
   EVENTS
   ========================================================= */

function bindEvents() {
  openFileButton.addEventListener("click", () => {
    fileInput.click();
  });

  browseButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }

    fileInput.value = "";
  });

  /* Drag and drop */

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragging");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  });

  /* Navigation */

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });
  });

  document.querySelectorAll(".tool-button").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.action);
    });
  });

  /* PDF navigation */

  prevPage.addEventListener("click", () => {
    if (!state.pdf) return;

    if (state.currentPage > 1) {
      state.currentPage--;

      renderPdfPage(state.currentPage);
    }
  });

  nextPage.addEventListener("click", () => {
    if (!state.pdf) return;

    if (state.currentPage < state.totalPages) {
      state.currentPage++;

      renderPdfPage(state.currentPage);
    }
  });

  /* Text actions */

  extractedText.addEventListener("input", () => {
    state.text = extractedText.value;

    updateTextStatistics();
    updateStats();
  });

  $("#copyTextButton").addEventListener("click", copyText);

  $("#cleanTextButton").addEventListener("click", cleanText);

  $("#downloadTextButton").addEventListener("click", downloadText);

  $("#printButton").addEventListener("click", printDocument);

  /* Search */

  searchInput.addEventListener("input", performSearch);

  /* Theme */

  $("#themeToggle").addEventListener("click", toggleTheme);

  /* Clear */

  $("#clearWorkspace").addEventListener("click", clearWorkspace);

  /* Keyboard shortcuts */

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") {
      event.preventDefault();

      fileInput.click();
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
      if (!workspace.classList.contains("hidden")) {
        event.preventDefault();

        switchView("search");

        searchInput.focus();
      }
    }

    if (event.key === "ArrowLeft" && state.pdf) {
      if (state.currentPage > 1) {
        state.currentPage--;

        renderPdfPage(state.currentPage);
      }
    }

    if (event.key === "ArrowRight" && state.pdf) {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;

        renderPdfPage(state.currentPage);
      }
    }
  });
}

/* =========================================================
   FILE PROCESSING
   ========================================================= */

async function processFile(file) {
  if (!isSupportedFile(file)) {
    showToast("Unsupported file. Use PDF, image or TXT.");

    return;
  }

  showLoading("Reading document...");

  try {
    resetDocumentState();

    state.file = file;

    state.type = getFileType(file);

    updateDocumentInformation();

    if (state.type === "pdf") {
      await processPdf(file);
    } else if (state.type === "image") {
      await processImage(file);
    } else if (state.type === "text") {
      await processText(file);
    }

    emptyState.classList.add("hidden");
    workspace.classList.remove("hidden");

    switchView("overview");

    showToast("Document loaded successfully.");
  } catch (error) {
    console.error(error);

    showToast("Couldn't read this document.");

    resetDocumentState();
  } finally {
    hideLoading();
  }
}

/* =========================================================
   FILE TYPES
   ========================================================= */

function isSupportedFile(file) {
  const allowed = [
    "application/pdf",

    "image/png",
    "image/jpeg",
    "image/webp",

    "text/plain",
  ];

  return allowed.includes(file.type);
}

function getFileType(file) {
  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type === "text/plain") {
    return "text";
  }

  return "unknown";
}

/* =========================================================
   PDF
   ========================================================= */

async function processPdf(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: buffer,
  }).promise;

  state.pdf = pdf;
  state.totalPages = pdf.numPages;
  state.currentPage = 1;

  pageIndicator.textContent = `1 / ${pdf.numPages}`;

  await extractPdfText();

  await renderPdfPage(1);

  $("#textHealth").innerHTML = "<span>✓</span> Text layer detected";

  updateStats();
}

async function renderPdfPage(pageNumber) {
  if (!state.pdf) return;

  const page = await state.pdf.getPage(pageNumber);

  const viewport = page.getViewport({
    scale: 1.5,
  });

  const canvas = pdfCanvas;

  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  pageIndicator.textContent = `${pageNumber} / ${state.totalPages}`;

  prevPage.disabled = pageNumber <= 1;

  nextPage.disabled = pageNumber >= state.totalPages;
}

async function extractPdfText() {
  if (!state.pdf) return;

  state.pageTexts = [];

  const pageTextParts = [];

  for (let pageNumber = 1; pageNumber <= state.pdf.numPages; pageNumber++) {
    loadingText.textContent = `Extracting text — page ${pageNumber} of ${state.pdf.numPages}`;

    const page = await state.pdf.getPage(pageNumber);

    const content = await page.getTextContent();

    const text = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    state.pageTexts.push(text);

    pageTextParts.push(`--- Page ${pageNumber} ---\n${text}`);
  }

  state.text = pageTextParts.join("\n\n");

  extractedText.value = state.text;

  updateTextStatistics();
}

/* =========================================================
   IMAGE
   ========================================================= */

async function processImage(file) {
  if (state.imageUrl) {
    URL.revokeObjectURL(state.imageUrl);
  }

  state.imageUrl = URL.createObjectURL(file);

  imagePreview.src = state.imageUrl;

  state.totalPages = 1;
  state.currentPage = 1;

  pageIndicator.textContent = "1 / 1";

  state.text = "";

  extractedText.value = "";

  pdfPageWrapper.classList.add("hidden");
  pdfCanvas.classList.add("hidden");

  imagePreview.classList.remove("hidden");

  txtPreview.classList.add("hidden");

  updateTextStatistics();
  updateStats();
}

/* =========================================================
   TEXT FILE
   ========================================================= */

async function processText(file) {
  const text = await file.text();

  state.text = text;

  state.totalPages = 1;
  state.currentPage = 1;

  extractedText.value = text;

  txtPreview.textContent = text;

  pdfPageWrapper.classList.add("hidden");
  pdfCanvas.classList.add("hidden");

  imagePreview.classList.add("hidden");

  txtPreview.classList.remove("hidden");

  pageIndicator.textContent = "1 / 1";

  updateTextStatistics();
  updateStats();
}

/* =========================================================
   INFORMATION
   ========================================================= */

function updateDocumentInformation() {
  if (!state.file) return;

  const typeLabel =
    state.type === "pdf" ? "PDF" : state.type === "image" ? "IMAGE" : "TEXT";

  $("#documentName").textContent = state.file.name;

  $("#documentType").textContent = typeLabel;

  $("#documentSize").textContent = formatBytes(state.file.size);

  $("#documentPages").textContent =
    `${state.totalPages} ${state.totalPages === 1 ? "page" : "pages"}`;

  $("#documentIcon").textContent = typeLabel;

  $("#detailName").textContent = state.file.name;

  $("#detailType").textContent = typeLabel;

  $("#detailSize").textContent = formatBytes(state.file.size);

  $("#detailPages").textContent = state.totalPages;

  $("#statType").textContent = typeLabel;

  $("#statSize").textContent = formatBytes(state.file.size);
}

function updateStats() {
  if (!state.file) return;

  const words = countWords(state.text);

  const characters = state.text.length;

  const reading = calculateReadingTime(words);

  $("#statPages").textContent = state.totalPages;

  $("#statWords").textContent = formatNumber(words);

  $("#statCharacters").textContent = formatNumber(characters);

  $("#statSize").textContent = formatBytes(state.file.size);

  $("#statReading").textContent = reading;

  $("#detailPages").textContent = state.totalPages;
}

/* =========================================================
   TEXT STATISTICS
   ========================================================= */

function updateTextStatistics() {
  const text = extractedText.value;

  const words = countWords(text);

  const characters = text.length;

  const lines = text ? text.split(/\r?\n/).length : 0;

  const reading = calculateReadingTime(words);

  $("#wordCount").textContent = formatNumber(words);

  $("#charCount").textContent = formatNumber(characters);

  $("#lineCount").textContent = formatNumber(lines);

  $("#readingTime").textContent = reading;
}

function countWords(text) {
  if (!text || !text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
}

function calculateReadingTime(words) {
  if (!words) {
    return "0 min";
  }

  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min`;
}

/* =========================================================
   VIEW SWITCHING
   ========================================================= */

function switchView(view) {
  const titles = {
    overview: "Overview",
    text: "Extract Text",
    search: "Search",
    stats: "Statistics",
  };

  document.querySelectorAll(".view").forEach((element) => {
    element.classList.remove("active-view");
  });

  const target = $(`#${view}View`);

  if (target) {
    target.classList.add("active-view");
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  $("#pageTitle").textContent = titles[view] || "Overview";
}

/* =========================================================
   SEARCH
   ========================================================= */

function performSearch() {
  const query = searchInput.value.trim();

  searchResults.innerHTML = "";

  if (!query) {
    searchCount.textContent = "0 results";

    searchResults.innerHTML = `
            <div class="search-empty">
                Search for a word or phrase to see matches.
            </div>
        `;

    return;
  }

  const results = [];

  state.pageTexts.forEach((pageText, index) => {
    if (!pageText) return;

    const lower = pageText.toLowerCase();

    const search = query.toLowerCase();

    let start = 0;

    while (true) {
      const position = lower.indexOf(search, start);

      if (position === -1) {
        break;
      }

      const contextStart = Math.max(0, position - 90);

      const contextEnd = Math.min(
        pageText.length,
        position + query.length + 90,
      );

      const context = pageText.substring(contextStart, contextEnd);

      results.push({
        page: index + 1,

        position,

        text: context,
      });

      start = position + query.length;

      if (results.length >= 50) {
        break;
      }
    }
  });

  searchCount.textContent = `${results.length} ${
    results.length === 1 ? "result" : "results"
  }`;

  if (!results.length) {
    searchResults.innerHTML = `
            <div class="search-empty">
                No matches found for
                <strong>"${escapeHtml(query)}"</strong>.
            </div>
        `;

    return;
  }

  results.forEach((result, index) => {
    const element = document.createElement("div");

    element.className = "search-result";

    const highlighted = highlightMatch(result.text, query);

    element.innerHTML = `

            <div class="search-result-top">

                <span class="search-result-page">
                    Page ${result.page}
                </span>

                <span class="search-result-index">
                    Match ${index + 1}
                </span>

            </div>

            <div class="search-result-text">
                ${highlighted}
            </div>
        `;

    element.addEventListener("click", () => {
      if (state.pdf) {
        state.currentPage = result.page;

        switchView("overview");

        renderPdfPage(result.page);
      }
    });

    searchResults.appendChild(element);
  });
}

function highlightMatch(text, query) {
  const escaped = escapeRegExp(query);

  return escapeHtml(text).replace(
    new RegExp(`(${escaped})`, "gi"),
    "<mark>$1</mark>",
  );
}

/* =========================================================
   TEXT ACTIONS
   ========================================================= */

async function copyText() {
  const text = extractedText.value;

  if (!text.trim()) {
    showToast("There is no extracted text to copy.");

    return;
  }

  try {
    await navigator.clipboard.writeText(text);

    showToast("Text copied to clipboard.");
  } catch {
    extractedText.select();

    document.execCommand("copy");

    showToast("Text copied.");
  }
}

function cleanText() {
  let text = extractedText.value;

  if (!text.trim()) {
    showToast("There is no text to clean.");

    return;
  }

  text = text

    /* Normalize spaces */
    .replace(/[ \t]+/g, " ")

    /* Normalize excessive blank lines */
    .replace(/\n{3,}/g, "\n\n")

    /* Remove spaces before punctuation */
    .replace(/\s+([,.!?;:])/g, "$1")

    /* Normalize quotation marks */
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")

    .trim();

  extractedText.value = text;

  state.text = text;

  updateTextStatistics();
  updateStats();

  showToast("Text cleaned.");
}

function downloadText() {
  const text = extractedText.value;

  if (!text.trim()) {
    showToast("No text available to download.");

    return;
  }

  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  const baseName = state.file
    ? state.file.name.replace(/\.[^/.]+$/, "")
    : "document";

  anchor.href = url;

  anchor.download = `${baseName}-extracted.txt`;

  anchor.click();

  URL.revokeObjectURL(url);

  showToast("Text file downloaded.");
}

/* =========================================================
   PRINT
   ========================================================= */

function printDocument() {
  if (!state.file) return;

  if (state.type === "pdf") {
    const canvas = pdfCanvas;

    const image = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showToast("Allow popups to print the document.");

      return;
    }

    printWindow.document.write(`
            <!doctype html>

            <html>

            <head>

                <title>
                    ${escapeHtml(state.file.name)}
                </title>

                <style>

                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                    }

                    img {
                        max-width: 100%;
                    }

                </style>

            </head>

            <body>

                <img src="${image}">

            </body>

            </html>
        `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();

      printWindow.print();
    };

    return;
  }

  const text = extractedText.value;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("Allow popups to print.");

    return;
  }

  printWindow.document.write(`
        <!doctype html>

        <html>

        <head>

            <title>
                ${escapeHtml(state.file.name)}
            </title>

            <style>

                body {
                    padding: 40px;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

            </style>

        </head>

        <body>${escapeHtml(text)}</body>

        </html>
    `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();

    printWindow.print();
  };
}

/* =========================================================
   CLEAR
   ========================================================= */

function clearWorkspace() {
  if (!state.file) {
    return;
  }

  const confirmed = confirm("Clear the current document?");

  if (!confirmed) return;

  resetDocumentState();

  workspace.classList.add("hidden");

  emptyState.classList.remove("hidden");

  switchView("overview");

  showToast("Workspace cleared.");
}

function resetDocumentState() {
  if (state.imageUrl) {
    URL.revokeObjectURL(state.imageUrl);
  }

  state.file = null;
  state.type = null;

  state.pdf = null;

  state.currentPage = 1;
  state.totalPages = 1;

  state.text = "";
  state.pageTexts = [];

  state.imageUrl = null;

  extractedText.value = "";

  searchInput.value = "";

  searchResults.innerHTML = `
        <div class="search-empty">
            Search for a word or phrase to see matches.
        </div>
    `;

  searchCount.textContent = "0 results";

  pdfCanvas.classList.remove("hidden");

  pdfPageWrapper.classList.remove("hidden");

  imagePreview.classList.add("hidden");

  txtPreview.classList.add("hidden");
}

/* =========================================================
   THEME
   ========================================================= */

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";

  localStorage.setItem("docuelevator-theme", state.theme);

  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle("dark", state.theme === "dark");

  $("#themeToggle").textContent = state.theme === "dark" ? "☾" : "☼";
}

/* =========================================================
   LOADING
   ========================================================= */

function showLoading(message) {
  loadingText.textContent = message;

  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return (
    parseFloat((bytes / Math.pow(1024, index)).toFixed(2)) + " " + units[index]
  );
}

function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
