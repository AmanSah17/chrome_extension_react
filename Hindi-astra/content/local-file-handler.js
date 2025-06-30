/**
 * Hindi-astra Local File Handler
 * Specialized handler for local file:// URLs including PDFs
 */

(function() {
    'use strict';
    
    // Only run on local files
    if (window.location.protocol !== 'file:') return;
    
    console.log('📁 Hindi-astra Local File Handler starting...');
    console.log('📄 Local file detected:', window.location.href);
    
    // Configuration
    const API_KEY = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
    let chatbotCreated = false;
    
    /**
     * Force initialize for local files
     */
    function forceInitialize() {
        console.log('🔧 Force initializing for local file...');
        
        // Wait for any existing universal injector
        setTimeout(() => {
            if (!window.hindiAstraInjected || !document.querySelector('.hindi-astra-chatbot')) {
                console.log('🚀 Creating local file chatbot...');
                createLocalChatbot();
            } else {
                console.log('✅ Universal injector already active');
            }
        }, 500);
        
        // Force text selectability for PDFs
        forceTextSelectability();
        
        // Show local file indicator
        showLocalFileIndicator();
    }
    
    /**
     * Create local chatbot if universal one doesn't exist
     */
    function createLocalChatbot() {
        if (chatbotCreated) return;
        chatbotCreated = true;
        
        // Create floating button
        const chatbot = document.createElement('div');
        chatbot.id = 'hindi-local-chatbot';
        chatbot.innerHTML = '🌐';
        chatbot.title = 'Hindi-astra Translator - Click to translate';
        
        chatbot.style.cssText = `
            position: fixed !important;
            right: 20px !important;
            bottom: 20px !important;
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
        `;
        
        // Create translation panel
        const panel = document.createElement('div');
        panel.id = 'hindi-local-panel';
        panel.style.cssText = `
            position: fixed !important;
            right: 90px !important;
            bottom: 20px !important;
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
        `;
        
        panel.innerHTML = `
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
                    <span style="font-weight: 600;">Hindi-astra (Local PDF)</span>
                </div>
                <button id="local-close-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                ">×</button>
            </div>
            
            <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="
                    background: #e8f5e8;
                    padding: 15px;
                    border-radius: 10px;
                    border-left: 4px solid #28a745;
                ">
                    <h4 style="margin: 0 0 8px 0; color: #2d5a2d;">✅ Local PDF Mode</h4>
                    <p style="margin: 0; font-size: 13px; color: #2d5a2d;">
                        Copy text from your PDF and paste it here for translation
                    </p>
                </div>
                
                <textarea id="local-input" placeholder="Paste English text from PDF here..." style="
                    width: 100%;
                    height: 120px;
                    border: 2px solid #28a745;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    resize: vertical;
                    font-family: inherit;
                    box-sizing: border-box;
                "></textarea>
                
                <button id="local-translate-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                ">Translate to Hindi</button>
                
                <div id="local-result" style="
                    background: #e8f5e8;
                    border: 1px solid #c3e6c3;
                    border-radius: 8px;
                    padding: 15px;
                    display: none;
                ">
                    <div style="font-weight: 600; color: #2d5a2d; margin-bottom: 8px;">Hindi Translation:</div>
                    <div id="local-result-text" style="font-size: 16px; color: #2d5a2d; line-height: 1.4;"></div>
                </div>
                
                <div id="local-error" style="
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
                💡 Tip: Select text in PDF, copy (Ctrl+C), then paste here
            </div>
        `;
        
        // Add to page
        document.body.appendChild(chatbot);
        document.body.appendChild(panel);
        
        // Setup events
        setupLocalEvents(chatbot, panel);
        
        console.log('🤖 Local chatbot created successfully');
    }
    
    /**
     * Setup local chatbot events
     */
    function setupLocalEvents(chatbot, panel) {
        // Toggle panel
        chatbot.addEventListener('click', () => {
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                setTimeout(() => {
                    const input = panel.querySelector('#local-input');
                    if (input) input.focus();
                }, 100);
            }
        });
        
        // Close button
        panel.querySelector('#local-close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        // Translate button
        const translateBtn = panel.querySelector('#local-translate-btn');
        const input = panel.querySelector('#local-input');
        
        translateBtn.addEventListener('click', () => performLocalTranslation(input, panel));
        
        // Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                performLocalTranslation(input, panel);
            }
        });
        
        // Hover effects
        chatbot.addEventListener('mouseenter', () => {
            chatbot.style.transform = 'scale(1.1)';
        });
        
        chatbot.addEventListener('mouseleave', () => {
            chatbot.style.transform = 'scale(1)';
        });
    }
    
    /**
     * Perform local translation
     */
    async function performLocalTranslation(input, panel) {
        const text = input.value.trim();
        if (!text) {
            showLocalError(panel, 'Please paste some text to translate');
            return;
        }
        
        const translateBtn = panel.querySelector('#local-translate-btn');
        const resultDiv = panel.querySelector('#local-result');
        const errorDiv = panel.querySelector('#local-error');
        const resultText = panel.querySelector('#local-result-text');
        
        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        try {
            const translation = await translateText(text);
            resultText.textContent = translation;
            resultDiv.style.display = 'block';
        } catch (error) {
            showLocalError(panel, 'Translation failed. Please check your internet connection.');
        } finally {
            translateBtn.textContent = 'Translate to Hindi';
            translateBtn.disabled = false;
        }
    }
    
    /**
     * Translate text
     */
    async function translateText(text) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text.trim(),
                source: 'en',
                target: 'hi',
                format: 'text'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        }
        
        throw new Error('Translation not found');
    }
    
    /**
     * Show local error
     */
    function showLocalError(panel, message) {
        const errorDiv = panel.querySelector('#local-error');
        const resultDiv = panel.querySelector('#local-result');
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }
    
    /**
     * Force text selectability
     */
    function forceTextSelectability() {
        const style = document.createElement('style');
        style.id = 'hindi-local-selectability';
        style.textContent = `
            /* Force text selectability for local PDFs */
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
            
            ::selection {
                background: rgba(40, 167, 69, 0.3) !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // Apply to all elements periodically
        const applySelectability = () => {
            document.querySelectorAll('*').forEach(el => {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.pointerEvents = 'auto';
            });
        };
        
        applySelectability();
        setInterval(applySelectability, 2000);
    }
    
    /**
     * Show local file indicator
     */
    function showLocalFileIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: #28a745 !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            z-index: 2147483647 !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        `;
        indicator.textContent = '📁 Local PDF Mode Active';
        
        document.body.appendChild(indicator);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s';
                setTimeout(() => indicator.remove(), 500);
            }
        }, 5000);
    }
    
    // Initialize immediately and with delays
    forceInitialize();
    setTimeout(forceInitialize, 1000);
    setTimeout(forceInitialize, 3000);
    
    // Also initialize when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceInitialize);
    }
    
    console.log('✅ Local File Handler initialized');
    
})();
