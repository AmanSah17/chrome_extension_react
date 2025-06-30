/**
 * Hindi-astra Options Page JavaScript
 * Handles settings and configuration
 */

class HindiAstraOptions {
    constructor() {
        this.defaultSettings = {
            autoTranslate: true,
            showOriginal: true,
            contextMenu: true,
            fontSize: 'medium',
            theme: 'modern',
            preferOnline: true,
            maxLength: 200,
            showConfidence: true,
            cacheTranslations: true,
            enableOffline: true,
            dictSize: 1000,
            mathematics: true,
            science: true,
            literature: true,
            history: true,
            economics: true,
            psychology: true,
            pdfSupport: true,
            ocrSupport: false
        };
        
        this.init();
    }

    /**
     * Initialize options page
     */
    async init() {
        console.log('⚙️ Hindi-astra Options initializing...');
        
        // Setup tab navigation
        this.setupTabNavigation();
        
        // Load current settings
        await this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load statistics
        await this.loadStatistics();
        
        console.log('✅ Hindi-astra Options ready!');
    }

    /**
     * Setup tab navigation
     */
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    /**
     * Load settings from storage
     */
    async loadSettings() {
        try {
            const stored = await chrome.storage.sync.get(['hindiAstraSettings']);
            const settings = stored.hindiAstraSettings || this.defaultSettings;
            
            // Apply settings to form elements
            Object.keys(settings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings[key];
                    } else if (element.type === 'range') {
                        element.value = settings[key];
                        this.updateRangeValue(key, settings[key]);
                    } else {
                        element.value = settings[key];
                    }
                }
            });
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Save settings button
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Reset settings button
        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });
        
        // Range input for max length
        const maxLengthRange = document.getElementById('maxLength');
        maxLengthRange.addEventListener('input', (e) => {
            this.updateRangeValue('maxLength', e.target.value);
        });
        
        // Dictionary management buttons
        document.getElementById('exportDict').addEventListener('click', () => {
            this.exportDictionary();
        });
        
        document.getElementById('importDict').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importDictionary(e.target.files[0]);
        });
        
        document.getElementById('clearDict').addEventListener('click', () => {
            this.clearDictionary();
        });
        
        // Auto-save on change
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.autoSave();
            });
        });
    }

    /**
     * Update range value display
     */
    updateRangeValue(id, value) {
        const valueElement = document.getElementById(id + 'Value');
        if (valueElement) {
            valueElement.textContent = value;
        }
    }

    /**
     * Save settings to storage
     */
    async saveSettings() {
        try {
            const settings = {};
            
            // Collect all form values
            Object.keys(this.defaultSettings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        settings[key] = element.checked;
                    } else if (element.type === 'range' || element.type === 'number') {
                        settings[key] = parseInt(element.value);
                    } else {
                        settings[key] = element.value;
                    }
                }
            });
            
            // Save to storage
            await chrome.storage.sync.set({ hindiAstraSettings: settings });
            
            // Show success message
            this.showMessage('Settings saved successfully!', 'success');
            
            // Notify content scripts of settings change
            this.notifySettingsChange(settings);
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }

    /**
     * Reset settings to default
     */
    async resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            try {
                await chrome.storage.sync.set({ hindiAstraSettings: this.defaultSettings });
                await this.loadSettings();
                this.showMessage('Settings reset to default!', 'success');
            } catch (error) {
                console.error('Error resetting settings:', error);
                this.showMessage('Error resetting settings. Please try again.', 'error');
            }
        }
    }

    /**
     * Auto-save settings (debounced)
     */
    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveSettings();
        }, 1000);
    }

    /**
     * Load and display statistics
     */
    async loadStatistics() {
        try {
            // Get offline dictionary stats
            const offlineData = await chrome.storage.local.get(['offlineDict']);
            const offlineDict = offlineData.offlineDict || [];
            
            // Get general stats
            const statsData = await chrome.storage.local.get(['hindiAstraStats']);
            const stats = statsData.hindiAstraStats || {};
            
            // Update UI
            document.getElementById('offlineWordsCount').textContent = offlineDict.length;
            document.getElementById('academicTermsCount').textContent = '500+'; // Pre-loaded terms
            
            const lastUpdated = offlineDict.length > 0 ? 
                new Date(Math.max(...offlineDict.map(e => e.timestamp || 0))).toLocaleDateString() : 
                'Never';
            document.getElementById('lastUpdated').textContent = lastUpdated;
            
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    /**
     * Export dictionary to JSON file
     */
    async exportDictionary() {
        try {
            const data = await chrome.storage.local.get(['offlineDict']);
            const dictionary = data.offlineDict || [];
            
            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                dictionary: dictionary
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `hindi-astra-dictionary-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showMessage('Dictionary exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting dictionary:', error);
            this.showMessage('Error exporting dictionary. Please try again.', 'error');
        }
    }

    /**
     * Import dictionary from JSON file
     */
    async importDictionary(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!importData.dictionary || !Array.isArray(importData.dictionary)) {
                throw new Error('Invalid dictionary format');
            }
            
            // Merge with existing dictionary
            const existing = await chrome.storage.local.get(['offlineDict']);
            const existingDict = existing.offlineDict || [];
            
            const mergedDict = [...existingDict, ...importData.dictionary];
            
            // Remove duplicates and keep only last 5000 entries
            const uniqueDict = mergedDict
                .filter((item, index, arr) => 
                    arr.findIndex(i => i.english === item.english) === index
                )
                .slice(-5000);
            
            await chrome.storage.local.set({ offlineDict: uniqueDict });
            
            this.showMessage(`Dictionary imported! Added ${importData.dictionary.length} entries.`, 'success');
            await this.loadStatistics();
            
        } catch (error) {
            console.error('Error importing dictionary:', error);
            this.showMessage('Error importing dictionary. Please check the file format.', 'error');
        }
    }

    /**
     * Clear offline dictionary
     */
    async clearDictionary() {
        if (confirm('Are you sure you want to clear the offline dictionary? This cannot be undone.')) {
            try {
                await chrome.storage.local.remove(['offlineDict']);
                this.showMessage('Dictionary cleared successfully!', 'success');
                await this.loadStatistics();
            } catch (error) {
                console.error('Error clearing dictionary:', error);
                this.showMessage('Error clearing dictionary. Please try again.', 'error');
            }
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    /**
     * Notify content scripts of settings change
     */
    async notifySettingsChange(settings) {
        try {
            const tabs = await chrome.tabs.query({});
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateSettings',
                    settings: settings
                }).catch(() => {
                    // Ignore errors for tabs without content script
                });
            });
        } catch (error) {
            console.log('Could not notify all tabs of settings change');
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.hindiAstraOptions = new HindiAstraOptions();
});

console.log('⚙️ Hindi-astra Options Script loaded');
