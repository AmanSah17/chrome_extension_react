/**
 * Hindi-astra Translation Engine
 * Advanced translation system with offline capabilities and academic focus
 */

class HindiAstraTranslationEngine {
    constructor() {
        this.apiKey = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";
        this.offlineDict = new Map();
        this.academicTerms = new Map();
        this.translationCache = new Map();
        this.isOnline = navigator.onLine;
        
        // Initialize offline dictionary and academic terms
        this.initializeOfflineResources();
        this.setupNetworkListeners();
    }

    /**
     * Initialize offline dictionary with common academic terms
     */
    async initializeOfflineResources() {
        // Load basic English-Hindi dictionary for offline use
        const basicDict = {
            // Academic terms
            'research': 'अनुसंधान',
            'study': 'अध्ययन',
            'analysis': 'विश्लेषण',
            'theory': 'सिद्धांत',
            'concept': 'अवधारणा',
            'method': 'विधि',
            'result': 'परिणाम',
            'conclusion': 'निष्कर्ष',
            'hypothesis': 'परिकल्पना',
            'experiment': 'प्रयोग',
            'data': 'डेटा',
            'evidence': 'साक्ष्य',
            'literature': 'साहित्य',
            'reference': 'संदर्भ',
            'bibliography': 'ग्रंथ सूची',
            
            // Common words
            'the': 'यह/वह',
            'and': 'और',
            'or': 'या',
            'but': 'लेकिन',
            'with': 'के साथ',
            'from': 'से',
            'to': 'को/तक',
            'in': 'में',
            'on': 'पर',
            'at': 'पर',
            'by': 'द्वारा',
            'for': 'के लिए',
            'of': 'का/की/के',
            'is': 'है',
            'are': 'हैं',
            'was': 'था',
            'were': 'थे',
            'will': 'होगा',
            'would': 'होगा',
            'can': 'सकता है',
            'could': 'सकता था',
            'should': 'चाहिए',
            'must': 'जरूर',
            'have': 'है/पास है',
            'has': 'है/पास है',
            'had': 'था/पास था',
            
            // Academic subjects
            'mathematics': 'गणित',
            'science': 'विज्ञान',
            'physics': 'भौतिकी',
            'chemistry': 'रसायन विज्ञान',
            'biology': 'जीव विज्ञान',
            'history': 'इतिहास',
            'geography': 'भूगोल',
            'economics': 'अर्थशास्त्र',
            'psychology': 'मनोविज्ञान',
            'sociology': 'समाजशास्त्र',
            'philosophy': 'दर्शनशास्त्र',
            'literature': 'साहित्य',
            'language': 'भाषा',
            'computer': 'कंप्यूटर',
            'technology': 'प्रौद्योगिकी',
            'engineering': 'इंजीनियरिंग',
            'medicine': 'चिकित्सा',
            'law': 'कानून',
            'business': 'व्यापार',
            'management': 'प्रबंधन',
            'education': 'शिक्षा'
        };

        // Load into offline dictionary
        for (const [english, hindi] of Object.entries(basicDict)) {
            this.offlineDict.set(english.toLowerCase(), hindi);
        }

        // Load from storage if available
        try {
            const stored = await chrome.storage.local.get(['offlineDict', 'academicTerms']);
            if (stored.offlineDict) {
                const storedDict = new Map(stored.offlineDict);
                storedDict.forEach((value, key) => {
                    this.offlineDict.set(key, value);
                });
            }
            if (stored.academicTerms) {
                this.academicTerms = new Map(stored.academicTerms);
            }
        } catch (error) {
            console.log('No stored dictionary found, using default');
        }
    }

    /**
     * Setup network status listeners
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Hindi-astra: Online mode activated');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Hindi-astra: Offline mode activated');
        });
    }

    /**
     * Main translation function with fallback support
     */
    async translateText(text, options = {}) {
        if (!text || text.trim().length === 0) {
            throw new Error('No text provided for translation');
        }

        const cleanText = text.trim().toLowerCase();
        const cacheKey = `${cleanText}_${options.context || 'general'}`;

        // Check cache first
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        let translation;

        try {
            if (this.isOnline) {
                // Try online translation first
                translation = await this.translateOnline(text, options);
            } else {
                throw new Error('Offline mode');
            }
        } catch (error) {
            console.log('Online translation failed, trying offline:', error.message);
            // Fallback to offline translation
            translation = await this.translateOffline(text, options);
        }

        // Cache the result
        this.translationCache.set(cacheKey, translation);
        
        // Save to storage for future offline use
        this.saveToOfflineDict(cleanText, translation.text);

        return translation;
    }

    /**
     * Online translation using Google Translate API
     */
    async translateOnline(text, options = {}) {
        try {
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.data && data.data.translations && data.data.translations.length > 0) {
                return {
                    text: data.data.translations[0].translatedText,
                    source: 'online',
                    confidence: 0.9,
                    context: options.context || 'general'
                };
            } else {
                throw new Error('Translation not found in response');
            }
        } catch (error) {
            console.error('Online translation error:', error);
            throw error;
        }
    }

    /**
     * Offline translation using local dictionary
     */
    async translateOffline(text, options = {}) {
        const words = text.toLowerCase().split(/\s+/);
        const translations = [];
        let confidence = 0;

        for (const word of words) {
            const cleanWord = word.replace(/[^\w]/g, '');
            
            if (this.offlineDict.has(cleanWord)) {
                translations.push(this.offlineDict.get(cleanWord));
                confidence += 0.8;
            } else {
                // Try partial matches or similar words
                const partialMatch = this.findPartialMatch(cleanWord);
                if (partialMatch) {
                    translations.push(`${partialMatch} (?)`);
                    confidence += 0.4;
                } else {
                    translations.push(`[${word}]`);
                    confidence += 0.1;
                }
            }
        }

        return {
            text: translations.join(' '),
            source: 'offline',
            confidence: Math.min(confidence / words.length, 1.0),
            context: options.context || 'general',
            note: 'Offline translation - may be incomplete'
        };
    }

    /**
     * Find partial matches in offline dictionary
     */
    findPartialMatch(word) {
        // Look for words that start with the same letters
        for (const [key, value] of this.offlineDict.entries()) {
            if (key.startsWith(word.substring(0, 3)) && word.length > 3) {
                return value;
            }
        }
        return null;
    }

    /**
     * Save translation to offline dictionary
     */
    async saveToOfflineDict(english, hindi) {
        this.offlineDict.set(english, hindi);
        
        try {
            // Save to chrome storage
            const dictArray = Array.from(this.offlineDict.entries());
            await chrome.storage.local.set({ 
                offlineDict: dictArray.slice(-1000) // Keep only last 1000 entries
            });
        } catch (error) {
            console.log('Could not save to storage:', error);
        }
    }

    /**
     * Get translation statistics
     */
    getStats() {
        return {
            offlineDictSize: this.offlineDict.size,
            cacheSize: this.translationCache.size,
            isOnline: this.isOnline,
            academicTermsCount: this.academicTerms.size
        };
    }

    /**
     * Clear cache and reset
     */
    clearCache() {
        this.translationCache.clear();
        console.log('Translation cache cleared');
    }
}

// Export for use in other modules
window.HindiAstraTranslationEngine = HindiAstraTranslationEngine;

// Initialize translation engine
window.hindiAstraEngine = new HindiAstraTranslationEngine();
