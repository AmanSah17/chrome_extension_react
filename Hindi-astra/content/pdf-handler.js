/**
 * Hindi-astra PDF Handler
 * Specialized handler for PDF documents, scanned documents, and academic papers
 */

class HindiAstraPDFHandler {
    constructor() {
        this.isInitialized = false;
        this.pdfViewer = null;
        this.textLayers = [];
        this.scannedTextCache = new Map();
        this.init();
    }

    /**
     * Initialize PDF handler
     */
    async init() {
        console.log('🔍 Hindi-astra PDF Handler initializing...');
        
        // Wait for PDF to load
        await this.waitForPDFLoad();
        
        // Detect PDF type (native PDF vs scanned)
        await this.detectPDFType();
        
        // Setup text extraction
        this.setupTextExtraction();
        
        this.isInitialized = true;
        console.log('✅ Hindi-astra PDF Handler initialized successfully');
    }

    /**
     * Wait for PDF viewer to load
     */
    async waitForPDFLoad() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20; // 10 seconds max wait

            const checkPDF = () => {
                attempts++;

                // Check for various PDF viewer types
                const embedElement = document.querySelector('embed[type="application/pdf"]');
                const objectElement = document.querySelector('object[type="application/pdf"]');
                const pdfViewer = document.querySelector('#viewer');
                const pdfContainer = document.querySelector('.pdfViewer');

                // For local files, also check if document is ready
                const isLocalFile = window.location.protocol === 'file:';
                const documentReady = document.readyState === 'complete';

                if (embedElement || objectElement || pdfViewer || pdfContainer) {
                    this.pdfViewer = embedElement || objectElement || pdfViewer || pdfContainer;
                    console.log('📄 PDF viewer found:', this.pdfViewer.tagName);
                    resolve();
                } else if (isLocalFile && documentReady && attempts > 5) {
                    // For local files, give it more time but don't wait forever
                    console.log('📄 Local PDF detected, proceeding without specific viewer');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.log('📄 PDF viewer not found after maximum attempts');
                    resolve();
                } else {
                    setTimeout(checkPDF, 500);
                }
            };
            checkPDF();
        });
    }

    /**
     * Detect if PDF is native text or scanned image
     */
    async detectPDFType() {
        try {
            // Look for text layers in PDF
            const textLayers = document.querySelectorAll('.textLayer, [class*="text"], [class*="Text"]');
            
            if (textLayers.length > 0) {
                this.textLayers = Array.from(textLayers);
                console.log('📄 Native PDF detected with text layers');
                return 'native';
            } else {
                console.log('🖼️ Scanned PDF detected - will use OCR fallback');
                return 'scanned';
            }
        } catch (error) {
            console.error('Error detecting PDF type:', error);
            return 'unknown';
        }
    }

    /**
     * Setup text extraction for different PDF types
     */
    setupTextExtraction() {
        // For native PDFs with text layers
        if (this.textLayers.length > 0) {
            this.setupNativePDFExtraction();
        } else {
            this.setupScannedPDFExtraction();
        }
    }

    /**
     * Setup text extraction for native PDFs
     */
    setupNativePDFExtraction() {
        this.textLayers.forEach((layer) => {
            // Make text selectable
            layer.style.userSelect = 'text';
            layer.style.pointerEvents = 'auto';

            // Add selection event listeners
            layer.addEventListener('mouseup', this.handleTextSelection.bind(this));
            layer.addEventListener('touchend', this.handleTextSelection.bind(this));
        });

        // Also add global selection handlers
        this.setupGlobalSelectionHandlers();
    }

    /**
     * Setup global selection handlers for PDF
     */
    setupGlobalSelectionHandlers() {
        // Add global mouseup listener for PDF text selection
        document.addEventListener('mouseup', this.handleGlobalTextSelection.bind(this));
        document.addEventListener('touchend', this.handleGlobalTextSelection.bind(this));

        // Add keyboard shortcut support
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    /**
     * Handle global text selection in PDF
     */
    handleGlobalTextSelection(_event) {
        // Only handle if we're in a PDF
        if (!this.isInitialized) return;

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Create translation popup
            this.showTranslationPopup(selectedText, {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                context: 'pdf_global'
            });
        }
    }

    /**
     * Handle keyboard shortcuts in PDF
     */
    handleKeyboardShortcuts(event) {
        // Ctrl+Shift+T or Cmd+Shift+T for translation
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
            event.preventDefault();

            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const selectedText = selection.toString().trim();
                if (selectedText) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();

                    this.showTranslationPopup(selectedText, {
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY,
                        context: 'pdf_keyboard'
                    });
                }
            }
        }
    }

    /**
     * Setup text extraction for scanned PDFs
     */
    setupScannedPDFExtraction() {
        // Create overlay for text selection on scanned PDFs
        this.createScannedPDFOverlay();
        
        // Setup OCR fallback (simplified version)
        this.setupOCRFallback();
    }

    /**
     * Create overlay for scanned PDF interaction
     */
    createScannedPDFOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'hindi-astra-pdf-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            pointer-events: auto;
            background: transparent;
        `;

        // Add to PDF container
        const pdfContainer = document.querySelector('#viewer') || document.body;
        pdfContainer.appendChild(overlay);

        // Add selection handlers
        overlay.addEventListener('mousedown', this.startAreaSelection.bind(this));
        overlay.addEventListener('mousemove', this.updateAreaSelection.bind(this));
        overlay.addEventListener('mouseup', this.endAreaSelection.bind(this));
    }

    /**
     * Handle text selection in native PDFs
     */
    handleTextSelection(_event) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Create translation popup
            this.showTranslationPopup(selectedText, {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                context: 'academic_pdf'
            });
        }
    }

    /**
     * Start area selection for scanned PDFs
     */
    startAreaSelection(event) {
        this.isSelecting = true;
        this.selectionStart = { x: event.clientX, y: event.clientY };
        
        // Create selection rectangle
        this.selectionRect = document.createElement('div');
        this.selectionRect.style.cssText = `
            position: absolute;
            border: 2px dashed #007bff;
            background: rgba(0, 123, 255, 0.1);
            pointer-events: none;
            z-index: 1001;
        `;
        document.body.appendChild(this.selectionRect);
    }

    /**
     * Update area selection
     */
    updateAreaSelection(event) {
        if (!this.isSelecting) return;

        const currentX = event.clientX;
        const currentY = event.clientY;
        const startX = this.selectionStart.x;
        const startY = this.selectionStart.y;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        this.selectionRect.style.left = left + 'px';
        this.selectionRect.style.top = top + 'px';
        this.selectionRect.style.width = width + 'px';
        this.selectionRect.style.height = height + 'px';
    }

    /**
     * End area selection and attempt OCR
     */
    async endAreaSelection(_event) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        
        // Get selected area
        const rect = this.selectionRect.getBoundingClientRect();
        
        // Remove selection rectangle
        this.selectionRect.remove();
        
        // Attempt to extract text from selected area
        try {
            const extractedText = await this.extractTextFromArea(rect);
            if (extractedText) {
                this.showTranslationPopup(extractedText, {
                    x: rect.left,
                    y: rect.top,
                    context: 'scanned_pdf'
                });
            } else {
                this.showOCRUnavailableMessage(rect);
            }
        } catch (error) {
            console.error('Text extraction failed:', error);
            this.showOCRUnavailableMessage(rect);
        }
    }

    /**
     * Extract text from selected area using OCR
     */
    async extractTextFromArea(rect) {
        console.log('📄 Attempting text extraction from selected area');

        // Try OCR first if available
        if (window.hindiAstraOCR && window.hindiAstraOCR.isAvailable()) {
            try {
                console.log('👁️ Using OCR for text extraction');

                const result = await window.hindiAstraOCR.extractTextFromArea(
                    rect.left,
                    rect.top,
                    rect.width,
                    rect.height
                );

                if (result.text && result.text.trim().length > 0) {
                    console.log('✅ OCR extraction successful:', result.text);
                    console.log('OCR Confidence:', Math.round(result.confidence * 100) + '%');

                    // If confidence is low, offer manual input as backup
                    if (result.confidence < 0.7) {
                        return await this.showOCRResultWithFallback(result.text, rect);
                    }

                    return result.text;
                } else {
                    console.log('⚠️ OCR returned empty text, falling back to manual input');
                }
            } catch (error) {
                console.error('❌ OCR extraction failed:', error);
                console.log('📝 Falling back to manual text input');
            }
        } else {
            console.log('📝 OCR not available, using manual text input');
        }

        // Fallback to manual text input
        return await this.showManualTextInput(rect);
    }

    /**
     * Show OCR result with option to correct it
     */
    async showOCRResultWithFallback(ocrText, rect) {
        return new Promise((resolve) => {
            const modal = this.createOCRResultModal(ocrText, rect);
            modal.onSubmit = (text) => {
                resolve(text);
                modal.remove();
            };
            modal.onCancel = () => {
                resolve(null);
                modal.remove();
            };
        });
    }

    /**
     * Show manual text input modal
     */
    async showManualTextInput(rect) {
        return new Promise((resolve) => {
            const modal = this.createTextInputModal(rect);
            modal.onSubmit = (text) => {
                resolve(text);
                modal.remove();
            };
            modal.onCancel = () => {
                resolve(null);
                modal.remove();
            };
        });
    }

    /**
     * Create text input modal for scanned content
     */
    createTextInputModal(_rect) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 300px;
        `;

        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #007bff;">📖 Hindi-astra OCR Assistant</h3>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">
                Please type the English text from the selected area:
            </p>
            <textarea id="ocr-text-input" style="
                width: 100%;
                height: 100px;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px;
                font-family: Arial, sans-serif;
                resize: vertical;
            " placeholder="Type the English text here..."></textarea>
            <div style="margin-top: 15px; text-align: right;">
                <button id="ocr-cancel" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    margin-right: 10px;
                    cursor: pointer;
                ">Cancel</button>
                <button id="ocr-translate" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Translate</button>
            </div>
        `;

        document.body.appendChild(modal);

        const textInput = modal.querySelector('#ocr-text-input');
        const cancelBtn = modal.querySelector('#ocr-cancel');
        const translateBtn = modal.querySelector('#ocr-translate');

        textInput.focus();

        cancelBtn.onclick = () => modal.onCancel();
        translateBtn.onclick = () => {
            const text = textInput.value.trim();
            if (text) {
                modal.onSubmit(text);
            }
        };

        // Handle Enter key
        textInput.onkeydown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                translateBtn.click();
            }
        };

        return modal;
    }

    /**
     * Create OCR result modal with correction option
     */
    createOCRResultModal(ocrText, _rect) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #28a745;">👁️ OCR Text Detected</h3>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">
                OCR detected the following text. Please review and correct if needed:
            </p>
            <textarea id="ocr-text-input" style="
                width: 100%;
                height: 100px;
                border: 1px solid #28a745;
                border-radius: 4px;
                padding: 8px;
                font-family: Arial, sans-serif;
                resize: vertical;
                font-size: 14px;
            ">${ocrText}</textarea>
            <div style="margin-top: 15px; text-align: right;">
                <button id="ocr-cancel" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    margin-right: 10px;
                    cursor: pointer;
                ">Cancel</button>
                <button id="ocr-use-as-is" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    margin-right: 10px;
                    cursor: pointer;
                ">Use As Is</button>
                <button id="ocr-translate" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Translate</button>
            </div>
        `;

        document.body.appendChild(modal);

        const textInput = modal.querySelector('#ocr-text-input');
        const cancelBtn = modal.querySelector('#ocr-cancel');
        const useAsIsBtn = modal.querySelector('#ocr-use-as-is');
        const translateBtn = modal.querySelector('#ocr-translate');

        // Select all text for easy editing
        textInput.select();

        cancelBtn.onclick = () => modal.onCancel();
        useAsIsBtn.onclick = () => modal.onSubmit(ocrText);
        translateBtn.onclick = () => {
            const text = textInput.value.trim();
            if (text) {
                modal.onSubmit(text);
            }
        };

        // Handle Enter key
        textInput.onkeydown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                translateBtn.click();
            }
        };

        return modal;
    }

    /**
     * Show OCR unavailable message
     */
    showOCRUnavailableMessage(rect) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            left: ${rect.left}px;
            top: ${rect.top - 40}px;
            background: #ff6b6b;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        message.textContent = 'OCR not available - please select text manually';
        document.body.appendChild(message);

        setTimeout(() => message.remove(), 3000);
    }

    /**
     * Show translation popup
     */
    async showTranslationPopup(text, options) {
        // Use the main translation engine
        if (window.hindiAstraTranslator) {
            await window.hindiAstraTranslator.showTranslationPopup(text, options);
        } else {
            console.error('Hindi-astra translator not available');
        }
    }

    /**
     * Setup OCR fallback (placeholder for future OCR integration)
     */
    setupOCRFallback() {
        // Placeholder for OCR integration
        // In a full implementation, you would integrate Tesseract.js or similar
        console.log('📷 OCR fallback ready for scanned documents');
    }
}

// Initialize PDF handler when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.hindiAstraPDFHandler = new HindiAstraPDFHandler();
    });
} else {
    window.hindiAstraPDFHandler = new HindiAstraPDFHandler();
}

console.log('📄 Hindi-astra PDF Handler loaded');
