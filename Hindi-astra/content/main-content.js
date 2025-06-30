/**
 * Hindi-astra Main Content Script
 * Coordinates all translation functionality for academic content
 */

class HindiAstraTranslator {
    constructor() {
        this.isInitialized = false;
        this.translationEngine = null;
        this.currentPopup = null;
        this.isTranslating = false;
        this.settings = {
            autoTranslate: true,
            showOriginal: true,
            fontSize: 'medium',
            theme: 'modern'
        };
        
        this.init();
    }

    /**
     * Initialize the translator
     */
    async init() {
        console.log('🚀 Hindi-astra Translator initializing...');
        
        // Wait for translation engine to be ready
        await this.waitForEngine();
        
        // Load user settings
        await this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Setup message handlers
        this.setupMessageHandlers();

        // Initialize UI components
        this.initializeUI();
        
        this.isInitialized = true;
        console.log('✅ Hindi-astra Translator ready!');
        
        // Show initialization notification
        this.showNotification('Hindi-astra is ready! Select English text to translate.', 'success');
    }

    /**
     * Wait for translation engine to be available
     */
    async waitForEngine() {
        return new Promise((resolve) => {
            const checkEngine = () => {
                if (window.hindiAstraEngine) {
                    this.translationEngine = window.hindiAstraEngine;
                    resolve();
                } else {
                    setTimeout(checkEngine, 100);
                }
            };
            checkEngine();
        });
    }

    /**
     * Load user settings from storage
     */
    async loadSettings() {
        try {
            const stored = await chrome.storage.sync.get(['hindiAstraSettings']);
            if (stored.hindiAstraSettings) {
                this.settings = { ...this.settings, ...stored.hindiAstraSettings };
            }
        } catch (error) {
            console.log('Using default settings');
        }
    }

    /**
     * Setup event listeners for text selection
     */
    setupEventListeners() {
        // Text selection handler
        document.addEventListener('mouseup', this.handleTextSelection.bind(this));
        document.addEventListener('touchend', this.handleTextSelection.bind(this));
        
        // Click outside to close popup
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // Scroll to hide popup
        document.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl+Shift+T or Cmd+Shift+T for translation
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                this.translateSelection();
            }

            // Escape to close popup
            if (event.key === 'Escape') {
                this.hideTranslationPopup();
            }
        });
    }

    /**
     * Setup message handlers for communication with popup and background
     */
    setupMessageHandlers() {
        chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
            switch (request.action) {
                case 'quickTranslate':
                    this.handleQuickTranslate(request, sendResponse);
                    return true; // Keep message channel open

                case 'contextTranslate':
                    this.handleContextTranslate(request);
                    break;

                case 'keyboardTranslate':
                    this.translateSelection();
                    break;

                case 'updateSettings':
                    this.updateSettings(request.settings);
                    break;

                case 'getStats':
                    this.handleGetStats(sendResponse);
                    return true;

                case 'toggleDictionary':
                    this.toggleDictionary();
                    break;

                default:
                    console.log('Unknown message action:', request.action);
            }
        });
    }

    /**
     * Handle quick translate from popup
     */
    async handleQuickTranslate(request, sendResponse) {
        try {
            const translation = await this.translationEngine.translateText(request.text, {
                context: 'popup'
            });
            sendResponse({ success: true, translation: translation });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    /**
     * Handle context menu translate
     */
    async handleContextTranslate(request) {
        if (request.text) {
            // Find a good position for the popup
            const selection = window.getSelection();
            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;

            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                x = rect.left + window.scrollX;
                y = rect.top + window.scrollY;
            }

            await this.showTranslationPopup(request.text, {
                x: x,
                y: y,
                context: request.context || 'context_menu'
            });
        }
    }

    /**
     * Handle get stats request
     */
    handleGetStats(sendResponse) {
        const stats = this.translationEngine ? this.translationEngine.getStats() : {};
        sendResponse({ success: true, stats: stats });
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('Settings updated:', this.settings);
    }

    /**
     * Toggle dictionary panel (future feature)
     */
    toggleDictionary() {
        console.log('Dictionary toggle requested - feature coming soon!');
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Create floating action button for mobile
        this.createFloatingActionButton();
        
        // Create dictionary panel
        this.createDictionaryPanel();
    }

    /**
     * Handle text selection
     */
    async handleTextSelection(_event) {
        if (this.isTranslating) return;
        
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length === 0) {
            this.hideTranslationPopup();
            return;
        }
        
        // Check if text is English and within limits
        if (!this.isEnglishText(selectedText) || selectedText.length > 200) {
            return;
        }
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Show translation popup
        await this.showTranslationPopup(selectedText, {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            context: this.detectContext()
        });
    }

    /**
     * Check if text is English
     */
    isEnglishText(text) {
        const englishRegex = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
        return englishRegex.test(text.trim());
    }

    /**
     * Detect context (PDF, academic, general)
     */
    detectContext() {
        const url = window.location.href;
        const title = document.title.toLowerCase();
        
        if (url.includes('.pdf') || title.includes('pdf')) {
            return 'academic_pdf';
        } else if (title.includes('research') || title.includes('study') || title.includes('paper')) {
            return 'academic';
        } else {
            return 'general';
        }
    }

    /**
     * Show translation popup
     */
    async showTranslationPopup(text, options = {}) {
        this.isTranslating = true;
        
        // Hide existing popup
        this.hideTranslationPopup();
        
        // Create popup element
        this.currentPopup = this.createTranslationPopup(text, options);
        
        // Show loading state
        this.updatePopupContent(this.currentPopup, text, 'Translating...', 'loading');
        
        try {
            // Get translation
            const translation = await this.translationEngine.translateText(text, {
                context: options.context
            });
            
            // Update popup with translation
            this.updatePopupContent(this.currentPopup, text, translation.text, 'success', translation);
            
        } catch (error) {
            console.error('Translation failed:', error);
            this.updatePopupContent(this.currentPopup, text, 'Translation failed', 'error');
        } finally {
            this.isTranslating = false;
        }
    }

    /**
     * Create translation popup element
     */
    createTranslationPopup(_text, options) {
        const popup = document.createElement('div');
        popup.className = 'hindi-astra-popup';
        popup.style.cssText = `
            position: absolute;
            left: ${options.x}px;
            top: ${options.y - 10}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 350px;
            min-width: 200px;
            z-index: 10000;
            animation: hindiAstraFadeIn 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        
        document.body.appendChild(popup);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (this.currentPopup === popup) {
                this.hideTranslationPopup();
            }
        }, 8000);
        
        return popup;
    }

    /**
     * Update popup content
     */
    updatePopupContent(popup, originalText, translatedText, status, translationData = null) {
        const isLoading = status === 'loading';
        const isError = status === 'error';
        
        popup.innerHTML = `
            <div class="hindi-astra-header" style="
                background: rgba(255,255,255,0.1);
                padding: 12px 16px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            ">
                <span style="font-weight: 600; font-size: 13px; opacity: 0.9; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${originalText}
                </span>
                <button class="hindi-astra-close" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    height: 24px;
                    width: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
            </div>
            <div class="hindi-astra-content" style="padding: 16px;">
                <div class="hindi-astra-translation" style="
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 1.4;
                    margin-bottom: ${translationData ? '12px' : '0'};
                    ${isLoading ? 'opacity: 0.7; font-style: italic;' : ''}
                    ${isError ? 'color: #ffcccb; font-style: italic;' : ''}
                ">
                    ${isLoading ? '🔄 ' : ''}${translatedText}
                </div>
                ${translationData ? `
                    <div class="hindi-astra-meta" style="
                        font-size: 11px;
                        opacity: 0.7;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>${translationData.source === 'online' ? '🌐 Online' : '📱 Offline'}</span>
                        <span>Confidence: ${Math.round(translationData.confidence * 100)}%</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add close button functionality
        const closeBtn = popup.querySelector('.hindi-astra-close');
        closeBtn.addEventListener('click', () => this.hideTranslationPopup());
    }

    /**
     * Hide translation popup
     */
    hideTranslationPopup() {
        if (this.currentPopup) {
            this.currentPopup.style.animation = 'hindiAstraFadeOut 0.2s ease-in';
            setTimeout(() => {
                if (this.currentPopup) {
                    this.currentPopup.remove();
                    this.currentPopup = null;
                }
            }, 200);
        }
    }

    /**
     * Handle document click
     */
    handleDocumentClick(event) {
        if (this.currentPopup && !this.currentPopup.contains(event.target)) {
            this.hideTranslationPopup();
        }
    }

    /**
     * Handle scroll
     */
    handleScroll() {
        this.hideTranslationPopup();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.hideTranslationPopup();
    }

    /**
     * Translate current selection
     */
    async translateSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            await this.showTranslationPopup(selectedText, {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                context: this.detectContext()
            });
        }
    }

    /**
     * Create floating action button for mobile
     */
    createFloatingActionButton() {
        // Implementation for mobile FAB
        // This would be expanded in a full implementation
    }

    /**
     * Create dictionary panel
     */
    createDictionaryPanel() {
        // Implementation for dictionary panel
        // This would be expanded in a full implementation
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: hindiAstraSlideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'hindiAstraSlideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes hindiAstraFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes hindiAstraFadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes hindiAstraSlideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes hindiAstraSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Initialize translator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.hindiAstraTranslator = new HindiAstraTranslator();
    });
} else {
    window.hindiAstraTranslator = new HindiAstraTranslator();
}

console.log('🌟 Hindi-astra Main Content Script loaded');
