/**
 * All extension config.
 */
ct.config = mw.config.get('wgColorizerToolVE');

/**
 * Reset cache each time after VE surface was activeted.
 */
mw.hook('ve.activationComplete').add(function () {
    ct.listeners.removeAll();
    ct.cache = {};
});

/**
 * Reset cache each time when use VEForAll.
 */
mw.hook('veForAll.targetCreated').add(function () {
    ct.listeners.removeAll();
    ct.cache = {};
});
