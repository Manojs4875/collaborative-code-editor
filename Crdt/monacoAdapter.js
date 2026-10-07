
function getElementBeforePosition(position) {
    let currentPosition = 0;
    let previousId = null;
    let result = null;

    const traverse = (parentId) => {
        const children = this.children.get(parentId) || [];

        // Stack: last inserted child comes first
        for (let i = children.length - 1; i >= 0; i--) {

            const childId = children[i];

            const element = this.elements.get(childId);

            if (!element) continue;

            // Have we reached the requested position?
            if (currentPosition === position) {
                result = previousId;
                return true;
            }

            // Deleted elements are not visible
            if (!element.deleted) {
                previousId = element.id;
                currentPosition++;
            }

            // Still traverse descendants
            if (traverse(element.id)) {
                return true;
            }
        }

        return false;
    };

    traverse(null);

    // Insertion at end
    if (result === null && currentPosition === position) {
        return previousId;
    }

    return result;
}
