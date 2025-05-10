/*!
 * ColorizerToolVe ContentEditable TextBgColorAnnotation class.
 */

/**
 * ContentEditable text background color annotation.
 *
 * @class
 * @extends ve.ce.TextStyleAnnotation
 *
 * @constructor
 * @param {Object} element
 */
ct.ce.TextBgColorAnnotation = function CtCeTextBgColorAnnotation() {
    // Parent constructor
    ct.ce.TextBgColorAnnotation.super.apply(this, arguments);

    // DOM changes
    this.$element.addClass('colorizertoolve-textBgColorAnnotation').prop({
        title: this.constructor.static.getDescription(this.model),
    });

    const hexColor = this.model.getAttribute('code');
    if (hexColor) {
        this.$element.css('background', hexColor);
    }
};

/* Inheritance */

OO.inheritClass(ct.ce.TextBgColorAnnotation, ve.ce.TextStyleAnnotation);

/* Static Properties */

/**
 * @inheritdoc
 */
ct.ce.TextBgColorAnnotation.static.name = 'textStyle/bgcolor';

/**
 * @inheritdoc
 */
ct.ce.TextBgColorAnnotation.static.tagName = 'span';

/* Static Methods */

ct.ce.TextBgColorAnnotation.static.getDescription = function (model) {
    return OO.ui.deferMsg('colorizertoolve-annotation-textbgcolor-desc');
};

/* Registration */

ve.ce.annotationFactory.register(ct.ce.TextBgColorAnnotation);
