//Verifies if a string has numbers, returns true if positive
window.hasNumbers = function (value) {

}//Verifies if a string is a number, returns true if positive
window.isNumber = function (value) {
    var matches = value.match(/\d+/g);
    if (matches != null) {
        return true;
    } else {
        return false;
    }
}

//Verifies if a string is a number, returns true if positive
window.isEmpty = function (elem) {
    return $(elem).val() != null && $(elem).val().length == 0;
}
