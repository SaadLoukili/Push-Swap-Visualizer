var type_rand = 1;
function gen_list(rand_min, rand_max)
{
    var rs = [];
    while (rand_min <= rand_max)
    {
        rs.push(rand_min);
        rand_min++;
    }
    return (rs);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function consecutive_numbers()
{
    var rand_min = parseInt($("#rand_min").val());
    var rand_max = parseInt($("#rand_max").val());
    var listnum = shuffleArray(gen_list(rand_min, rand_max));
    for(i=0;i<listnum.length;i++)
    {
        $("#randomNumber").append(listnum[i] + " ");
    }
}
function random_number()
{
    var rand_quantity = parseInt($("#rand_quantity").val());
    var czero = $("#rand_quantity").val().length;
    if (czero == 1)
        czero = 2;
    czero = Math.pow(10, (czero - 1)) * 9.9;

    var listnum = shuffleArray(gen_list(czero * -1, czero));
    for(i=0;i<listnum.length;i++)
    {
        $("#randomNumber").append(listnum[i] + " ");
    }
}
$("#gen_random").click(function (){
    $("#randomNumber").text("");
    if (type_rand == 1)
       consecutive_numbers();
   else
        random_number();
});
$("#random_rand").click(function(){
    $("#randomNumber").text("");
    type_rand = 2;
});
$("#consecutive_rand").click(function(){
    $("#randomNumber").text("");
    type_rand = 1;
});