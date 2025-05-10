/*!
 * ColorizerToolVe ContentEditable TextColorAnnotation class.
 */

/**
 * ContentEditable text color annotation.
 *
 * @class
 * @extends ct.ce.TextStyleAnnotation
 *
 * @constructor
 * @param {Object} element
 */
ct.ce.TextColorAnnotation = function CtCeTextColorAnnotation() {
    // Parent constructor
    ct.ce.TextColorAnnotation.super.apply(this, arguments);

    // DOM changes
    this.$element.addClass('colorizertoolve-textColorAnnotation').prop({
        title: this.constructor.static.getDescription(this.model),
    });

    const hexColor = this.model.getAttribute('code');
    if (hexColor) {
        this.$element.css('color', hexColor);
    }
};

/* Inheritance */

OO.inheritClass(ct.ce.TextColorAnnotation, ve.ce.TextStyleAnnotation);

/* Static Properties */

ct.ce.TextColorAnnotation.static.name = 'textStyle/textcolor';

ct.ce.TextColorAnnotation.static.tagName = 'span';

/* Static Methods */

ct.ce.TextColorAnnotation.static.getDescription = function (model) {
    return OO.ui.deferMsg('colorizertoolve-annotation-textcolor-desc');
};

/* Registration */

ve.ce.annotationFactory.register(ct.ce.TextColorAnnotation);
