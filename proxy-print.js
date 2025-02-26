

const card = "card"
let cardID = 0;
let cardCount = 0;

function setup() {
    listenersCreate();
};


function upload(e) {
    const file = e.target.files[0];

    if (FileReader) {
        console.log("hello!");
        let fr = new FileReader();
        fr.onload = function () {
            const thisPage = pageManager.addCardHere();
            thisPage.appendChild( createHTML_Card( fr.result ) );
            listenersUpdate();
        };
        fr.readAsDataURL( file );
    };
};

function clearFile(e) {
    e.target.value = "";
};

// PAGE MANAGER
const pageManager = ( function () {
    const maxPerPage = 9;
    const page = "page";
    let pageID = 0;

    const addCardHere = function() {
        let thisPage = document.getElementById( page+pageID );

        console.log(`children elements ${thisPage.childElementCount} // max per page ${maxPerPage}`)

        if (thisPage.childElementCount >= maxPerPage) {
            console.log("MAKE A NEW PAGE PLEASE!");
            pageID += 1;
            thisPage.parentNode.classList.add("break");
            
            let pageParent = createHTML_Page( page+pageID );
            document.querySelector("body").appendChild( pageParent );
            thisPage = pageParent.querySelector(".paper");
        }

        return thisPage;
    };

    // SHIFTS CARDS SO THAT IT ALWAYS USES THE
    // FEWEST NUMBER OF PAGES
    const shiftCards = function () {
        for (let i = pageID-1; i >= 0; i--) {

            let pageA = document.getElementById( page+i );
            let pageB = document.getElementById( page+(i+1) );

            if (pageA){ console.log("found page A") }
            if (pageB){ console.log("found page B") }

            if (pageA && pageB) {

                while( (pageA.childElementCount < maxPerPage) && (pageB.childElementCount > 0) ) {
                    pageA.appendChild( pageB.childNodes[0] );
                };

                if (pageB.childElementCount <=0) {
                    pageB.parentNode.remove();
                    pageA.parentNode.classList.remove("break");
                    pageID -= 1;
                };
            };


        }

    };

    return { addCardHere, shiftCards }

})();

function deleteCard(e) {
    // TARGET THAT WILL BE REASSIGNED
    let target = e.currentTarget;

    // TRAVEL UP THE DOM UNTIL FIRST INSTANCE OF DIV WITH AN ID
    while(target.id == '') {
        target = target.parentNode;
    };

    target.remove();
    pageManager.shiftCards();
};




function duplicateCard(e) {
    // TARGET THAT WILL BE REASSIGNED
    let target = e.currentTarget;

    // TRAVEL UP THE DOM UNTIL FIRST INSTANCE OF DIV WITH AN ID
    while(target.id == '') {
        target = target.parentNode;
    };

    let dupe = target.cloneNode(true);
    dupe.id = card + cardID;
    cardID += 1;
    
    
    pageManager.addCardHere().appendChild( dupe );
    listenersUpdate();
};

function createHTML( type, classes) {
    let element = document.createElement( type );
    for(const el of classes) {
        element.classList.add( el);
    };
    return element;
};

function createHTML_Page( pageID ) {

    // <div class="page break">
    //     <div class="paper" id = "page0">
    //     </div>
    // </div>

    const pageDiv = createHTML("div", ["page"]);
    const paperDiv = createHTML("div", ["paper"]);
    paperDiv.id = pageID;
    pageDiv.appendChild( paperDiv );

    return pageDiv;
};

function createHTML_Card( img ) {

    // <div class="card">
    //     <div class="buttons">
    //         <button class="delete"> <img src="./images/delete.svg" alt=""> </button>
    //         <button class="duplicate"> <img src="./images/duplicate.svg" alt=""> </button>
    //     </div>
    //     <img src="./images/007-001.webp" alt="" id="">
    // </div>


    const cardDiv = createHTML("div", ["card"]);
    cardDiv.id = card+cardID;
    cardID += 1;
    const buttonsDiv = createHTML("div", ["buttons"]);
    const deleteButton = createHTML("button", ["delete", "hidden"]);
    const deleteImg = createHTML("img", []);
    deleteImg.src = "./images/delete.svg";
    const duplicateButton = createHTML("button", ["duplicate", "hidden"]);
    const duplicateImg = createHTML("img", []);
    duplicateImg.src = "./images/duplicate.svg";
    const cardImg = createHTML("img", []);
    cardImg.src = img;

    deleteButton.appendChild(deleteImg);
    duplicateButton.appendChild(duplicateImg);
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(duplicateButton);

    cardDiv.appendChild(buttonsDiv);
    cardDiv.appendChild(cardImg);
    return cardDiv;
}


function listenersUpdate() {
    document.querySelectorAll(".delete").forEach( delButton => delButton.addEventListener("click", deleteCard ) );
    document.querySelectorAll(".duplicate").forEach( delButton => delButton.addEventListener("click", duplicateCard ) );

};

function listenersCreate() {
    document.getElementById("card-upload").addEventListener('click', clearFile);
    document.getElementById("card-upload").addEventListener('change', upload);

    listenersUpdate();
};


setup();