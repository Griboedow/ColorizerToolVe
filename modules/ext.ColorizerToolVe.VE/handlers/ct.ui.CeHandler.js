/*!
 * ColorizeToolVe Handler ContentEditable class.
 */

/**
 * Helper for ColorPicker buttons. Provides methods for keeping the CE up to date.
 * Actuality this class saves the selection for when the default browser's ColorPicker is used,
 * and 'caches' the items on the surface so that they don't have to be searched for again on each 'input' event
 * The class doesn't do everything on its own, it needs to be used properly.
 *
 * @class
 *
 * @constructor
 * @property {Array} storageDomElements Stores all elements whose styles have been changed on the ve.ce.Surfave but not in the Document Model.
 * @property {ve.dm.Selection|null} selection Selection which was active when default browser's ColorPicker has been activeted.
 */
ct.ui.CeHandler = function CtUiMixinCeHandler() {
    this.storageDomElements = [];
    this.selection = null;
};

/* Initialization */

OO.initClass(ct.ui.CeHandler);

/* Methods */

/**
 * Add new item to storage.
 *
 * @param {string} style Style attr of element before DOM changing.
 * @param {jQuery} el Element after DOM changing.
 */
ct.ui.CeHandler.prototype.addElement = function (style, el) {
    this.storageDomElements.push({
        style,
        el,
    });
};

/**
 * Return all elements in storage.
 *
 * @returns {object[]}
 */
ct.ui.CeHandler.prototype.getElements = function () {
    return this.storageDomElements;
};

/**
 * Set new styles for all elements that are present in the storage.
 *
 * @param {object} styles Styles which wii be passed to jQuery.css()
 */
ct.ui.CeHandler.prototype.updateElements = function (styles) {
    this.getElements().forEach((item) => {
        item.el.css(styles);
    });
};

/**
 * Returns the element's style attribute value, which was before the element was modified.
 */
ct.ui.CeHandler.prototype.resetElements = function () {
    this.getElements().forEach((item) => {
        item.el.attr('style', item.style || '');
    });
};

/**
 * Set current selection.
 *
 * @param {ve.dm.Selection} selection Selection which was active when default browser's
 * ColorPicker has been activeted.
 */
ct.ui.CeHandler.prototype.memorizeSelection = function (selection) {
    this.selection = selection;
};

/**
 * Get selection.
 *
 * @returns {ve.dm.Selection} Previous active selection if current selection is different
 */
ct.ui.CeHandler.prototype.getMemorizedSelection = function () {
    return this.selection;
};

/**
 * Remove selection from this instance.
 */
ct.ui.CeHandler.prototype.removeMemorizedSelection = function () {
    this.selection = null;
};

/**
 * Checks if storage not empty (if there are elements that have been modified in the DOM).
 *
 * @returns {boolean}
 */
ct.ui.CeHandler.prototype.isStorageEmpty = function () {
    return !!!this.storageDomElements.length;
};

/**
 * Remove all elements from storage.
 */
ct.ui.CeHandler.prototype.emptyStorage = function () {
    this.storageDomElements.length = 0;
};
