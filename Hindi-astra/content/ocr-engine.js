/**
 * Hindi-astra OCR Engine
 * Optical Character Recognition for scanned PDFs and images
 */

class HindiAstraOCREngine {
    constructor() {
        this.isInitialized = false;
        this.tesseractWorker = null;
        this.isProcessing = false;
        this.supportedLanguages = ['eng']; // English for now
        this.init();
    }

    /**
     * Initialize OCR engine
     */
    async init() {
        console.log('👁️ Hindi-astra OCR Engine initializing...');
        
        try {
            // Load Tesseract.js from CDN
            await this.loadTesseract();
            
            // Initialize worker
            await this.initializeWorker();
            
            this.isInitialized = true;
            console.log('✅ OCR Engine ready!');
        } catch (error) {
            console.error('❌ OCR Engine initialization failed:', error);
            console.log('📝 OCR will use manual text input fallback');
        }
    }

    /**
     * Load Tesseract.js library
     */
    async loadTesseract() {
        return new Promise((resolve, reject) => {
            // Check if Tesseract is already loaded
            if (window.Tesseract) {
                resolve();
                return;
            }

            // Create script element to load Tesseract.js
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/tesseract.js@4/dist/tesseract.min.js';
            script.onload = () => {
                console.log('📚 Tesseract.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load Tesseract.js'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Tesseract worker
     */
    async initializeWorker() {
        if (!window.Tesseract) {
            throw new Error('Tesseract.js not available');
        }

        try {
            console.log('🔧 Initializing Tesseract worker...');
            
            this.tesseractWorker = await window.Tesseract.createWorker('eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            });

            console.log('✅ Tesseract worker initialized');
        } catch (error) {
            console.error('Failed to initialize Tesseract worker:', error);
            throw error;
        }
    }

    /**
     * Extract text from image using OCR
     */
    async extractTextFromImage(imageData, options = {}) {
        if (!this.isInitialized || !this.tesseractWorker) {
            throw new Error('OCR Engine not initialized');
        }

        if (this.isProcessing) {
            throw new Error('OCR is already processing another image');
        }

        this.isProcessing = true;

        try {
            console.log('👁️ Starting OCR text extraction...');
            
            const { data } = await this.tesseractWorker.recognize(imageData, {
                rectangle: options.rectangle,
            });

            console.log('✅ OCR extraction completed');
            console.log('Confidence:', data.confidence);
            
            return {
                text: data.text.trim(),
                confidence: data.confidence / 100, // Convert to 0-1 scale
                words: data.words,
                lines: data.lines,
                paragraphs: data.paragraphs
            };
        } catch (error) {
            console.error('OCR extraction failed:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Extract text from canvas element
     */
    async extractTextFromCanvas(canvas, options = {}) {
        if (!canvas || !canvas.getContext) {
            throw new Error('Invalid canvas element');
        }

        // Convert canvas to image data
        const imageData = canvas.toDataURL('image/png');
        return await this.extractTextFromImage(imageData, options);
    }

    /**
     * Extract text from selected area of the page
     */
    async extractTextFromArea(x, y, width, height) {
        try {
            console.log(`👁️ Extracting text from area: ${x},${y} ${width}x${height}`);
            
            // Create canvas to capture the selected area
            const canvas = await this.captureAreaToCanvas(x, y, width, height);
            
            // Extract text using OCR
            const result = await this.extractTextFromCanvas(canvas);
            
            return result;
        } catch (error) {
            console.error('Area text extraction failed:', error);
            throw error;
        }
    }

    /**
     * Capture a specific area of the page to canvas
     */
    async captureAreaToCanvas(x, y, width, height) {
        return new Promise((resolve, reject) => {
            try {
                // Use html2canvas if available, otherwise fallback
                if (window.html2canvas) {
                    window.html2canvas(document.body, {
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                        useCORS: true,
                        allowTaint: true
                    }).then(canvas => {
                        resolve(canvas);
                    }).catch(reject);
                } else {
                    // Fallback: create canvas manually
                    const canvas = this.createCanvasFromArea(x, y, width, height);
                    resolve(canvas);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Create canvas from area (fallback method)
     */
    createCanvasFromArea(x, y, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        // Add text indicating manual input needed
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Manual text input required', width/2, height/2);
        ctx.fillText('OCR capture not available', width/2, height/2 + 20);
        
        return canvas;
    }

    /**
     * Check if OCR is available and ready
     */
    isAvailable() {
        return this.isInitialized && this.tesseractWorker && !this.isProcessing;
    }

    /**
     * Get OCR engine status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isProcessing: this.isProcessing,
            hasWorker: !!this.tesseractWorker,
            supportedLanguages: this.supportedLanguages,
            tesseractAvailable: !!window.Tesseract
        };
    }

    /**
     * Process image file for OCR
     */
    async processImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Invalid image file');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = await this.extractTextFromImage(e.target.result);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Clean up OCR engine
     */
    async cleanup() {
        if (this.tesseractWorker) {
            try {
                await this.tesseractWorker.terminate();
                console.log('🧹 OCR worker terminated');
            } catch (error) {
                console.error('Error terminating OCR worker:', error);
            }
            this.tesseractWorker = null;
        }
        this.isInitialized = false;
    }

    /**
     * Reinitialize OCR engine
     */
    async reinitialize() {
        await this.cleanup();
        await this.init();
    }
}

// Initialize OCR engine
window.hindiAstraOCR = new HindiAstraOCREngine();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.hindiAstraOCR) {
        window.hindiAstraOCR.cleanup();
    }
});

console.log('👁️ Hindi-astra OCR Engine loaded');
