/**
 * Hindi-astra PDF Auto-Detector
 * Automatically detects PDF files and offers translation assistance
 */

class HindiAstraPDFAutoDetector {
    constructor() {
        this.isPDFDetected = false;
        this.hasShownPopup = false;
        this.autoPopup = null;
        this.init();
    }

    /**
     * Initialize PDF auto-detector
     */
    init() {
        console.log('🔍 Hindi-astra PDF Auto-Detector initializing...');
        
        // Check if this is a PDF
        this.detectPDF();
        
        if (this.isPDFDetected) {
            console.log('📄 PDF detected! Showing assistance popup...');
            
            // Wait for page to load, then show popup
            this.waitForPageLoad().then(() => {
                this.showAutoPopup();
                this.ensureFloatingChatbot();
            });
        }
        
        console.log('✅ PDF Auto-Detector ready!');
    }

    /**
     * Detect if current page is a PDF
     */
    detectPDF() {
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();
        
        // Check URL for PDF indicators
        if (url.includes('.pdf') || 
            url.startsWith('file://') && url.includes('.pdf') ||
            url.includes('chrome-extension://') && url.includes('.pdf') ||
            title.includes('.pdf') ||
            title.includes('pdf')) {
            this.isPDFDetected = true;
            console.log('📄 PDF detected via URL/title');
            return;
        }

        // Check for PDF viewer elements
        const pdfElements = [
            'embed[type="application/pdf"]',
            'object[type="application/pdf"]',
            '#viewer',
            '.pdfViewer',
            '[data-pdf]'
        ];

        for (const selector of pdfElements) {
            if (document.querySelector(selector)) {
                this.isPDFDetected = true;
                console.log('📄 PDF detected via DOM elements');
                return;
            }
        }

        // Check content type
        const contentType = document.contentType || '';
        if (contentType.includes('application/pdf')) {
            this.isPDFDetected = true;
            console.log('📄 PDF detected via content type');
            return;
        }
    }

    /**
     * Wait for page to fully load
     */
    async waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
                // Fallback timeout
                setTimeout(resolve, 3000);
            }
        });
    }

    /**
     * Show automatic popup offering translation assistance
     */
    showAutoPopup() {
        if (this.hasShownPopup) return;
        
        this.hasShownPopup = true;
        
        this.autoPopup = document.createElement('div');
        this.autoPopup.id = 'hindi-astra-auto-popup';
        this.autoPopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 450px;
            width: 90%;
            animation: popupSlideIn 0.4s ease-out;
            border: 1px solid rgba(0,0,0,0.1);
        `;
        
        this.autoPopup.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px 15px 0 0;
                text-align: center;
            ">
                <div style="font-size: 32px; margin-bottom: 10px;">🌐📄</div>
                <h2 style="margin: 0; font-size: 20px; font-weight: 600;">PDF Detected!</h2>
                <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
                    Hindi-astra can help you translate English text to Hindi
                </p>
            </div>
            
            <div style="padding: 25px;">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #333; font-size: 16px;">
                        🎯 How would you like to translate?
                    </h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button id="use-floating-bot" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: transform 0.2s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        ">
                            🤖 Use Floating Translator (Recommended)
                        </button>
                        
                        <button id="try-text-selection" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: transform 0.2s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        ">
                            ✨ Try Text Selection
                        </button>
                        
                        <button id="not-now" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-size: 13px;
                            cursor: pointer;
                            transition: transform 0.2s ease;
                        ">
                            Not now
                        </button>
                    </div>
                </div>
                
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                ">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                        💡 Quick Tips:
                    </h4>
                    <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #666; line-height: 1.4;">
                        <li>Use the floating bot for easy access anywhere</li>
                        <li>Select English text for instant translation</li>
                        <li>Press Ctrl+Shift+T for keyboard shortcut</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.autoPopup);
        
        // Add event listeners
        this.setupAutoPopupEvents();
        
        // Auto-close after 15 seconds
        setTimeout(() => {
            if (this.autoPopup && this.autoPopup.parentNode) {
                this.closeAutoPopup();
            }
        }, 15000);
    }

    /**
     * Setup auto popup event listeners
     */
    setupAutoPopupEvents() {
        const floatingBotBtn = this.autoPopup.querySelector('#use-floating-bot');
        const textSelectionBtn = this.autoPopup.querySelector('#try-text-selection');
        const notNowBtn = this.autoPopup.querySelector('#not-now');
        
        // Floating bot button
        floatingBotBtn.addEventListener('click', () => {
            this.activateFloatingBot();
            this.closeAutoPopup();
        });
        
        // Text selection button
        textSelectionBtn.addEventListener('click', () => {
            this.showTextSelectionDemo();
            this.closeAutoPopup();
        });
        
        // Not now button
        notNowBtn.addEventListener('click', () => {
            this.closeAutoPopup();
        });
        
        // Button hover effects
        [floatingBotBtn, textSelectionBtn, notNowBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-1px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
        
        // Close on outside click
        this.autoPopup.addEventListener('click', (e) => {
            if (e.target === this.autoPopup) {
                this.closeAutoPopup();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.autoPopup) {
                this.closeAutoPopup();
            }
        });
    }

    /**
     * Activate floating bot
     */
    activateFloatingBot() {
        if (window.hindiAstraFloatingChatbot) {
            window.hindiAstraFloatingChatbot.show();
            window.hindiAstraFloatingChatbot.showChatPanel();
            
            // Show success message
            this.showSuccessMessage('🤖 Floating translator activated! Click the icon anytime to translate.');
        } else {
            this.showErrorMessage('Floating translator not available. Please reload the page.');
        }
    }

    /**
     * Show text selection demo
     */
    showTextSelectionDemo() {
        // Create demo overlay
        const demoOverlay = document.createElement('div');
        demoOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            animation: fadeIn 0.3s ease-out;
        `;
        
        demoOverlay.innerHTML = `
            <div style="max-width: 500px; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">✨</div>
                <h2 style="margin: 0 0 15px 0; font-size: 24px;">Text Selection Mode</h2>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                    Simply select any English text on this PDF and a Hindi translation will appear instantly!
                </p>
                <p style="font-size: 14px; opacity: 0.8; margin-bottom: 25px;">
                    You can also use the keyboard shortcut: <strong>Ctrl+Shift+T</strong>
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                ">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(demoOverlay);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (demoOverlay.parentNode) {
                demoOverlay.remove();
            }
        }, 8000);
    }

    /**
     * Ensure floating chatbot is available
     */
    ensureFloatingChatbot() {
        if (!window.hindiAstraFloatingChatbot) {
            console.log('🤖 Floating chatbot not found, initializing...');
            // The chatbot should be loaded by the manifest, but ensure it's available
            setTimeout(() => {
                if (!window.hindiAstraFloatingChatbot) {
                    console.warn('⚠️ Floating chatbot still not available');
                }
            }, 2000);
        }
    }

    /**
     * Close auto popup
     */
    closeAutoPopup() {
        if (this.autoPopup) {
            this.autoPopup.style.animation = 'popupSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (this.autoPopup && this.autoPopup.parentNode) {
                    this.autoPopup.remove();
                    this.autoPopup = null;
                }
            }, 300);
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showMessage(message, '#28a745');
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showMessage(message, '#dc3545');
    }

    /**
     * Show message
     */
    showMessage(message, color) {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 1000001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }, 4000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes popupSlideIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes popupSlideOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Initialize PDF auto-detector
window.hindiAstraPDFAutoDetector = new HindiAstraPDFAutoDetector();

console.log('🔍 Hindi-astra PDF Auto-Detector loaded');
