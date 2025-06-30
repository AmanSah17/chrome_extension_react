// Simple Chrome Extension Translation Script
let translationPopup = null;
let isTranslating = false;

// Check if text is English
function isEnglishText(text) {
    const englishRegex = /^[a-zA-Z\s.,!?;:'"()-]+$/;
    return englishRegex.test(text.trim());
}

// Create translation popup
function createTranslationPopup(x, y, originalText, translation) {
    removeTranslationPopup();

    translationPopup = document.createElement('div');
    translationPopup.id = 'translation-popup';
    translationPopup.innerHTML = `
        <div class="translation-header">
            <span class="original-text">${originalText}</span>
            <button class="close-btn">×</button>
        </div>
        <div class="translation-content">
            <span class="translation-text">${translation}</span>
        </div>
    `;

    // Position popup
    translationPopup.style.position = 'absolute';
    translationPopup.style.left = x + 'px';
    translationPopup.style.top = (y - 80) + 'px';
    translationPopup.style.zIndex = '10000';

    // Add close button functionality
    const closeBtn = translationPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', removeTranslationPopup);

    document.body.appendChild(translationPopup);

    // Auto-remove after 5 seconds
    setTimeout(removeTranslationPopup, 5000);
}

// Remove translation popup
function removeTranslationPopup() {
    if (translationPopup) {
        translationPopup.remove();
        translationPopup = null;
    }
}

// Get selected text and position
function getSelectionInfo() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const selectedText = selection.toString().trim();

    if (selectedText.length === 0) return null;

    return {
        text: selectedText,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

// Direct API call to Google Translate
async function translateText(text) {
    const API_KEY = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";

    try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
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
            return data.data.translations[0].translatedText;
        } else {
            throw new Error('Translation not found');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed. Please try again.';
    }
}

// Main text selection handler
document.addEventListener('mouseup', async function(event) {
    if (isTranslating) return;

    const selectionInfo = getSelectionInfo();
    if (!selectionInfo) {
        removeTranslationPopup();
        return;
    }

    const { text, x, y } = selectionInfo;

    // Only translate English text, max 50 characters
    if (!isEnglishText(text) || text.length > 50) {
        removeTranslationPopup();
        return;
    }

    console.log('🔄 Translating:', text);
    isTranslating = true;
    createTranslationPopup(x, y, text, 'Translating...');

    try {
        const translation = await translateText(text);
        console.log('✅ Translation successful:', translation);
        createTranslationPopup(x, y, text, translation);
    } catch (error) {
        console.error('❌ Translation failed:', error);
        createTranslationPopup(x, y, text, 'Translation failed');
    } finally {
        isTranslating = false;
    }
});

// Remove popup when clicking elsewhere
document.addEventListener('click', function(event) {
    if (translationPopup && !translationPopup.contains(event.target)) {
        removeTranslationPopup();
    }
});

// Remove popup when scrolling
document.addEventListener('scroll', removeTranslationPopup);

console.log('🌐 Hindi Translation Extension v0.0.2 loaded successfully!');
console.log('✅ Ready to translate English text to Hindi!');
