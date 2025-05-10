/*!
 * ColorizerToolVe GroupAnnotationButton mixin class.
 */

/**
 * Mixin for ct.ui.ButtonTool class and other buttons, that works with annotation.
 *
 * Provides methods to activate the action when the button is clicked.
 *
 * @class
 * @abstract
 * @mixins ct.ui.mixin.GroupActionButton
 */
ct.ui.mixin.GroupAnnotationButton = function CtUiMixinGroupAnnotationButton() {
    ct.ui.mixin.GroupActionButton.call(this);
    // See: ve.ui.AnnotationAction.toggle(), ve.ui.AnnotationAction.set()
    this.setArguments(this.getName());
};

/* Initialization */

OO.initClass(ct.ui.mixin.GroupAnnotationButton);

/* Inheritance */

OO.mixinClass(ct.ui.mixin.GroupAnnotationButton, ct.ui.mixin.GroupActionButton);

/* Static Properties (inherit from ct.ui.mixin.GroupActionButton) */

/**
 * @inheritdoc
 */
ct.ui.mixin.GroupAnnotationButton.static.action = 'annotation';

/* Methods */

/**
 * Remove the Annotation.
 * For more complex annotations, 'toggle()' is not enough, so use this method.
 */
ct.ui.mixin.GroupAnnotationButton.prototype.clearAnnotation = function () {
    this.surface.execute(this.getAction(), 'clear', ...this.getArguments());
};

/**
 * Set up styling flags to customize the look and feel of a button.
 * Works only for MediaWiki buttons.
 */
ct.ui.mixin.GroupAnnotationButton.prototype.changeActive = function () {
    if (this.isActive()) {
        this.setFlags(['primary', 'progressive']);
    } else {
        this.clearFlags();
    }
};

/**
 * Checks if current selections has annotation.
 *
 * @param {boolean} [all] Get annotations which only cover some of the fragment.
 * @returns {boolean}
 */
ct.ui.mixin.GroupAnnotationButton.prototype.isActive = function (all = true) {
    return this.surface
        .getModel()
        .getFragment()
        .getAnnotations(all)
        .hasAnnotationWithName(this.getName());
};

/**
 * Returns true if the selection covers the annotation completely.
 *
 * @returns {boolean}
 */
ct.ui.mixin.GroupAnnotationButton.prototype.isPartSelection = function () {
    const fullRange = this.surface.getModel().getSelection().getCoveringRange(),
        annotationRange = this.getAnnotationRange(fullRange);
    return !fullRange.equalsSelection(annotationRange);
};

/**
 * Returns the full range of the annotation in the range of the part it is.
 *
 * @param {ve.Range} [range] Range than contains annotation, by default current range.
 * @param {ve.dm.Annotation} [annotation] Annotation for which you want to return the range,
 * by default the first annotation will be taken.
 * @returns {ve.Range}
 */
ct.ui.mixin.GroupAnnotationButton.prototype.getAnnotationRange = function (range, annotation) {
    const fullRange = range || this.surface.getModel().getSelection().getCoveringRange();
    return this.surface
        .getModel()
        .getDocument()
        .data.getAnnotatedRangeFromSelection(
            fullRange,
            annotation || this.getCurrentAnnotations().get(0)
        );
};

/**
 * Return annotation set of current selection.
 *
 * @param {boolean} [all] Get annotations which only cover some of the fragment.
 * @returns {ve.dm.AnnotationSet} Annotation set of current selection.
 */
ct.ui.mixin.GroupAnnotationButton.prototype.getCurrentAnnotations = function (all = true) {
    return this.surface
        .getModel()
        .getFragment()
        .getAnnotations(true)
        .getAnnotationsByName(this.getName());
};

/**
 * Resets all arguments for the command, keeping only the name as the first element of the array.
 */
ct.ui.mixin.GroupAnnotationButton.prototype.resetArguments = function () {
    // For annotations we should save firs element, since it is name of annotation
    // See: ve.ui.AnnotationAction.toggle(), ve.ui.AnnotationAction.set()
    const annotationName = this.arguments[0];
    this.arguments.length = 0;
    this.arguments.push(annotationName);
};
