/**
 * Hindi-astra UI Components
 * Reusable UI components for the extension
 */

class HindiAstraUIComponents {
    constructor() {
        this.components = new Map();
        this.init();
    }

    /**
     * Initialize UI components
     */
    init() {
        console.log('🎨 Hindi-astra UI Components initializing...');
        
        // Register components
        this.registerComponents();
        
        // Add global styles
        this.addGlobalStyles();
        
        console.log('✅ UI Components ready!');
    }

    /**
     * Register UI components
     */
    registerComponents() {
        this.components.set('translationPopup', this.createTranslationPopup.bind(this));
        this.components.set('loadingSpinner', this.createLoadingSpinner.bind(this));
        this.components.set('errorMessage', this.createErrorMessage.bind(this));
        this.components.set('notification', this.createNotification.bind(this));
        this.components.set('tooltip', this.createTooltip.bind(this));
    }

    /**
     * Add global styles for components
     */
    addGlobalStyles() {
        if (document.getElementById('hindi-astra-styles')) return;

        const style = document.createElement('style');
        style.id = 'hindi-astra-styles';
        style.textContent = `
            /* Hindi-astra Global Styles */
            .hindi-astra-popup {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                position: absolute;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                font-size: 14px;
                max-width: 350px;
                min-width: 200px;
                z-index: 10000;
                animation: hindiAstraFadeIn 0.3s ease-out;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                user-select: none;
            }

            .hindi-astra-popup-header {
                background: rgba(255,255,255,0.1);
                padding: 12px 16px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            }

            .hindi-astra-popup-content {
                padding: 16px;
            }

            .hindi-astra-original-text {
                font-weight: 600;
                font-size: 13px;
                opacity: 0.9;
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .hindi-astra-translation-text {
                font-size: 16px;
                font-weight: 500;
                line-height: 1.4;
                margin-bottom: 12px;
                word-wrap: break-word;
            }

            .hindi-astra-meta {
                font-size: 11px;
                opacity: 0.7;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .hindi-astra-close-btn {
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
                transition: background-color 0.2s ease;
            }

            .hindi-astra-close-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .hindi-astra-loading {
                opacity: 0.7;
                font-style: italic;
            }

            .hindi-astra-error {
                color: #ffcccb;
                font-style: italic;
            }

            .hindi-astra-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #007bff;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: hindiAstraSlideIn 0.3s ease-out;
                max-width: 300px;
            }

            .hindi-astra-notification.success {
                background: #28a745;
            }

            .hindi-astra-notification.error {
                background: #dc3545;
            }

            .hindi-astra-notification.warning {
                background: #ffc107;
                color: #212529;
            }

            .hindi-astra-tooltip {
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10002;
                white-space: nowrap;
                animation: hindiAstraFadeIn 0.2s ease-out;
            }

            .hindi-astra-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: hindiAstraSpin 1s ease-in-out infinite;
            }

            /* Animations */
            @keyframes hindiAstraFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes hindiAstraFadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }

            @keyframes hindiAstraSlideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }

            @keyframes hindiAstraSlideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }

            @keyframes hindiAstraSpin {
                to { transform: rotate(360deg); }
            }

            /* Responsive adjustments */
            @media (max-width: 480px) {
                .hindi-astra-popup {
                    max-width: 280px;
                    font-size: 13px;
                }
                
                .hindi-astra-translation-text {
                    font-size: 15px;
                }

                .hindi-astra-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Create translation popup component
     */
    createTranslationPopup(options = {}) {
        const popup = document.createElement('div');
        popup.className = 'hindi-astra-popup';
        
        if (options.x !== undefined && options.y !== undefined) {
            popup.style.left = options.x + 'px';
            popup.style.top = (options.y - 10) + 'px';
        }

        return popup;
    }

    /**
     * Update translation popup content
     */
    updateTranslationPopup(popup, originalText, translatedText, status, metadata = null) {
        const isLoading = status === 'loading';
        const isError = status === 'error';
        
        popup.innerHTML = `
            <div class="hindi-astra-popup-header">
                <span class="hindi-astra-original-text">${originalText}</span>
                <button class="hindi-astra-close-btn">×</button>
            </div>
            <div class="hindi-astra-popup-content">
                <div class="hindi-astra-translation-text ${isLoading ? 'hindi-astra-loading' : ''} ${isError ? 'hindi-astra-error' : ''}">
                    ${isLoading ? '🔄 ' : ''}${translatedText}
                </div>
                ${metadata ? `
                    <div class="hindi-astra-meta">
                        <span>${metadata.source === 'online' ? '🌐 Online' : '📱 Offline'}</span>
                        <span>Confidence: ${Math.round(metadata.confidence * 100)}%</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Add close button functionality
        const closeBtn = popup.querySelector('.hindi-astra-close-btn');
        closeBtn.addEventListener('click', () => {
            this.removeComponent(popup);
        });

        return popup;
    }

    /**
     * Create loading spinner component
     */
    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'hindi-astra-spinner';
        return spinner;
    }

    /**
     * Create error message component
     */
    createErrorMessage(message, options = {}) {
        const error = document.createElement('div');
        error.className = 'hindi-astra-error';
        error.textContent = message;
        
        if (options.timeout) {
            setTimeout(() => this.removeComponent(error), options.timeout);
        }
        
        return error;
    }

    /**
     * Create notification component
     */
    createNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `hindi-astra-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.style.animation = 'hindiAstraSlideOut 0.3s ease-in';
            setTimeout(() => this.removeComponent(notification), 300);
        }, duration);
        
        return notification;
    }

    /**
     * Create tooltip component
     */
    createTooltip(text, x, y) {
        const tooltip = document.createElement('div');
        tooltip.className = 'hindi-astra-tooltip';
        tooltip.textContent = text;
        tooltip.style.left = x + 'px';
        tooltip.style.top = (y - 30) + 'px';
        
        document.body.appendChild(tooltip);
        
        // Auto-remove after 2 seconds
        setTimeout(() => this.removeComponent(tooltip), 2000);
        
        return tooltip;
    }

    /**
     * Remove component with animation
     */
    removeComponent(element) {
        if (!element || !element.parentNode) return;
        
        element.style.animation = 'hindiAstraFadeOut 0.2s ease-in';
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 200);
    }

    /**
     * Get component by type
     */
    getComponent(type) {
        return this.components.get(type);
    }

    /**
     * Show success notification
     */
    showSuccess(message, duration = 3000) {
        return this.createNotification(message, 'success', duration);
    }

    /**
     * Show error notification
     */
    showError(message, duration = 5000) {
        return this.createNotification(message, 'error', duration);
    }

    /**
     * Show warning notification
     */
    showWarning(message, duration = 4000) {
        return this.createNotification(message, 'warning', duration);
    }

    /**
     * Show info notification
     */
    showInfo(message, duration = 3000) {
        return this.createNotification(message, 'info', duration);
    }
}

// Initialize UI components
window.hindiAstraUI = new HindiAstraUIComponents();

console.log('🎨 Hindi-astra UI Components loaded');
