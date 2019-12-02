/** A bunch of functions for very basic and commonly needed tasks. 

Dependencies: none  */




/** Function to throw an error message, if a certain condition doesn't hold */
function rsAssert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}