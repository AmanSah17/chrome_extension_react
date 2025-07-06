/**
 * Hindi-astra Background Service Worker
 * Handles background processes, context menus, and API calls
 */

class HindiAstraBackground {
    constructor() {
        this.apiKey = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
        this.init();
    }

    /**
     * Initialize background service
     */
    init() {
        console.log('🔧 Hindi-astra Background Service initializing...');
        
        // Setup installation handler
        chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
        
        // Setup message handlers
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
        
        // Setup context menus
        this.setupContextMenus();
        
        // Setup keyboard commands
        chrome.commands.onCommand.addListener(this.handleCommand.bind(this));

        // Setup global translator command
        chrome.commands.onCommand.addListener(this.handleGlobalCommand.bind(this));

        // Setup tab listeners for aggressive injection
        chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
        chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));

        // Setup aggressive injection for local files
        this.setupAggressiveInjection();

        console.log('✅ Hindi-astra Background Service ready!');
    }

    /**
     * Handle extension installation
     */
    async handleInstall(details) {
        console.log('📦 Hindi-astra installed:', details.reason);

        if (details.reason === 'install') {
            // First time installation
            await this.initializeDefaultSettings();
            await this.showWelcomeNotification();
            await this.checkFileURLPermission();
        } else if (details.reason === 'update') {
            // Extension updated
            console.log('🔄 Hindi-astra updated');
            await this.checkFileURLPermission();
        }
    }

    /**
     * Check if file URL permission is enabled
     */
    async checkFileURLPermission() {
        try {
            // Check if we can access file URLs
            const hasFileAccess = await chrome.extension.isAllowedFileSchemeAccess();

            if (!hasFileAccess) {
                console.warn('📄 File URL access not enabled - local PDFs will not work');

                // Show notification about file access
                setTimeout(() => {
                    chrome.notifications.create('hindi-astra-file-access', {
                        type: 'basic',
                        iconUrl: '../icons/icon-48.png',
                        title: 'Hindi-astra Setup Required',
                        message: 'Enable "Allow access to file URLs" in extension settings to use with local PDF files.'
                    });
                }, 2000);
            } else {
                console.log('✅ File URL access enabled - local PDFs supported');
            }
        } catch (error) {
            console.log('Could not check file URL permission:', error);
        }
    }

    /**
     * Setup aggressive injection for local files
     */
    setupAggressiveInjection() {
        // Inject into all existing tabs
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (this.shouldInjectIntoTab(tab)) {
                    this.injectIntoTab(tab.id);
                }
            });
        });
    }

    /**
     * Handle tab updates
     */
    handleTabUpdate(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && this.shouldInjectIntoTab(tab)) {
            console.log('📄 PDF tab detected, attempting injection:', tab.url);

            // Multiple injection attempts with different methods
            this.injectIntoTab(tabId);
            setTimeout(() => this.injectIntoTab(tabId), 1000);
            setTimeout(() => this.injectIntoTab(tabId), 3000);
            setTimeout(() => this.injectIntoTab(tabId), 5000);

            // Force injection via executeScript
            setTimeout(() => this.forceInjectChatbot(tabId), 2000);
        }
    }

    /**
     * Handle tab activation
     */
    handleTabActivated(activeInfo) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (this.shouldInjectIntoTab(tab)) {
                this.injectIntoTab(tab.id);
            }
        });
    }

    /**
     * Check if we should inject into this tab
     */
    shouldInjectIntoTab(tab) {
        if (!tab.url) return false;

        const url = tab.url.toLowerCase();
        return url.startsWith('file://') ||
               url.includes('.pdf') ||
               url.includes('chrome-extension://') && url.includes('.pdf');
    }

    /**
     * Inject scripts into tab
     */
    async injectIntoTab(tabId) {
        try {
            // Try to inject universal injector
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content/universal-injector.js']
            });

            console.log(`✅ Injected into tab ${tabId}`);
        } catch (error) {
            console.log(`⚠️ Could not inject into tab ${tabId}:`, error.message);

            // Try alternative injection method
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: this.createEmergencyTranslator
                });
                console.log(`✅ Emergency translator injected into tab ${tabId}`);
            } catch (emergencyError) {
                console.log(`❌ Emergency injection also failed for tab ${tabId}`);
            }
        }
    }

    /**
     * Emergency translator function (injected directly)
     */
    createEmergencyTranslator() {
        if (window.hindiAstraEmergency) return;
        window.hindiAstraEmergency = true;

        console.log('🚨 Hindi-astra Emergency Translator activated');

        // Create emergency floating button
        const btn = document.createElement('div');
        btn.innerHTML = '🌐';
        btn.title = 'Hindi-astra Emergency Translator';
        btn.style.cssText = `
            position: fixed !important;
            right: 20px !important;
            bottom: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: #dc3545 !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            color: white !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            border: 3px solid rgba(255,255,255,0.2) !important;
        `;

        btn.onclick = () => {
            const text = prompt('Enter English text to translate to Hindi:');
            if (text) {
                fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        q: text.trim(),
                        source: 'en',
                        target: 'hi',
                        format: 'text'
                    })
                }).then(r => r.json()).then(data => {
                    if (data.data && data.data.translations && data.data.translations.length > 0) {
                        alert(`Hindi Translation:\n\n${data.data.translations[0].translatedText}`);
                    } else {
                        alert('Translation failed');
                    }
                }).catch(() => {
                    alert('Translation failed - check internet connection');
                });
            }
        };

        document.body.appendChild(btn);

        // Show indicator
        const indicator = document.createElement('div');
        indicator.textContent = '🚨 Emergency Mode';
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: #dc3545 !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            z-index: 2147483647 !important;
        `;
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 5000);
    }

    /**
     * Force inject chatbot using direct script execution
     */
    async forceInjectChatbot(tabId) {
        try {
            console.log('🚀 Force injecting chatbot into tab:', tabId);

            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: this.createWorkingChatbot,
                args: [this.apiKey]
            });

            console.log('✅ Force injection successful');
        } catch (error) {
            console.log('❌ Force injection failed:', error);
        }
    }

    /**
     * Create working chatbot (injected function)
     */
    createWorkingChatbot(apiKey) {
        // Prevent multiple injections
        if (window.hindiAstraForceInjected) return;
        window.hindiAstraForceInjected = true;

        console.log('🤖 Creating working chatbot...');

        // Create floating button
        const chatbot = document.createElement('div');
        chatbot.innerHTML = '🌐';
        chatbot.title = 'Hindi-astra Translator';
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
            font-family: Arial, sans-serif !important;
        `;

        // Create panel
        const panel = document.createElement('div');
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
            font-family: Arial, sans-serif !important;
            border: 1px solid #ccc !important;
        `;

        panel.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">🌐 Hindi-astra</span>
                <button id="close-panel" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
            </div>
            <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 15px;">
                <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <strong>Quick Translate</strong><br>
                    <small>Paste English text for Hindi translation</small>
                </div>
                <textarea id="text-input" placeholder="Paste English text here..." style="width: 100%; height: 100px; border: 2px solid #667eea; border-radius: 6px; padding: 10px; font-size: 14px; resize: vertical; box-sizing: border-box;"></textarea>
                <button id="translate-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Translate to Hindi</button>
                <div id="result-area" style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 6px; padding: 12px; display: none;">
                    <strong style="color: #2d5a2d;">Hindi Translation:</strong><br>
                    <div id="result-text" style="font-size: 16px; color: #2d5a2d; margin-top: 8px;"></div>
                </div>
                <div id="error-area" style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; padding: 12px; color: #721c24; display: none;"></div>
            </div>
        `;

        document.body.appendChild(chatbot);
        document.body.appendChild(panel);

        let isTranslating = false;

        // Toggle panel
        chatbot.onclick = () => {
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                setTimeout(() => document.getElementById('text-input').focus(), 100);
            }
        };

        // Close panel
        document.getElementById('close-panel').onclick = () => {
            panel.style.display = 'none';
        };

        // Translate function
        async function translateText() {
            if (isTranslating) return;

            const input = document.getElementById('text-input');
            const text = input.value.trim();

            if (!text) {
                showError('Please enter some text to translate');
                return;
            }

            const btn = document.getElementById('translate-btn');
            const resultArea = document.getElementById('result-area');
            const errorArea = document.getElementById('error-area');
            const resultText = document.getElementById('result-text');

            isTranslating = true;
            btn.textContent = 'Translating...';
            btn.disabled = true;
            resultArea.style.display = 'none';
            errorArea.style.display = 'none';

            try {
                console.log('🔄 Translating:', text);

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
                    console.error('API Error:', errorText);
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('📄 API Response data:', data);

                if (data.data && data.data.translations && data.data.translations.length > 0) {
                    const translation = data.data.translations[0].translatedText;

                    // Check if it's a single word for synonym support
                    const isSingleWord = text.split(/\s+/).length === 1 && /^[a-zA-Z]+$/.test(text);

                    // Get synonyms if it's a single word
                    let synonyms = [];
                    if (isSingleWord) {
                        synonyms = getCommonSynonyms(text.toLowerCase());
                    }

                    // Display enhanced results
                    displayEnhancedResults(translation, synonyms, isSingleWord);
                    resultArea.style.display = 'block';
                    console.log('✅ Translation successful:', translation);
                } else {
                    throw new Error('No translation found in response');
                }

            } catch (error) {
                console.error('❌ Translation failed:', error);
                showError(`Translation failed: ${error.message}`);
            } finally {
                btn.textContent = 'Translate to Hindi';
                btn.disabled = false;
                isTranslating = false;
            }
        }

        // Get synonyms for common words
        function getCommonSynonyms(word) {
            const synonymDict = {
                'happy': ['joyful', 'cheerful', 'glad', 'pleased'],
                'sad': ['unhappy', 'sorrowful', 'melancholy', 'dejected'],
                'big': ['large', 'huge', 'enormous', 'massive'],
                'small': ['tiny', 'little', 'miniature', 'petite'],
                'good': ['excellent', 'great', 'wonderful', 'fine'],
                'bad': ['terrible', 'awful', 'horrible', 'poor'],
                'fast': ['quick', 'rapid', 'swift', 'speedy'],
                'slow': ['sluggish', 'gradual', 'leisurely', 'delayed'],
                'observe': ['watch', 'notice', 'see', 'examine'],
                'study': ['learn', 'examine', 'research', 'analyze'],
                'understand': ['comprehend', 'grasp', 'realize', 'perceive'],
                'explain': ['describe', 'clarify', 'illustrate', 'demonstrate'],
                'create': ['make', 'produce', 'generate', 'build'],
                'important': ['significant', 'crucial', 'vital', 'essential'],
                'beautiful': ['gorgeous', 'lovely', 'attractive', 'stunning'],
                'smart': ['intelligent', 'clever', 'bright', 'brilliant'],
                'strong': ['powerful', 'mighty', 'robust', 'sturdy'],
                'easy': ['simple', 'effortless', 'straightforward', 'basic'],
                'difficult': ['hard', 'challenging', 'tough', 'complex']
            };
            return synonymDict[word] || [];
        }

        // Display enhanced results with synonyms
        function displayEnhancedResults(translation, synonyms, isSingleWord) {
            const resultText = document.getElementById('result-text');

            let content = `<strong style="color: #2d5a2d;">${translation}</strong>`;

            if (synonyms.length > 0 && isSingleWord) {
                content += `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #c3e6c3;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 6px;">
                            📚 English Synonyms:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${synonyms.slice(0, 4).map(synonym =>
                                `<span style="background: #e8f5e8; color: #2d5a2d; padding: 2px 6px; border-radius: 8px; font-size: 11px; border: 1px solid #c3e6c3;">${synonym}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            resultText.innerHTML = content;
        }

        function showError(message) {
            const errorArea = document.getElementById('error-area');
            const resultArea = document.getElementById('result-area');

            errorArea.textContent = message;
            errorArea.style.display = 'block';
            resultArea.style.display = 'none';
        }

        // Event listeners
        document.getElementById('translate-btn').onclick = translateText;

        document.getElementById('text-input').onkeydown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                translateText();
            }
        };

        // Hover effects
        chatbot.onmouseenter = () => chatbot.style.transform = 'scale(1.1)';
        chatbot.onmouseleave = () => chatbot.style.transform = 'scale(1)';

        // Close on outside click
        document.onclick = (e) => {
            if (panel.style.display === 'flex' &&
                !panel.contains(e.target) &&
                !chatbot.contains(e.target)) {
                panel.style.display = 'none';
            }
        };

        // Success indicator
        const indicator = document.createElement('div');
        indicator.textContent = '✅ Hindi-astra Active';
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: #28a745 !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            z-index: 2147483647 !important;
            font-family: Arial, sans-serif !important;
        `;

        document.body.appendChild(indicator);
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s';
                setTimeout(() => indicator.remove(), 500);
            }
        }, 3000);

        console.log('✅ Working chatbot created successfully!');
    }

    /**
     * Initialize default settings
     */
    async initializeDefaultSettings() {
        const defaultSettings = {
            autoTranslate: true,
            showOriginal: true,
            fontSize: 'medium',
            theme: 'modern',
            offlineMode: true,
            academicMode: true
        };

        try {
            await chrome.storage.sync.set({ hindiAstraSettings: defaultSettings });
            console.log('✅ Default settings initialized');
        } catch (error) {
            console.error('Error initializing settings:', error);
        }
    }

    /**
     * Show welcome notification
     */
    async showWelcomeNotification() {
        try {
            await chrome.notifications.create('hindi-astra-welcome', {
                type: 'basic',
                iconUrl: '../icons/icon-48.png',
                title: 'Hindi-astra Ready!',
                message: 'Select any English text to translate to Hindi. Perfect for academic content!'
            });
        } catch (error) {
            console.log('Notification permission not granted');
        }
    }

    /**
     * Setup context menus
     */
    setupContextMenus() {
        // Remove existing menus
        chrome.contextMenus.removeAll(() => {
            // Create main translation menu
            chrome.contextMenus.create({
                id: 'hindi-astra-translate',
                title: 'Translate to Hindi',
                contexts: ['selection']
            });

            // Create academic translation menu
            chrome.contextMenus.create({
                id: 'hindi-astra-academic',
                title: 'Academic Translation',
                contexts: ['selection']
            });

            // Create separator
            chrome.contextMenus.create({
                id: 'hindi-astra-separator',
                type: 'separator',
                contexts: ['selection']
            });

            // Create settings menu
            chrome.contextMenus.create({
                id: 'hindi-astra-settings',
                title: 'Hindi-astra Settings',
                contexts: ['selection']
            });
        });

        // Handle context menu clicks
        chrome.contextMenus.onClicked.addListener(this.handleContextMenu.bind(this));
    }

    /**
     * Handle context menu clicks
     */
    async handleContextMenu(info, tab) {
        switch (info.menuItemId) {
            case 'hindi-astra-translate':
                await this.translateSelection(tab, info.selectionText, 'general');
                break;
            case 'hindi-astra-academic':
                await this.translateSelection(tab, info.selectionText, 'academic');
                break;
            case 'hindi-astra-settings':
                chrome.runtime.openOptionsPage();
                break;
        }
    }

    /**
     * Translate selected text
     */
    async translateSelection(tab, text, context) {
        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'contextTranslate',
                text: text,
                context: context
            });
        } catch (error) {
            console.error('Error sending translation message:', error);
        }
    }

    /**
     * Handle keyboard commands
     */
    async handleCommand(command) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        switch (command) {
            case 'translate-selection':
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'keyboardTranslate'
                });
                break;
            case 'toggle-dictionary':
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleDictionary'
                });
                break;
            case 'open-translator':
                await this.handleGlobalTranslator(tab);
                break;
        }
    }

    /**
     * Handle global translator command (Ctrl+Shift+K)
     */
    async handleGlobalTranslator(tab) {
        try {
            console.log('🌐 Opening global translator on:', tab.url);

            // First try to send message to existing content script
            try {
                await chrome.tabs.sendMessage(tab.id, { action: 'open-translator' });
                console.log('✅ Translator opened via message');
            } catch (messageError) {
                console.log('📨 Message failed, injecting global translator...');

                // If message fails, inject the global translator
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content/global-translator.js']
                });

                console.log('✅ Global translator injected');

                // Wait a bit then send message to open
                setTimeout(async () => {
                    try {
                        await chrome.tabs.sendMessage(tab.id, { action: 'open-translator' });
                        console.log('✅ Translator opened after injection');
                    } catch (error) {
                        console.log('⚠️ Could not send open message, but script is injected');
                    }
                }, 500);
            }
        } catch (error) {
            console.error('❌ Global translator error:', error);
        }
    }

    /**
     * Handle messages from content scripts and popup
     */
    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'translate':
                this.handleTranslateRequest(request, sendResponse);
                return true; // Keep message channel open
                
            case 'getStats':
                this.handleStatsRequest(sendResponse);
                return true;
                
            case 'saveToOffline':
                this.handleSaveOffline(request, sendResponse);
                return true;
                
            default:
                sendResponse({ error: 'Unknown action' });
        }
    }

    /**
     * Handle translation requests
     */
    async handleTranslateRequest(request, sendResponse) {
        try {
            const translation = await this.translateText(request.text, request.options || {});
            sendResponse({ success: true, translation: translation });
        } catch (error) {
            console.error('Background translation error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    /**
     * Handle stats requests
     */
    async handleStatsRequest(sendResponse) {
        try {
            const stats = await chrome.storage.local.get(['hindiAstraStats']);
            sendResponse({ success: true, stats: stats.hindiAstraStats || {} });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    /**
     * Handle save to offline dictionary
     */
    async handleSaveOffline(request, sendResponse) {
        try {
            const stored = await chrome.storage.local.get(['offlineDict']);
            const offlineDict = stored.offlineDict || [];
            
            // Add new translation
            offlineDict.push({
                english: request.english,
                hindi: request.hindi,
                context: request.context,
                timestamp: Date.now()
            });
            
            // Keep only last 1000 entries
            const trimmedDict = offlineDict.slice(-1000);
            
            await chrome.storage.local.set({ offlineDict: trimmedDict });
            sendResponse({ success: true });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    /**
     * Translate text using Google Translate API
     */
    async translateText(text, options = {}) {
        if (!text || text.trim().length === 0) {
            throw new Error('No text provided for translation');
        }

        try {
            console.log('🌐 Translating via background:', text);
            
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text.trim(),
                    source: 'en',
                    target: 'hi',
                    format: 'text'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(`API Error: ${data.error.message}`);
            }

            if (data.data && data.data.translations && data.data.translations.length > 0) {
                const translation = {
                    text: data.data.translations[0].translatedText,
                    source: 'online',
                    confidence: 0.95,
                    context: options.context || 'general'
                };
                
                console.log('✅ Translation successful:', translation.text);
                
                // Save to offline dictionary for future use
                this.saveToOfflineDict(text.trim(), translation.text, options.context);
                
                return translation;
            } else {
                throw new Error('Translation not found in response');
            }
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }

    /**
     * Save translation to offline dictionary
     */
    async saveToOfflineDict(english, hindi, context) {
        try {
            const stored = await chrome.storage.local.get(['offlineDict']);
            const offlineDict = stored.offlineDict || [];
            
            // Check if already exists
            const exists = offlineDict.some(entry => 
                entry.english.toLowerCase() === english.toLowerCase()
            );
            
            if (!exists) {
                offlineDict.push({
                    english: english.toLowerCase(),
                    hindi: hindi,
                    context: context || 'general',
                    timestamp: Date.now()
                });
                
                // Keep only last 1000 entries
                const trimmedDict = offlineDict.slice(-1000);
                await chrome.storage.local.set({ offlineDict: trimmedDict });
            }
        } catch (error) {
            console.error('Error saving to offline dict:', error);
        }
    }

    /**
     * Get offline dictionary stats
     */
    async getOfflineStats() {
        try {
            const stored = await chrome.storage.local.get(['offlineDict']);
            const offlineDict = stored.offlineDict || [];
            return {
                totalWords: offlineDict.length,
                lastUpdated: offlineDict.length > 0 ? Math.max(...offlineDict.map(e => e.timestamp)) : null
            };
        } catch (error) {
            return { totalWords: 0, lastUpdated: null };
        }
    }
}

// Initialize background service
const hindiAstraBackground = new HindiAstraBackground();

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('🚀 Hindi-astra extension started');
});

// Handle extension suspend
chrome.runtime.onSuspend.addListener(() => {
    console.log('💤 Hindi-astra extension suspended');
});

console.log('🔧 Hindi-astra Background Script loaded');
