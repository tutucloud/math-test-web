
const NUMBER_STRING_LENGTH_COLUMN_4 = 5;
const NUMBER_STRING_LENGTH_COLUMN_3 = 5;
const PLACEHOLDER_FILL_COLUMN_3 = "("+"&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_3-2)+")";
const PLACEHOLDER_FILL_COLUMN_4 = "("+"&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_4-2)+")";
const PLACEHOLDER_NORMAL_COLUMN_3 = "&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_3);
const PLACEHOLDER_NORMAL_COLUMN_4 = "&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_4);
const PATTERN_NORMAL = "normal";
const PATTERN_FILL = "fill";
const COLUMN_3 = 3;
const COLUMN_4 = 4;
const OPERATOR_ADD = "add";
const OPERATOR_SUB = "sub";
const OPERATOR_MUL = "mul";
const OPERATOR_DIV = "div";
const PERCENT_TOTAL = 100

const DEFAULT_COUNT=50;
const DEFAULT_RANGE=10;
const DEFAULT_ADD_SELECTED = true;
const DEFAULT_ADD_PERCENT = 50;
const DEFAULT_SUB_SELECTED = true;
const DEFAULT_SUB_PERCENT = 50;
const DEFAULT_MUL_SELECTED = false;
const DEFAULT_MUL_PERCENT = 0;
const DEFAULT_DIV_SELECTED = false;
const DEFAULT_DIV_PERCENT = 0;
const DEFAULT_PATTERN = PATTERN_NORMAL;
const DEFAULT_COLUMN = COLUMN_4;

let model = {
    count: DEFAULT_COUNT,
    range: DEFAULT_RANGE,
    operators: {
        add: { selected: DEFAULT_ADD_SELECTED, percent: DEFAULT_ADD_PERCENT },
        sub: { selected: DEFAULT_SUB_SELECTED, percent: DEFAULT_SUB_PERCENT },
        mul: { selected: DEFAULT_MUL_SELECTED, percent: DEFAULT_MUL_PERCENT },
        div: { selected: DEFAULT_DIV_SELECTED, percent: DEFAULT_DIV_PERCENT },
    },
    pattern: DEFAULT_PATTERN,
    column: DEFAULT_COLUMN,
};

function getNumStrLen(model) {
    if( model.column == COLUMN_3 ) {
        return NUMBER_STRING_LENGTH_COLUMN_3;
    } else if ( model.column == COLUMN_4 ) {
        return NUMBER_STRING_LENGTH_COLUMN_4;
    } else {
        throw "Invalid column: "+model.column;
    }
}

function getPlaceHolder(model) {
    if( model.pattern == PATTERN_NORMAL ) {
        if( model.column == COLUMN_3 ) {
            return PLACEHOLDER_NORMAL_COLUMN_3;
        } else if ( model.column == COLUMN_4 ) {
            return PLACEHOLDER_NORMAL_COLUMN_4;
        } else {
            throw "Invalid column: "+model.column;
        }
    } else if( model.pattern == PATTERN_FILL ) {
        if( model.column == COLUMN_3 ) {
            return PLACEHOLDER_FILL_COLUMN_3;
        } else if ( model.column == COLUMN_4 ) {
            return PLACEHOLDER_FILL_COLUMN_4;
        } else {
            throw "Invalid column: "+model.column;
        }
    } else {
        throw "Invalid pattern: "+model.pattern;
    } 
}

function updateContent() {
    updateTitle();
    updateContent_Count();
    updateContent_Table();
}

function updateTitle() {
    let titleElm = document.getElementById("title");
    let title = ""+model.range+"以内"
        +(model.operators.add?"加":"")
        +(model.operators.sub?"减":"")
        +"法算术运算";
    titleElm.innerText = title;
    document.title = title;
}

function updateContent_Table() {
    let table = document.getElementById("item_table");
    table.innerHTML = "";
    let tr = null;
    for ( let i=0; i < model.count; ) {
        if (i % model.column == 0) {
            tr = document.createElement("tr");
            table.append(tr);
        }
        let td = document.createElement("td");
        td.innerHTML = generateItem();
        tr.append(td);
        ++i;
    }
}

function getRandomOperators() {
    let keys = Object.keys(model.operators)
    for ( let i=0; i<100; ++i ) {
        let index = Math.floor(Math.random()*keys.length);
        if (model.operators[keys[index]].selected) {
            return keys[index];
        }
    }
    throw "No operator selected";
}

function generateItem() {
    for ( let i=0; i<1000; ++i ) {
        let operator = getRandomOperators();
        let small1 = Math.floor(Math.random() * model.range+1);
        let small2 = Math.floor(Math.random() * model.range+1);

        let large
        if ( operator == OPERATOR_ADD || operator == OPERATOR_SUB ) {
            large = small1 + small2
            if ( large > model.range ) {
                continue;
            }
        }
        if ( operator == OPERATOR_MUL || operator == OPERATOR_DIV ) {
            large = small1 * small2
            if ( large > model.range ) {
                continue;
            }
        }
        if ( model.pattern == PATTERN_NORMAL ) {
            return generateNormalItem(operator, small1, small2, large);
        } else if ( model.pattern == PATTERN_FILL ) {
            return generateFillItem(operator, small1, small2, large);
        }
    }
    throw "Item not generated."
}

function fillSpace(value) {
    value = ""+value;
    let len = value.length;
    let numStrLen = getNumStrLen(model)
    let left = Math.floor((numStrLen - len)/2);
    let right = numStrLen - len - left;
    return "&nbsp;".repeat(left) + value + "&nbsp;".repeat(right);
}

function generateItemByData(operand1, operator, operand2, result) {
    return operand1 + getOperatorChar(operator) + operand2 + "＝" + result;
}

function generateNormalItem(operator, small1, small2, large) {
    if ( operator == OPERATOR_ADD || operator == OPERATOR_MUL ) {
        return generateItemByData(fillSpace(small1), operator, fillSpace(small2), getPlaceHolder(model));
    }
    if ( operator == OPERATOR_SUB || operator == OPERATOR_DIV ) {
        return generateItemByData(fillSpace(large), operator, fillSpace(small1), getPlaceHolder(model));
    }
    throw "Invalid operator: " + operator;
}

function generateFillItem(operator, small1, small2, large) {
    let index = Math.floor(Math.random()*3);
    if ( operator == OPERATOR_ADD || operator == OPERATOR_MUL ) {
        if ( index == 0 ) {
            return generateItemByData(fillSpace(small1), operator, fillSpace(small2), getPlaceHolder(model));
        } else if ( index == 1 ) {
            return generateItemByData(fillSpace(small1), operator, getPlaceHolder(model), fillSpace(large));
        } else {
            return generateItemByData(getPlaceHolder(model), operator, fillSpace(small2), fillSpace(large));
        }
    }
    if ( operator == OPERATOR_SUB || operator == OPERATOR_DIV ) {
        if ( index == 0 ) {
            return generateItemByData(fillSpace(large), operator, fillSpace(small1), getPlaceHolder(model));
        } else if ( index == 1 ) {
            return generateItemByData(fillSpace(large), operator, getPlaceHolder(model), fillSpace(small2));
        } else {
            return generateItemByData(getPlaceHolder(model), operator, fillSpace(small1), fillSpace(small2));
        }
    }
    throw "Invalid operator: " + operator;
}

function getOperatorChar(operator) {
    if ( operator == OPERATOR_ADD ) {
        return "＋";
    } else if ( operator == OPERATOR_SUB ) {
        return "ー";
    } else if ( operator == OPERATOR_MUL ) {
        return "×";
    } else if ( operator == OPERATOR_DIV ) {
        return "÷";
    }
    throw "Invalid operator: " + operator
}

function updateContent_Count() {
    let countElm = document.getElementById("count");
    countElm.innerText = model.count;
}

function initControlForm() {
    let form = document.forms["control_form"];
    form.elements["count"].value = model.count;
    form.elements["range"].value = model.range;
    for ( let operator of Object.keys(model.operators) ) {
        form.elements[operator].checked = model.operators[operator].selected;
        form.elements[getPercentInputName(operator)].value = model.operators[operator].percent;
    }
    form.elements["pattern"].value = model.pattern;
    form.elements["column"].value = model.column;
}

function docLoaded() {
    initControlForm();
    settingsChanged();
}

function settingsChanged() {
    let form = document.forms["control_form"];
    model.count = form.elements["count"].value;
    model.range = form.elements["range"].value;
    for ( let operator of Object.keys(model.operators) ) {
        model.operators[operator].selected = form.elements[operator].checked;
        model.operators[operator].percent = form.elements[getPercentInputName(operator)].value;
    }
    model.pattern = form.elements["pattern"].value;
    model.column = form.elements["column"].value;
    updateContent()
}

function printDoc() {
    window.print();
}

function getPercentInputName(operator) {
    return operator + "_percent"
}

function getControlForm() {
    return document.forms["control_form"];
}

function getInputOperatorPercent(operator) {
    let percentName = getPercentInputName(operator);
    return getControlForm().elements[percentName];
}

function getInputOperator(operator) {
    return getControlForm().elements[operator];
}

function updateInputOperatorsEnabled() {
    let checkedOperators = []
    for ( let operator of Object.keys(model.operators) ) {
        let elm = getInputOperator(operator);
        if ( elm.checked ) {
            checkedOperators.push(operator)
        } else {
            let percentElm = getInputOperatorPercent(operator);
            percentElm.disabled = true;
            percentElm.value = 0;
        }
    }
    if ( checkedOperators.length == 1 ) {
        let operator = checkedOperators[0];
        getInputOperator(operator).disabled = true;
        getInputOperatorPercent(operator).disabled = true;
    } else {
        for ( let operator of checkedOperators ) {
            getInputOperator(operator).disabled = false;
            getInputOperatorPercent(operator).disabled = false;
        }
    }
}

function collectInfoOfFormOperatorPercent() {
    let sum = 0
    let checkedPercentElms = {}
    for ( let operator of Object.keys(model.operators) ) {
        let percentElm = getInputOperatorPercent(operator);
        sum += parseInt(percentElm.value);
        if ( getInputOperator(operator).checked && operator != processingOperator ) {
            checkedPercentElms[operator] = percentElm;
        }
    }
    return {
        sum: sum,
        elms: checkedPercentElms,
    };
}

let processingOperator = null;

function updateFormPercent(operator) {
    if ( processingOperator ) {
        return;
    }
    processingOperator = operator;

    let info = collectInfoOfFormOperatorPercent();
    let delta = info.sum - PERCENT_TOTAL;
    for ( let i=0; i<10 && delta != 0; ++i ) {
        let curDelta = Math.trunc(delta / Object.keys(info.elms).length);
        for( let operator in info.elms ) {
            let elm = info.elms[operator];
            let curValue = parseInt(elm.value);
            let newValue = curValue - curDelta;
            if ( newValue < 0 ) {
                newValue = 0;
            } else if ( newValue > PERCENT_TOTAL ) {
                newValue = PERCENT_TOTAL;
            }
            delta -= curValue - newValue;
            elm.value = newValue;
        }
    }

    processingOperator = null;
}

function inputOperatorChanged(operator) {
    updateInputOperatorsEnabled();
    updateFormPercent(operator);
}

function inputPercentChanged(operator) {
    updateFormPercent(operator);
}

function balanceClicked() {
    let info = collectInfoOfFormOperatorPercent();
    let elmCount = Object.keys(info.elms).length;
    let value = Math.floor(PERCENT_TOTAL / elmCount);
    for ( let operator in info.elms ) {
        info.elms[operator].value = value;
    }
}


document.addEventListener("DOMContentLoaded", docLoaded)
