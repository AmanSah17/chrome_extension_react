/**
 * Hindi-astra Local PDF Fixer
 * Specialized handler for local PDF files that Chrome treats differently
 */

class HindiAstraLocalPDFFixer {
    constructor() {
        this.isLocalPDF = false;
        this.pdfViewerType = 'unknown';
        this.selectionHandler = null;
        this.init();
    }

    /**
     * Initialize local PDF fixer
     */
    async init() {
        console.log('🔧 Hindi-astra Local PDF Fixer initializing...');
        
        // Check if this is a local PDF
        this.detectLocalPDF();
        
        if (this.isLocalPDF) {
            console.log('📄 Local PDF detected, applying fixes...');
            
            // Wait for PDF to load
            await this.waitForPDFLoad();
            
            // Apply local PDF specific fixes
            this.applyLocalPDFFixes();
            
            // Setup enhanced selection handling
            this.setupEnhancedSelection();
            
            console.log('✅ Local PDF fixes applied successfully');
        } else {
            console.log('ℹ️ Not a local PDF, skipping local fixes');
        }
    }

    /**
     * Detect if this is a local PDF file
     */
    detectLocalPDF() {
        const url = window.location.href;
        
        // Check for file:// protocol with PDF
        if (url.startsWith('file://') && url.toLowerCase().includes('.pdf')) {
            this.isLocalPDF = true;
            this.pdfViewerType = 'file_protocol';
            console.log('📄 Local PDF detected via file:// protocol');
            return;
        }

        // Check for Chrome's internal PDF viewer with local file
        if (url.includes('chrome-extension://') && url.includes('file://')) {
            this.isLocalPDF = true;
            this.pdfViewerType = 'chrome_internal';
            console.log('📄 Local PDF detected via Chrome internal viewer');
            return;
        }

        // Check document title for local file indicators
        const title = document.title;
        if (title && (title.includes('file://') || title.includes('C:\\') || title.includes('/'))) {
            this.isLocalPDF = true;
            this.pdfViewerType = 'title_based';
            console.log('📄 Local PDF detected via document title');
            return;
        }
    }

    /**
     * Wait for PDF to fully load
     */
    async waitForPDFLoad() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30; // 15 seconds max wait
            
            const checkLoaded = () => {
                attempts++;
                
                // Check various indicators that PDF is loaded
                const indicators = [
                    document.readyState === 'complete',
                    document.querySelector('embed'),
                    document.querySelector('object'),
                    document.querySelector('#viewer'),
                    document.body && document.body.children.length > 0,
                    document.documentElement.scrollHeight > 100
                ];

                const loadedCount = indicators.filter(Boolean).length;
                
                if (loadedCount >= 3 || attempts >= maxAttempts) {
                    console.log(`📄 PDF load check: ${loadedCount}/6 indicators positive`);
                    resolve();
                } else {
                    setTimeout(checkLoaded, 500);
                }
            };
            
            checkLoaded();
        });
    }

    /**
     * Apply local PDF specific fixes
     */
    applyLocalPDFFixes() {
        // Fix 1: Ensure document is selectable
        this.makeDocumentSelectable();
        
        // Fix 2: Add CSS fixes for local PDFs
        this.addLocalPDFStyles();
        
        // Fix 3: Override Chrome's PDF viewer restrictions
        this.overridePDFRestrictions();
        
        // Fix 4: Add visual indicators
        this.addVisualIndicators();
    }

    /**
     * Make document text selectable
     */
    makeDocumentSelectable() {
        // Apply to document body
        if (document.body) {
            document.body.style.userSelect = 'text';
            document.body.style.webkitUserSelect = 'text';
            document.body.style.mozUserSelect = 'text';
            document.body.style.msUserSelect = 'text';
        }

        // Apply to all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.pointerEvents = 'auto';
            }
        });

        // Special handling for embed and object elements
        const pdfElements = document.querySelectorAll('embed, object');
        pdfElements.forEach(el => {
            el.style.userSelect = 'text';
            el.style.pointerEvents = 'auto';
            
            // Try to access content document
            try {
                const contentDoc = el.contentDocument || el.contentWindow?.document;
                if (contentDoc) {
                    contentDoc.body.style.userSelect = 'text';
                    console.log('📄 Made PDF content selectable');
                }
            } catch (e) {
                console.log('📄 Cannot access PDF content (security restriction)');
            }
        });

        console.log('📄 Applied selectability fixes');
    }

    /**
     * Add CSS fixes for local PDFs
     */
    addLocalPDFStyles() {
        const style = document.createElement('style');
        style.id = 'hindi-astra-local-pdf-fixes';
        style.textContent = `
            /* Local PDF Fixes */
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                pointer-events: auto !important;
            }
            
            embed, object, iframe {
                user-select: text !important;
                pointer-events: auto !important;
            }
            
            /* PDF viewer specific fixes */
            #viewer, .pdfViewer {
                user-select: text !important;
                pointer-events: auto !important;
            }
            
            /* Text layer fixes */
            .textLayer, .textLayerDiv {
                user-select: text !important;
                pointer-events: auto !important;
                opacity: 1 !important;
            }
            
            /* Selection highlighting */
            ::selection {
                background: rgba(102, 126, 234, 0.3) !important;
            }
            
            ::-moz-selection {
                background: rgba(102, 126, 234, 0.3) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('📄 Applied local PDF CSS fixes');
    }

    /**
     * Override PDF viewer restrictions
     */
    overridePDFRestrictions() {
        // Override common PDF viewer restrictions
        const overrides = {
            'user-select': 'text',
            'pointer-events': 'auto',
            '-webkit-user-select': 'text',
            '-moz-user-select': 'text'
        };

        // Apply overrides periodically (some PDF viewers reset styles)
        const applyOverrides = () => {
            document.querySelectorAll('*').forEach(el => {
                Object.entries(overrides).forEach(([prop, value]) => {
                    el.style.setProperty(prop, value, 'important');
                });
            });
        };

        // Apply immediately and then periodically
        applyOverrides();
        setInterval(applyOverrides, 2000);

        console.log('📄 Applied PDF restriction overrides');
    }

    /**
     * Add visual indicators for local PDF
     */
    addVisualIndicators() {
        // Add indicator that Hindi-astra is active
        const indicator = document.createElement('div');
        indicator.id = 'hindi-astra-local-pdf-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
        `;
        indicator.textContent = '🌐 Hindi-astra Active';
        indicator.title = 'Select English text to translate to Hindi';
        
        document.body.appendChild(indicator);

        // Remove indicator after 5 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s';
                setTimeout(() => indicator.remove(), 500);
            }
        }, 5000);

        console.log('📄 Added visual indicators');
    }

    /**
     * Setup enhanced selection handling for local PDFs
     */
    setupEnhancedSelection() {
        // Remove any existing handlers
        if (this.selectionHandler) {
            document.removeEventListener('mouseup', this.selectionHandler);
        }

        // Create enhanced selection handler
        this.selectionHandler = (event) => {
            setTimeout(() => this.handleLocalPDFSelection(event), 100);
        };

        // Add selection handlers
        document.addEventListener('mouseup', this.selectionHandler);
        document.addEventListener('touchend', this.selectionHandler);
        
        // Add keyboard handler
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                this.handleLocalPDFSelection(event);
            }
        });

        console.log('📄 Enhanced selection handlers setup');
    }

    /**
     * Handle text selection in local PDF
     */
    async handleLocalPDFSelection(event) {
        try {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (!selectedText || selectedText.length === 0) {
                return;
            }

            // Check if text is English and reasonable length
            if (!this.isEnglishText(selectedText) || selectedText.length > 200) {
                return;
            }

            console.log('📄 Local PDF text selected:', selectedText);

            // Get selection position
            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;

            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                x = rect.left + window.scrollX;
                y = rect.top + window.scrollY;
            }

            // Show translation popup
            await this.showTranslationPopup(selectedText, { x, y });

        } catch (error) {
            console.error('📄 Local PDF selection error:', error);
        }
    }

    /**
     * Check if text is English
     */
    isEnglishText(text) {
        const englishRegex = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
        return englishRegex.test(text.trim());
    }

    /**
     * Show translation popup
     */
    async showTranslationPopup(text, position) {
        try {
            // Use the main translator if available
            if (window.hindiAstraTranslator) {
                await window.hindiAstraTranslator.showTranslationPopup(text, {
                    x: position.x,
                    y: position.y,
                    context: 'local_pdf'
                });
            } else {
                // Fallback: create simple popup
                this.createFallbackPopup(text, position);
            }
        } catch (error) {
            console.error('📄 Translation popup error:', error);
            this.createFallbackPopup(text, position);
        }
    }

    /**
     * Create fallback popup if main translator not available
     */
    createFallbackPopup(text, position) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: absolute;
            left: ${position.x}px;
            top: ${position.y - 10}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        popup.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">${text}</div>
            <div style="font-size: 12px; opacity: 0.9;">Translation loading...</div>
        `;

        document.body.appendChild(popup);

        // Remove after 3 seconds
        setTimeout(() => popup.remove(), 3000);
    }

    /**
     * Get status of local PDF fixer
     */
    getStatus() {
        return {
            isLocalPDF: this.isLocalPDF,
            pdfViewerType: this.pdfViewerType,
            hasSelectionHandler: !!this.selectionHandler,
            url: window.location.href
        };
    }
}

// Initialize local PDF fixer
window.hindiAstraLocalPDFFixer = new HindiAstraLocalPDFFixer();

console.log('🔧 Hindi-astra Local PDF Fixer loaded');
