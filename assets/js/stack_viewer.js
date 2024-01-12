var sp_numbers;
var sp_operations;
var numberList;
var operationsList;
var opin;
// Operations
function op_sa()
{
    var firstDiv = $('#stack_a div:first');
    var secondDiv = $('#stack_a div:nth-child(2)');

    firstDiv.before(secondDiv);
    if (firstDiv.length && secondDiv.length)
        return (1);
    return (0);
}
function op_sb()
{
    var firstDiv = $('#stack_b div:first');
    var secondDiv = $('#stack_b div:nth-child(2)');

    firstDiv.before(secondDiv);
    if (firstDiv.length && secondDiv.length)
        return (1);
    return (0);
}

function op_ss()
{
    if (op_sa() && op_sb())
        return (1);
    return (0);
}

function op_pa()
{
    var firstDiv = $('#stack_b div:first');
    $("#stack_a").prepend(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}

function op_pb()
{
    var firstDiv = $('#stack_a div:first');
    $("#stack_b").prepend(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}
function op_ra()
{
    var firstDiv = $('#stack_a div:first');
    $('#stack_a').append(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}

function op_rb()
{
    var firstDiv = $('#stack_b div:first');
    $('#stack_b').append(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}
function op_rr()
{
    if (op_ra() && op_rb())
        return (1);
    return (0);
}

function op_rra()
{
    var firstDiv = $('#stack_a div:last');
    $('#stack_a').prepend(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}

function op_rrb()
{
    var firstDiv = $('#stack_b div:last');
    $('#stack_b').prepend(firstDiv);
    if (firstDiv.length)
        return (1);
    return (0);
}

function op_rrr()
{
    if (op_rra() && op_rrb())
        return (1);
    return (0);
}


// Get Numbers && Operations
function ps_split(str, sp)
{
    var separators;
    if (sp == '0')
        separators = [' ', ',', '\n'];
    else if (sp == '1')
        separators = [','];
    else if (sp == '2')
        separators = [' '];
    else if (sp == '3')
        separators = ['\n'];

    var regex = new RegExp(separators.join('|'), 'g');
    var splitStr = str.split(regex);
    return (splitStr);
}

function create_div(nbr)
{
    var dup = numberList.slice();
    var sorted_tab = dup.sort(function(a, b) {
        return a - b;
    });
    var newDiv = $('<div class="stack_node"></div>');
    newDiv.html(nbr);
    return (newDiv);
}
function makeList()
{
    var newList = [];
    ps_split(numberList, sp_numbers).forEach(function (nbr)
    {
        newList.push(parseInt(nbr));
    });

    operationsList = ps_split(operationsList, sp_operations);
    numberList = newList.filter(function(item) {
        return !isNaN(+item) && typeof item === 'number';
    });
}

function add_to_stack_a()
{
    numberList.forEach(function (nbr){
        $("#stack_a").append(create_div(nbr));
    });

}



function set_opview(index)
{
    if (index == 0)
    {
        $("#op_b").addClass("oprtHide");
        $("#op_e").text(operationsList[index]);
        if (index + 1 <= operationsList.length - 1)
            $("#op_n").text(operationsList[index + 1]);
        $("#opr_back").attr("disabled", true);
    }
    else
    {
        $("#op_b").removeClass("oprtHide");
        $("#opr_back").attr("disabled", false);

    }
    if (index == operationsList.length)
    {
        $("#op_n").addClass("oprtHide");
        $("#op_e").text(operationsList[index]);
        if (index - 1 > 0)
            $("#op_b").text(operationsList[index - 1]);
        $("#opr_next").attr("disabled", true);
    }
    else
    {
        $("#op_n").removeClass("oprtHide");
        $("#opr_next").attr("disabled", false);
    }
    if (index != 0 && index != operationsList.length - 1)
    {
        $("#op_b").text(operationsList[index - 1]);
        $("#op_e").text(operationsList[index]);
        $("#op_n").text(operationsList[index + 1]);
    }
}


// do opr
function do_opr(op)
{
    var rs;
    if (op == "sa")
        rs = op_sa();
    else if (op == "sb")
        rs = op_sb();
    else if (op == "ss")
        rs = op_ss();
    else if (op == "pa")
        rs = op_pa();
    else if (op == "pb")
        rs = op_pb();
    else if (op == "ra")
        rs = op_ra();
    else if (op == "rb")
        rs = op_rb();
    else if (op == "rr")
        rs = op_rr();
    else if (op == "rra")
        rs = op_rra();
    else if (op == "rrb")
        rs = op_rrb();
    else if (op == "rrr")
        rs = op_rrr();
}

function do_opr_rev(op)
{
    var rs;
    if (op == "sa")
        rs = op_sa();
    else if (op == "sb")
        rs = op_sb();
    else if (op == "ss")
        rs = op_ss();
    else if (op == "pa")
        rs = op_pb();
    else if (op == "pb")
        rs = op_pa();
    else if (op == "ra")
        rs = op_rra();
    else if (op == "rb")
        rs = op_rrb();
    else if (op == "rr")
        rs = op_rrr();
    else if (op == "rra")
        rs = op_ra();
    else if (op == "rrb")
        rs = op_rb();
    else if (op == "rrr")
        rs = op_rr();
}

// Clicks
$("#visualize").click(function ()
{
    $("#stack_a").html("");
    $("#stack_b").html("");
    $("#home_panel").hide();
    $("#visualize").hide();
    $("#back_to_panel").show();
    $("#vr_ps").show();
    sp_numbers = $("#sp_numbers").val();
    sp_operations = $("#sp_operations").val();
    numberList = $("#numberList").val();
    operationsList = $("#operationsList").val();
    makeList();
    set_opview(0);
    opin = 0;
    add_to_stack_a();
});

$("#opr_next").click(function() {
    do_opr(operationsList[opin]);
    opin++;
    set_opview(opin);
});

$("#opr_back").click(function() {
    opin--;
    do_opr_rev(operationsList[opin]);
    set_opview(opin);
});

$("#back_to_panel").click(function(){
    $("#back_to_panel").hide();
    $("#vr_ps").hide();
    $("#visualize").show();
    $("#home_panel").show();
});