# Contributing to Hindi-astra

Thank you for your interest in contributing to Hindi-astra! This document provides guidelines and information for contributors.

## 🤝 **How to Contribute**

### **Types of Contributions**
- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new functionality
- 📝 **Documentation**: Improve guides and documentation
- 🔧 **Code Contributions**: Submit bug fixes and new features
- 🌐 **Translations**: Help translate the extension to other languages
- 🧪 **Testing**: Test the extension on different systems

## 🚀 **Getting Started**

### **Development Setup**

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Hindi-astra.git
   cd Hindi-astra
   ```

2. **Set up development environment**
   ```bash
   # Install dependencies (if any)
   npm install
   
   # Load extension in Chrome
   # 1. Open chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked"
   # 4. Select the Hindi-astra folder
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

### **Development Guidelines**

#### **Code Style**
- Use **ES6+** JavaScript features
- Follow **camelCase** naming convention
- Add **JSDoc comments** for functions
- Use **meaningful variable names**
- Keep functions **small and focused**

#### **File Structure**
```
Hindi-astra/
├── manifest.json              # Extension configuration
├── background/
│   └── background.js          # Service worker
├── content/
│   ├── global-translator.js   # Main functionality
│   └── *.js                   # Other content scripts
├── popup/
│   ├── *.html                 # Popup interfaces
│   └── *.js                   # Popup logic
├── icons/                     # Extension icons
└── docs/                      # Documentation
```

#### **Coding Standards**

```javascript
/**
 * Example function with proper documentation
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, targetLang = 'hi') {
    try {
        // Implementation here
        return translatedText;
    } catch (error) {
        console.error('Translation failed:', error);
        throw error;
    }
}
```

## 🐛 **Reporting Bugs**

### **Before Reporting**
1. **Search existing issues** to avoid duplicates
2. **Test with latest version** of the extension
3. **Try basic troubleshooting** (reload extension, restart Chrome)

### **Bug Report Template**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Chrome Version: 
- Extension Version: 
- Operating System: 
- PDF Type (if applicable): 

## Console Output
```
Paste any console errors here
```

## Additional Context
Any other relevant information
```

## ✨ **Feature Requests**

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other ways to solve this problem

## Additional Context
Mockups, examples, or related issues
```

## 🔧 **Code Contributions**

### **Pull Request Process**

1. **Create an issue** first to discuss the change
2. **Fork and create branch** from main
3. **Make your changes** following coding standards
4. **Test thoroughly** on different systems
5. **Update documentation** if needed
6. **Submit pull request** with clear description

### **Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Tested on local PDFs
- [ ] Tested on web pages
- [ ] Tested keyboard shortcuts
- [ ] Tested API functionality
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### **Review Process**
1. **Automated checks** run on PR submission
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Approval** and merge by maintainers

## 🧪 **Testing**

### **Manual Testing Checklist**
- [ ] **Extension loads** without errors
- [ ] **Ctrl+Shift+K** opens popup on web pages
- [ ] **Ctrl+Shift+K** works on local PDF files
- [ ] **Translation API** returns correct results
- [ ] **Error handling** works properly
- [ ] **UI responsive** on different screen sizes
- [ ] **No console errors** during normal usage

### **Test Cases**
1. **Basic Translation**
   - Open any webpage
   - Press Ctrl+Shift+K
   - Type "hello world"
   - Verify Hindi translation appears

2. **Local PDF Support**
   - Open local PDF file
   - Press Ctrl+Shift+K
   - Copy text from PDF and paste
   - Verify translation works

3. **Error Handling**
   - Test with no internet connection
   - Test with invalid text
   - Verify appropriate error messages

## 📚 **Documentation**

### **Documentation Standards**
- Use **clear, simple language**
- Include **code examples** where helpful
- Add **screenshots** for UI features
- Keep **up-to-date** with code changes

### **Types of Documentation**
- **README.md**: Main project documentation
- **API Documentation**: Technical implementation details
- **User Guides**: Step-by-step usage instructions
- **Troubleshooting**: Common issues and solutions

## 🌐 **Internationalization**

### **Adding New Languages**
1. Create language files in `_locales/` directory
2. Update manifest.json with new locale
3. Test translation functionality
4. Update documentation

### **Translation Guidelines**
- Use **native speakers** when possible
- Maintain **consistent terminology**
- Test **UI layout** with translated text
- Consider **cultural context**

## 📋 **Issue Labels**

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: Critical issues
- `priority-low`: Nice to have features

## 🎯 **Development Priorities**

### **High Priority**
- Bug fixes affecting core functionality
- Security vulnerabilities
- Performance improvements
- Chrome Web Store compliance

### **Medium Priority**
- New features with clear use cases
- UI/UX improvements
- Documentation updates
- Code refactoring

### **Low Priority**
- Nice-to-have features
- Experimental functionality
- Non-critical optimizations

## 📞 **Getting Help**

### **Communication Channels**
- **GitHub Issues**: Technical discussions and bug reports
- **GitHub Discussions**: General questions and ideas
- **Email**: amansah1717@gmail.com for direct contact

### **Response Times**
- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 1 week
- **General questions**: Within 72 hours

## 🏆 **Recognition**

Contributors will be recognized in:
- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub releases** notes
- **Extension credits** (for major features)

## 📄 **License**

By contributing to Hindi-astra, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Hindi-astra! Your help makes this project better for Hindi-speaking students and professionals worldwide.** 🙏
