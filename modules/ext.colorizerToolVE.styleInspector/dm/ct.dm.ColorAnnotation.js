/*!
 * ColorizerToolVe DataModel ColorAnnotation abstract class.
 */

/**
 * Abstract class for TextColorAnnotation and TextBgColorAnnotation.
 *
 * This is an abstract class, each child class should extend this and call this constructor from their constructor.
 * You should not instantiate this class directly.
 *
 * @class
 * @abstract
 *
 * @extends ve.dm.TextStyleAnnotation
 * @constructor
 * @param {Object} element
 */
ct.dm.ColorAnnotation = function CtDmColorAnnotation() {
    // Parent constructor
    ct.dm.ColorAnnotation.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ct.dm.ColorAnnotation, ve.dm.TextStyleAnnotation);

/* Static Properties */

ct.dm.ColorAnnotation.static.matchTagNames = ['span'];

ct.dm.ColorAnnotation.static.inferFromView = true;

ct.dm.ColorAnnotation.static.method = 'set';

/**
 * CSS property in the 'style' attribute that this model corresponds to.
 *
 * @static
 * @property {string}
 */
ct.dm.ColorAnnotation.static.styleAttr = null;

// ct.dm.ColorAnnotation.static.applyToAppendedContent = false;

ct.dm.ColorAnnotation.static.matchFunction = function (element) {
    const styleAttr = element.getAttribute('style');

    if (styleAttr && styleAttr.includes(this.styleAttr)) {
        return true;
    }

    return false;
};

/**
 * @inheritdoc
 */
ct.dm.ColorAnnotation.static.toDataElement = function (domElements) {
    return {
        type: this.name,
        attributes: {
            code: this.getCodeFromElement(domElements[0]),
        },
    };
};

ct.dm.ColorAnnotation.static.getCodeFromElement = function (el) {
    let style, props, prop, i, propBits, val, propName;
    style = el.getAttribute('style');
    if (!style) {
        return '';
    }
    props = style.split(';');
    for (i = 0; i < props.length; i++) {
        prop = props[i].trim();
        if (prop === '') {
            continue;
        }
        propBits = prop.split(':');
        if (propBits.length < 2) {
            continue;
        }
        val = propBits.pop().trim();
        propName = propBits.pop().trim();
        if (propName === this.styleAttr) {
            return val;
        }
    }
    return '';
};

/**
 * Static function to convert a linear model data element for this annotation type back to
 * a DOM element.
 *
 * As special facilities for annotations, the annotated content that the returned element will
 * wrap around is passed in as childDomElements, and this function may return an empty array to
 * indicate that the annotation should produce no output. In that case, the child DOM elements will
 * not be wrapped in anything and will be inserted directly into this annotation's parent.
 *
 * @static
 * @method
 * @param {Object|Array} dataElement Linear model element or array of linear model data
 * @param {Document} doc HTML document for creating elements
 * @param {ve.dm.Converter} converter Converter object to optionally call .getDomSubtreeFromData() on
 * @param {Node[]} childDomElements Children that will be appended to the returned element
 * @return {HTMLElement[]} Array of DOM elements; only the first element is used; may be empty
 */
ct.dm.ColorAnnotation.static.toDomElements = function (dataElement, doc) {
    const domElement = doc.createElement(this.matchTagNames[0]);

    if (dataElement?.attributes?.code) {
        domElement.setAttribute('style', `${this.styleAttr}: ` + dataElement.attributes.code);
    }

    // This is to avoid wrapping the text with 'span' for case
    // when on ct.ce the text was wrapped into an empty annotation (stub)
    if (!domElement.hasAttribute('style')) {
        return '';
    }

    return [domElement];
};

/**
 * Get an object containing comparable annotation properties.
 *
 * This is used by the converter to merge adjacent annotations.
 *
 * @return {Object} An object containing a subset of the annotation's properties
 */
ct.dm.ColorAnnotation.prototype.getComparableObject = function () {
    return {
        type: this.getType(),
        code: this.getAttribute('code'),
    };
};

/**
 * If annotation doesn't have color code return true.
 *
 * @return {boolean}
 */
ct.dm.ColorAnnotation.prototype.isStub = function () {
    return !!!this.getAttribute('code');
};
