var sp_numbers;
var sp_operations;
var numberList;
var operationsList;
var index;
var speed;

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

function get_time()
{
   var second = speed * 1000;
   return (second / operationsList.length);
}

function nbr_width(nbr)
{
   var dup = numberList.slice();
   var sorted_tab = dup.sort(function(a, b) {
      return a - b;
   });
   var width;
   width = ((sorted_tab.indexOf(nbr) + 1) / numberList.length) * 100;
   return (width);
}

function get_height()
{
   var count = 500 / numberList.length;
   return (count);
}

function makeList()
{
   if ($("#customize_speed").attr("is_auto") == "0")
   {
      speed = parseInt($("#speed_int").val());
   }else{
      speed = 6;
   }
   var newList = [];
   ps_split(numberList, sp_numbers).forEach(function (nbr)
   {
      newList.push(parseInt(nbr));
   });

   operationsList = ps_split(operationsList, sp_operations);
   numberList = newList.filter(function(item) {
      return !isNaN(+item) && typeof item === 'number';
   });

   return (numberList);
}
function getColorForNumber(n, min_number, max_number) {
   // Map the range from min_number to max_number to a range within the hue circle (0-360)
   var hue = ((n - min_number) / (max_number - min_number)) * 360;

   // Convert HSL to RGB, then to Hex. Keeping saturation and lightness constant.
   return hslToHex(hue, 100, 50); // Full saturation, 50% lightness
}

function hslToHex(h, s, l) {
   l /= 100;
   const a = s * Math.min(l, 1 - l) / 100;
   const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
   };
   return `#${f(0)}${f(8)}${f(4)}`;
}
function create_div(nbr)
{
   var dup = numberList.slice();
   var sorted_tab = dup.sort(function(a, b) {
      return a - b;
   });
   var newDiv = $('<div></div>');
   newDiv.css({
      'width': nbr_width(nbr) + '%',
      'height': get_height() + 'px',
      'background-color': getColorForNumber(nbr, sorted_tab[0], sorted_tab[sorted_tab.length - 1])
   });
   return (newDiv);
}

function do_op(op)
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
   console.log(op + " : " + rs);
}

function appendNumber() {
   if (index < operationsList.length) {
      do_op(operationsList[index])// Append the number to the div
      index++;
      setTimeout(appendNumber, get_time()); // Wait 100ms (0.1 second) before appending the next number
   }
}
function add_to_stack_a()
{
   numberList.forEach(function (nbr){
      $("#stack_a").append(create_div(nbr));
   });
   index = 0;
   appendNumber();
}

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
   add_to_stack_a();
});


$("#back_to_panel").click(function(){
   $("#back_to_panel").hide();
   $("#vr_ps").hide();
   $("#visualize").show();
   $("#home_panel").show();
});


$(document).ready(function (){
   $("#operationsList").attr("placeholder", "ra\npb\nsa\n..");
});

$("#customize_speed").click(function (){
   if ($(this).attr("is_auto") == "1")
   {
      $(this).attr("is_auto", 0);
      $(this).text("Auto");
      $("#speed_int").val(6);
      $("#speed_int").attr("disabled", false);
   }else{
      $(this).attr("is_auto", 1);
      $(this).text("Customize");
      $("#speed_int").val("");
      $("#speed_int").attr("disabled", true);
   }
});