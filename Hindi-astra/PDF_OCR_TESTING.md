# 📄 PDF & OCR Testing Guide for Hindi-astra

## 🚨 **Critical Setup for PDF Files**

### **Step 1: Enable File Access (REQUIRED)**
1. Go to `chrome://extensions/`
2. Find "Hindi-astra" extension
3. Click "Details"
4. **Enable "Allow access to file URLs"** ⚠️ **CRITICAL**
5. Restart Chrome completely

### **Step 2: Verify Setup**
1. Open any local PDF file in Chrome
2. Check that URL starts with `file://`
3. Open console (F12) and type: `hindiAstraDebug.permissions()`
4. Should show: `File URL access: ✅ Enabled`

## 🧪 **Testing Different PDF Types**

### **Test 1: Text-based PDF (Easy)**
1. **Create a test PDF**:
   - Open Google Docs or Word
   - Type: "Hello world. This is a test document for translation."
   - Download as PDF
2. **Open in Chrome** (drag & drop)
3. **Select text** and verify translation works
4. **Expected**: Instant translation popup

### **Test 2: Scanned PDF with OCR (Advanced)**
1. **Find a scanned PDF** (image-based, no selectable text)
2. **Open in Chrome**
3. **Try selecting text** - if nothing selects, it's scanned
4. **Use area selection**:
   - Click and drag to select an area with text
   - OCR modal should appear with detected text
   - Review and correct if needed
   - Click "Translate"

### **Test 3: Mixed PDF (Text + Images)**
1. **Find a PDF** with both text and images
2. **Test text areas** - should work normally
3. **Test image areas** - should trigger OCR

## 👁️ **OCR Engine Testing**

### **Check OCR Status**
Open console (F12) and run:
```javascript
hindiAstraDebug.info()
// Look for OCR status in the output
```

### **Test OCR Manually**
```javascript
// Check if OCR is available
window.hindiAstraOCR.getStatus()

// Test OCR on selected area (after selecting area)
window.hindiAstraOCR.extractTextFromArea(100, 100, 200, 50)
```

### **OCR Performance Expectations**
- **Loading**: OCR engine takes 5-10 seconds to initialize
- **Processing**: Text extraction takes 2-5 seconds per area
- **Accuracy**: 80-95% for clear, printed text
- **Languages**: Currently supports English only

## 🔍 **Troubleshooting PDF Issues**

### **Issue: "setupSelectionHandlers is not a function"**
**Status**: ✅ **FIXED** in latest version
**Solution**: Reload the extension

### **Issue: Local PDF not working**
**Diagnostic Steps**:
1. Check file URL permission: `hindiAstraDebug.permissions()`
2. Verify PDF detection: `hindiAstraDebug.pdf()`
3. Check console for errors
4. Try different PDF files

### **Issue: OCR not working**
**Diagnostic Steps**:
1. Check OCR status: `window.hindiAstraOCR.getStatus()`
2. Verify internet connection (OCR loads from CDN)
3. Check console for Tesseract.js errors
4. Try manual text input as fallback

### **Issue: Translation popup not appearing**
**Solutions**:
1. Ensure text is English
2. Check text length (max 200 characters)
3. Verify extension is enabled
4. Try keyboard shortcut: Ctrl+Shift+T

## 📋 **Step-by-Step PDF Testing**

### **Complete Test Sequence**
1. **Setup Check**:
   ```javascript
   hindiAstraDebug.test()
   ```

2. **Open Local PDF**:
   - Download any PDF
   - Open in Chrome (file:// URL)

3. **Test Text Selection**:
   - Select readable text
   - Verify translation popup

4. **Test OCR (if scanned PDF)**:
   - Select area with text
   - Wait for OCR processing
   - Review detected text
   - Confirm translation

5. **Test Keyboard Shortcut**:
   - Select text
   - Press Ctrl+Shift+T
   - Verify popup appears

## 🎯 **Expected Results**

### **Working Correctly**
- ✅ Local PDFs open and display properly
- ✅ Text selection works in text-based PDFs
- ✅ Translation popup appears with Hindi text
- ✅ OCR modal appears for scanned areas
- ✅ Keyboard shortcuts work
- ✅ Console shows initialization messages

### **Console Messages (Success)**
```
📄 PDF detected: local_pdf - file:///...
👁️ Hindi-astra OCR Engine initializing...
📚 Tesseract.js loaded successfully
✅ OCR Engine ready!
✅ Hindi-astra Translator ready!
```

### **Console Messages (Issues)**
```
❌ File URL access: Disabled
❌ OCR Engine initialization failed
❌ Translation failed
```

## 🔧 **Advanced OCR Features**

### **OCR Confidence Levels**
- **High (90%+)**: Text used automatically
- **Medium (70-90%)**: Review modal shown
- **Low (<70%)**: Manual correction required

### **OCR Fallback Options**
1. **Primary**: Tesseract.js OCR
2. **Secondary**: Manual text input modal
3. **Tertiary**: Copy-paste from external OCR

### **Supported Text Types**
- ✅ Printed text (books, papers)
- ✅ Computer-generated text
- ⚠️ Handwritten text (limited accuracy)
- ❌ Stylized fonts (decorative text)

## 📱 **Mobile Testing**

### **Chrome Mobile Limitations**
- File access more restricted
- OCR performance slower
- Touch selection different
- Use cloud storage for PDFs

## 🚀 **Performance Optimization**

### **For Better OCR Results**
1. **High-quality PDFs** work better
2. **Clear, printed text** gives best results
3. **Good contrast** (black text on white)
4. **Avoid skewed/rotated text**

### **For Faster Processing**
1. **Select smaller areas** for OCR
2. **Use text-based PDFs** when possible
3. **Good internet connection** for OCR loading

## 📞 **Reporting Issues**

### **Information to Include**
1. **Chrome version**: `chrome://version/`
2. **Extension version**: Check in extensions page
3. **PDF type**: Text-based or scanned
4. **Console errors**: Copy from F12 console
5. **Steps to reproduce**: Exact sequence

### **Debug Information Export**
```javascript
hindiAstraDebug.export()
// Copy the output and include in bug report
```

### **Contact**
- **Email**: amansah1717@gmail.com
- **Subject**: Hindi-astra PDF/OCR Issue
- **Include**: Debug export and error details

## ✅ **Success Checklist**

Before reporting issues:
- ✅ File URL access enabled
- ✅ Chrome restarted after permission change
- ✅ Extension shows as enabled
- ✅ PDF opens correctly in Chrome
- ✅ Console shows no critical errors
- ✅ OCR engine initializes (if using scanned PDFs)
- ✅ Internet connection stable (for OCR)

---

**Note**: OCR functionality requires internet connection for initial setup (downloads Tesseract.js library). After initialization, basic OCR can work offline.
