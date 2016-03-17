operator = undefined;
num1str = undefined;
num2str = undefined;
operationEnd = true;

NUM_KEYS = {'48': '#btn0', '49': '#btn1', '50': '#btn2', '51': '#btn3', '52': '#btn4',
            '53': '#btn5', '54': '#btn6', '55': '#btn7', '56': '#btn8', '57': '#btn9',
            '47': '#btndiv', '42': '#btnmult', '45': '#btnminus', '43': '#btnplus',
            '13': '#btneq', '46': '#btndot', '8': '#del1'};

$(document).ready(function(){
    $('#display1').focus(function(){
        this.selectionStart = this.selectionEnd = this.value.length;
    });

    $(document).keypress(function(event){
        if (event.which in NUM_KEYS){
            event.preventDefault();
            $(NUM_KEYS[event.which]).addClass('button-active');
            setTimeout(function(){$(NUM_KEYS[event.which]).removeClass('button-active')}, 100);
            $(NUM_KEYS[event.which]).trigger('click');

        }
    });

    function writeOnDisplay(dispNum, text, concat){
        if (concat){
            $('#display' + dispNum).val($('#display' + dispNum).val() + text);
        }else {
            $('#display' + dispNum).val(text);
        }
        $('#display' + dispNum).focus();
    }

    function convertToNumber(numStr){
        if (numStr.split('.').length > 1){
            return parseFloat(numStr);
        } else if (numStr == 'π') {
            return Math.PI;
        } else {
            return parseInt(numStr);
        }

    }

    function calculate(){
        if (!num1str || !num2str || !operator)
            return "Error"
        var num1 = convertToNumber(num1str),
            num2 = convertToNumber(num2str);
        switch (operator) {
            case '+':
                return num1 + num2;
                break;
            case '-':
                return num1 - num2;
                break;
            case 'x':
                return num1 * num2;
                break;
            case '÷':
                return num1 / num2;
                break;
            default:
                return "Wrong operand";
        }
    }

    function deleteLastChar(dispNum){
        var withoutLast = $('#display' + dispNum).val().slice(0, -1);
        if (withoutLast == $('#display' + dispNum).val())
            return false;
        $('#display' + dispNum).val(withoutLast);
        return true;
    }

    function endInOperator(text){
        return ['+', '-', 'x', '÷'].includes(text.substr(-1));
    }

    function calculateOperation(){
        num2str = $('#display1').val();
        var result = calculate();
        writeOnDisplay(dispNum=1, text=result, concat=false);
        writeOnDisplay(dispNum=2, text=num2str+" = "+result, concat=true);
        num1str = num2str = operator = undefined;
        operationEnd = true;
    }

    $('.number').click(function(event){
        if (operationEnd){
            writeOnDisplay(dispNum=2, text="", concat=false);
            writeOnDisplay(dispNum=1, text="", concat=false);
            operationEnd = false;
        }
        if (operator != undefined && num2str == undefined){ // Clear the display with the new number
            writeOnDisplay(dispNum=1, text=$(this).html(), concat=false);
            num2str = $(this).html();
        } else {
            writeOnDisplay(dispNum=1, text=$(this).html(), concat=true);
        }
    });

    $('.operation').click(function(event){
        if (operator){ // If there is already an operator...
            if (!num2str){
                operator = $(this).html();
                deleteLastChar(dispNum=2);
                writeOnDisplay(dispNum=2, text=operator, concat=true);
            } else {
                calculateOperation();
                operator = $(this).html();
                writeOnDisplay(dispNum=2, text=operator, concat=true);
                num1str = $('#display1').val();
            }
        } else {
            num1str = $('#display1').val();
            operator = $(this).html();
            writeOnDisplay(dispNum=2, text=num1str + $(this).html(), concat=false);
        }
        operationEnd = false;
    });

    $('.result').click(calculateOperation);

    $('#delAll').click(function(event){
        num1str = num2str = operator = undefined;
        writeOnDisplay(dispNum=2, text="", concat=false);
        writeOnDisplay(dispNum=1, text="", concat=false);
    });

    $('#del1').click(function(event){
        if (operator != undefined && num2str == undefined)
            return false; // no character can be deleted
        // Delete from display 2 if on display 1 has been deleted
        if (deleteLastChar(dispNum=1)){
            deleteLastChar(dispNum=2);
        }
    });

    $('#signo').click(function(event){
        if($('#display1').val().substr(0, 1) == '-'){
            writeOnDisplay(dispNum=1, text=$('#display1').val().substr(1), concat=false);
        } else {
            writeOnDisplay(dispNum=1, text="-"+$('#display1').val(), concat=false);
        }
    });
});
