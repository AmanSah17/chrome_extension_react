/**
 * Hindi-astra Universal Injector
 * Aggressive injection that works on ALL pages including local PDFs
 */

(function() {
    'use strict';
    
    // Prevent multiple injections
    if (window.hindiAstraInjected) return;
    window.hindiAstraInjected = true;
    
    console.log('🚀 Hindi-astra Universal Injector starting...');
    
    // Global configuration
    const CONFIG = {
        API_KEY: "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI",
        CHATBOT_ENABLED: true,
        AUTO_DETECT_PDF: true,
        KEYBOARD_SHORTCUT: true
    };
    
    // Global state
    let chatbot = null;
    let isTranslating = false;
    let hasShownPDFPopup = false;
    
    /**
     * Initialize the extension
     */
    function initialize() {
        console.log('🔧 Initializing Hindi-astra...');
        
        // Add global styles
        addGlobalStyles();
        
        // Create floating chatbot
        createFloatingChatbot();
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Setup text selection handler
        setupTextSelection();
        
        // Check if this is a PDF and show popup
        if (isPDF()) {
            console.log('📄 PDF detected, showing assistance popup...');
            setTimeout(showPDFAssistancePopup, 2000);
        }
        
        console.log('✅ Hindi-astra initialized successfully!');
    }
    
    /**
     * Check if current page is a PDF
     */
    function isPDF() {
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();
        
        return url.includes('.pdf') || 
               url.startsWith('file://') && url.includes('.pdf') ||
               title.includes('.pdf') ||
               title.includes('pdf') ||
               document.querySelector('embed[type="application/pdf"]') ||
               document.querySelector('object[type="application/pdf"]') ||
               document.contentType === 'application/pdf';
    }
    
    /**
     * Add global styles
     */
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.id = 'hindi-astra-global-styles';
        style.textContent = `
            /* Hindi-astra Global Styles */
            .hindi-astra-chatbot {
                position: fixed !important;
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 24px !important;
                color: white !important;
                cursor: pointer !important;
                z-index: 2147483647 !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                user-select: none !important;
                border: 3px solid rgba(255,255,255,0.2) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            .hindi-astra-chatbot:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
            }
            
            .hindi-astra-panel {
                position: fixed !important;
                width: 350px !important;
                height: 400px !important;
                background: white !important;
                border-radius: 15px !important;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
                z-index: 2147483646 !important;
                display: none !important;
                flex-direction: column !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                overflow: hidden !important;
            }
            
            .hindi-astra-popup {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background: white !important;
                border-radius: 15px !important;
                box-shadow: 0 15px 50px rgba(0,0,0,0.3) !important;
                z-index: 2147483647 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                max-width: 450px !important;
                width: 90% !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
            }
            
            /* Force text selectability for PDFs */
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
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
    }
    
    /**
     * Create floating chatbot
     */
    function createFloatingChatbot() {
        // Create chatbot icon
        chatbot = document.createElement('div');
        chatbot.className = 'hindi-astra-chatbot';
        chatbot.innerHTML = '🌐';
        chatbot.title = 'Hindi-astra Translator - Click to translate text';
        chatbot.style.right = '20px';
        chatbot.style.bottom = '20px';
        
        // Create chat panel
        const panel = document.createElement('div');
        panel.className = 'hindi-astra-panel';
        panel.id = 'hindi-astra-panel';
        panel.innerHTML = createPanelHTML();
        
        // Add to page
        document.body.appendChild(chatbot);
        document.body.appendChild(panel);
        
        // Setup events
        setupChatbotEvents(chatbot, panel);
        
        console.log('🤖 Floating chatbot created');
    }
    
    /**
     * Create panel HTML
     */
    function createPanelHTML() {
        return `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🌐</span>
                    <span style="font-weight: 600;">Hindi-astra Translator</span>
                </div>
                <button id="hindi-close-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            
            <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                ">
                    <h4 style="margin: 0 0 8px 0; color: #333;">Quick Translate</h4>
                    <p style="margin: 0; font-size: 13px; color: #666;">
                        Type or paste English text below for instant Hindi translation
                    </p>
                </div>
                
                <textarea id="hindi-translate-input" placeholder="Type English text here..." style="
                    width: 100%;
                    height: 100px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    resize: vertical;
                    font-family: inherit;
                    box-sizing: border-box;
                "></textarea>
                
                <button id="hindi-translate-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                ">Translate to Hindi</button>
                
                <div id="hindi-result" style="
                    background: #e8f5e8;
                    border: 1px solid #c3e6c3;
                    border-radius: 8px;
                    padding: 15px;
                    display: none;
                ">
                    <div style="font-weight: 600; color: #2d5a2d; margin-bottom: 8px;">Hindi Translation:</div>
                    <div id="hindi-result-text" style="font-size: 16px; color: #2d5a2d; line-height: 1.4;"></div>
                </div>
                
                <div id="hindi-error" style="
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 8px;
                    padding: 15px;
                    color: #721c24;
                    display: none;
                "></div>
            </div>
            
            <div style="
                padding: 15px 20px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #666;
                text-align: center;
            ">
                💡 Tip: Press Ctrl+Shift+T to translate selected text
            </div>
        `;
    }
    
    /**
     * Setup chatbot events
     */
    function setupChatbotEvents(chatbot, panel) {
        // Toggle panel on chatbot click
        chatbot.addEventListener('click', () => {
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                // Position panel
                const rect = chatbot.getBoundingClientRect();
                panel.style.right = '90px';
                panel.style.bottom = '20px';
                
                // Focus input
                setTimeout(() => {
                    const input = panel.querySelector('#hindi-translate-input');
                    if (input) input.focus();
                }, 100);
            }
        });
        
        // Close button
        const closeBtn = panel.querySelector('#hindi-close-btn');
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        // Translate button
        const translateBtn = panel.querySelector('#hindi-translate-btn');
        const input = panel.querySelector('#hindi-translate-input');
        
        translateBtn.addEventListener('click', () => performTranslation(input, panel));
        
        // Enter key to translate
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                performTranslation(input, panel);
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (panel.style.display === 'flex' && 
                !panel.contains(e.target) && 
                !chatbot.contains(e.target)) {
                panel.style.display = 'none';
            }
        });
    }
    
    /**
     * Perform translation
     */
    async function performTranslation(input, panel) {
        if (isTranslating) return;
        
        const text = input.value.trim();
        if (!text) {
            showError(panel, 'Please enter some text to translate');
            return;
        }
        
        const translateBtn = panel.querySelector('#hindi-translate-btn');
        const resultDiv = panel.querySelector('#hindi-result');
        const errorDiv = panel.querySelector('#hindi-error');
        const resultText = panel.querySelector('#hindi-result-text');
        
        isTranslating = true;
        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        try {
            const translation = await translateText(text);
            resultText.textContent = translation;
            resultDiv.style.display = 'block';
        } catch (error) {
            showError(panel, 'Translation failed. Please check your internet connection.');
        } finally {
            translateBtn.textContent = 'Translate to Hindi';
            translateBtn.disabled = false;
            isTranslating = false;
        }
    }
    
    /**
     * Translate text using Google Translate API
     */
    async function translateText(text) {
        console.log('🔄 Universal injector translating:', text);

        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${CONFIG.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                q: text.trim(),
                source: 'en',
                target: 'hi',
                format: 'text'
            })
        });

        console.log('📡 Universal API Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Universal API Error:', response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        console.log('📄 Universal API Response data:', data);

        if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translation = data.data.translations[0].translatedText;
            console.log('✅ Universal translation successful:', translation);
            return translation;
        }

        console.error('❌ No translation in universal response:', data);
        throw new Error('No translation found in API response');
    }
    
    /**
     * Show error message
     */
    function showError(panel, message) {
        const errorDiv = panel.querySelector('#hindi-error');
        const resultDiv = panel.querySelector('#hindi-result');
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }
    
    /**
     * Setup keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+T for translation
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                handleTextSelection();
            }
            
            // Escape to close panel
            if (e.key === 'Escape') {
                const panel = document.getElementById('hindi-astra-panel');
                if (panel && panel.style.display === 'flex') {
                    panel.style.display = 'none';
                }
            }
        });
    }
    
    /**
     * Setup text selection handler
     */
    function setupTextSelection() {
        document.addEventListener('mouseup', handleTextSelection);
        document.addEventListener('touchend', handleTextSelection);
    }
    
    /**
     * Handle text selection
     */
    function handleTextSelection() {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText && selectedText.length > 0 && selectedText.length < 200) {
                // Check if text is English
                const englishRegex = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
                if (englishRegex.test(selectedText)) {
                    showQuickTranslation(selectedText, selection);
                }
            }
        }, 100);
    }
    
    /**
     * Show quick translation popup
     */
    async function showQuickTranslation(text, selection) {
        // Remove existing popup
        const existing = document.getElementById('hindi-quick-popup');
        if (existing) existing.remove();
        
        // Get selection position
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            x = rect.left + window.scrollX;
            y = rect.top + window.scrollY - 10;
        }
        
        // Create popup
        const popup = document.createElement('div');
        popup.id = 'hindi-quick-popup';
        popup.style.cssText = `
            position: absolute;
            left: ${Math.min(x, window.innerWidth - 300)}px;
            top: ${Math.max(y - 80, 10)}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 350px;
            min-width: 200px;
            z-index: 2147483647;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 16px;
        `;
        
        popup.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">${text}</div>
            <div style="font-size: 16px; margin-bottom: 8px;">🔄 Translating...</div>
            <div style="font-size: 11px; opacity: 0.7;">Click to close</div>
        `;
        
        document.body.appendChild(popup);
        
        // Close on click
        popup.addEventListener('click', () => popup.remove());
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 8000);
        
        // Translate
        try {
            const translation = await translateText(text);
            popup.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; opacity: 0.9;">${text}</div>
                <div style="font-size: 16px; margin-bottom: 8px;">${translation}</div>
                <div style="font-size: 11px; opacity: 0.7;">🌐 Google Translate • Click to close</div>
            `;
        } catch (error) {
            popup.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 8px;">${text}</div>
                <div style="font-size: 16px; margin-bottom: 8px;">❌ Translation failed</div>
                <div style="font-size: 11px; opacity: 0.7;">Check internet connection</div>
            `;
        }
    }
    
    /**
     * Show PDF assistance popup
     */
    function showPDFAssistancePopup() {
        if (hasShownPDFPopup) return;
        hasShownPDFPopup = true;
        
        const popup = document.createElement('div');
        popup.className = 'hindi-astra-popup';
        popup.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px 15px 0 0;
                text-align: center;
            ">
                <div style="font-size: 32px; margin-bottom: 10px;">🌐📄</div>
                <h2 style="margin: 0; font-size: 20px; font-weight: 600;">PDF Translation Ready!</h2>
                <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
                    Hindi-astra is ready to help you translate English text to Hindi
                </p>
            </div>
            
            <div style="padding: 25px;">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #333; font-size: 16px;">
                        🎯 How to translate:
                    </h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button id="use-chatbot" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                        ">
                            🤖 Use Floating Translator (Recommended)
                        </button>
                        
                        <button id="try-selection" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                        ">
                            ✨ Try Text Selection
                        </button>
                        
                        <button id="close-popup" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-size: 13px;
                            cursor: pointer;
                        ">
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Setup events
        popup.querySelector('#use-chatbot').addEventListener('click', () => {
            chatbot.click();
            popup.remove();
        });
        
        popup.querySelector('#try-selection').addEventListener('click', () => {
            showMessage('Select any English text on this page for instant translation!', '#28a745');
            popup.remove();
        });
        
        popup.querySelector('#close-popup').addEventListener('click', () => {
            popup.remove();
        });
        
        // Auto-close after 15 seconds
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 15000);
    }
    
    /**
     * Show message
     */
    function showMessage(message, color) {
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
            z-index: 2147483647;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            max-width: 350px;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => messageEl.remove(), 4000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also initialize after a delay for late-loading content
    setTimeout(initialize, 1000);
    
})();
