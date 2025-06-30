/**
 * Hindi-astra PDF Text Extractor
 * Specialized text extraction for PDF documents
 */

class HindiAstraPDFTextExtractor {
    constructor() {
        this.isInitialized = false;
        this.textLayers = [];
        this.extractionMethods = [];
        this.init();
    }

    /**
     * Initialize PDF text extractor
     */
    async init() {
        console.log('📄 Hindi-astra PDF Text Extractor initializing...');
        
        // Wait for PDF to be ready
        await this.waitForPDFReady();
        
        // Detect available extraction methods
        this.detectExtractionMethods();
        
        // Setup text layers
        this.setupTextLayers();
        
        this.isInitialized = true;
        console.log('✅ PDF Text Extractor ready!');
    }

    /**
     * Wait for PDF to be ready for text extraction
     */
    async waitForPDFReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                // Check for various PDF viewer types
                const pdfElements = [
                    document.querySelector('embed[type="application/pdf"]'),
                    document.querySelector('object[type="application/pdf"]'),
                    document.querySelector('#viewer'),
                    document.querySelector('.pdfViewer'),
                    document.querySelector('.textLayer')
                ];

                if (pdfElements.some(el => el !== null)) {
                    // Wait a bit more for text layers to load
                    setTimeout(resolve, 1000);
                } else {
                    setTimeout(checkReady, 500);
                }
            };
            checkReady();
        });
    }

    /**
     * Detect available text extraction methods
     */
    detectExtractionMethods() {
        this.extractionMethods = [];
        const isLocalFile = window.location.protocol === 'file:';

        // Method 1: PDF.js text layers
        if (document.querySelector('.textLayer')) {
            this.extractionMethods.push('pdfjs-textlayer');
            console.log('📄 PDF.js text layers detected');
        }

        // Method 2: Chrome PDF viewer (works differently for local files)
        if (document.querySelector('embed[type="application/pdf"]')) {
            this.extractionMethods.push(isLocalFile ? 'chrome-embed-local' : 'chrome-embed');
            console.log(`📄 Chrome PDF embed detected (${isLocalFile ? 'local' : 'web'})`);
        }

        // Method 3: Generic PDF object
        if (document.querySelector('object[type="application/pdf"]')) {
            this.extractionMethods.push('pdf-object');
            console.log('📄 PDF object detected');
        }

        // Method 4: Custom PDF viewers
        if (document.querySelector('[data-pdf-viewer]')) {
            this.extractionMethods.push('custom-viewer');
            console.log('📄 Custom PDF viewer detected');
        }

        // Method 5: Local file specific detection
        if (isLocalFile) {
            this.extractionMethods.push('local-file-extraction');
            console.log('📄 Local file extraction method added');
        }

        // Method 6: Chrome's internal PDF viewer
        if (document.querySelector('#viewer') || document.querySelector('.pdfViewer')) {
            this.extractionMethods.push('chrome-internal-viewer');
            console.log('📄 Chrome internal PDF viewer detected');
        }

        if (this.extractionMethods.length === 0) {
            console.log('📄 No PDF text extraction methods detected - using fallback');
            this.extractionMethods.push('fallback');
        }

        console.log('📄 Available extraction methods:', this.extractionMethods);
    }

    /**
     * Setup text layers for extraction
     */
    setupTextLayers() {
        // Find all text layers
        this.textLayers = Array.from(document.querySelectorAll('.textLayer, .textLayerDiv, [class*="text"]'));
        
        // Make text layers selectable
        this.textLayers.forEach(layer => {
            layer.style.userSelect = 'text';
            layer.style.pointerEvents = 'auto';
            
            // Add data attribute for identification
            layer.setAttribute('data-hindi-astra-text-layer', 'true');
        });

        console.log(`📄 Found ${this.textLayers.length} text layers`);
    }

    /**
     * Extract text from PDF using best available method
     */
    extractText(element, options = {}) {
        if (!this.isInitialized) {
            console.warn('PDF Text Extractor not initialized');
            return null;
        }

        // Try each extraction method in order of preference
        for (const method of this.extractionMethods) {
            try {
                const text = this.extractByMethod(element, method, options);
                if (text && text.trim().length > 0) {
                    return this.cleanPDFText(text);
                }
            } catch (error) {
                console.warn(`PDF extraction method ${method} failed:`, error);
            }
        }

        return null;
    }

    /**
     * Extract text using specific method
     */
    extractByMethod(element, method, options) {
        switch (method) {
            case 'pdfjs-textlayer':
                return this.extractFromPDFJSTextLayer(element, options);
            case 'chrome-embed':
                return this.extractFromChromeEmbed(element, options);
            case 'chrome-embed-local':
                return this.extractFromChromeEmbedLocal(element, options);
            case 'pdf-object':
                return this.extractFromPDFObject(element, options);
            case 'custom-viewer':
                return this.extractFromCustomViewer(element, options);
            case 'local-file-extraction':
                return this.extractFromLocalFile(element, options);
            case 'chrome-internal-viewer':
                return this.extractFromChromeInternalViewer(element, options);
            case 'fallback':
                return this.extractFallback(element, options);
            default:
                return null;
        }
    }

    /**
     * Extract text from PDF.js text layers
     */
    extractFromPDFJSTextLayer(element, options) {
        // Find the closest text layer
        const textLayer = element.closest('.textLayer') || 
                          element.closest('.textLayerDiv') ||
                          element.querySelector('.textLayer') ||
                          element.querySelector('.textLayerDiv');

        if (!textLayer) {
            return element.textContent || element.innerText || '';
        }

        // Get text from text layer spans
        const textSpans = textLayer.querySelectorAll('span');
        let extractedText = '';

        if (textSpans.length > 0) {
            // Extract text from spans
            textSpans.forEach(span => {
                const text = span.textContent || span.innerText || '';
                if (text.trim()) {
                    extractedText += text + ' ';
                }
            });
        } else {
            // Fallback to layer text content
            extractedText = textLayer.textContent || textLayer.innerText || '';
        }

        return extractedText.trim();
    }

    /**
     * Extract text from Chrome PDF embed
     */
    extractFromChromeEmbed(element, options) {
        // Chrome PDF viewer doesn't expose text directly
        // Try to get text from selection or nearby elements
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.toString();
        }

        // Fallback to element text
        return element.textContent || element.innerText || '';
    }

    /**
     * Extract text from Chrome PDF embed (local files)
     */
    extractFromChromeEmbedLocal(element, options) {
        console.log('📄 Attempting local Chrome PDF extraction');

        // For local files, Chrome's PDF viewer behaves differently
        // Try multiple approaches

        // Method 1: Check for selection first
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim()) {
            console.log('📄 Got text from selection');
            return selection.toString();
        }

        // Method 2: Look for text in the embed element
        const embed = document.querySelector('embed[type="application/pdf"]');
        if (embed) {
            // Try to access the PDF document (may be restricted)
            try {
                const doc = embed.contentDocument || embed.contentWindow?.document;
                if (doc) {
                    const text = doc.body?.textContent || doc.body?.innerText || '';
                    if (text.trim()) {
                        console.log('📄 Got text from embed document');
                        return text;
                    }
                }
            } catch (e) {
                console.log('📄 Cannot access embed document (security restriction)');
            }
        }

        // Method 3: Fallback to element text
        return element.textContent || element.innerText || '';
    }

    /**
     * Extract text from Chrome's internal PDF viewer
     */
    extractFromChromeInternalViewer(element, options) {
        console.log('📄 Attempting Chrome internal viewer extraction');

        // Look for text in viewer elements
        const viewer = document.querySelector('#viewer') || document.querySelector('.pdfViewer');
        if (viewer) {
            // Check for text layers within the viewer
            const textLayers = viewer.querySelectorAll('.textLayer, .textLayerDiv, [class*="text"]');
            if (textLayers.length > 0) {
                let combinedText = '';
                textLayers.forEach(layer => {
                    const layerText = layer.textContent || layer.innerText || '';
                    if (layerText.trim()) {
                        combinedText += layerText + ' ';
                    }
                });
                if (combinedText.trim()) {
                    console.log('📄 Got text from viewer text layers');
                    return combinedText.trim();
                }
            }
        }

        // Fallback to selection or element text
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim()) {
            return selection.toString();
        }

        return element.textContent || element.innerText || '';
    }

    /**
     * Extract text from local file
     */
    extractFromLocalFile(element, options) {
        console.log('📄 Attempting local file extraction');

        // For local files, we need to be more aggressive in finding text

        // Method 1: Check current selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim()) {
            console.log('📄 Got text from local file selection');
            return selection.toString();
        }

        // Method 2: Look for any text content in the document
        const allTextElements = document.querySelectorAll('*');
        let bestText = '';

        for (const el of allTextElements) {
            const text = el.textContent || el.innerText || '';
            if (text.trim() && text.length > bestText.length && text.length < 1000) {
                // Prefer longer text but not too long
                bestText = text;
            }
        }

        if (bestText.trim()) {
            console.log('📄 Got text from local file elements');
            return bestText;
        }

        // Method 3: Try to get text from the specific element
        return element.textContent || element.innerText || '';
    }

    /**
     * Extract text from PDF object
     */
    extractFromPDFObject(element, options) {
        // Similar to Chrome embed - limited text access
        return element.textContent || element.innerText || '';
    }

    /**
     * Extract text from custom PDF viewer
     */
    extractFromCustomViewer(element, options) {
        // Look for common custom viewer text containers
        const textContainers = [
            element.querySelector('[class*="text"]'),
            element.querySelector('[data-text]'),
            element.querySelector('.pdf-text'),
            element.closest('[class*="text"]')
        ].filter(Boolean);

        if (textContainers.length > 0) {
            return textContainers[0].textContent || textContainers[0].innerText || '';
        }

        return element.textContent || element.innerText || '';
    }

    /**
     * Fallback text extraction
     */
    extractFallback(element, options) {
        return element.textContent || element.innerText || '';
    }

    /**
     * Clean extracted PDF text
     */
    cleanPDFText(text) {
        if (!text || typeof text !== 'string') return '';

        return text
            // Remove excessive whitespace
            .replace(/\s+/g, ' ')
            // Remove line breaks that split words
            .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2')
            // Normalize line breaks
            .replace(/\n+/g, ' ')
            // Remove control characters
            .replace(/[\x00-\x1F\x7F]/g, '')
            // Trim whitespace
            .trim();
    }

    /**
     * Extract text from coordinates (for area selection)
     */
    extractTextFromArea(x, y, width, height) {
        const elements = [];
        
        // Sample multiple points within the area
        const samplePoints = [
            [x + width * 0.25, y + height * 0.25],
            [x + width * 0.5, y + height * 0.5],
            [x + width * 0.75, y + height * 0.75]
        ];

        samplePoints.forEach(([px, py]) => {
            const element = document.elementFromPoint(px, py);
            if (element && !elements.includes(element)) {
                elements.push(element);
            }
        });

        // Extract text from all found elements
        let combinedText = '';
        elements.forEach(element => {
            const text = this.extractText(element);
            if (text) {
                combinedText += text + ' ';
            }
        });

        return combinedText.trim() || null;
    }

    /**
     * Check if element is in a PDF text layer
     */
    isInTextLayer(element) {
        return element.closest('.textLayer') !== null ||
               element.closest('.textLayerDiv') !== null ||
               element.hasAttribute('data-hindi-astra-text-layer');
    }

    /**
     * Get all available text from current page
     */
    getAllPageText() {
        let allText = '';
        
        this.textLayers.forEach(layer => {
            const text = this.extractText(layer);
            if (text) {
                allText += text + '\n';
            }
        });

        return allText.trim();
    }

    /**
     * Get extraction statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            textLayersFound: this.textLayers.length,
            extractionMethods: this.extractionMethods,
            totalTextLength: this.getAllPageText().length
        };
    }
}

// Initialize PDF text extractor
window.hindiAstraPDFTextExtractor = new HindiAstraPDFTextExtractor();

console.log('📄 Hindi-astra PDF Text Extractor loaded');
