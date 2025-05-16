/*!
 * ColorizerToolVe DataModel TextBgColorAnnotation class.
 */

/**
 * DataModel text background color annotation.
 *
 * @class
 * @extends ct.dm.ColorAnnotation
 * @constructor
 * @param {Object} element
 */

ct.dm.TextBgColorAnnotation = function CtDmTextBgColorAnnotation(element) {
    // Parent constructor
    ct.dm.TextBgColorAnnotation.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ct.dm.TextBgColorAnnotation, ct.dm.ColorAnnotation);

/* Static Properties */

ct.dm.TextBgColorAnnotation.static.name = 'textStyle/bgcolor';

ct.dm.TextBgColorAnnotation.static.removes = ['textStyle/bgcolor'];

ct.dm.TextBgColorAnnotation.static.styleAttr = 'background';

ct.dm.TextBgColorAnnotation.static.description = 'Background color';

/* Registration */

ve.dm.modelRegistry.register(ct.dm.TextBgColorAnnotation);
