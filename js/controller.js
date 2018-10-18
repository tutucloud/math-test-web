
const NUMBER_STRING_LENGTH_COLUMN_4 = 4;
const NUMBER_STRING_LENGTH_COLUMN_3 = 5;
const PLACEHOLDER_FILL_COLUMN_3 = "("+"&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_3-2)+")";
const PLACEHOLDER_FILL_COLUMN_4 = "("+"&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_4-2)+")";
const PLACEHOLDER_NORMAL_COLUMN_3 = "&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_3);
const PLACEHOLDER_NORMAL_COLUMN_4 = "&nbsp;".repeat(NUMBER_STRING_LENGTH_COLUMN_4);
const COLUMN_3 = 3;
const COLUMN_4 = 4;
const OPERATOR_ADD = "add";
const OPERATOR_SUB = "sub";
const OPERATOR_MUL = "mul";
const OPERATOR_DIV = "div";
const PATTERN_NORMAL = "normal";
const PATTERN_FILL = "fill";
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
const DEFAULT_NORMAL_SELECTED = true;
const DEFAULT_NORMAL_PERCENT = 100;
const DEFAULT_FILL_SELECTED = false;
const DEFAULT_FILL_PERCENT = 0;
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
    patterns: {
        normal: { selected: DEFAULT_NORMAL_SELECTED, percent: DEFAULT_NORMAL_PERCENT, placeholder: "" },
        fill: { selected: DEFAULT_FILL_SELECTED, percent: DEFAULT_FILL_PERCENT, placeholder: "" },
    },
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

function getPlaceHolder(pattern, column) {
    if( pattern == PATTERN_NORMAL ) {
        if( column == COLUMN_3 ) {
            return PLACEHOLDER_NORMAL_COLUMN_3;
        } else if ( column == COLUMN_4 ) {
            return PLACEHOLDER_NORMAL_COLUMN_4;
        } else {
            throw "Invalid column: "+column;
        }
    } else if( pattern == PATTERN_FILL ) {
        if( column == COLUMN_3 ) {
            return PLACEHOLDER_FILL_COLUMN_3;
        } else if ( column == COLUMN_4 ) {
            return PLACEHOLDER_FILL_COLUMN_4;
        } else {
            throw "Invalid column: "+column;
        }
    } else {
        throw "Invalid pattern: " + pattern;
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

function getRandomValue(objs) {
    value = Math.random() * PERCENT_TOTAL;
    for ( let name in objs ) {
        if ( objs[name].percent == 0 ) {
            continue;
        }
        value -= objs[name].percent;
        if ( value <= 0 ) {
            return name;
        }
    }
    throw "No operator selected";
}

const RANDOM_FOR_ADD_X_RANGE = 2;
const RANDOM_FOR_ADD_Y_OFFSET = Math.sinh(RANDOM_FOR_ADD_X_RANGE);
function randomForAdd() {
    return Math.sinh((Math.random()-0.5)*RANDOM_FOR_ADD_X_RANGE*2) / RANDOM_FOR_ADD_Y_OFFSET / 2 + 0.5;
}

function generateItem() {
    for ( let i=0; i<1000; ++i ) {
        let operator = getRandomValue(model.operators);
        let pattern = getRandomValue(model.patterns);

        let large, small1, small2;
        if ( operator == OPERATOR_ADD || operator == OPERATOR_SUB ) {
            small1 = Math.floor(randomForAdd() * (model.range+1));
            small2 = Math.floor(randomForAdd() * (model.range+1));
            large = small1 + small2
            if ( large > model.range ) {
                continue;
            }
        } else if ( operator == OPERATOR_MUL || operator == OPERATOR_DIV ) {
            small1 = Math.floor(Math.random()*10+1);
            small2 = Math.round(Math.random()*10+1);
            large = Math.floor(small1 * small2);
            if ( large > model.range ) {
                continue;
            }
        } else {
            throw "Invalid operator: " + operator;
        }
        if ( pattern == PATTERN_NORMAL ) {
            return generateNormalItem(operator, small1, small2, large, model.patterns[pattern].placeholder);
        } else if ( pattern == PATTERN_FILL ) {
            return generateFillItem(operator, small1, small2, large, model.patterns[pattern].placeholder);
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

function generateNormalItem(operator, small1, small2, large, placeholder) {
    if ( operator == OPERATOR_ADD || operator == OPERATOR_MUL ) {
        return generateItemByData(fillSpace(small1), operator, fillSpace(small2), placeholder);
    }
    if ( operator == OPERATOR_SUB || operator == OPERATOR_DIV ) {
        return generateItemByData(fillSpace(large), operator, fillSpace(small1), placeholder);
    }
    throw "Invalid operator: " + operator;
}

function generateFillItem(operator, small1, small2, large, placeholder) {
    let index = Math.floor(Math.random()*3);
    if ( operator == OPERATOR_ADD || operator == OPERATOR_MUL ) {
        if ( index == 0 ) {
            return generateItemByData(fillSpace(small1), operator, fillSpace(small2), placeholder);
        } else if ( index == 1 ) {
            return generateItemByData(fillSpace(small1), operator, placeholder, fillSpace(large));
        } else {
            return generateItemByData(placeholder, operator, fillSpace(small2), fillSpace(large));
        }
    }
    if ( operator == OPERATOR_SUB || operator == OPERATOR_DIV ) {
        if ( index == 0 ) {
            return generateItemByData(fillSpace(large), operator, fillSpace(small1), placeholder);
        } else if ( index == 1 ) {
            return generateItemByData(fillSpace(large), operator, placeholder, fillSpace(small2));
        } else {
            return generateItemByData(placeholder, operator, fillSpace(small1), fillSpace(small2));
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
    form.elements["column"].value = model.column;
    for ( let operator of Object.keys(model.operators) ) {
        form.elements[operator].checked = model.operators[operator].selected;
        form.elements[getPercentInputName(operator)].value = model.operators[operator].percent;
    }
    for ( let pattern of Object.keys(model.patterns) ) {
        form.elements[pattern].checked = model.patterns[pattern].selected;
        form.elements[getPercentInputName(pattern)].value = model.patterns[pattern].percent;
    }
}

function docLoaded() {
    initControlForm();
    updateInputElmsEnabled(model.operators);
    updateInputElmsEnabled(model.patterns);
    settingsChanged();
}

function settingsChanged() {
    let form = document.forms["control_form"];
    model.count = parseInt(form.elements["count"].value);
    model.range = parseInt(form.elements["range"].value);
    model.column = parseInt(form.elements["column"].value);
    for ( let operator of Object.keys(model.operators) ) {
        model.operators[operator].selected = form.elements[operator].checked;
        model.operators[operator].percent = parseInt(form.elements[getPercentInputName(operator)].value);
    }
    for ( let pattern of Object.keys(model.patterns) ) {
        model.patterns[pattern].selected = form.elements[pattern].checked;
        model.patterns[pattern].percent = parseInt(form.elements[getPercentInputName(pattern)].value);
        model.patterns[pattern].placeholder = getPlaceHolder(pattern, model.column);
    }
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

function getNamedPercentInputElm(name) {
    let percentName = getPercentInputName(name);
    return getControlForm().elements[percentName];
}

function getNamedInputElm(name) {
    return getControlForm().elements[name];
}

function updateInputElmsEnabled(objs) {
    let checkedNames = []
    for ( let name in objs ) {
        let elm = getNamedInputElm(name);
        if ( elm.checked ) {
            checkedNames.push(name)
        } else {
            let percentElm = getNamedPercentInputElm(name);
            percentElm.disabled = true;
            percentElm.value = 0;
        }
    }
    if ( checkedNames.length == 1 ) {
        let name = checkedNames[0];
        getNamedInputElm(name).disabled = true;
        getNamedPercentInputElm(name).disabled = true;
    } else {
        for ( let name of checkedNames ) {
            getNamedInputElm(name).disabled = false;
            getNamedPercentInputElm(name).disabled = false;
        }
    }
}

let processingName = null;

function collectInfoOfFormPercent(objs) {
    let sum = 0
    let checkedPercentElms = {}
    for ( let name of Object.keys(objs) ) {
        let percentElm = getNamedPercentInputElm(name);
        sum += parseInt(percentElm.value);
        if ( getNamedInputElm(name).checked && name != processingName ) {
            checkedPercentElms[name] = percentElm;
        }
    }
    return {
        sum: sum,
        elms: checkedPercentElms,
    };
}

function updateFormPercent(objs, curName) {
    if ( processingName ) {
        return;
    }
    processingName = curName;

    let info = collectInfoOfFormPercent(objs);
    let delta = info.sum - PERCENT_TOTAL;
    for ( let i=0; i<10 && delta != 0; ++i ) {
        let curDelta = Math.trunc(delta / Object.keys(info.elms).length);
        for( let name in info.elms ) {
            let elm = info.elms[name];
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

    processingName = null;
}

function inputOperatorChanged(operator) {
    updateInputElmsEnabled(model.operators);
    updateFormPercent(model.operators, operator);
}

function inputOperatorPercentChanged(operator) {
    updateFormPercent(model.operators, operator);
}

function inputPatternChanged(pattern) {
    updateInputElmsEnabled(model.patterns);
    updateFormPercent(model.patterns, pattern);
}

function inputPatternPercentChanged(pattern) {
    updateFormPercent(model.patterns, pattern);
}

function balance(objs, name) {
    let info = collectInfoOfFormPercent(objs);
    let elmCount = Object.keys(info.elms).length;
    let value = Math.floor(PERCENT_TOTAL / elmCount);
    for ( let operator in info.elms ) {
        info.elms[operator].value = value;
    }
}

function operatorsBalanceClicked() {
    balance(model.operators);
}

function patternsBalanceClicked() {
    balance(model.patterns);
}


document.addEventListener("DOMContentLoaded", docLoaded)
