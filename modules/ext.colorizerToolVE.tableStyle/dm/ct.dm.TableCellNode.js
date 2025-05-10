/*!
 * ColorizeToolVE DataModel TableCellNode class.
 */

/**
 * DataModel table cell node.
 *
 * @class
 * @extends ve.dm.TableCellNode
 *
 * @constructor
 * @param {Object} [element] Reference to element in linear model
 * @param {ct.dm.Node[]} [children]
 */
ct.dm.TableCellNode = function CtDmTableCellNode() {
    // Parent constructor
    ct.dm.TableCellNode.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ct.dm.TableCellNode, ve.dm.TableCellNode);

/* Static Properties */

// We will manually move the style attribute in the static.toDomElements() method
// because otherwise it will be automatically overwritten at conversion time
// See: ct.dm.Converter.prototype.getDomElementsFromDataElement()
// TODO: It's not very pretty, there are probably better ways to do it
ct.dm.TableCellNode.static.preserveHtmlAttributes = function (attr) {
    if (attr === 'style') {
        return false;
    }
    return ve.dm.TableCellNode.static.preserveHtmlAttributes(attr);
};

/* Static Methods */
ct.dm.TableCellNode.static.toDataElement = function (domElements) {
    // ************
    // WARNING!!!!!! Background-color in attributes must be separate from style
    // otherwise we will get an infinite loop.
    // See: ct.dm.TableCellNode.prototype.onAttributeChange()
    // ************
    const attributes = {};
    if (domElements[0].hasAttribute('style')) {
        attributes.background = domElements[0]
            .getAttribute('style')
            .split(';')
            .filter((style) => {
                return style.includes('background-color');
            })
            .map((style) => {
                const index = style.indexOf(':');
                return style.substring(index + 1).trim();
            })
            .join(';');
    }
    ve.dm.TableCellableNode.static.setAttributes(attributes, domElements);

    return {
        type: this.name,
        attributes: attributes,
    };
};

ct.dm.TableCellNode.static.toDomElements = function (dataElement, doc, converter) {
    // ************
    // WARNING!!!!!! Background-color in attributes must be separate from style
    // otherwise we will get an infinite loop.
    // See: ct.dm.TableCellNode.prototype.onAttributeChange()
    // ************
    const tag = dataElement.attributes && dataElement.attributes.style === 'header' ? 'th' : 'td',
        domElement = doc.createElement(tag),
        attributes = dataElement.attributes;

    let styleAttr = '';

    // SB, SG, Niko: add background attribute to DOM element
    if (
        dataElement.originalDomElementsHash &&
        (hashValueStore = converter.getStore()) &&
        (originalDomElement = hashValueStore.value(dataElement.originalDomElementsHash)?.[0]) &&
        originalDomElement.hasAttribute('style')
    ) {
        // here we are trying to keep styles which was applied in SE
        styleAttr = originalDomElement
            .getAttribute('style')
            .split(';')
            .filter((style) => {
                return !style.includes('background-color');
            })
            .join(';');

        if (styleAttr && !styleAttr.endsWith(';')) {
            styleAttr += ';';
        }
    }

    // Add HTML attribute from data attributes
    if (attributes?.background) {
        styleAttr += `background-color:${attributes.background};`;
    }

    if (styleAttr) {
        domElement.setAttribute('style', styleAttr);
    }

    ve.dm.TableCellableNode.static.applyAttributes(attributes, domElement);

    return [domElement];
};

/* Registration */

ve.dm.modelRegistry.register(ct.dm.TableCellNode);
