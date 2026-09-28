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

        const list = this.children.get(afterId);

        list.push(uniqueId);

        // deterministic ordering
        list.sort((a, b) => b.localeCompare(a));

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
            if(operation.after !== null && !this.elements.has(operation.after)) {
                // Store the operation for later processing
                this.pendingOperations.push(operation);
                return;
            }
            const element = {
                id: operation.id,
                value: operation.value,
                after: operation.after,
                deleted: false
            };

            this.elements.set(operation.id, element);

            if (!this.children.has(operation.after)) {
                this.children.set(operation.after, []);
            }

            const list = this.children.get(operation.after);

            list.push(operation.id);

            // Same ordering rule for remote operations
            list.sort((a, b) => b.localeCompare(a));
            this.processpending();
        }

        else if (operation.type === "delete") {

            this.delete(operation.targetId);
        }
    }
    processpending() {
        let processed = true;
        while (processed) {
            processed = false;
        for (let i = 0; i < this.pendingOperations.length;i++ ) {
            const op = this.pendingOperations[i];
            if(this.elements.has(op.after)) {
                processed=true;
                this.pendingOperations.splice(i, 1);
                this.applyOperation(op);
                break;
            } 
        }}
    }
    getText() {
        let text = "";

        const traverse = (parentId) => {

            const children = this.children.get(parentId) || [];

            for (const childId of children) {

                // Convert ID → actual element
                const element = this.elements.get(childId);

                if (!element) {
                    continue;
                }

                if (!element.deleted) {
                    text += element.value;
                }

                // Process descendants
                traverse(element.id);
            }
        };

        traverse(null);

        return text;
    }
}

module.exports = RGA;