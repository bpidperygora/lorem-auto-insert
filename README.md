# Lorem Ipsum Auto-Insert Firefox Extension

Automatically replaces `lorem[number];` with lorem ipsum text in any input field.

## Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" 
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory
5. Extension will be loaded and active immediately

## Usage

Type `lorem` followed by a number and semicolon in any input field:

- `lorem5;` → generates 5 lorem ipsum words
- `lorem20;` → generates 20 lorem ipsum words  
- `lorem100;` → generates 100 lorem ipsum words
- `lorem1000/5;` → generates 1000 words divided into 5 paragraphs
- `lorem500/3;` → generates 500 words divided into 3 paragraphs

Works in:
- Input fields (`<input>`)
- Text areas (`<textarea>`)
- Content-editable elements

## Features

- **Instant replacement**: Text is replaced immediately when you type the semicolon
- **Smart paragraphs**: Default paragraph breaks every 350 words, or custom division with `/` syntax
- **WordPress compatible**: Enhanced support for WordPress WYSIWYG editors (TinyMCE, Gutenberg)
- **Secure**: No XSS vulnerabilities, sanitized input processing
- **Lightweight**: Minimal performance impact
- **Universal**: Works on all websites and web applications
- **Limit protection**: Maximum 1000 words to prevent browser freezing

## Examples

Typing `lorem10;` in any field will replace it with something like:
> lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod

Typing `lorem100;` will generate 100 words (paragraph break after 350 words if applicable).

Typing `lorem500/3;` will generate 500 words divided into 3 paragraphs:
> First paragraph with ~167 words...
> 
> Second paragraph with ~167 words...
> 
> Third paragraph with ~166 words...

Each generation creates random combinations from the standard lorem ipsum word list.

## Development

Built with:
- Vanilla JavaScript

## Credits & Inspiration

This Firefox extension was inspired by the excellent Chrome extension ["Lorem ipsum generator (using keyboard only)"](https://chromewebstore.google.com/detail/ogkidppcbldhebgplkdmepodkbfanndi?utm_source=item-share-cb) by Žiga Miklič. 

**Enhanced Features Added:**
- Custom paragraph division syntax (`lorem1000/5;`)
- WordPress/WYSIWYG editor compatibility
- Adjustable paragraph breaks (350 words default)