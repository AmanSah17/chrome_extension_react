# 🧪 Hindi-astra Testing Guide

## 📋 **Pre-Testing Checklist**

Before testing, ensure you have:
- ✅ Google Chrome Browser (Version 88+)
- ✅ Active internet connection (for online translation)
- ✅ Developer mode enabled in Chrome
- ✅ All extension files in the Hindi-astra folder

## 🚀 **Installation Steps**

### Step 1: Enable Developer Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** in the top-right corner
3. You should see additional buttons appear

### Step 2: Load the Extension
1. Click **"Load unpacked"** button
2. Navigate to your `Hindi-astra` folder
3. Select the folder and click "Select Folder"
4. The extension should appear in your extensions list

### Step 3: Verify Installation
1. Look for "Hindi-astra - Academic Translation Assistant" in the list
2. Ensure the toggle is **ON** (blue)
3. Click the puzzle piece icon in Chrome toolbar
4. Pin the Hindi-astra extension for easy access

## 🔧 **Basic Functionality Tests**

### Test 1: Extension Popup
1. **Click the Hindi-astra icon** in the toolbar
2. **Expected Result**: Popup opens showing:
   - Header with logo and online status
   - Statistics (translations today, offline words, accuracy)
   - Quick translate box
   - Feature grid
   - Usage instructions
   - Settings checkboxes

### Test 2: Quick Translation
1. **Open the extension popup**
2. **Type English text** in the quick translate box (e.g., "hello world")
3. **Click "Translate" button**
4. **Expected Result**: 
   - Button shows "Translating..." briefly
   - Result appears below with Hindi translation
   - Shows confidence score and source (online/offline)

### Test 3: Text Selection Translation
1. **Go to any webpage** with English text
2. **Select any English word or phrase** (e.g., "computer", "education")
3. **Expected Result**:
   - Beautiful popup appears near selected text
   - Shows original English text in header
   - Displays Hindi translation
   - Shows confidence score and source
   - Auto-disappears after 8 seconds

### Test 4: Keyboard Shortcut
1. **Select English text** on any webpage
2. **Press Ctrl+Shift+T** (Cmd+Shift+T on Mac)
3. **Expected Result**: Translation popup appears

### Test 5: Context Menu
1. **Select English text** on any webpage
2. **Right-click** on the selected text
3. **Expected Result**: Context menu shows "Translate to Hindi" option
4. **Click the option**: Translation popup appears

## 📄 **PDF Testing (Critical for Local Files)**

### **IMPORTANT: Local PDF Setup Required**
Before testing local PDFs, you MUST enable file access:
1. Go to `chrome://extensions/`
2. Click "Details" on Hindi-astra
3. Enable "Allow access to file URLs"
4. Restart Chrome

### Test 6: Web-hosted PDF Translation
1. **Search for "sample PDF filetype:pdf"** in Google
2. **Open a PDF directly** from search results
3. **Select text** from the PDF
4. **Expected Result**: Translation popup appears with Hindi translation

### Test 7: Local PDF Translation (Main Issue)
1. **Download a PDF** to your computer
2. **Open the PDF in Chrome** (drag & drop or Ctrl+O)
3. **Verify URL starts with `file://`**
4. **Select text** from the PDF
5. **Expected Result**: Translation popup appears
6. **If it doesn't work**: Check console for error messages

### Test 8: Debug Local PDF Issues
1. **Open a local PDF** in Chrome
2. **Press F12** to open Developer Tools
3. **Type in console**: `hindiAstraDebug.test()`
4. **Review the diagnostic results**
5. **Check for specific error messages**

### Test 9: Different PDF Types
Test with various PDF types:
- **Text-based PDF** (created from Word/Google Docs)
- **Scanned PDF** (image-based)
- **Mixed PDF** (text + images)
- **Academic papers** (research PDFs)

### Test 10: Scanned PDF (OCR Assistance)
1. **Open a scanned PDF** (image-based PDF)
2. **Try to select text** - if no text is selectable:
3. **Use area selection** (drag to select an area)
4. **Expected Result**: Modal appears asking you to type the text
5. **Type the English text** and click "Translate"
6. **Expected Result**: Translation popup appears

## 🌐 **Online/Offline Testing**

### Test 8: Online Mode
1. **Ensure internet connection** is active
2. **Translate any text**
3. **Expected Result**: 
   - Status shows "🌐 Online"
   - High confidence scores (90%+)
   - Fast translation speed

### Test 9: Offline Mode
1. **Disconnect internet** (turn off WiFi)
2. **Try translating common words** (e.g., "computer", "study", "research")
3. **Expected Result**:
   - Status shows "📱 Offline"
   - Basic translations for common academic terms
   - Lower confidence scores
   - "Offline translation" note

## ⚙️ **Settings Testing**

### Test 10: Settings Page
1. **Click the Hindi-astra icon**
2. **Click "⚙️ Settings" button**
3. **Expected Result**: Settings page opens with tabs:
   - General, Translation, Offline, Academic, About

### Test 11: Settings Functionality
1. **In settings, toggle "Auto-translate on selection"** OFF
2. **Save settings**
3. **Go to a webpage and select text**
4. **Expected Result**: No automatic translation
5. **Toggle it back ON** and test again

## 🐛 **Error Handling Tests**

### Test 12: Network Error Handling
1. **Disconnect internet mid-translation**
2. **Try translating text**
3. **Expected Result**: Graceful fallback to offline mode

### Test 13: Invalid Text Handling
1. **Select non-English text** (numbers, symbols, other languages)
2. **Expected Result**: No translation popup appears

### Test 14: Long Text Handling
1. **Select very long text** (more than 200 characters)
2. **Expected Result**: No translation popup (respects character limit)

## 📱 **Mobile Testing** (Chrome Mobile)

### Test 15: Mobile Responsiveness
1. **Open Chrome on mobile device**
2. **Install extension** (if supported)
3. **Test text selection** on mobile
4. **Expected Result**: Responsive popup design

## 🔍 **Console Debugging & Local PDF Diagnostics**

### Test 16: Console Messages
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Reload page with extension**
4. **Expected Messages**:
   ```
   🚀 Hindi-astra Translator initializing...
   🔍 Hindi-astra PDF Detector initializing...
   📝 Hindi-astra Text Extractor initializing...
   🎨 Hindi-astra UI Components initializing...
   🔍 Hindi-astra Debug Helper initializing...
   ✅ Hindi-astra Translator ready!
   ```

### Test 17: Local PDF Specific Debugging
1. **Open a local PDF** (file:// URL)
2. **Open console** (F12)
3. **Type**: `hindiAstraDebug.info()`
4. **Check for**:
   ```
   📄 PDF detected: local_pdf - file:///...
   📄 Local file extraction method added
   File URL access: ✅ Enabled (or ❌ Disabled)
   ```

### Test 18: Debug Commands
Use these console commands for debugging:
```javascript
hindiAstraDebug.help()        // Show all commands
hindiAstraDebug.pdf()         // Test PDF detection
hindiAstraDebug.permissions() // Check file access
hindiAstraDebug.extract()     // Test text extraction
hindiAstraDebug.translate("hello") // Test translation
```

### Test 19: Error Monitoring
1. **Keep console open** while testing
2. **Look for any red error messages**
3. **Pay attention to**:
   - Permission denied errors
   - File access errors
   - PDF detection failures
4. **Expected Result**: No critical errors (warnings are OK)

## 📊 **Performance Testing**

### Test 18: Translation Speed
1. **Time translation requests**
2. **Expected Result**: 
   - Online: < 2 seconds
   - Offline: < 0.5 seconds

### Test 19: Memory Usage
1. **Open Chrome Task Manager** (Shift+Esc)
2. **Monitor extension memory usage**
3. **Expected Result**: < 50MB memory usage

## ✅ **Success Criteria**

The extension is working correctly if:
- ✅ All basic functionality tests pass
- ✅ PDF translation works on at least text-based PDFs
- ✅ Online and offline modes both function
- ✅ Settings can be changed and saved
- ✅ No critical console errors
- ✅ Responsive design works on different screen sizes
- ✅ Translation accuracy is reasonable (80%+ for common words)

## 🚨 **Common Issues & Solutions**

### Issue: Extension not loading
**Solution**: 
- Check that all files are in the Hindi-astra folder
- Ensure manifest.json is valid
- Try reloading the extension

### Issue: Translation not working
**Solution**:
- Check internet connection
- Verify API key is working
- Check console for error messages

### Issue: PDF translation not working
**Solution**:
- Ensure PDF has selectable text
- Try different PDF files
- Check if PDF viewer supports text selection

### Issue: Popup not appearing
**Solution**:
- Check if text is English
- Ensure text length is reasonable
- Verify extension is enabled

## 📞 **Reporting Issues**

If you encounter issues:
1. **Check console** for error messages
2. **Note the specific steps** that caused the issue
3. **Include browser version** and operating system
4. **Report to**: amansah1717@gmail.com

## 🎯 **Next Steps After Testing**

Once testing is complete:
1. **Document any issues** found
2. **Test on different websites** and PDF types
3. **Share with other users** for feedback
4. **Consider publishing** to Chrome Web Store

---

**Happy Testing! 🎉**

*Remember: This extension is designed to help Hindi-speaking students with English academic content. Test it with real academic materials for the best evaluation.*
