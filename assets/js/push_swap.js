let ps_errors = [];
const stack_a = document.getElementById('stack_a');
const stack_b = document.getElementById('stack_b');
let sortedTab = [];
let operationsList = [];
let numbersList = [];
let index = 0;
let playerSpeed = 50;
let playerStart = 0;
let psType = 1;

function op_swap(stack)
{
    const firstDiv = stack.querySelector('div:first-child');
    const secondDiv = stack.querySelector('div:nth-child(2)');

    if (firstDiv && secondDiv)
    {
        stack.insertBefore(secondDiv, firstDiv);
        return (1);
    }
    return (0);
}

function op_push(from, to)
{
    const firstDiv = from.querySelector('div:first-child');
    if (!firstDiv)
        return (0);
    to.prepend(firstDiv);
    return (1);
}
function op_rotate(stack)
{
    const firstDiv = stack.querySelector('div:first-child');
    if (!firstDiv)
        return (0);
    stack.append(firstDiv);
    return (1);
}
function op_reverse_rotate(stack)
{
    const lastDiv = stack.querySelector('div:last-child');
    if (!lastDiv)
        return (0);
    stack.prepend(lastDiv);
    return (1);
}

function op_sa()
{
    if(!op_swap(stack_a))
    {
        ps_errors.push({"op": "sa", "index": index, "error": "swap_a"});
        return (0);
    }
    return (1);
}

function op_sb()
{
    if(!op_swap(stack_b))
    {
        ps_errors.push({"op": "sb", "index": index, "error": "swap_b"});
        return (0);
    }
    return (1);
}

function op_ss()
{
    if (!op_swap(stack_a) || !op_swap(stack_b))
    {
        ps_errors.push({"op": "ss", "index": index, "error": "swap_ab"});
        return (0);
    }
    return (1);
}

function op_pa()
{
    if (!op_push(stack_b, stack_a))
    {
        ps_errors.push({"op": "pa", "index": index, "error": "push_a"});
        return (0);
    }
    return (1);
}
function op_pb()
{
    if (!op_push(stack_a, stack_b))
    {
        ps_errors.push({"op": "pb", "index": index, "error": "push_b"});
        return (0);
    }
    return (1);
}
function op_ra()
{
    if (!op_rotate(stack_a))
    {
        ps_errors.push({"op": "ra", "index": index, "error": "rotate_a"});
        return (0);
    }
    return (1);
}

function op_rb()
{
    if (!op_rotate(stack_b))
    {
        ps_errors.push({"op": "rb", "index": index, "error": "rotate_b"});
        return (0);
    }
    return (1);
}

function op_rr()
{
    if (!op_rotate(stack_a) || !op_rotate(stack_b))
    {
        ps_errors.push({"op": "rr", "index": index, "error": "r_ab"});
        return (0);
    }
    return (1);
}
function op_rra()
{
    if (!op_reverse_rotate(stack_a))
    {
        ps_errors.push({"op": "rra", "index": index, "error": "rr_a"});
        return (0);
    }
    return (1);
}

function op_rrb()
{
    if (!op_reverse_rotate(stack_b))
    {
        ps_errors.push({"op": "rrb", "index": index, "error": "rr_b"});
        return (0);
    }
    return (1);
}

function op_rrr()
{
    if (!op_reverse_rotate(stack_a) || !op_reverse_rotate(stack_b))
    {
        ps_errors.push({"op": "rrr", "index": index, "error": "rr_ab"});
        return (0);
    }
    return (1);
}
function logicChecker() {
    if (index - 1 < 0) {
        return 1;
    }

    const firstOp = operationsList[index - 1];
    const secondOp = operationsList[index];

    // Rule Definitions
    const errorRules = [
        { ops: ["sa", "sa"], error: "dup_sa" },
        { ops: ["sb", "sb"], error: "dup_sb" },
        { ops: ["ss", "ss"], error: "dup_ss" },
        { ops: ["pa", "pb"], error: "rev_pb" }, // Assuming 'rev_pb' means pb after pa
        { ops: ["pb", "pa"], error: "rev_pa" },
        { ops: ["ra", "rra"], error: "rev_rra" },
        { ops: ["rra", "ra"], error: "rev_ra" },
        { ops: ["rb", "rrb"], error: "rev_rrb" },
        { ops: ["rrb", "rb"], error: "rev_rb" },
        { ops: ["rr", "rrr"], error: "rev_rrr" },
        { ops: ["rrr", "rr"], error: "rev_rr" },
    ];

    // Check for matches
    for (const rule of errorRules) {
        if (firstOp === rule.ops[0] && secondOp === rule.ops[1]) {
            ps_errors.push({"op": secondOp, "index": index, "error": rule.error});
            break; // Found a match, no need to check other rules
        }
    }
    return 0;
}

function cleanStack()
{
    stopPlayer();
    operationsList = [];
    index = 0;
    sortedTab = [];
    document.getElementById('stack_a').innerHTML = '';
    document.getElementById('stack_b').innerHTML = '';
    document.getElementById('home_panel').style.display = 'none';
    document.getElementById('visualize').style.display = 'none';
    document.getElementById('back_to_panel').removeAttribute('style');
    document.getElementById('gen_report').removeAttribute('style');
    document.getElementById('vr_ps').removeAttribute('style');
}

function pushSwapChecker()
{
    const numbersSp = document.getElementById('sp_numbers').value;
    const operationsSp = document.getElementById('sp_operations').value;
    const numbersVal = document.getElementById('numbersList').value;
    const operationsVal = document.getElementById('operationsList').value;
    numbersList = ps_split(numbersVal, numbersSp, 0);
    operationsList = ps_split(operationsVal, operationsSp, 1);
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

function getColorForNumber(n, min_number, max_number) {
    const hue = ((n - min_number) / (max_number - min_number)) * 360;
    return hslToHex(hue, 100, 50);
}
function createVisualizerDiv(nbr)
{
    const newDiv = document.createElement( 'div' );
    const height = (500 / numbersList.length);
    const width  = ((sortedTab.indexOf(nbr) + 1) / numbersList.length) * 100;
    newDiv.style.width = width + '%';
    newDiv.style.height = height + 'px';
    newDiv.style.backgroundColor = getColorForNumber(nbr, sortedTab[0], sortedTab[sortedTab.length - 1]);
    return (newDiv);
}

function createViewerDiv(nbr)
{
    const newDiv = document.createElement( 'div' );
    newDiv.classList.add('stack_node');
    newDiv.innerText = nbr;
    return (newDiv);
}

function setStackA(type)
{
    document.getElementById('stackATitle').innerText = 'Stack A (' + sortedTab.length + ')';
    document.getElementById('stackBTitle').innerText = 'Stack B (0)';
    document.getElementById('operationsTitle').innerText = 'Operations ('+ operationsList.length +')';
    numbersList.forEach(value => {
        if (type === 1)
            stack_a.appendChild(createVisualizerDiv(value));
        else
            stack_a.appendChild(createViewerDiv(value));
    });
}

function setSortedTab()
{
    const dup = numbersList.slice();
    sortedTab = dup.sort(function (a, b) {
        return a - b;
    });
}

function do_op(op, rev = 0)
{
    const operations = {
        "sa": op_sa,
        "sb": op_sb,
        "ss": op_ss,
        "pa": op_pa,
        "pb": op_pb,
        "ra": op_ra,
        "rb": op_rb,
        "rr": op_rr,
        "rra": op_rra,
        "rrb": op_rrb,
        "rrr": op_rrr
    };
    const operationsRev = {
        "sa": op_sa,
        "sb": op_sb,
        "ss": op_ss,
        "pa": op_pb,
        "pb": op_pa,
        "ra": op_rra,
        "rb": op_rrb,
        "rr": op_rrr,
        "rra": op_ra,
        "rrb": op_rb,
        "rrr": op_rr
    };
    if (rev === 0 && operations[op]) {
        operations[op]();
        return;
    }else if(rev === 1 && operationsRev[op]) {
        operationsRev[op]();
        return;
    }
    console.error(`Invalid operation: ${op}`);
}

function viewChange()
{
    document.getElementById('stackATitle').innerText = 'Stack A (' + stack_a.getElementsByTagName('div').length + ')';
    document.getElementById('stackBTitle').innerText = 'Stack B (' + stack_b.getElementsByTagName('div').length + ')';
    const ps_next = document.getElementById('ps_next');
    const ps_back = document.getElementById('ps_back');
    const op_n = document.getElementById('op_n');
    const op_e = document.getElementById('op_e');
    const op_b = document.getElementById('op_b');
    if (index + 1 >= operationsList.length)
        op_n.style.display = 'none';
    else
    {
        op_n.innerText = operationsList[index + 1];
        op_n.style.display = 'block';
    }
    if (index === operationsList.length)
    {
        ps_next.setAttribute('disabled', true);
        op_e.innerText = "Finished";
        replay_button();
    }
    else
    {
        ps_next.removeAttribute('disabled');
        op_e.innerText = operationsList[index];
    }
    if (index - 1 < 0)
    {
        ps_back.setAttribute('disabled', true);
        op_b.style.display = 'none';
    }
    else
    {
        ps_back.removeAttribute('disabled');
        op_b.innerText = operationsList[index - 1];
        op_b.style.display = 'block';
    }
}

function next_op(saveReport = 0)
{
    if (index >= operationsList.length)
        return ;
    if (saveReport === 1)
        logicChecker();
    do_op(operationsList[index]);
    index++;
    viewChange();
}
function back_op(saveReport = 0)
{
    const newIndex = index - 1;
    if (newIndex < 0)
        return ;
    if (saveReport === 1)
        logicChecker();
    do_op(operationsList[newIndex], 1);
    index--;
    viewChange();
}

function getReport()
{
    ps_errors = [];
    const controls = [
        document.getElementById('move_int'),
        document.getElementById('ps_back'),
        document.getElementById('ps_next'),
        document.getElementById('speed_int'),
        document.getElementById('ps_player')
    ];
    controls.forEach(control => control.setAttribute("disabled", "true"));

    psVisualize(psType);
    startPlayer_set();
    startPlayer(0);
    psVisualize(psType);
    startPlayer_set();
    stopPlayer();
    controls.forEach(control => control.removeAttribute("disabled"));
}

function generate_error(err) {
    const errorMessages = {
        "dup_sa": "Double swap on Stack A is unnecessary. This has no effect; consider removing the repeated 'sa' operations.",
        "dup_sb": "Double swap on Stack B is unnecessary. This has no effect; consider removing the repeated 'sb' operations.",
        "dup_ss": "Double swap between Stack A and Stack B is unnecessary. This has no effect; consider removing the repeated 'ss' operations.",
        "rev_pb": "Unnecessary element move between Stack A and Stack B. Pushing from A to B and back to A has no net effect. Consider simplifying.",
        "rev_pa": "Unnecessary element move between Stack B and Stack A. Pushing from B to A and back to B has no net effect. Consider simplifying.",
        "rev_rra": "Redundant rotate and reverse-rotate on Stack A. These operations cancel each other out. Consider removing one.",
        "rev_rrb": "Redundant rotate and reverse-rotate on Stack B. These operations cancel each other out. Consider removing one.",
        "rev_ra": "Redundant reverse-rotate and rotate on Stack A. These operations cancel each other out. Consider removing one.",
        "rev_rb": "Redundant reverse-rotate and rotate on Stack B. These operations cancel each other out. Consider removing one.",
        "rev_rrr": "Redundant rotations and reverse rotations. These operations have no net effect on the stacks. Consider simplifying.",
        "rev_rr": "Redundant reverse rotations. These operations have no net effect on the stacks. Consider simplifying.",
        "swap_a": "The swap operation (sa) requires at least two element on Stack A. Please ensure it's not empty before attempting a swap.",
        "swap_b": "The swap operation (sb) requires at least two element on Stack B. Please ensure it's not empty before attempting a swap.",
        "swap_ab": "The swap operation (ss) requires at least two element on Stack A & Stack B. Please ensure it's not empty before attempting a swap.",
        "push_a": "The Push To Stack A (pa) operation requires an element from Stack B to push to Stack A. Please ensure Stack B is not empty.",
        "push_b": "The Push To Stack B (pb) operation requires an element from Stack A to push to Stack B. Please ensure Stack A is not empty.",
        "rotate_a": "The rotate operation (ra) requires at least two element on Stack A. Please add elements to Stack A before attempting to rotate.",
        "rotate_b": "The rotate operation (rb) requires at least two element on Stack B. Please add elements to Stack B before attempting to rotate.",
        "r_ab": "The rotate operation (rr) requires at least two element on Stack A & Stack B. Please add elements to Stack A & Stack B before attempting to rotate.",
        "rr_a": "The reverse rotate operation (rra) requires at least two element on Stack A. Please add elements to Stack A before attempting to reverse rotate.",
        "rr_b": "The reverse rotate operation (rrb) requires at least two element on Stack B. Please add elements to Stack B before attempting to reverse rotate.",
        "rr_ab": "The reverse rotate operation (rrr) requires at least two element on Stack A & Stack B. Please add elements to Stack A & Stack B before attempting to reverse rotate."
    };

    let htmlErr = "<div>";
    htmlErr += "<b class='text-danger'>OP:  (" + err['index'] + ") " + err['op'] + "</b> ";

    // Look up the message directly
    if (err['error'] in errorMessages) {
        htmlErr += errorMessages[err['error']];
    } else {
        htmlErr += "Unknown error type."; // Handle unknown errors
    }

    htmlErr += "<br><hr>";
    return htmlErr;
}

function genReport()
{
    const reportModalBody = document.getElementById('reportModalBody');
    const reportModal = new bootstrap.Modal(document.getElementById('reportModal'), {
        keyboard: false
    })
    let htmlRs = "";
    reportModalBody.innerText = "";
    getReport();
    reportModal.show();
    ps_errors.forEach(error => {
        htmlRs += generate_error(error);
    });
    if (ps_errors.length === 0)
        htmlRs = "<p>No error found.</p>";
    reportModalBody.innerHTML = htmlRs;
}
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function replay_button()
{
    const ps_player = document.getElementById('ps_player');
    ps_player.classList.remove("bg-danger");
    ps_player.classList.remove("bg-success");
    ps_player.classList.add("bg-primary");
    ps_player.innerText = "Replay";
    ps_player.setAttribute('is_started', '2');
}

function startPlayer(genReport = -1)
{
    if (genReport === -1)
    {
        sleep(playerSpeed).then(() => {
            next_op();
            if (index === operationsList.length)
            {
                replay_button();
                return ;
            }
            if (playerStart === 1)
                startPlayer();
        });
    }
    else
    {
        while (index < operationsList.length)
        {
            next_op(1);
        }
    }
}

function stopPlayer()
{
    const ps_player = document.getElementById('ps_player');
    ps_player.setAttribute('is_started', '0');
    ps_player.innerText = 'start';
    ps_player.classList.add('bg-success');
    ps_player.classList.remove('bg-danger');
    playerStart = 0;
}

function psVisualize(type)
{
    psType = type;
    cleanStack();
    pushSwapChecker();
    setSortedTab();
    setStackA(type);
    viewChange();
}

document.getElementById('back_to_panel').onclick = function ()
{
    document.getElementById('back_to_panel').style.display = 'none';
    document.getElementById('gen_report').style.display = 'none';
    document.getElementById('vr_ps').style.display = 'none';
    document.getElementById('visualize').removeAttribute('style');
    document.getElementById('home_panel').removeAttribute('style');
}

document.getElementById('ps_next').onclick = function ()
{
    let i = parseInt(document.getElementById('move_int').value);
    while (i-- > 0)
        next_op();
}

document.getElementById('ps_back').onclick = function ()
{
    let i = parseInt(document.getElementById('move_int').value);
    while (i-- > 0)
        back_op();
}

function startPlayer_set()
{
    const ps_player = document.getElementById('ps_player');
    ps_player.setAttribute('is_started', '1');
    ps_player.classList.add('bg-danger');
    ps_player.classList.remove('bg-success');
    ps_player.innerText = 'stop';
    playerStart = 1;
}

document.getElementById('ps_player').onclick = function(){
    const ps_player = document.getElementById('ps_player');
    if (ps_player.getAttribute('is_started') === '1')
    {
        stopPlayer();
    }
    else if (ps_player.getAttribute('is_started') === '2')
    {
        psVisualize(psType);
        startPlayer_set();
        startPlayer();
    }
    else
    {
        startPlayer_set();
        startPlayer();
    }
};

document.getElementById('speed_int').onchange = function ()
{
    playerSpeed = parseInt(document.getElementById('speed_int').value);
}

document.getElementById('gen_report').onclick = function()
{
    genReport();
}