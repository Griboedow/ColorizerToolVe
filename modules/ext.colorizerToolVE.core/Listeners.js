/**
 * A wrapper for adding listeners to global objects.
 * Listeners are registered to be removed at a convenient time and place afterwards.
 */
ct.Listeners = function Listeners() {
    this.registry = [];
};

/**
 * Add new listener of event.
 * Also listener will be added to inner registry.
 *
 * @param {(Window|Document|HTMLElement)} target Element, which could thow event.
 * @param {string} event Name of jQuery.Event.
 * @param {Function} handler Function which handle the event.
 */
ct.Listeners.prototype.add = function (target, event, handler) {
    $(target).on(event, handler);
    ct.listeners.registry.push({
        target,
        event,
        handler,
    });
};

/**
 * Remove all listeners from registry.
 */
ct.Listeners.prototype.removeAll = function () {
    ct.listeners.registry.forEach(({ target, event, handler }) => {
        $(target).off(event, handler);
    });
};

ct.listeners = new ct.Listeners();
