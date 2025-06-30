# 🎓 Hindi-astra - Academic Translation Assistant

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://github.com/AmanSah17/Hindi-astra)
[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen?style=for-the-badge)](https://github.com/AmanSah17/Hindi-astra)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Google Translate API](https://img.shields.io/badge/Google-Translate_API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com/translate)
[![Ctrl+Shift+K](https://img.shields.io/badge/Shortcut-Ctrl%2BShift%2BK-FF6B6B?style=for-the-badge&logo=keyboard&logoColor=white)](https://github.com/AmanSah17/Hindi-astra)

> **Advanced Chrome extension specifically designed for Hindi-speaking students to translate English academic content including PDFs, Word documents, and scanned materials**

Hindi-astra (हिंदी-अस्त्र) is a powerful Chrome extension that provides **instant English-to-Hindi translation** with a simple **Ctrl+Shift+K** keyboard shortcut. Designed specifically for Hindi-speaking students and professionals, it works seamlessly with **local PDF files**, web pages, and academic content.

## 🚀 **Key Highlight: Global Keyboard Shortcut**

**Press `Ctrl+Shift+K` anywhere** → Beautiful translation popup appears instantly!

Perfect for reading PDFs and browsing the web with immediate Hindi translations.

## 🎯 **Target Audience**

**Perfect for Hindi-speaking students who:**
- 📚 Study English academic textbooks and research papers
- 🎓 Need to understand complex academic terminology
- 📄 Work with PDF documents and scanned materials
- 💻 Want offline translation capabilities
- ⚡ Need instant translation while studying
- 🌐 Have limited or unreliable internet connectivity

## ✨ **Key Features**

### 🚀 **Global Keyboard Shortcut**
- **`Ctrl+Shift+K`** opens translator popup anywhere
- Works on **any webpage** and **local PDF files**
- **Instant access** - no need to find extension icon
- **Beautiful purple gradient** popup design

### 📄 **Universal PDF Support**
- **Local PDF files** (file:// URLs) - Perfect for offline study
- **Web-based PDFs** - Online research papers and documents
- **Scanned documents** with OCR support
- **Academic papers** and textbooks

### 🎯 **Smart Translation**
- **Online Mode** - High-accuracy translations using Google Translate API
- **Offline Mode** - Built-in dictionary with 1000+ academic terms
- **Context-Aware** - Adapts translation based on academic context
- **Caching System** - Stores translations for faster offline access

### 🎓 **Academic Specialization**
- **Subject-Specific Terms** - Pre-loaded with academic vocabulary
- **Research Terminology** - Specialized for scientific and research content
- **Multi-disciplinary** - Covers various academic fields
- **Confidence Scoring** - Shows translation accuracy levels

### ⚡ **Enhanced User Experience**
- **Instant Translation** - Select text anywhere for immediate translation
- **Keyboard Shortcuts** - Ctrl+Shift+T for quick translation
- **Beautiful UI** - Modern, student-friendly interface
- **Mobile Responsive** - Works on Chrome mobile browser

## 🚀 **Installation Guide**

### **Method 1: Developer Installation**

1. **Download Hindi-astra**
   ```bash
   git clone https://github.com/AmanSah17/chrome_extension_react.git
   cd chrome_extension_react
   git checkout Hindi-astra
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `Hindi-astra` folder
   - Pin the extension for easy access

3. **Verify Installation**
   - Look for the Hindi-astra icon in your toolbar
   - Click it to see the popup interface
   - Check that it shows "Online" status

## 📖 **How to Use Hindi-astra**

### **Basic Translation**
1. **Select English text** on any webpage or PDF
2. **View instant Hindi translation** in a beautiful popup
3. **See confidence score** and translation source (online/offline)
4. **Auto-hide** after 8 seconds or click × to close

### **PDF Documents**
1. **Open any PDF** in Chrome browser
2. **Select text** directly from the PDF
3. **For scanned PDFs** - Use area selection tool
4. **Get academic-focused** translations

### **Keyboard Shortcuts**
- **Ctrl+Shift+T** (Cmd+Shift+T on Mac) - Translate selected text
- **Escape** - Close translation popup
- **Ctrl+Shift+D** - Toggle dictionary panel (coming soon)

### **Offline Mode**
- **Automatic fallback** when internet is unavailable
- **1000+ pre-loaded** academic terms
- **Basic translation** for common words and phrases
- **Confidence indicators** show translation reliability

## 🛠️ **Technical Architecture**

### **Advanced Components**
```
Hindi-astra/
├── manifest.json              # Extension configuration
├── popup/                     # Extension popup interface
│   ├── popup.html            # Main popup UI
│   ├── popup.css             # Styling
│   └── popup.js              # Popup functionality
├── content/                   # Content scripts
│   ├── main-content.js       # Main translator
│   ├── translation-engine.js # Translation logic
│   ├── pdf-handler.js        # PDF support
│   ├── pdf-text-extractor.js # PDF text extraction
│   ├── text-extractor.js     # General text extraction
│   └── ui-components.js      # UI components
├── background/               # Background processes
│   └── background.js         # Service worker
├── options/                  # Settings page
│   ├── options.html          # Settings UI
│   └── options.js            # Settings logic
└── icons/                    # Extension icons
```

### **Key Technologies**
- **Manifest V3** - Latest Chrome extension standard
- **Google Cloud Translate API** - Professional translation service
- **Offline Dictionary** - Local storage with academic terms
- **PDF.js Integration** - Advanced PDF text extraction
- **OCR Support** - For scanned document assistance
- **Progressive Enhancement** - Works with/without internet

## 🎯 **Academic Focus Areas**

### **Pre-loaded Academic Subjects**
- 🧮 **Mathematics** - गणित
- 🔬 **Science** - विज्ञान (Physics, Chemistry, Biology)
- 📚 **Literature** - साहित्य
- 🏛️ **History** - इतिहास
- 🌍 **Geography** - भूगोल
- 💼 **Economics** - अर्थशास्त्र
- 🧠 **Psychology** - मनोविज्ञान
- ⚖️ **Law** - कानून
- 💻 **Computer Science** - कंप्यूटर विज्ञान
- 🏥 **Medicine** - चिकित्सा

### **Research Terminology**
- **Research** → अनुसंधान
- **Analysis** → विश्लेषण
- **Hypothesis** → परिकल्पना
- **Methodology** → कार्यप्रणाली
- **Conclusion** → निष्कर्ष
- **Bibliography** → ग्रंथ सूची

## 📊 **Performance & Statistics**

### **Translation Accuracy**
- **Online Mode**: 95%+ accuracy with Google Translate API
- **Offline Mode**: 80%+ accuracy for common academic terms
- **Context Awareness**: Adapts based on document type
- **Caching**: Improves speed and offline availability

### **Supported Content Types**
- ✅ **Web Pages** - All websites and online content
- ✅ **PDF Documents** - Native text-based PDFs
- ✅ **Scanned PDFs** - With OCR assistance
- ✅ **Academic Papers** - Research papers and journals
- ✅ **E-books** - Digital textbooks and materials
- ✅ **Online Courses** - Educational platforms

## 🔧 **Configuration Options**

### **Settings Available**
- **Auto-translate on selection** - Enable/disable automatic translation
- **Show original text** - Display source text with translation
- **Font size** - Adjust popup text size
- **Theme** - Choose popup appearance
- **Offline dictionary** - Manage cached translations
- **Academic subjects** - Customize subject-specific terms

## 🤝 **Contributing to Hindi-astra**

We welcome contributions from the academic community!

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AcademicFeature`)
3. **Add** academic terms or improve translations
4. **Test** with real academic content
5. **Submit** a pull request

### **Contribution Areas**
- 📚 **Academic terminology** - Add subject-specific terms
- 🔧 **PDF support** - Improve document handling
- 🎨 **UI/UX** - Enhance user experience
- 🌐 **Offline dictionary** - Expand offline capabilities
- 📱 **Mobile support** - Improve mobile experience

## 📞 **Support & Feedback**

### **For Students**
- 📧 **Email**: amansah1717@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/AmanSah17/chrome_extension_react/issues)
- 💡 **Feature Requests**: Share your academic needs
- 📚 **Academic Support**: Help with specific subjects

### **For Educators**
- 🏫 **Institutional Support** - Bulk deployment assistance
- 📖 **Curriculum Integration** - Custom academic term lists
- 📊 **Usage Analytics** - Student engagement insights
- 🎓 **Training Materials** - How to use in classroom

## 🏆 **Recognition**

Hindi-astra is designed with the vision of making English academic content accessible to Hindi-speaking students across India and the world. Our goal is to break down language barriers in education and empower students to excel in their academic pursuits.

---

<div align="center">

**🎓 Empowering Hindi-speaking students in their academic journey**

**Made with ❤️ for the student community by [Aman Sah](https://github.com/AmanSah17)**

**⭐ Star this repository if Hindi-astra helps you in your studies!**

</div>
