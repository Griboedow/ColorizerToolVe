/**
 * Returns a Boolean indicating whether the range contains all of the text
 *
 * @param {Range} range
 * @param {Node} node
 * @returns {boolean}
 */
ct.utils.rangeContainsTextNode = function rangeContainsTextNode(range, node) {
    const treeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                return NodeFilter.FILTER_ACCEPT;
            },
        },
        false
    );

    let firstTextNode, lastTextNode, textNode;
    while ((textNode = treeWalker.nextNode())) {
        if (!firstTextNode) {
            firstTextNode = textNode;
        }
        lastTextNode = textNode;
    }

    const nodeRange = range.cloneRange();
    if (firstTextNode) {
        nodeRange.setStart(firstTextNode, 0);
        nodeRange.setEnd(lastTextNode, lastTextNode.length);
    } else {
        nodeRange.selectNodeContents(node);
    }
    return (
        range.compareBoundaryPoints(Range.START_TO_START, nodeRange) < 1 &&
        range.compareBoundaryPoints(Range.END_TO_END, nodeRange) > -1
    );
};

/**
 * Small helper.
 * Compares 2 colors and returns the one that is not black or an empty string if both are black.
 *
 * @param {string} hexOne
 * @param {string} hexTwo
 * @returns {string}
 */
ct.utils.getNotBlackColor = function (hexOne, hexTwo) {
    const blackColor = '#000000';
    if (hexOne === hexTwo && hexOne === blackColor) {
        return '';
    }

    if (hexOne === blackColor) {
        return hexTwo;
    } else {
        return hexOne;
    }
};

ct.utils.isFirefox = navigator.userAgent.includes('Firefox');
ct.utils.isChrome = navigator.userAgent.includes('Chrome');
ct.utils.isWindows = navigator.userAgent.includes('Windows');
