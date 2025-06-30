/**
 * Hindi-astra PDF Detector
 * Detects PDF documents and initializes appropriate handlers
 */

class HindiAstraPDFDetector {
    constructor() {
        this.isPDF = false;
        this.pdfType = 'unknown';
        this.init();
    }

    /**
     * Initialize PDF detection
     */
    init() {
        console.log('🔍 Hindi-astra PDF Detector initializing...');
        
        // Detect if current page is a PDF
        this.detectPDF();
        
        // Setup observers for dynamic content
        this.setupObservers();
        
        console.log(`📄 PDF Detection: ${this.isPDF ? 'PDF detected' : 'Regular webpage'}`);
    }

    /**
     * Detect if current page is a PDF
     */
    detectPDF() {
        // Check URL for PDF extension (including file:// URLs)
        const url = window.location.href.toLowerCase();
        if (url.includes('.pdf')) {
            this.isPDF = true;
            this.pdfType = url.startsWith('file://') ? 'local_pdf' : 'url_pdf';
            console.log(`📄 PDF detected: ${this.pdfType} - ${url}`);
            return;
        }

        // Special handling for Chrome's PDF viewer
        if (url.includes('chrome-extension://') && url.includes('pdf')) {
            this.isPDF = true;
            this.pdfType = 'chrome_pdf_viewer';
            console.log('📄 Chrome PDF viewer detected');
            return;
        }

        // Check for file:// protocol with PDF content type
        if (url.startsWith('file://') && this.isLikelyPDF()) {
            this.isPDF = true;
            this.pdfType = 'local_file_pdf';
            console.log('📄 Local file PDF detected');
            return;
        }

        // Check for PDF viewer elements
        const pdfElements = [
            'embed[type="application/pdf"]',
            'object[type="application/pdf"]',
            '#viewer', // Chrome PDF viewer
            '.pdfViewer', // PDF.js viewer
            '[data-pdf-viewer]'
        ];

        for (const selector of pdfElements) {
            if (document.querySelector(selector)) {
                this.isPDF = true;
                this.pdfType = 'embedded_pdf';
                return;
            }
        }

        // Check document title
        const title = document.title.toLowerCase();
        if (title.includes('pdf') || title.includes('.pdf')) {
            this.isPDF = true;
            this.pdfType = 'title_pdf';
            console.log('📄 PDF detected from title');
            return;
        }

        // Check for Chrome's internal PDF viewer indicators
        if (document.querySelector('embed[type="application/pdf"]') ||
            document.querySelector('object[data*=".pdf"]') ||
            document.querySelector('iframe[src*=".pdf"]')) {
            this.isPDF = true;
            this.pdfType = 'embedded_pdf';
            console.log('📄 Embedded PDF detected');
            return;
        }

        // Check meta tags
        const contentType = document.querySelector('meta[http-equiv="content-type"]');
        if (contentType && contentType.content.includes('application/pdf')) {
            this.isPDF = true;
            this.pdfType = 'meta_pdf';
            return;
        }
    }

    /**
     * Setup observers for dynamic content
     */
    setupObservers() {
        // Observer for DOM changes (for SPAs)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Re-check for PDF elements
                    const wasPDF = this.isPDF;
                    this.detectPDF();
                    
                    if (this.isPDF && !wasPDF) {
                        console.log('📄 PDF detected after DOM change');
                        this.notifyPDFDetected();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Notify other components that PDF was detected
     */
    notifyPDFDetected() {
        // Dispatch custom event
        const event = new CustomEvent('hindiAstraPDFDetected', {
            detail: {
                isPDF: this.isPDF,
                pdfType: this.pdfType
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Check if current page is likely a PDF based on various indicators
     */
    isLikelyPDF() {
        // Check content type
        const contentType = document.contentType || '';
        if (contentType.includes('application/pdf')) {
            return true;
        }

        // Check for PDF-specific elements that might load later
        const pdfIndicators = [
            () => document.querySelector('embed[type="application/pdf"]'),
            () => document.querySelector('object[type="application/pdf"]'),
            () => document.querySelector('#viewer'),
            () => document.querySelector('.pdfViewer'),
            () => document.querySelector('[data-pdf]'),
            () => document.body && document.body.innerHTML.includes('PDF')
        ];

        return pdfIndicators.some(check => {
            try {
                return check();
            } catch (e) {
                return false;
            }
        });
    }

    /**
     * Get PDF detection status
     */
    getStatus() {
        return {
            isPDF: this.isPDF,
            pdfType: this.pdfType,
            url: window.location.href,
            isLocal: window.location.protocol === 'file:'
        };
    }
}

// Initialize PDF detector
window.hindiAstraPDFDetector = new HindiAstraPDFDetector();

console.log('🔍 Hindi-astra PDF Detector loaded');
