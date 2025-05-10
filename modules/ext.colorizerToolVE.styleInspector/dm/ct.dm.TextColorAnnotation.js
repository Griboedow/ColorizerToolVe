/*!
 * ColorizerToolVe DataModel TextColorAnnotation class.
 */

/**
 * DataModel text background color annotation.
 *
 * @class
 * @extends ct.dm.ColorAnnotation
 * @constructor
 * @param {Object} element
 */

ct.dm.TextColorAnnotation = function CtDmTextColorAnnotation(element) {
    // Parent constructor
    ct.dm.TextColorAnnotation.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ct.dm.TextColorAnnotation, ct.dm.ColorAnnotation);

/* Static Properties */

ct.dm.TextColorAnnotation.static.name = 'textStyle/textcolor';

ct.dm.TextColorAnnotation.static.removes = ['textStyle/textcolor'];

ct.dm.TextColorAnnotation.static.styleAttr = 'color';

ct.dm.TextColorAnnotation.static.description = 'Text color';

/* Registration */

ve.dm.modelRegistry.register(ct.dm.TextColorAnnotation);
