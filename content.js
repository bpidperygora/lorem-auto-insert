/**
 * Lorem Ipsum Auto-Insert Extension
 * Automatically replaces lorem[number]; with lorem ipsum text
 */

/**
 * Lorem ipsum word list for text generation
 * @type {Array<string>}
 */
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo', 'ipsam',
  'voluptatem', 'quia', 'voluptas', 'aspernatur', 'odit', 'aut', 'fugit'
];

/**
 * Pattern for detecting lorem ipsum commands
 * Supports: lorem20; or lorem1000/5; (1000 words in 5 paragraphs)
 * @type {RegExp}
 */
const LOREM_PATTERN = /lorem(\d+)(?:\/(\d+))?;/gi;

/**
 * Class for handling lorem ipsum text replacement
 * @constructor
 */
class LoremIpsumReplacer {
  constructor() {
    /** @type {boolean} */
    this.isActive = true;
    
    this.init();
  }

  /**
   * Initialize event listeners
   */
  init() {
    document.addEventListener('input', this.handleInput.bind(this), true);
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
  }

  /**
   * Handle input events for text replacement
   * @param {Event} event - Input event
   */
  handleInput = (event) => {
    if (!this.isActive) return;

    /** @type {HTMLElement} */
    const target = event.target;
    
    if (!this.isValidInputElement(target)) return;

    const text = this.getElementText(target);
    const match = LOREM_PATTERN.exec(text);
    
    if (match) {
      this.replaceLoremText(target, match);
    }
  }

  /**
   * Handle keydown events to detect semicolon trigger
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyDown = (event) => {
    if (!this.isActive) return;
    
    if (event.key === ';') {
      setTimeout(() => {
        this.handleInput(event);
      }, 0);
    }
  }

  /**
   * Check if element is valid for text replacement
   * @param {HTMLElement} element - Element to check
   * @return {boolean} - Whether element is valid
   */
  isValidInputElement(element) {
    if (!element) return false;
    
    return element.tagName === 'INPUT' ||
           element.tagName === 'TEXTAREA' ||
           element.contentEditable === 'true' ||
           element.classList.contains('wp-editor-area') ||
           element.id === 'content' ||
           element.classList.contains('mce-content-body') ||
           element.getAttribute('data-element') === 'main';
  }

  /**
   * Get text content from element
   * @param {HTMLElement} element - Element to get text from
   * @return {string} - Text content
   */
  getElementText(element) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return element.value;
    } else if (element.contentEditable === 'true') {
      return element.textContent || element.innerText || '';
    }
    return '';
  }

  /**
   * Set text content in element with proper formatting
   * @param {HTMLElement} element - Element to set text in
   * @param {string} text - Text to set
   */
  setElementText(element, text) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (element.contentEditable === 'true') {
      // Convert line breaks to HTML paragraphs for WYSIWYG editors
      /** @type {string} */
      const htmlText = text.replace(/\n\n/g, '</p><p>');
      
      if (htmlText.includes('</p><p>')) {
        element.innerHTML = `<p>${htmlText}</p>`;
      } else {
        element.textContent = text;
      }
      
      // Trigger multiple events for WordPress compatibility
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('keyup', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Trigger WordPress-specific events if available
      if (typeof jQuery !== 'undefined' && jQuery(element).trigger) {
        jQuery(element).trigger('input').trigger('change');
      }
    }
  }

  /**
   * Generate lorem ipsum text with specified word count and paragraphs
   * @param {number} wordCount - Number of words to generate
   * @param {number|null} paragraphCount - Optional custom paragraph count
   * @return {string} - Generated lorem ipsum text with paragraphs
   */
  generateLoremText(wordCount, paragraphCount = null) {
    if (wordCount <= 0) return '';
    
    // Apply word count limit
    if (wordCount > 1000) {
      wordCount = 1000;
    }
    
    /** @type {Array<string>} */
    const words = [];
    /** @type {number} */
    let wordsPerParagraph;
    
    if (paragraphCount && paragraphCount > 0) {
      // Custom paragraph division: lorem1000/5; = 1000 words in 5 paragraphs
      wordsPerParagraph = Math.ceil(wordCount / paragraphCount);
    } else {
      // Default: paragraph break every 350 words
      wordsPerParagraph = 350;
    }
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * LOREM_WORDS.length);
      words.push(LOREM_WORDS[randomIndex]);
      
      // Add paragraph break (except for the last word)
      if ((i + 1) % wordsPerParagraph === 0 && i + 1 < wordCount) {
        words.push('\n\n');
      }
    }
    
    return words.join(' ');
  }

  /**
   * Replace lorem command with generated text
   * @param {HTMLElement} element - Target element
   * @param {RegExpExecArray} match - Regex match result
   */
  replaceLoremText(element, match) {
    /** @type {string} */
    const fullMatch = match[0];
    /** @type {number} */
    const wordCount = parseInt(match[1], 10);
    /** @type {number|null} */
    const paragraphCount = match[2] ? parseInt(match[2], 10) : null;

    /** @type {string} */
    const currentText = this.getElementText(element);
    /** @type {string} */
    const loremText = this.generateLoremText(wordCount, paragraphCount);
    /** @type {string} */
    const newText = currentText.replace(fullMatch, loremText);

    this.setElementText(element, newText);
    
    // Reset regex lastIndex to avoid issues with global flag
    LOREM_PATTERN.lastIndex = 0;
  }

  /**
   * Toggle extension active state
   */
  toggle() {
    this.isActive = !this.isActive;
  }

  /**
   * Get current active state
   * @return {boolean} - Whether extension is active
   */
  getActiveState() {
    return this.isActive;
  }
}

// Initialize the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoremIpsumReplacer();
  });
} else {
  new LoremIpsumReplacer();
} 