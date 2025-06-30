/**
 * Hindi-astra Direct PDF Injector
 * Aggressive approach for local PDF files that bypasses Chrome restrictions
 */

(function() {
    'use strict';
    
    console.log('🚀 Hindi-astra Direct PDF Injector starting...');
    
    // Check if this is a local PDF
    const isLocalPDF = window.location.protocol === 'file:' && 
                      window.location.href.toLowerCase().includes('.pdf');
    
    if (!isLocalPDF) {
        console.log('ℹ️ Not a local PDF, skipping direct injection');
        return;
    }
    
    console.log('📄 Local PDF detected, applying direct injection...');
    
    // Global variables
    let translationPopup = null;
    let isTranslating = false;
    
    // Translation function (simplified)
    async function translateText(text) {
        try {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text.trim(),
                    source: 'en',
                    target: 'hi',
                    format: 'text'
                })
            });
            
            const data = await response.json();
            if (data.data && data.data.translations && data.data.translations.length > 0) {
                return data.data.translations[0].translatedText;
            }
            throw new Error('Translation not found');
        } catch (error) {
            console.error('Translation failed:', error);
            return 'Translation failed';
        }
    }
    
    // Create translation popup
    function createTranslationPopup(originalText, translatedText, x, y) {
        // Remove existing popup
        if (translationPopup) {
            translationPopup.remove();
        }
        
        translationPopup = document.createElement('div');
        translationPopup.style.cssText = `
            position: fixed;
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
            z-index: 999999;
            animation: fadeIn 0.3s ease-out;
            border: 1px solid rgba(255,255,255,0.2);
        `;
        
        translationPopup.innerHTML = `
            <div style="
                background: rgba(255,255,255,0.1);
                padding: 12px 16px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            ">
                <span style="
                    font-weight: 600;
                    font-size: 13px;
                    opacity: 0.9;
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">${originalText}</span>
                <button onclick="this.closest('div').remove()" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    height: 24px;
                    width: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            <div style="padding: 16px;">
                <div style="
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 1.4;
                    margin-bottom: 12px;
                ">${translatedText}</div>
                <div style="
                    font-size: 11px;
                    opacity: 0.7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>🌐 Online</span>
                    <span>Local PDF</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(translationPopup);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (translationPopup && translationPopup.parentNode) {
                translationPopup.style.animation = 'fadeOut 0.3s ease-in';
                setTimeout(() => {
                    if (translationPopup && translationPopup.parentNode) {
                        translationPopup.remove();
                    }
                }, 300);
            }
        }, 8000);
    }
    
    // Handle text selection
    async function handleSelection() {
        if (isTranslating) return;
        
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (!selectedText || selectedText.length === 0) {
            if (translationPopup) {
                translationPopup.remove();
                translationPopup = null;
            }
            return;
        }
        
        // Check if text is English and reasonable length
        const englishRegex = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
        if (!englishRegex.test(selectedText) || selectedText.length > 200) {
            return;
        }
        
        console.log('📄 Selected text for translation:', selectedText);
        
        // Get selection position
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            x = rect.left + window.scrollX;
            y = rect.top + window.scrollY;
        }
        
        isTranslating = true;
        
        // Show loading popup
        createTranslationPopup(selectedText, '🔄 Translating...', x, y);
        
        try {
            const translation = await translateText(selectedText);
            createTranslationPopup(selectedText, translation, x, y);
        } catch (error) {
            createTranslationPopup(selectedText, '❌ Translation failed', x, y);
        } finally {
            isTranslating = false;
        }
    }
    
    // Force document to be selectable
    function forceSelectability() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                pointer-events: auto !important;
            }
            ::selection {
                background: rgba(102, 126, 234, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
        
        // Apply to all elements
        function makeSelectable() {
            document.querySelectorAll('*').forEach(el => {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.pointerEvents = 'auto';
            });
        }
        
        makeSelectable();
        
        // Reapply periodically
        setInterval(makeSelectable, 1000);
    }
    
    // Initialize
    function initialize() {
        console.log('🔧 Initializing direct PDF injection...');
        
        // Force selectability
        forceSelectability();
        
        // Add event listeners
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                handleSelection();
            }
        });
        
        // Show indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        indicator.textContent = '🌐 Hindi-astra Ready';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s';
                setTimeout(() => indicator.remove(), 500);
            }
        }, 3000);
        
        console.log('✅ Direct PDF injection initialized');
    }
    
    // Wait for document ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also initialize after a delay to catch late-loading PDFs
    setTimeout(initialize, 2000);
    
})();
