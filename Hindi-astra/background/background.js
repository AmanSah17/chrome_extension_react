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
