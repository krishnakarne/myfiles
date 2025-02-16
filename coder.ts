execCommand(command: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (command === 'insertUnorderedList') {
        this.createUnorderedList(range);
        return;
    }

    const wrapper = this.getWrapperElement(command);
    if (range.collapsed) {
        // If there's no selection, just insert an empty element
        range.insertNode(wrapper);
    } else {
        // Wrap the selected text with the newly created element
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);
    }

    // Adjust the range to select the new element
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);
}

getWrapperElement(command: string): HTMLElement {
    let element: HTMLElement;
    switch (command) {
        case 'bold':
            element = document.createElement('strong');
            break;
        case 'italic':
            element = document.createElement('em');
            break;
        case 'underline':
            element = document.createElement('u');
            break;
        case 'strikeThrough':
            element = document.createElement('s');
            break;
        default:
            element = document.createElement('span'); // Fallback if needed
            break;
    }
    return element;
}

createUnorderedList(range: Range) {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = '\u200B'; // Zero-width space to keep the <li> visible

    if (range.collapsed) {
        ul.appendChild(li);
        range.insertNode(ul);
    } else {
        const content = range.extractContents();
        li.appendChild(content);
        ul.appendChild(li);
        range.insertNode(ul);
    }

    // Place the cursor inside the newly created list item
    const selection = window.getSelection();
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStart(li, 0);
    newRange.collapse(true);
    selection.addRange(newRange);
}
