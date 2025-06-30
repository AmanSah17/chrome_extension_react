# 📄 Local PDF Setup Guide for Hindi-astra

## 🚨 **Critical Setup Required for Local PDF Files**

To use Hindi-astra with locally saved PDF files, you **MUST** enable file access permissions. This is a Chrome security requirement.

## 🔧 **Step-by-Step Setup Instructions**

### **Step 1: Enable File URLs Access**

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in your address bar
   - Press Enter

2. **Find Hindi-astra Extension**
   - Look for "Hindi-astra - Academic Translation Assistant"
   - Make sure it's enabled (toggle should be blue)

3. **Click "Details" Button**
   - Click the "Details" button on the Hindi-astra extension card

4. **Enable File Access**
   - Scroll down to find **"Allow access to file URLs"**
   - **Toggle this ON** (it should turn blue)
   - This is the most critical step!

### **Step 2: Verify Permissions**

1. **Check Extension Permissions**
   - In the Details page, verify these permissions are granted:
     - ✅ Read and change all your data on all websites
     - ✅ Access to file URLs (this should now be enabled)

2. **Restart Chrome** (Recommended)
   - Close all Chrome windows
   - Reopen Chrome
   - This ensures all permissions are properly applied

## 📋 **Testing Local PDF Access**

### **Test 1: Basic Local PDF**
1. **Download a sample PDF** to your computer
2. **Open the PDF in Chrome** by:
   - Dragging the PDF file into Chrome, OR
   - Using Ctrl+O and selecting the PDF file
3. **Select text** in the PDF
4. **Expected Result**: Hindi translation popup should appear

### **Test 2: Verify Extension is Working**
1. **Check the address bar** - it should show `file:///...`
2. **Open Developer Console** (F12)
3. **Look for these messages**:
   ```
   📄 PDF detected: local_pdf - file:///...
   📄 Local file extraction method added
   📄 Attempting local file extraction
   ```

## 🔍 **Troubleshooting Local PDF Issues**

### **Issue: "Allow access to file URLs" is grayed out**
**Solution**: 
- The extension might be installed from Chrome Web Store
- For developer-installed extensions, this option should be available
- Try reinstalling the extension using "Load unpacked"

### **Issue: Translation not working on local PDFs**
**Diagnostic Steps**:
1. **Check Console Messages** (F12 → Console):
   ```
   📄 PDF detected: local_pdf
   📄 Local file extraction method added
   ```
   
2. **Verify File URL Permission**:
   - Go to `chrome://extensions/`
   - Check Hindi-astra details
   - Ensure "Allow access to file URLs" is ON

3. **Test with Different PDF Types**:
   - Try text-based PDFs (created from Word documents)
   - Try scanned PDFs (images converted to PDF)

### **Issue: Extension works on web PDFs but not local PDFs**
**This confirms a permission issue**:
1. **Double-check file URL access** is enabled
2. **Restart Chrome completely**
3. **Try opening PDF with `file://` URL directly**

## 🔒 **Security Considerations**

### **Why This Permission is Required**
- Chrome restricts extensions from accessing local files by default
- This prevents malicious extensions from reading your personal files
- Hindi-astra only processes text you explicitly select

### **What Hindi-astra Can Access**
- ✅ **Only text you select** in PDF files
- ✅ **Only when you explicitly select text**
- ❌ **Cannot read files automatically**
- ❌ **Cannot access other files on your computer**

### **Privacy Protection**
- Hindi-astra only translates text you actively select
- No automatic file scanning or reading
- Translation data is not stored permanently
- API calls are made only for selected text

## 🌐 **Alternative Solutions**

### **Option 1: Use Web-hosted PDFs**
- Upload PDFs to Google Drive, Dropbox, or similar
- Open PDFs through web browser
- No special permissions required

### **Option 2: Copy-Paste Method**
1. **Select text** in your PDF viewer
2. **Copy** the text (Ctrl+C)
3. **Open Hindi-astra popup**
4. **Paste text** in quick translate box
5. **Click Translate**

### **Option 3: Online PDF Viewers**
- Use online PDF viewers like:
  - Google Drive PDF viewer
  - Adobe Acrobat online
  - PDF.js demo sites
- Upload your PDF and use Hindi-astra normally

## 📱 **Mobile Chrome Support**

### **Android Chrome**
- Local file access is more limited on mobile
- Use cloud storage solutions (Google Drive, etc.)
- Copy-paste method works well

### **iOS Chrome**
- Similar limitations to Android
- Cloud storage recommended
- Extension functionality may be limited

## 🔧 **Advanced Troubleshooting**

### **Check Extension Console**
1. **Go to** `chrome://extensions/`
2. **Click "Details"** on Hindi-astra
3. **Click "Inspect views: background page"**
4. **Check for errors** in the console

### **Verify Content Script Injection**
1. **Open a local PDF**
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Look for Hindi-astra initialization messages**

### **Test with Different PDF Types**
- **Text-based PDFs**: Created from Word, Google Docs
- **Scanned PDFs**: Images converted to PDF
- **Mixed PDFs**: Combination of text and images

## 📞 **Getting Help**

If you're still having issues:

1. **Check the console** for error messages
2. **Try the testing steps** in order
3. **Note your Chrome version** and operating system
4. **Contact support** with specific error messages

**Email**: amansah1717@gmail.com
**Subject**: Hindi-astra Local PDF Issue

Include:
- Chrome version
- Operating system
- Specific error messages
- Steps you've already tried

## ✅ **Success Checklist**

Before reporting issues, verify:
- ✅ "Allow access to file URLs" is enabled
- ✅ Chrome has been restarted after enabling permission
- ✅ Extension is enabled and working on web pages
- ✅ PDF opens correctly in Chrome
- ✅ You can select text in the PDF manually
- ✅ Console shows Hindi-astra initialization messages

---

**Remember**: Local file access is a Chrome security feature. These steps are necessary for any extension that needs to work with local files, not just Hindi-astra.
