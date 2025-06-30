console.log("Background script loaded")

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed")

    // Set up context menu for translation
    chrome.contextMenus.create({
        id: "translate-text",
        title: "Translate to Hindi",
        contexts: ["selection"]
    });
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate-text" && info.selectionText) {
        // Send message to content script to translate
        chrome.tabs.sendMessage(tab.id, {
            action: "translate",
            text: info.selectionText
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "translate") {
        translateText(request.text)
            .then(translation => {
                sendResponse({ success: true, translation: translation });
            })
            .catch(error => {
                console.error('Background translation error:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep message channel open for async response
    }
});

// Translation function
async function translateText(text) {
    const API_KEY = "AIzaSyDP6sQRs214HFL6uCjEwVRYW4Gl6EBRLbI";

    if (!text || text.trim().length === 0) {
        throw new Error('No text provided for translation');
    }

    try {
        console.log('Translating text:', text);

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
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Translation API response:', data);

        if (data.error) {
            throw new Error(`API Error: ${data.error.message}`);
        }

        if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translation = data.data.translations[0].translatedText;
            console.log('Translation successful:', translation);
            return translation;
        } else {
            throw new Error('Translation not found in response');
        }
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

