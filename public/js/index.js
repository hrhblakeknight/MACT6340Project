"use strict";

(() => { 
    
    document.querySelector("#testButton").addEventListener("click", handleClick); 
function handleClick() {
    console.group("Thank you for clicking.");
}
})();