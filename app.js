function init() {
    var result = 0;
    for (var i = 1; i <= 2660; i++) {
        numStr = i.toString();
        var count = (numStr.match(/10/g) || []).length;

        result += count;

    }
    console.log(result);
}

init();