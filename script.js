//Szakál Kristóf
//DYY0E5
//SET

//BUTTONS
const startButton = document.querySelector("#startButton");
const rulesButton = document.querySelector("#rulesButton");
const backToMenuButton = document.querySelector("#back");
const playersButton = document.querySelector("#playersN");
const backFromPlayersButton = document.querySelector("#OK");
const settingsButton = document.querySelector("#settings");
const backFromSettingsButton = document.querySelector("#backFromSettings");
const gameModeButton = document.querySelector("#gameMode");
const backFromGM = document.querySelector("#backFromGM");
const radioNoob = document.querySelector("#noob");
const isThereASetButton = document.querySelector("#isThereASetButton");
const setShowButton = document.querySelector("#setShowButton");
const plusThreeButton = document.querySelector("#plusThreeButton");
const actualPlayers = document.querySelector("#actualPlayers");
const yesSpan = document.querySelector("#yesSpan");
const player1Selector = document.querySelector("#player1");
const player1Points = document.querySelector("#player1Points");

//DIVS
const menuDiv = document.querySelector("#menu");
const gameDiv = document.querySelector("#game");
const rulesDiv = document.querySelector("#rules");
const playersNDIV = document.querySelector("#playersIn");
const settingsDiv = document.querySelector("#settingsPage");
const gameModeDiv = document.querySelector("#gameModeSettings");
const playersList = document.querySelector("#playersList");
const deckDiv = document.querySelector("#deck");
const buttonsDiv = document.querySelector("#buttons");
const everyThing = document.querySelector("#everything");

//INPUTS
const playersNumInput = document.querySelector("#PNI");
const isThereASet = document.querySelector("#isThereASet");
const setShow = document.querySelector("#setShow");
const plusThree = document.querySelector("#plusThree");

//EVENTLISTENERS
startButton.addEventListener("click", startGame);
rulesButton.addEventListener("click",showRules);
backToMenuButton.addEventListener("click",backRules);
playersButton.addEventListener("click",players)
backFromPlayersButton.addEventListener("click", backPlayers);
settingsButton.addEventListener("click", settings);
backFromSettingsButton.addEventListener("click",backSettings);
gameModeButton.addEventListener("click",gameMode);
backFromGM.addEventListener("click",backGM);
playersNumInput.addEventListener("change",makePlayerNames);
isThereASetButton.addEventListener("click", isThereASetButtonHandler);
setShowButton.addEventListener("click", setShowButtonHandler);

//GLOBAL VARIABLES
let playersNUM = 1;
let playersNames = new Array();
let chosenGameMode = "noob";
let isThereASetFinal = false;
let setShowFinal = false;
let plusThreeFinal = false;

let shapes = ["ovalis", "hullamos", "rombusz"];
let colors = ["piros", "zold", "lila"];
let numbers = ["1","2","3"];
let deck = new Array();
let cardsOnTable = [];

///GENERATE + SHUFFLE DECK
function generateDeck(){
    for(let i = 0; i < shapes.length; i++){
        for(let j = 0; j < colors.length; j++){
            for(let k = 0; k < numbers.length; k++){
                let card = {Number: numbers[k], Color: colors[j], Shape: shapes[i]};
                deck.push(card);
            }
        }
    }
}

function shuffleDeck(shuffleDeck){
    for(let i = 0; i < 1000; i++){
        let loc1 = Math.floor((Math.random() * shuffleDeck.length));
        let loc2 = Math.floor((Math.random() * shuffleDeck.length));
        let temp = shuffleDeck[loc1];
        shuffleDeck[loc1] = shuffleDeck[loc2];
        shuffleDeck[loc2] = temp;
    }
}
 

///FIRST 12 CARDS (3x4)
let table = document.createElement("TABLE");
let szamlalo = 0;

function takeFirst12(){
    deckDiv.appendChild(table);
    while(szamlalo < 12){
        for (let i = 0; i < 4; i++) {
            let newTr = document.createElement("TR");
            table.appendChild(newTr);
            for (let j = 0; j < 3; j++) {
                let actualCard = deck[szamlalo];
                cardsOnTable.push(actualCard);

                let newTD = document.createElement("TD");
                newTr.appendChild(newTD);
                
                let actFileName = "icons/" + cardsOnTable[szamlalo].Number + cardsOnTable[szamlalo].Color + cardsOnTable[szamlalo].Shape + ".svg";
                let newImg = document.createElement("IMG");
                newImg.src = actFileName;
                newImg.classList.add("rotate90");
                newTD.appendChild(newImg);
                szamlalo++;
            }

        }
        
    }
    
}


delegate(table, "click", "img", selectCard);

//CARD SELECTION
let selectedList = new Array();
let selectedCardImages = new Array();
let pickedNum = 0;
let szam = 0;

function selectCard(e){
    if(e.target.matches('img')){
        let i = e.target.parentElement.parentElement.rowIndex;
        let j = e.target.parentElement.cellIndex;
        let index = i * 3 + j;
        if(!e.target.classList.contains('selected')){
            e.target.classList.remove('showed');
            e.target.classList.add('selected');
            szam = 0;
            while(szam < selectedList.length){
                if(selectedList[szam] === undefined){
                    selectedList[szam] = cardsOnTable[index];
                    break;
                }
                szam++;
            }
            if(szam === selectedList.length){
                selectedList.push(cardsOnTable[index])
                selectedCardImages.push(e.target);
            }
            pickedNum++;
        }else{
            for(let i = 0; i < selectedList.length; i++){
                if(cardsOnTable[index] === selectedList[i]){
                    e.target.classList.remove('selected');
                    selectedList[i] = undefined;
                    selectedCardImages[i] = undefined;
                }
            }
            pickedNum--;
        }
    }

    //SET
    if(pickedNum == 3){
        let a = isItASet(selectedList[0],selectedList[1],selectedList[2]);
        if(a){
            setAlert("Helyes Set volt! :)",1000);
            player1Points.innerText = parseInt(player1Points.innerText) + 1;
        }else{
            setAlert("NEM volt Set! :(",1000);
            player1Points.innerText = parseInt(player1Points.innerText) - 1;
        }

        //console.log("Set: " + a);
        
        if(a){
            if(szamlalo < deck.length){
                for(let i = 0; i < 3; i++){
                    let cardIndex = cardsOnTable.indexOf(selectedList[i]);
                    cardsOnTable[cardIndex] = deck[szamlalo];
                    szamlalo++;
                    table.rows[parseInt(cardIndex / 3)].cells[parseInt(cardIndex % 3)].querySelector("img").src = "icons/" + cardsOnTable[cardIndex].Number + cardsOnTable[cardIndex].Color + cardsOnTable[cardIndex].Shape + ".svg";
                }
            }else{
                for(let i = 0; i < 3; i++){ 
                    let cardIndex = cardsOnTable.indexOf(selectedList[i]);
                    if(szamlalo < 27 && endGame()){
                        cardsOnTable[cardIndex] = undefined;
                        table.rows[parseInt(cardIndex / 3)].cells[parseInt(cardIndex % 3)].querySelector("img").src = "icons/" + cardsOnTable[cardIndex].Number + cardsOnTable[cardIndex].Color + cardsOnTable[cardIndex].Shape + ".svg"; 
                    }else{
                        cardsOnTable[cardIndex] = undefined;
                        table.rows[parseInt(cardIndex / 3)].cells[parseInt(cardIndex % 3)].querySelector("img").src = "";
                        
                    }
                }
            }
        }

        for(let i = 0; i < 3; i++){
            selectedList[i] = undefined;
        }

        for (let i = 0, row; row = table.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                col.childNodes[0].classList.remove('selected');
            }  
         }

        pickedNum = 0;
    }

    if(szamlalo === 27 && !endGame()){
        alert("Vége a játéknak! Végső pont: " + player1Points.innerText);
        console.log("Vege a jateknak!");

        ///End of the game
        console.log("Sajnos új játékot nem lehet kezdeni, csak reload után!")
    }
}

function setAlert(msg,d){
     let el = document.createElement("div");
     el.setAttribute("style","font-size:4em; padding-top: 300px;");
     el.innerHTML = msg;
     setTimeout(function(){
      el.parentNode.removeChild(el);
      deckDiv.hidden = false;;
     },d);
     gameDiv.appendChild(el);
     deckDiv.hidden = true;
    }


///DECIDE IF THE SELECTED ONES ARE A SET
function isItASet(c1,c2,c3){
    let l = (c1.Number === c2.Number && c1.Number === c3.Number && c2.Number === c3.Number) || (c1.Number !== c2.Number && c1.Number !== c3.Number && c2.Number !== c3.Number);
    l = l && ((c1.Color === c2.Color && c1.Color === c3.Color && c2.Color === c3.Color) || (c1.Color !== c2.Color && c1.Color !== c3.Color  && c2.Color !== c3.Color));
    l = l && ((c1.Shape === c2.Shape  && c1.Shape  === c3.Shape && c2.Shape  === c3.Shape) || (c1.Shape  !== c2.Shape  && c1.Shape  !== c3.Shape  && c2.Shape !== c3.Shape));
    return l;
}


function showMeASet(show){
    for(let i = 0; i < cardsOnTable.length-2; i++){
        if(cardsOnTable[i] === undefined){continue;}
        for(let j = 1; j < cardsOnTable.length-1; j++){
            if(i === j || cardsOnTable[j] === undefined){continue;}
            for(let k = 2; k < cardsOnTable.length; k++){
                if(i === j && i === k || cardsOnTable[k] === undefined){continue;}
                let temp = isItASet(cardsOnTable[i],cardsOnTable[j],cardsOnTable[k]);
                if(temp){
                    if(show){
                        table.rows[parseInt(i/3)].cells[parseInt(i%3)].querySelector("img").classList.add("showed");
                        table.rows[parseInt(j/3)].cells[parseInt(j%3)].querySelector("img").classList.add("showed");
                        table.rows[parseInt(k/3)].cells[parseInt(k%3)].querySelector("img").classList.add("showed");
                    }
                    return true;
                }
            }
        }
    }
    return false;
}
function setShowButtonHandler(){
    showMeASet(true);
}

function isThereASetButtonHandler(){
    if(showMeASet(false)){
        yesSpan.innerText = "Van Set";
    }else{
        yesSpan.innerText = "Nincs Set";
    }
}

function endGame(){
    if(showMeASet(false)){
        return true;
    }else{
        return false;
    }
}

//MENU BUTTONS
function startGame(){
    gameDiv.hidden = false;
    buttonsDiv.hidden = false;
    menuDiv.hidden = true;
    rulesDiv.hidden = true;
    playersNDIV.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;

    ///PLUS BUTTONS
    if(chosenGameMode == "noob"){
        if(isThereASetFinal){
            isThereASetButton.hidden = false;  
        } 
        if(setShowFinal){
            setShowButton.hidden = false; 
        } 
        if(plusThreeFinal){
            plusThreeButton.hidden = false;
        } 
    }

    generateDeck();
    shuffleDeck(deck);
    console.log(deck);
    takeFirst12();
    
}

function showRules(){
    rulesDiv.hidden = false;
    menuDiv.hidden = true;
    gameDiv.hidden = true; 
    playersNDIV.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;
}
function backRules(){
    menuDiv.hidden = false;
    rulesDiv.hidden = true;
    gameDiv.hidden = true; 
    playersNDIV.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;
}

function backPlayers(){
    menuDiv.hidden = false;
    rulesDiv.hidden = true;
    playersNDIV.hidden = true;
    gameDiv.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;

    playersNUM = playersNumInput.value;
    
}

function backSettings(){
    menuDiv.hidden = false;
    rulesDiv.hidden = true;
    playersNDIV.hidden = true;
    gameDiv.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;

    isThereASetFinal = isThereASet.checked;
    setShowFinal = setShow.checked;
    plusThreeFinal = plusThree.checked;

}

function backGM(){
    menuDiv.hidden = false;
    rulesDiv.hidden = true;
    playersNDIV.hidden = true;
    gameDiv.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;

    if(radioNoob.checked) chosenGameMode = "noob";
    else chosenGameMode = "race";
}

function players(){
    playersNDIV.hidden = false;
    menuDiv.hidden = true;
    rulesDiv.hidden = true;
    gameDiv.hidden = true;
    settingsDiv.hidden = true;
    gameModeDiv.hidden = true;
}

function settings(){
    settingsDiv.hidden = false;
    playersNDIV.hidden = true;
    menuDiv.hidden = true;
    rulesDiv.hidden = true;
    gameDiv.hidden = true;
    gameModeDiv.hidden = true;
}

function gameMode(){
    gameModeDiv.hidden = false;
    settingsDiv.hidden = true;
    playersNDIV.hidden = true;
    menuDiv.hidden = true;
    rulesDiv.hidden = true;
    gameDiv.hidden = true;
}

let lastValue = 1;

function makePlayerNames(){
    const newLi = document.createElement("li");
    const newIn = document.createElement("input");
    newIn.type = "text";
    newIn.value = "Player" + playersNumInput.value;
    newLi.appendChild(newIn);
    playersList.appendChild(newLi);
    playersNames.push(newIn.value);
    //lastValue = playersNumInput.value
}


//DELEGATE
function delegate(parent, type, selector, fn) {
    function delegatedFunction(e) {
        if (e.target.matches(`${selector},${selector} *`)) {
            let target = e.target;
            while (!target.matches(selector)) target = target.parentNode;
            e.delegatedTarget = target;
            return fn(e);
        }
    }
    parent.addEventListener(type, delegatedFunction, false);
}