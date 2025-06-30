/**
 * Hindi-astra Popup JavaScript
 * Handles popup interface functionality
 */

class HindiAstraPopup {
    constructor() {
        this.translationEngine = null;
        this.stats = {
            translationsToday: 0,
            offlineWords: 0,
            accuracy: 95
        };
        this.init();
    }

    /**
     * Initialize popup
     */
    async init() {
        console.log('🚀 Hindi-astra Popup initializing...');
        
        // Load stats and settings
        await this.loadStats();
        await this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateUI();
        
        // Check online status
        this.updateOnlineStatus();
        
        console.log('✅ Hindi-astra Popup ready!');
    }

    /**
     * Load statistics from storage
     */
    async loadStats() {
        try {
            const stored = await chrome.storage.local.get(['hindiAstraStats']);
            if (stored.hindiAstraStats) {
                this.stats = { ...this.stats, ...stored.hindiAstraStats };
            }
        } catch (error) {
            console.log('Using default stats');
        }
    }

    /**
     * Load settings from storage
     */
    async loadSettings() {
        try {
            const stored = await chrome.storage.sync.get(['hindiAstraSettings']);
            if (stored.hindiAstraSettings) {
                const settings = stored.hindiAstraSettings;
                document.getElementById('autoTranslate').checked = settings.autoTranslate !== false;
                document.getElementById('showOriginal').checked = settings.showOriginal !== false;
            }
        } catch (error) {
            console.log('Using default settings');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Quick translate button
        const translateBtn = document.getElementById('translateBtn');
        const quickInput = document.getElementById('quickInput');
        
        translateBtn.addEventListener('click', () => this.quickTranslate());
        quickInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.quickTranslate();
            }
        });

        // Settings checkboxes
        document.getElementById('autoTranslate').addEventListener('change', (e) => {
            this.saveSetting('autoTranslate', e.target.checked);
        });
        
        document.getElementById('showOriginal').addEventListener('change', (e) => {
            this.saveSetting('showOriginal', e.target.checked);
        });

        // Footer buttons
        document.getElementById('settingsBtn').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
        
        document.getElementById('helpBtn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/AmanSah17/chrome_extension_react/tree/Hindi-astra' });
        });
        
        document.getElementById('feedbackBtn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'mailto:amansah1717@gmail.com?subject=Hindi-astra Feedback' });
        });

        // Online/offline status
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
    }

    /**
     * Quick translate functionality
     */
    async quickTranslate() {
        const input = document.getElementById('quickInput');
        const translateBtn = document.getElementById('translateBtn');
        const resultBox = document.getElementById('quickResult');
        const resultText = document.getElementById('resultText');
        const resultMeta = document.getElementById('resultMeta');

        const text = input.value.trim();
        if (!text) {
            this.showError('Please enter some text to translate');
            return;
        }

        // Show loading state
        translateBtn.classList.add('loading');
        translateBtn.querySelector('.btn-text').textContent = 'Translating...';
        resultBox.classList.add('hidden');

        try {
            // Send message to content script for translation
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'quickTranslate',
                text: text
            });

            if (response && response.success) {
                // Show result
                resultText.textContent = response.translation.text;
                resultMeta.innerHTML = `
                    <span>${response.translation.source === 'online' ? '🌐 Online' : '📱 Offline'}</span>
                    <span>Confidence: ${Math.round(response.translation.confidence * 100)}%</span>
                `;
                resultBox.classList.remove('hidden');
                
                // Update stats
                this.updateStats('translation');
            } else {
                throw new Error(response?.error || 'Translation failed');
            }
        } catch (error) {
            console.error('Quick translate error:', error);
            this.showError('Translation failed. Please try again.');
        } finally {
            // Reset button state
            translateBtn.classList.remove('loading');
            translateBtn.querySelector('.btn-text').textContent = 'Translate';
        }
    }

    /**
     * Save setting to storage
     */
    async saveSetting(key, value) {
        try {
            const stored = await chrome.storage.sync.get(['hindiAstraSettings']);
            const settings = stored.hindiAstraSettings || {};
            settings[key] = value;
            await chrome.storage.sync.set({ hindiAstraSettings: settings });
            
            // Send message to content script to update settings
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.tabs.sendMessage(tab.id, {
                action: 'updateSettings',
                settings: settings
            }).catch(() => {
                // Ignore errors if content script not available
            });
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    }

    /**
     * Update UI with current data
     */
    updateUI() {
        // Update stats
        document.getElementById('translationsToday').textContent = this.stats.translationsToday;
        document.getElementById('offlineWords').textContent = this.stats.offlineWords;
        document.getElementById('accuracy').textContent = `${this.stats.accuracy}%`;
    }

    /**
     * Update online status indicator
     */
    updateOnlineStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (navigator.onLine) {
            statusDot.classList.remove('offline');
            statusDot.classList.add('online');
            statusText.textContent = 'Online';
        } else {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Offline';
        }
    }

    /**
     * Update statistics
     */
    async updateStats(type) {
        switch (type) {
            case 'translation':
                this.stats.translationsToday++;
                break;
            case 'offlineWords':
                this.stats.offlineWords++;
                break;
        }
        
        // Save to storage
        try {
            await chrome.storage.local.set({ hindiAstraStats: this.stats });
        } catch (error) {
            console.error('Error saving stats:', error);
        }
        
        // Update UI
        this.updateUI();
    }

    /**
     * Show error message
     */
    showError(message) {
        const resultBox = document.getElementById('quickResult');
        const resultText = document.getElementById('resultText');
        const resultMeta = document.getElementById('resultMeta');
        
        resultText.textContent = message;
        resultText.style.color = '#dc3545';
        resultMeta.textContent = '';
        resultBox.classList.remove('hidden');
        
        // Reset after 3 seconds
        setTimeout(() => {
            resultText.style.color = '';
            resultBox.classList.add('hidden');
        }, 3000);
    }

    /**
     * Get translation engine stats
     */
    async getEngineStats() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'getStats'
            });
            
            if (response && response.stats) {
                this.stats.offlineWords = response.stats.offlineDictSize;
                this.updateUI();
            }
        } catch (error) {
            // Content script might not be available
            console.log('Could not get engine stats');
        }
    }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.hindiAstraPopup = new HindiAstraPopup();
});

// Handle popup visibility
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.hindiAstraPopup) {
        window.hindiAstraPopup.getEngineStats();
        window.hindiAstraPopup.updateOnlineStatus();
    }
});

console.log('📱 Hindi-astra Popup Script loaded');
