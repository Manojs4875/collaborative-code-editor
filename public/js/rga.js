class RGA {
    constructor(clientId) {
        this.elements = new Map();
        this.children = new Map();
        this.clientId = clientId;
        this.pendingOperations = [];
        this.counter = 0;
    }
    insert(afterId, value) {
        this.counter++;

        const uniqueId = `${this.clientId}:${this.counter}`;

        const element = {
            id: uniqueId,
            value: value,
            after: afterId,
            deleted: false
        };

        this.elements.set(uniqueId, element);

        if (!this.children.has(afterId)) {
            this.children.set(afterId, []);
        }

        this.children.get(afterId).push(uniqueId);

        // deterministic ordering
        
        return {
            type: "insert",
            id: uniqueId,
            value: value,
            after: afterId
        };
    }

    delete(uniqueId) {
        const element = this.elements.get(uniqueId);

        if (!element) {
            return null;
        }

        element.deleted = true;

        return {
            type: "delete",
            targetId: uniqueId
        };
    }

    applyOperation(operation) {

        if (operation.type === "insert") {

            // Already received this operation
            if (this.elements.has(operation.id)) {
                return;
            }
            if (operation.after !== null && !this.elements.has(operation.after)) {
                // Store the operation for later processing
                this.pendingOperations.push(operation);
                return;
            }
           this.insert(operation.after, operation.value);
            this.processpending();
        }

        else if (operation.type === "delete") {

            this.delete(operation.targetId);
        }
    }
    processpending() {
        let processed = true;
        while (processed) {
            // topo sort
            processed = false;
            for (let i = 0; i < this.pendingOperations.length; i++) {
                const op = this.pendingOperations[i];
                if (this.elements.has(op.after)) {
                    processed = true;
                    this.pendingOperations.splice(i, 1);
                    this.applyOperation(op);
                    break;
                }
            }
        }
    }
    getText() {
        let text = "";
        // bfs
        const traverse = (parentId) => {

            const children = this.children.get(parentId) || [];
            for(let i=children.length-1;i>=0;i--){
                const childId = children[i];
                const element = this.elements.get(childId);
                 if (!element) continue;

            if (!element.deleted) {
                text += element.value;
            }

            // Process this child's descendants
            traverse(element.id);}
        };

        traverse(null);

        return text;
    }
    loadText(text) {
        // this is bcs once server is restarted or client is refreshed, the RGA instance will be empty and we need to load the text from the database
        let afterId = null;


        for (let i = 0; i < text.length; i++) {

            const id = `init:${i + 1}`;

            const element = {
                id: id,
                value: text[i],
                after: afterId,
                deleted: false
            };

            this.elements.set(id, element);

            if (!this.children.has(afterId)) {
                this.children.set(afterId, []);
            }

            this.children.get(afterId).push(id);

            afterId = id;
        }
    }
   getElementBeforePosition(position) {
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
    }

    traverse(null);

    // Handle insertion at the end of the document
    if (result === null && currentPosition === position) {
        return previousId;
    }

    return result;
}

getElementAtPosition(position) {
    let currentPosition = 0;
    let result = null;

    const traverse = (parentId) => {
        const children = this.children.get(parentId) || [];

        // LIFO
        for (let i = children.length - 1; i >= 0; i--) {

            const childId = children[i];
            const element = this.elements.get(childId);

            if (!element) continue;

            if (!element.deleted) {
                if (currentPosition === position) {
                    result = element.id;
                    return true;
                }

                currentPosition++;
            }

            // Traverse descendants even if element is deleted
            if (traverse(element.id)) {
                return true;
            }
        }

        return false;
    };

    traverse(null);

    return result;
}

 getElementBeforePosition(position) {
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
}

window.RGA = RGA;