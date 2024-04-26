function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
function ps_split(str, sp = 0, type = 0)
{
    const valid_operations = ['sa', 'sb', 'ss', 'pa', 'pb', 'ra', 'rb', 'rr', 'rra', 'rrb', 'rrr'];
    const separators = [
        [' ', ',', '\n'],
        [','],
        [' '],
        ['\n']
    ];
    const regex = new RegExp(separators[sp].join('|'), 'g');
    const splitStr = str.split(regex);
    const result = [];
    splitStr.forEach(value => {
        if (type === 0 && isNumeric(value))
            result.push(parseInt(String(value)));
        else if (type === 1 && valid_operations.includes(value))
            result.push(value);
    })
    return (result);
}

function read_file(from, to)
{
    const inputFile = document.getElementById(from);
    const output = document.getElementById(to);
    inputFile.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the selected file
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            output.value = event.target.result;
        });
        reader.readAsText(file);
    });

}

read_file('numbersFile', 'numbersList');
read_file('operationsFile', 'operationsList');