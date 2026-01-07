export class Variable {
    constructor(name) {
        this.name = name;
        this.value = false;
    }
    getValue() {
        return this.value;
    }
}

export class Operator {}

export class DyadicOperator extends Operator {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}

export class Not extends Operator {
    constructor(operand) {
        super();
        this.operand = operand;
    }

    getValue() {
        return !this.operand.getValue();
    }
}

export class And extends DyadicOperator {
    getValue() {
        return this.left.getValue() && this.right.getValue();
    }
}

export class Or extends DyadicOperator {
    getValue() {
        return this.left.getValue() || this.right.getValue();
    }
}

export class XOr extends DyadicOperator {
    getValue() {
        return this.left.getValue() != this.right.getValue();
    }
}

export class Implication extends DyadicOperator {
    getValue() {
        return !this.left.getValue() || this.right.getValue();
    }
}
