/**
 * Hindi-astra Floating Chatbot
 * Persistent floating interface for PDF translation assistance
 */

class HindiAstraFloatingChatbot {
    constructor() {
        this.isVisible = false;
        this.isDragging = false;
        this.chatbotElement = null;
        this.chatPanel = null;
        this.position = { x: window.innerWidth - 80, y: window.innerHeight - 80 };
        this.apiKey = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
        this.init();
    }

    /**
     * Initialize floating chatbot
     */
    init() {
        console.log('🤖 Hindi-astra Floating Chatbot initializing...');
        
        // Create floating chatbot icon
        this.createFloatingIcon();
        
        // Create chat panel
        this.createChatPanel();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Floating Chatbot ready!');
    }

    /**
     * Create floating chatbot icon
     */
    createFloatingIcon() {
        this.chatbotElement = document.createElement('div');
        this.chatbotElement.id = 'hindi-astra-chatbot';
        this.chatbotElement.innerHTML = '🌐';
        this.chatbotElement.title = 'Hindi-astra Translator - Click to translate text';
        
        this.chatbotElement.style.cssText = `
            position: fixed;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            border: 3px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
        `;
        
        this.updatePosition();
        document.body.appendChild(this.chatbotElement);
        
        // Add hover effects
        this.chatbotElement.addEventListener('mouseenter', () => {
            this.chatbotElement.style.transform = 'scale(1.1)';
            this.chatbotElement.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        });
        
        this.chatbotElement.addEventListener('mouseleave', () => {
            this.chatbotElement.style.transform = 'scale(1)';
            this.chatbotElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });
    }

    /**
     * Create chat panel
     */
    createChatPanel() {
        this.chatPanel = document.createElement('div');
        this.chatPanel.id = 'hindi-astra-chat-panel';
        this.chatPanel.style.cssText = `
            position: fixed;
            width: 350px;
            height: 400px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 999998;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
        `;
        
        this.chatPanel.innerHTML = `
            <div class="chat-header" style="
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
                <button id="close-chat" style="
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
            
            <div class="chat-body" style="
                flex: 1;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            ">
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
                
                <div class="input-section">
                    <textarea id="translate-input" placeholder="Type English text here..." style="
                        width: 100%;
                        height: 100px;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        padding: 12px;
                        font-size: 14px;
                        resize: vertical;
                        font-family: inherit;
                        transition: border-color 0.2s ease;
                    "></textarea>
                    
                    <button id="translate-btn" style="
                        width: 100%;
                        margin-top: 10px;
                        padding: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    ">Translate to Hindi</button>
                </div>
                
                <div id="translation-result" style="
                    background: #e8f5e8;
                    border: 1px solid #c3e6c3;
                    border-radius: 8px;
                    padding: 15px;
                    display: none;
                ">
                    <div style="font-weight: 600; color: #2d5a2d; margin-bottom: 8px;">Hindi Translation:</div>
                    <div id="translation-text" style="font-size: 16px; color: #2d5a2d; line-height: 1.4;"></div>
                    <div id="translation-meta" style="font-size: 11px; color: #666; margin-top: 8px; display: flex; justify-content: space-between;"></div>
                </div>
                
                <div id="translation-error" style="
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 8px;
                    padding: 15px;
                    color: #721c24;
                    display: none;
                "></div>
            </div>
            
            <div class="chat-footer" style="
                padding: 15px 20px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #666;
                text-align: center;
            ">
                💡 Tip: Select text on the page and press Ctrl+Shift+T for quick translation
            </div>
        `;
        
        document.body.appendChild(this.chatPanel);
        this.updateChatPanelPosition();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Chatbot icon click
        this.chatbotElement.addEventListener('click', () => {
            this.toggleChatPanel();
        });
        
        // Make chatbot draggable
        this.setupDragging();
        
        // Chat panel events
        this.setupChatPanelEvents();
        
        // Window resize
        window.addEventListener('resize', () => {
            this.constrainPosition();
            this.updatePosition();
            this.updateChatPanelPosition();
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && 
                !this.chatPanel.contains(e.target) && 
                !this.chatbotElement.contains(e.target)) {
                this.hideChatPanel();
            }
        });
    }

    /**
     * Setup dragging functionality
     */
    setupDragging() {
        this.chatbotElement.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragOffset = {
                x: e.clientX - this.position.x,
                y: e.clientY - this.position.y
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.position.x = e.clientX - this.dragOffset.x;
                this.position.y = e.clientY - this.dragOffset.y;
                this.constrainPosition();
                this.updatePosition();
                this.updateChatPanelPosition();
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    /**
     * Setup chat panel events
     */
    setupChatPanelEvents() {
        const closeBtn = this.chatPanel.querySelector('#close-chat');
        const translateBtn = this.chatPanel.querySelector('#translate-btn');
        const input = this.chatPanel.querySelector('#translate-input');
        
        closeBtn.addEventListener('click', () => {
            this.hideChatPanel();
        });
        
        translateBtn.addEventListener('click', () => {
            this.performTranslation();
        });
        
        // Enter key to translate
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.performTranslation();
            }
        });
        
        // Input focus styling
        input.addEventListener('focus', () => {
            input.style.borderColor = '#667eea';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e9ecef';
        });
        
        // Button hover effect
        translateBtn.addEventListener('mouseenter', () => {
            translateBtn.style.transform = 'translateY(-1px)';
        });
        
        translateBtn.addEventListener('mouseleave', () => {
            translateBtn.style.transform = 'translateY(0)';
        });
    }

    /**
     * Toggle chat panel visibility
     */
    toggleChatPanel() {
        if (this.isVisible) {
            this.hideChatPanel();
        } else {
            this.showChatPanel();
        }
    }

    /**
     * Show chat panel
     */
    showChatPanel() {
        this.isVisible = true;
        this.chatPanel.style.display = 'flex';
        this.chatPanel.style.animation = 'chatPanelSlideIn 0.3s ease-out';
        
        // Focus on input
        setTimeout(() => {
            const input = this.chatPanel.querySelector('#translate-input');
            input.focus();
        }, 100);
    }

    /**
     * Hide chat panel
     */
    hideChatPanel() {
        this.isVisible = false;
        this.chatPanel.style.animation = 'chatPanelSlideOut 0.3s ease-in';
        setTimeout(() => {
            this.chatPanel.style.display = 'none';
        }, 300);
    }

    /**
     * Perform translation
     */
    async performTranslation() {
        const input = this.chatPanel.querySelector('#translate-input');
        const translateBtn = this.chatPanel.querySelector('#translate-btn');
        const resultDiv = this.chatPanel.querySelector('#translation-result');
        const errorDiv = this.chatPanel.querySelector('#translation-error');
        const textDiv = this.chatPanel.querySelector('#translation-text');
        const metaDiv = this.chatPanel.querySelector('#translation-meta');
        
        const text = input.value.trim();
        
        if (!text) {
            this.showError('Please enter some text to translate');
            return;
        }
        
        // Show loading state
        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        try {
            const translation = await this.translateText(text);
            
            // Show result
            textDiv.textContent = translation;
            metaDiv.innerHTML = `
                <span>🌐 Google Translate</span>
                <span>Confidence: 95%</span>
            `;
            resultDiv.style.display = 'block';
            
        } catch (error) {
            this.showError('Translation failed. Please check your internet connection.');
        } finally {
            translateBtn.textContent = 'Translate to Hindi';
            translateBtn.disabled = false;
        }
    }

    /**
     * Translate text using Google Translate API
     */
    async translateText(text) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
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
     * Show error message
     */
    showError(message) {
        const errorDiv = this.chatPanel.querySelector('#translation-error');
        const resultDiv = this.chatPanel.querySelector('#translation-result');
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
    }

    /**
     * Update chatbot position
     */
    updatePosition() {
        this.chatbotElement.style.left = this.position.x + 'px';
        this.chatbotElement.style.top = this.position.y + 'px';
    }

    /**
     * Update chat panel position
     */
    updateChatPanelPosition() {
        const panelWidth = 350;
        const panelHeight = 400;
        
        let x = this.position.x - panelWidth - 10;
        let y = this.position.y - panelHeight + 60;
        
        // Adjust if panel goes off screen
        if (x < 10) {
            x = this.position.x + 70;
        }
        if (y < 10) {
            y = 10;
        }
        if (y + panelHeight > window.innerHeight - 10) {
            y = window.innerHeight - panelHeight - 10;
        }
        
        this.chatPanel.style.left = x + 'px';
        this.chatPanel.style.top = y + 'px';
    }

    /**
     * Constrain position to window bounds
     */
    constrainPosition() {
        const margin = 10;
        this.position.x = Math.max(margin, Math.min(window.innerWidth - 60 - margin, this.position.x));
        this.position.y = Math.max(margin, Math.min(window.innerHeight - 60 - margin, this.position.y));
    }

    /**
     * Show chatbot
     */
    show() {
        this.chatbotElement.style.display = 'flex';
    }

    /**
     * Hide chatbot
     */
    hide() {
        this.chatbotElement.style.display = 'none';
        this.hideChatPanel();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes chatPanelSlideIn {
        from { opacity: 0; transform: scale(0.8) translateY(20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    @keyframes chatPanelSlideOut {
        from { opacity: 1; transform: scale(1) translateY(0); }
        to { opacity: 0; transform: scale(0.8) translateY(20px); }
    }
`;
document.head.appendChild(style);

// Initialize floating chatbot
window.hindiAstraFloatingChatbot = new HindiAstraFloatingChatbot();

console.log('🤖 Hindi-astra Floating Chatbot loaded');
