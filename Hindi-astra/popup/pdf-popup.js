/**
 * Hindi-astra PDF Popup Script
 * Direct injection solution for local PDF files
 */

class PDFPopup {
    constructor() {
        this.apiKey = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
        this.currentTab = null;
        this.init();
    }

    async init() {
        console.log('🚀 PDF Popup initializing...');
        
        // Get current tab
        await this.getCurrentTab();
        
        // Check if PDF and setup interface
        this.setupInterface();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
            console.log('Current tab:', tab.url);
        } catch (error) {
            console.error('Error getting tab:', error);
        }
    }

    setupInterface() {
        const isPDF = this.isPDF();
        
        if (isPDF) {
            document.getElementById('pdf-interface').style.display = 'block';
            document.getElementById('not-pdf-interface').style.display = 'none';
        } else {
            document.getElementById('pdf-interface').style.display = 'none';
            document.getElementById('not-pdf-interface').style.display = 'block';
        }
    }

    isPDF() {
        if (!this.currentTab) return false;
        
        const url = this.currentTab.url.toLowerCase();
        return url.includes('.pdf') || 
               url.startsWith('file://') && url.includes('.pdf') ||
               this.currentTab.title.toLowerCase().includes('.pdf');
    }

    setupEventListeners() {
        // Inject chatbot button
        document.getElementById('inject-chatbot').addEventListener('click', () => {
            this.injectChatbot();
        });

        // Try inject anyway button
        document.getElementById('try-inject-anyway').addEventListener('click', () => {
            this.injectChatbot();
        });

        // Toggle quick translate
        document.getElementById('toggle-quick').addEventListener('click', () => {
            const quickDiv = document.getElementById('quick-translate');
            quickDiv.classList.toggle('show');
            if (quickDiv.classList.contains('show')) {
                document.getElementById('text-input').focus();
            }
        });

        // Translate button
        document.getElementById('translate-btn').addEventListener('click', () => {
            this.translateText();
        });

        // Enter key in textarea
        document.getElementById('text-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.translateText();
            }
        });
    }

    async injectChatbot() {
        const statusDiv = document.getElementById('status');
        this.showStatus('loading', '🔄 Adding floating translator to your PDF...');

        try {
            // Inject the floating chatbot
            await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                func: this.createFloatingChatbot,
                args: [this.apiKey]
            });

            this.showStatus('success', '✅ Floating translator added! Look for the 🌐 icon on your PDF page.');
            
            // Auto-close popup after 3 seconds
            setTimeout(() => {
                window.close();
            }, 3000);

        } catch (error) {
            console.error('Injection failed:', error);
            this.showStatus('error', '❌ Failed to add translator. Make sure "Allow access to file URLs" is enabled in extension settings.');
        }
    }

    // This function gets injected into the PDF page
    createFloatingChatbot(apiKey) {
        // Prevent multiple injections
        if (window.hindiAstraChatbotInjected) {
            console.log('Chatbot already exists');
            return;
        }
        window.hindiAstraChatbotInjected = true;

        console.log('🤖 Creating floating chatbot...');

        // Create floating chatbot button
        const chatbot = document.createElement('div');
        chatbot.id = 'hindi-floating-chatbot';
        chatbot.innerHTML = '🌐';
        chatbot.title = 'Hindi-astra Translator - Click to translate text';
        
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

        // Create chat panel
        const panel = document.createElement('div');
        panel.id = 'hindi-chat-panel';
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
                    <span style="font-weight: 600;">Hindi-astra PDF Translator</span>
                </div>
                <button id="hindi-close" style="
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
                    <h4 style="margin: 0 0 8px 0; color: #2d5a2d;">📄 PDF Translation Mode</h4>
                    <p style="margin: 0; font-size: 13px; color: #2d5a2d;">
                        Copy text from your PDF and paste it here for instant Hindi translation
                    </p>
                </div>
                
                <textarea id="hindi-input" placeholder="Paste English text from PDF here..." style="
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
                
                <button id="hindi-translate" style="
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
                💡 Tip: Select text in PDF, copy (Ctrl+C), then paste above
            </div>
        `;

        // Add to page
        document.body.appendChild(chatbot);
        document.body.appendChild(panel);

        // Setup events
        let isTranslating = false;

        // Toggle panel
        chatbot.addEventListener('click', () => {
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                setTimeout(() => {
                    document.getElementById('hindi-input').focus();
                }, 100);
            }
        });

        // Close button
        document.getElementById('hindi-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Translate function
        async function translateText() {
            if (isTranslating) return;

            const input = document.getElementById('hindi-input');
            const text = input.value.trim();
            
            if (!text) {
                showError('Please paste some text to translate');
                return;
            }

            const translateBtn = document.getElementById('hindi-translate');
            const resultDiv = document.getElementById('hindi-result');
            const errorDiv = document.getElementById('hindi-error');
            const resultText = document.getElementById('hindi-result-text');

            isTranslating = true;
            translateBtn.textContent = 'Translating...';
            translateBtn.disabled = true;
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';

            try {
                console.log('🔄 Starting translation for:', text);

                const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
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

                console.log('📡 API Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ API Error:', response.status, errorText);
                    throw new Error(`API Error: ${response.status} - ${errorText.substring(0, 100)}`);
                }

                const data = await response.json();
                console.log('📄 API Response data:', data);

                if (data.data && data.data.translations && data.data.translations.length > 0) {
                    const translation = data.data.translations[0].translatedText;
                    resultText.textContent = translation;
                    resultDiv.style.display = 'block';
                    console.log('✅ Translation successful:', translation);
                } else {
                    console.error('❌ No translation found in response:', data);
                    throw new Error('No translation found in API response');
                }

            } catch (error) {
                console.error('❌ Translation error:', error);
                showError(`Translation failed: ${error.message}`);
            } finally {
                translateBtn.textContent = 'Translate to Hindi';
                translateBtn.disabled = false;
                isTranslating = false;
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('hindi-error');
            const resultDiv = document.getElementById('hindi-result');
            
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            resultDiv.style.display = 'none';
        }

        // Translate button
        document.getElementById('hindi-translate').addEventListener('click', translateText);

        // Enter key
        document.getElementById('hindi-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                translateText();
            }
        });

        // Hover effects
        chatbot.addEventListener('mouseenter', () => {
            chatbot.style.transform = 'scale(1.1)';
        });

        chatbot.addEventListener('mouseleave', () => {
            chatbot.style.transform = 'scale(1)';
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (panel.style.display === 'flex' && 
                !panel.contains(e.target) && 
                !chatbot.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        // Show success indicator
        const indicator = document.createElement('div');
        indicator.textContent = '✅ Hindi-astra Translator Added!';
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: #28a745 !important;
            color: white !important;
            padding: 10px 15px !important;
            border-radius: 25px !important;
            font-size: 13px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            z-index: 2147483647 !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s';
                setTimeout(() => indicator.remove(), 500);
            }
        }, 4000);

        console.log('✅ Floating chatbot created successfully!');
    }

    async translateText() {
        const input = document.getElementById('text-input');
        const text = input.value.trim();
        
        if (!text) {
            this.showStatus('error', 'Please enter some text to translate');
            return;
        }

        const translateBtn = document.getElementById('translate-btn');
        const resultDiv = document.getElementById('translation-result');

        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        resultDiv.classList.remove('show');

        try {
            console.log('🔄 Popup translating:', text);

            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
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

            console.log('📡 Popup API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Popup API Error:', response.status, errorText);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('📄 Popup API Response data:', data);

            if (data.data && data.data.translations && data.data.translations.length > 0) {
                const translation = data.data.translations[0].translatedText;

                resultDiv.innerHTML = `
                    <div class="result-text">${translation}</div>
                    <div class="result-meta">🌐 Google Translate • Success</div>
                `;
                resultDiv.classList.add('show');
                console.log('✅ Popup translation successful:', translation);
            } else {
                console.error('❌ No translation in popup response:', data);
                throw new Error('No translation found in response');
            }

        } catch (error) {
            console.error('❌ Popup translation error:', error);
            this.showStatus('error', `Translation failed: ${error.message}. Check internet connection and API key.`);
        } finally {
            translateBtn.textContent = 'Translate to Hindi';
            translateBtn.disabled = false;
        }
    }

    showStatus(type, message) {
        const statusDiv = document.getElementById('status');
        statusDiv.className = `status status-${type} show`;
        statusDiv.textContent = message;
        
        if (type !== 'loading') {
            setTimeout(() => {
                statusDiv.classList.remove('show');
            }, 5000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PDFPopup();
});
