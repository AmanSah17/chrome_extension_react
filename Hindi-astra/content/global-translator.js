/**
 * Hindi-astra Global Translator
 * Simple Ctrl+Shift+K popup translator for any page
 */

(function() {
    'use strict';
    
    // Prevent multiple injections
    if (window.hindiAstraGlobalTranslator) return;
    window.hindiAstraGlobalTranslator = true;
    
    console.log('🌐 Hindi-astra Global Translator loading...');
    
    const API_KEY = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
    let translatorPopup = null;
    let isTranslating = false;
    
    /**
     * Create the translation popup
     */
    function createTranslatorPopup() {
        if (translatorPopup) return;
        
        translatorPopup = document.createElement('div');
        translatorPopup.id = 'hindi-astra-global-popup';
        translatorPopup.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 400px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 15px !important;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3) !important;
            z-index: 2147483647 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            color: white !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
        `;
        
        translatorPopup.innerHTML = `
            <div style="
                padding: 20px;
                text-align: center;
                background: rgba(255,255,255,0.1);
                border-bottom: 1px solid rgba(255,255,255,0.2);
            ">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">
                    🌐 Hindi-astra Quick Translator
                </h3>
                <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 13px;">
                    Paste English text from PDF or webpage
                </p>
            </div>
            
            <div style="padding: 25px;">
                <div style="margin-bottom: 15px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        opacity: 0.9;
                    ">Paste English text from PDF:</label>
                    <textarea id="hindi-global-input" placeholder="Copy text from PDF and paste here..." style="
                        width: 100%;
                        height: 100px;
                        border: none;
                        border-radius: 8px;
                        padding: 12px;
                        font-size: 14px;
                        resize: vertical;
                        font-family: inherit;
                        box-sizing: border-box;
                        background: rgba(255,255,255,0.95);
                        color: #333;
                    "></textarea>
                </div>
                
                <button id="hindi-global-translate" style="
                    width: 100%;
                    padding: 12px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">Translate to Hindi</button>
                
                <div id="hindi-global-result" style="
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 15px;
                    display: none;
                ">
                    <div style="
                        font-size: 12px;
                        opacity: 0.8;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    ">
                        <span>🌐</span>
                        <span>Google Translate • Success</span>
                    </div>
                    <div id="hindi-global-result-text" style="
                        font-size: 16px;
                        line-height: 1.4;
                        font-weight: 500;
                    "></div>
                </div>
                
                <div id="hindi-global-error" style="
                    background: rgba(220, 53, 69, 0.3);
                    border: 1px solid rgba(220, 53, 69, 0.5);
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 15px;
                    display: none;
                    font-size: 13px;
                "></div>
            </div>
            
            <div style="
                padding: 15px 25px;
                background: rgba(0,0,0,0.1);
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                opacity: 0.8;
            ">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span>💡 Select text in PDF, copy (Ctrl+C), then paste above</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>Use Ctrl+Shift+K after adding translator</span>
                    <button id="hindi-global-close" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        font-size: 16px;
                    ">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(translatorPopup);
        setupPopupEvents();
        
        console.log('✅ Global translator popup created');
    }
    
    /**
     * Setup popup event listeners
     */
    function setupPopupEvents() {
        const input = document.getElementById('hindi-global-input');
        const translateBtn = document.getElementById('hindi-global-translate');
        const closeBtn = document.getElementById('hindi-global-close');
        
        // Translate button
        translateBtn.addEventListener('click', translateText);
        
        // Close button
        closeBtn.addEventListener('click', hidePopup);
        
        // Enter key to translate
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                translateText();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && translatorPopup.style.display === 'flex') {
                hidePopup();
            }
        });
        
        // Close on outside click
        translatorPopup.addEventListener('click', (e) => {
            if (e.target === translatorPopup) {
                hidePopup();
            }
        });
        
        // Button hover effects
        translateBtn.addEventListener('mouseenter', () => {
            translateBtn.style.background = 'rgba(255,255,255,0.3)';
            translateBtn.style.transform = 'translateY(-1px)';
        });
        
        translateBtn.addEventListener('mouseleave', () => {
            translateBtn.style.background = 'rgba(255,255,255,0.2)';
            translateBtn.style.transform = 'translateY(0)';
        });
    }
    
    /**
     * Show the popup
     */
    function showPopup() {
        if (!translatorPopup) {
            createTranslatorPopup();
        }
        
        translatorPopup.style.display = 'flex';
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('hindi-global-input');
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
        
        console.log('📄 Global translator popup shown');
    }
    
    /**
     * Hide the popup
     */
    function hidePopup() {
        if (translatorPopup) {
            translatorPopup.style.display = 'none';
        }
    }
    
    /**
     * Translate text
     */
    async function translateText() {
        if (isTranslating) return;
        
        const input = document.getElementById('hindi-global-input');
        const text = input.value.trim();
        
        if (!text) {
            showError('Please paste some text to translate');
            return;
        }
        
        const translateBtn = document.getElementById('hindi-global-translate');
        const resultDiv = document.getElementById('hindi-global-result');
        const errorDiv = document.getElementById('hindi-global-error');
        const resultText = document.getElementById('hindi-global-result-text');
        
        isTranslating = true;
        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        try {
            console.log('🔄 Global translator translating:', text);
            
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: 'hi',
                    format: 'text'
                })
            });
            
            console.log('📡 Global API Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Global API Error:', response.status, errorText);
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📄 Global API Response data:', data);
            
            if (data.data && data.data.translations && data.data.translations.length > 0) {
                const translation = data.data.translations[0].translatedText;
                resultText.textContent = translation;
                resultDiv.style.display = 'block';
                console.log('✅ Global translation successful:', translation);
            } else {
                console.error('❌ No translation in global response:', data);
                throw new Error('No translation found in response');
            }
            
        } catch (error) {
            console.error('❌ Global translation error:', error);
            showError(`Translation failed: ${error.message}`);
        } finally {
            translateBtn.textContent = 'Translate to Hindi';
            translateBtn.disabled = false;
            isTranslating = false;
        }
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        const errorDiv = document.getElementById('hindi-global-error');
        const resultDiv = document.getElementById('hindi-global-result');
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }
    
    /**
     * Handle keyboard shortcut
     */
    function handleKeyboardShortcut(event) {
        // Ctrl+Shift+K (or Cmd+Shift+K on Mac)
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'K') {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('⌨️ Ctrl+Shift+K pressed - showing translator');
            showPopup();
        }
    }
    
    // Setup global keyboard listener
    document.addEventListener('keydown', handleKeyboardShortcut, true);
    
    // Also listen for the command from background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'open-translator') {
                console.log('📨 Received open-translator command');
                showPopup();
                sendResponse({ success: true });
            }
        });
    }
    
    console.log('✅ Hindi-astra Global Translator ready! Press Ctrl+Shift+K to open.');
    
})();
