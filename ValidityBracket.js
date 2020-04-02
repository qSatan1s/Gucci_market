function validBrackets(couples) {
    const brackets = ["(", "{", "["];
    const brackets_2 = ["()", "{}", "[]"];
    var valid = "";
    var i = 0
    var arr = []
    while (i != couples) {

        random_brackets = brackets[(Math.floor(Math.random() * 2))]
        if (random_brackets == "(") {
            i = i + 2
            qwe = brackets_2[(Math.floor(Math.random() * 2))]
            valid = valid + random_brackets + qwe + ") ";
        }


        if (random_brackets == "{") {
            i++
            valid = valid + random_brackets + "} "
        }

        if (random_brackets == "[") {
            valid = valid + random_brackets + "] "
            i++
        }

    }
    arr.push(valid)
    console.log(arr)


    let startBrackets = ['{', '(', '[', '<'];
    let endBrackets = ['}', ')', ']', '>'];


    function isBracketsValid(value) {
        let temp = [];
        for (let index = 0; index < value.length; index++) {
            const element = value[index];

            if (startBrackets.includes(element)) {
                temp.push(element);
            }

            if (endBrackets.includes(element)) {
                let endBracketIndex = endBrackets.findIndex(el => el === element);
                if (temp[temp.length - 1] === startBrackets[endBracketIndex]) {
                    temp.pop();
                } else {
                    temp.push(element);
                }
            }
        }
        return !temp.length ? 'true' : 'nope'
    }

    console.log(isBracketsValid(arr));


}