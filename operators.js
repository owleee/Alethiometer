export class Operator {
    static parseValue(value) {
        if (value instanceof Operator) {
            return value.getValue();
        } else {
            return value;
        }
    }
}

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
        return !Operator.parseValue(this.operand);
    }
}

export class And extends DyadicOperator {
    getValue() {
        return Operator.parseValue(this.left) && Operator.parseValue(this.right);
    }
}

export class Or extends DyadicOperator {
    getValue() {
        return Operator.parseValue(this.left) || Operator.parseValue(this.right);
    }
}

export class XOr extends DyadicOperator {
    getValue() {
        return Operator.parseValue(this.left) != Operator.parseValue(this.right);
    }
}

export class Implication extends DyadicOperator {
    getValue() {
        return !Operator.parseValue(this.left) || Operator.parseValue(this.right);
    }
}
