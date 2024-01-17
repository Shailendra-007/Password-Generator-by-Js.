const InputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copymsg = document.querySelector("[data-copymsg]");
const copybtn= document.querySelector("[data-copybtn]");
const upcaseCheck = document.querySelector("#uppercase");
const lwcaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const genratebtn = document.querySelector(".generateButton");
const indicator = document.querySelector("[data-indicator]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


const allCheckbox = document.querySelectorAll("input[type=checkbox]")


let password ="";
let passwordlength = 10;
let checkCount = 0;
// indicator color
setIndicator("#ccc");

handleSlider();

function handleSlider(){
        InputSlider.value = passwordlength;
        lengthDisplay.innerText = passwordlength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow

}

function getrndInteger( min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function getrndNumber(){
    return getrndInteger(0 , 9);
}

function genratelowercase(){
    return String.fromCharCode(getrndInteger(97 , 123));
}

function genrateuppercase(){
    return String.fromCharCode(getrndInteger(65 , 91));
}

function genratesymbols(){
    const random = getrndInteger(0 , symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upcaseCheck.checked) hasUpper = true;
    if(lwcaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    } catch (error) {
        copymsg.innerText = "Failed";
    }

    //
    copymsg.classList.add("active");

    setTimeout( () => {
        copymsg.classList.remove("active");
    },2000);
}

InputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copybtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
})


///////////////////////////
function handleCheckBox(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(checkCount > passwordlength){
        passwordlength = checkCount;
        handleSlider();
    }
}


allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
})

/////////

genratebtn.addEventListener('click' , ()=>{
    if(checkCount === 0) 
    return ;

    if(checkCount > passwordlength){
        passwordlength = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";

    // let put the count of checkbox
    // if(upcaseCheck.checked){
    //     password += genrateuppercase();
    // }
    // if(LwcaseCheck.checked){
    //     password += genratelowercase();
    // }
    // if(numberCheck.checked){
    //     password += getrndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += genratesymbols();
    // }

    console.log("Start");
    let funArr  = [];
    
    if(upcaseCheck.checked){
        funArr.push(genrateuppercase);
    }
    if(lwcaseCheck.checked){
        funArr.push(genratelowercase);
    }
    if(numberCheck.checked){
        funArr.push(getrndNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(genratesymbols);
    }

    // Compulsory addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }

    console.log("compulsory done ");

    // remaining addition 
    for (let i = 0; i < passwordlength - funArr.length; i++) {
        let random = getrndInteger(0 , funArr.length);
        password += funArr[random]();
    }

    console.log("remaining done ");
    // shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("Shuffling done ");

    passwordDisplay.value = password;

    console.log("UI done ");
    // calculate strength
    calcStrength();
})

function shufflePassword(array){
    // method: Fisher Yates method
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}