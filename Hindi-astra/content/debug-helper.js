/**
 * Hindi-astra Debug Helper
 * Diagnostic tool for troubleshooting PDF and local file issues
 */

class HindiAstraDebugHelper {
    constructor() {
        this.debugInfo = {};
        this.init();
    }

    /**
     * Initialize debug helper
     */
    init() {
        console.log('🔍 Hindi-astra Debug Helper initializing...');
        
        // Collect debug information
        this.collectDebugInfo();
        
        // Add debug commands to window
        this.addDebugCommands();
        
        console.log('✅ Debug Helper ready! Type hindiAstraDebug.help() for commands');
    }

    /**
     * Collect comprehensive debug information
     */
    collectDebugInfo() {
        this.debugInfo = {
            // Environment info
            environment: {
                url: window.location.href,
                protocol: window.location.protocol,
                isLocal: window.location.protocol === 'file:',
                userAgent: navigator.userAgent,
                chromeVersion: this.getChromeVersion(),
                timestamp: new Date().toISOString()
            },
            
            // PDF detection
            pdfDetection: {
                isPDF: false,
                pdfType: 'unknown',
                detectionMethods: []
            },
            
            // Extension status
            extension: {
                isLoaded: false,
                components: {},
                permissions: {}
            },
            
            // DOM elements
            domElements: {
                pdfViewers: [],
                textLayers: [],
                embedElements: []
            }
        };

        this.updateDebugInfo();
    }

    /**
     * Update debug information
     */
    updateDebugInfo() {
        // Check PDF detection
        if (window.hindiAstraPDFDetector) {
            const status = window.hindiAstraPDFDetector.getStatus();
            this.debugInfo.pdfDetection = {
                isPDF: status.isPDF,
                pdfType: status.pdfType,
                isLocal: status.isLocal,
                detectionMethods: ['PDF detector available']
            };
        }

        // Check extension components
        this.debugInfo.extension.components = {
            pdfDetector: !!window.hindiAstraPDFDetector,
            textExtractor: !!window.hindiAstraTextExtractor,
            translationEngine: !!window.hindiAstraEngine,
            translator: !!window.hindiAstraTranslator,
            uiComponents: !!window.hindiAstraUI,
            ocrEngine: !!window.hindiAstraOCR
        };

        // Check DOM elements
        this.debugInfo.domElements = {
            pdfViewers: this.findPDFViewers(),
            textLayers: this.findTextLayers(),
            embedElements: this.findEmbedElements()
        };
    }

    /**
     * Get Chrome version
     */
    getChromeVersion() {
        const match = navigator.userAgent.match(/Chrome\/(\d+)/);
        return match ? match[1] : 'Unknown';
    }

    /**
     * Find PDF viewers in the page
     */
    findPDFViewers() {
        const selectors = [
            'embed[type="application/pdf"]',
            'object[type="application/pdf"]',
            '#viewer',
            '.pdfViewer',
            '[data-pdf-viewer]'
        ];

        const viewers = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                viewers.push({
                    selector: selector,
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    src: el.src || el.data || 'N/A'
                });
            });
        });

        return viewers;
    }

    /**
     * Find text layers
     */
    findTextLayers() {
        const selectors = [
            '.textLayer',
            '.textLayerDiv',
            '[class*="text"]'
        ];

        const layers = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                layers.push({
                    selector: selector,
                    tagName: el.tagName,
                    className: el.className,
                    textLength: (el.textContent || '').length,
                    hasText: !!(el.textContent || '').trim()
                });
            });
        });

        return layers;
    }

    /**
     * Find embed elements
     */
    findEmbedElements() {
        const embeds = [];
        document.querySelectorAll('embed, object, iframe').forEach(el => {
            embeds.push({
                tagName: el.tagName,
                type: el.type,
                src: el.src || el.data,
                width: el.width,
                height: el.height
            });
        });
        return embeds;
    }

    /**
     * Add debug commands to window
     */
    addDebugCommands() {
        window.hindiAstraDebug = {
            help: () => this.showHelp(),
            info: () => this.showDebugInfo(),
            test: () => this.runDiagnosticTests(),
            pdf: () => this.testPDFDetection(),
            extract: () => this.testTextExtraction(),
            translate: (text) => this.testTranslation(text),
            permissions: () => this.checkPermissions(),
            export: () => this.exportDebugInfo()
        };
    }

    /**
     * Show help commands
     */
    showHelp() {
        console.log(`
🔍 Hindi-astra Debug Commands:

hindiAstraDebug.help()        - Show this help
hindiAstraDebug.info()        - Show debug information
hindiAstraDebug.test()        - Run diagnostic tests
hindiAstraDebug.pdf()         - Test PDF detection
hindiAstraDebug.extract()     - Test text extraction
hindiAstraDebug.translate()   - Test translation
hindiAstraDebug.permissions() - Check permissions
hindiAstraDebug.export()      - Export debug info

Example usage:
hindiAstraDebug.translate("hello world")
        `);
    }

    /**
     * Show debug information
     */
    showDebugInfo() {
        this.updateDebugInfo();
        console.log('🔍 Hindi-astra Debug Information:');
        console.table(this.debugInfo.environment);
        console.log('PDF Detection:', this.debugInfo.pdfDetection);
        console.log('Extension Components:', this.debugInfo.extension.components);
        console.log('DOM Elements:', this.debugInfo.domElements);
    }

    /**
     * Run diagnostic tests
     */
    runDiagnosticTests() {
        console.log('🧪 Running Hindi-astra Diagnostic Tests...');
        
        const tests = [
            () => this.testExtensionLoaded(),
            () => this.testPDFDetection(),
            () => this.testTextExtraction(),
            () => this.testTranslationEngine(),
            () => this.testPermissions()
        ];

        tests.forEach((test, index) => {
            try {
                console.log(`\n📋 Test ${index + 1}:`);
                test();
            } catch (error) {
                console.error(`❌ Test ${index + 1} failed:`, error);
            }
        });

        console.log('\n✅ Diagnostic tests completed!');
    }

    /**
     * Test if extension is loaded
     */
    testExtensionLoaded() {
        const components = this.debugInfo.extension.components;
        const loaded = Object.values(components).filter(Boolean).length;
        const total = Object.keys(components).length;
        
        console.log(`Extension Components: ${loaded}/${total} loaded`);
        
        if (loaded === total) {
            console.log('✅ All extension components loaded');
        } else {
            console.warn('⚠️ Some extension components missing:', components);
        }
    }

    /**
     * Test PDF detection
     */
    testPDFDetection() {
        console.log('Testing PDF detection...');
        
        if (window.hindiAstraPDFDetector) {
            const status = window.hindiAstraPDFDetector.getStatus();
            console.log('✅ PDF Detector available');
            console.log('PDF Status:', status);
            
            if (status.isPDF) {
                console.log(`✅ PDF detected: ${status.pdfType}`);
            } else {
                console.log('ℹ️ No PDF detected on this page');
            }
        } else {
            console.error('❌ PDF Detector not available');
        }
    }

    /**
     * Test text extraction
     */
    testTextExtraction() {
        console.log('Testing text extraction...');
        
        if (window.hindiAstraTextExtractor) {
            console.log('✅ Text Extractor available');
            
            // Try to extract text from current selection
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const text = window.hindiAstraTextExtractor.extractSelectionText();
                console.log('Selected text:', text);
            } else {
                console.log('ℹ️ No text selected');
            }
        } else {
            console.error('❌ Text Extractor not available');
        }
    }

    /**
     * Test translation engine
     */
    testTranslationEngine() {
        console.log('Testing translation engine...');
        
        if (window.hindiAstraEngine) {
            console.log('✅ Translation Engine available');
            const stats = window.hindiAstraEngine.getStats();
            console.log('Engine stats:', stats);
        } else {
            console.error('❌ Translation Engine not available');
        }
    }

    /**
     * Test translation with sample text
     */
    async testTranslation(text = 'hello world') {
        console.log(`Testing translation of: "${text}"`);
        
        if (window.hindiAstraEngine) {
            try {
                const result = await window.hindiAstraEngine.translateText(text);
                console.log('✅ Translation successful:', result);
            } catch (error) {
                console.error('❌ Translation failed:', error);
            }
        } else {
            console.error('❌ Translation Engine not available');
        }
    }

    /**
     * Check permissions
     */
    async checkPermissions() {
        console.log('Checking permissions...');
        
        try {
            // Check if we can access chrome.extension API
            if (chrome.extension) {
                const hasFileAccess = await chrome.extension.isAllowedFileSchemeAccess();
                console.log('File URL access:', hasFileAccess ? '✅ Enabled' : '❌ Disabled');
                
                if (!hasFileAccess && window.location.protocol === 'file:') {
                    console.warn('⚠️ File URL access required for local PDFs');
                    console.log('Enable in chrome://extensions/ → Hindi-astra → Details → Allow access to file URLs');
                }
            }
        } catch (error) {
            console.error('Could not check permissions:', error);
        }
    }

    /**
     * Export debug information
     */
    exportDebugInfo() {
        this.updateDebugInfo();
        
        const debugData = {
            ...this.debugInfo,
            exportTime: new Date().toISOString(),
            version: '1.0.0'
        };

        console.log('📤 Exporting debug information...');
        console.log(JSON.stringify(debugData, null, 2));
        
        // Also copy to clipboard if possible
        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
                .then(() => console.log('✅ Debug info copied to clipboard'))
                .catch(() => console.log('ℹ️ Could not copy to clipboard'));
        }

        return debugData;
    }
}

// Initialize debug helper
window.hindiAstraDebugHelper = new HindiAstraDebugHelper();

console.log('🔍 Hindi-astra Debug Helper loaded');
