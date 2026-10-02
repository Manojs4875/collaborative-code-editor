
function getElementBeforePosition(position) {
     let currentPosition = 0;
    let previousId = null;
    let result = null;

    const traverse = (parentId) => {
        const children = this.children.get(parentId) || [];

        for (const childId of children) {
            const element = this.elements.get(childId);

            if (!element) continue;

            // Have we reached the required position?
            if (currentPosition === position) {
                result = previousId;
                return true;
            }

            // Deleted elements are not visible in Monaco
            if (!element.deleted) {
                previousId = element.id;
                currentPosition++;
            }

            // Traverse descendants even if this element is deleted
            // it return true if decendents returns true else it will return false
            if (traverse(element.id)) {
                return true;
            }
        }

        return false;
    };

    traverse(null);

    // Handle insertion at the end of the document
    if (result === null && currentPosition === position) {
        return previousId;
    }

    return result;
}