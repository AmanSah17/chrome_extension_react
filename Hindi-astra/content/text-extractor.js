/**
 * Hindi-astra Text Extractor
 * Extracts text from various document types and web pages
 */

class HindiAstraTextExtractor {
    constructor() {
        this.extractors = new Map();
        this.init();
    }

    /**
     * Initialize text extractor
     */
    init() {
        console.log('📝 Hindi-astra Text Extractor initializing...');
        
        // Register extractors for different content types
        this.registerExtractors();
        
        console.log('✅ Text Extractor ready!');
    }

    /**
     * Register extractors for different content types
     */
    registerExtractors() {
        // Web page text extractor
        this.extractors.set('webpage', this.extractWebPageText.bind(this));
        
        // PDF text extractor
        this.extractors.set('pdf', this.extractPDFText.bind(this));
        
        // Input field extractor
        this.extractors.set('input', this.extractInputText.bind(this));
        
        // Selection extractor
        this.extractors.set('selection', this.extractSelectionText.bind(this));
    }

    /**
     * Extract text from web page elements
     */
    extractWebPageText(element) {
        if (!element) return null;

        // Get text content, preserving some structure
        let text = '';
        
        if (element.nodeType === Node.TEXT_NODE) {
            text = element.textContent.trim();
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            // Handle different element types
            switch (element.tagName.toLowerCase()) {
                case 'input':
                case 'textarea':
                    text = element.value;
                    break;
                case 'img':
                    text = element.alt || element.title || '';
                    break;
                case 'a':
                    text = element.textContent || element.href;
                    break;
                default:
                    text = element.textContent || element.innerText || '';
            }
        }

        return this.cleanText(text);
    }

    /**
     * Extract text from PDF elements
     */
    extractPDFText(element) {
        if (!element) return null;

        // Try different PDF text extraction methods
        let text = '';

        // Method 1: Text layer elements
        if (element.classList.contains('textLayer') || 
            element.closest('.textLayer')) {
            text = element.textContent || '';
        }
        
        // Method 2: PDF.js text elements
        else if (element.classList.contains('textLayerDiv') ||
                 element.closest('.textLayerDiv')) {
            text = element.textContent || '';
        }
        
        // Method 3: Generic text extraction
        else {
            text = element.textContent || element.innerText || '';
        }

        return this.cleanText(text);
    }

    /**
     * Extract text from input fields
     */
    extractInputText(element) {
        if (!element) return null;

        let text = '';
        
        if (element.tagName.toLowerCase() === 'input') {
            text = element.value || element.placeholder || '';
        } else if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value || element.placeholder || '';
        } else if (element.contentEditable === 'true') {
            text = element.textContent || element.innerText || '';
        }

        return this.cleanText(text);
    }

    /**
     * Extract text from current selection
     */
    extractSelectionText() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;

        const selectedText = selection.toString().trim();
        return this.cleanText(selectedText);
    }

    /**
     * Clean and normalize extracted text
     */
    cleanText(text) {
        if (!text || typeof text !== 'string') return '';

        return text
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Remove leading/trailing whitespace
            .trim()
            // Remove control characters
            .replace(/[\x00-\x1F\x7F]/g, '')
            // Normalize quotes
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'");
    }

    /**
     * Extract text from element with context detection
     */
    extractText(element, context = 'auto') {
        if (!element) return null;

        // Auto-detect context if not specified
        if (context === 'auto') {
            context = this.detectContext(element);
        }

        // Use appropriate extractor
        const extractor = this.extractors.get(context) || this.extractors.get('webpage');
        return extractor(element);
    }

    /**
     * Detect context for text extraction
     */
    detectContext(element) {
        if (!element) return 'webpage';

        // Check if we're in a PDF
        if (window.hindiAstraPDFDetector && window.hindiAstraPDFDetector.getStatus().isPDF) {
            return 'pdf';
        }

        // Check element type
        const tagName = element.tagName ? element.tagName.toLowerCase() : '';
        
        if (tagName === 'input' || tagName === 'textarea' || element.contentEditable === 'true') {
            return 'input';
        }

        // Check for PDF-specific classes
        if (element.classList.contains('textLayer') || 
            element.closest('.textLayer') ||
            element.classList.contains('textLayerDiv') ||
            element.closest('.textLayerDiv')) {
            return 'pdf';
        }

        return 'webpage';
    }

    /**
     * Extract text from selection with position info
     */
    extractSelectionWithPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const text = this.extractSelectionText();

        if (!text) return null;

        return {
            text: text,
            position: {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height
            },
            range: range,
            context: this.detectContext(range.commonAncestorContainer)
        };
    }

    /**
     * Extract text from specific coordinates (for OCR assistance)
     */
    extractTextFromCoordinates(x, y, width, height) {
        // Get elements in the specified area
        const elements = document.elementsFromPoint(x + width/2, y + height/2);
        
        let extractedText = '';
        
        for (const element of elements) {
            const text = this.extractText(element);
            if (text && text.length > extractedText.length) {
                extractedText = text;
            }
        }

        return extractedText || null;
    }

    /**
     * Check if text is likely English
     */
    isEnglishText(text) {
        if (!text || typeof text !== 'string') return false;
        
        // Basic English character check
        const englishRegex = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
        return englishRegex.test(text.trim());
    }

    /**
     * Check if text is suitable for translation
     */
    isTranslatableText(text) {
        if (!text || typeof text !== 'string') return false;
        
        const cleanText = text.trim();
        
        // Check length
        if (cleanText.length < 1 || cleanText.length > 500) return false;
        
        // Check if it's English
        if (!this.isEnglishText(cleanText)) return false;
        
        // Check if it's not just numbers or symbols
        const hasLetters = /[a-zA-Z]/.test(cleanText);
        if (!hasLetters) return false;
        
        return true;
    }
}

// Initialize text extractor
window.hindiAstraTextExtractor = new HindiAstraTextExtractor();

console.log('📝 Hindi-astra Text Extractor loaded');
