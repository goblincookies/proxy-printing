const card = "card"
let cardID = 0;
let cardCount = 0;

function setup() {
    listenersCreate();
};


function upload(e) {
    const file = e.target.files[0];

    if (FileReader) {
        console.log("hello new card!");
        let fr = new FileReader();
        fr.onload = function () {
            // const thisPage = pageManager.addCardHere();

            pageManager.addNewCard( createHTML_Card( fr.result ) );
            listenersUpdate();
        };
        fr.readAsDataURL( file );
    };
};

function clearFile(e) {
    let fileInput = document.getElementById("card-file");
    fileInput.value = "";
    fileInput.click();
};



// PAGE MANAGER
const pageManager = ( function () {

    const maxPerPage = 9;
    const page = "page";
    let pageID = 0;

    // MAKE A NEW PAGE
    const makeANewPage = function() {
        let thisPage = document.getElementById( page+pageID );
        console.log("make a new page please!");
        pageID += 1;

        thisPage.parentNode.classList.add("break");
        
        let pageParent = createHTML_Page( page+pageID );
        document.querySelector("body").appendChild( pageParent );
        thisPage = pageParent.querySelector(".paper");

    };

    const addNewCard = function( card ) {

        let thisPage = document.getElementById( page+0 );

        // EASY?
        if (thisPage.childElementCount < maxPerPage) {
            console.log(`we're cool on the card count`)

            thisPage.prepend( card );
            return 0;
        }
        
        // TOO MANY CARDS
        pushCardsForward( thisPage );
        thisPage.prepend( card );

        return thisPage;
    };

    const duplicateThisCard = function( targetCard ) {

        let dupe = targetCard.cloneNode(true);
        dupe.id = card + cardID;
        cardID += 1;
        let next = targetCard.nextElementSibling;

        const thisPage = targetCard.parentNode;
        
        // IS THIS THE LAST CARD ON THE PAGE?
        if (thisPage.lastElementChild == targetCard ) {
            // ENOUGH SPACE TO BASIC DUPE
            if (thisPage.childElementCount < maxPerPage ) {
                thisPage.appendChild(dupe)
                return 1;
            };

            // MAKE SOME SPACE
            // ADD IT TO THE END
            pushCardsForward( thisPage );
            thisPage.appendChild(dupe);
            return 1;
        };

        // TOO MANY CARDS ON THIS PAGE?
        if (thisPage.childElementCount >= maxPerPage ) {
            // TOO MANY
            pushCardsForward( thisPage );
            
        };

        if (thisPage.lastElementChild == targetCard ) {
            thisPage.appendChild(dupe);
            return 1;
        };

        thisPage.insertBefore(dupe, next);
    };

    const pushCardsForward = function( thisPage ) {
        let thisID = parseInt(thisPage.id.split(page)[1]);
        let nextPage = document.getElementById( page + (thisID + 1));

        if (!nextPage) {
            // NO NEXT PAGE, MAKE ONE!
            console.log(`not finding the next page`)
            makeANewPage();
            nextPage = document.getElementById( page + (thisID + 1));
        };

        console.log(`total pages ${pageID+1}`);

        for (let i = pageID; i >= 0; i--) {
            
            let pageA = document.getElementById( page+i );
            
            if (pageA) {
                while( pageA.childElementCount >= maxPerPage) {
                    let pageB = document.getElementById( page+(i+1) );
                    
                    if(!pageB) {
                        makeANewPage()
                        pageB = document.getElementById( page+(i+1) );
                    };

                    pageB.prepend( pageA.lastChild );
                };
            };

        };

    };

    // SHIFTS CARDS SO THAT IT ALWAYS USES THE
    // FEWEST NUMBER OF PAGES
    const shiftCardsBack = function () {
        for (let i = pageID-1; i >= 0; i--) {

            let pageA = document.getElementById( page+i );
            let pageB = document.getElementById( page+(i+1) );

            if (pageA && pageB) {

                while( (pageA.childElementCount < maxPerPage) && (pageB.childElementCount > 0) ) {
                    pageA.appendChild( pageB.childNodes[0] );
                };

                if (pageB.childElementCount <=0) {
                    console.log(`too many pages here, removing one`)
                    pageB.parentNode.remove();
                    pageA.parentNode.classList.remove("break");
                    pageID -= 1;
                    console.log(`total pages ${pageID+1}`)
                };
            };
        };

    };

    return { addNewCard, shiftCardsBack, duplicateThisCard, pushCardsForward }

})();

function deleteCard(e) {
    // TARGET THAT WILL BE REASSIGNED
    let target = e.currentTarget;

    // TRAVEL UP THE DOM UNTIL FIRST INSTANCE OF DIV WITH AN ID
    while(target.id == '') {
        target = target.parentNode;
    };

    target.remove();
    pageManager.shiftCardsBack();
};

function duplicateCard(e) {
    // TARGET THAT WILL BE REASSIGNED
    let target = e.currentTarget;
    // TRAVEL UP THE DOM UNTIL FIRST INSTANCE OF DIV WITH AN ID
    while(target.id == '') {
        target = target.parentNode;
    };
    pageManager.duplicateThisCard( target );
    
    // ASSUMES SAME PAGE, AND THAT THE PAGE ISN'T
    // FULL WHEN ADDING CARDS THIS WAY, THE LAST
    // CARD MUST BE MOVED TO A NEW PAGE

    // const page = pageManager.addCardHere();
    // page.insertBefore(dupe, next);
    // .appendChild( dupe );
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
    //         <button class="delete no-drag"> <img class="no-drag" src="./images/delete.svg" alt=""> </button>
    //         <button class="duplicate no-drag"> <img class="no-drag" src="./images/duplicate.svg" alt=""> </button>
    //     </div>
    //     <img src="./images/007-001.webp" alt="" id="">
    // </div>


    const cardDiv = createHTML("div", ["card"]);
    cardDiv.id = card+cardID;
    cardID += 1;
    const buttonsDiv = createHTML("div", ["buttons"]);
    const deleteButton = createHTML("button", ["delete", "hidden", "no-drag"]);
    const deleteImg = createHTML("img", ["no-drag"]);
    deleteImg.src = "./images/delete.svg";
    const duplicateButton = createHTML("button", ["duplicate", "hidden", "no-drag"]);
    const duplicateImg = createHTML("img", ["no-drag"]);
    duplicateImg.src = "./images/duplicate.svg";
    const cardImg = createHTML("img", ["no-drag"]);
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
    document.getElementById("upload-button").addEventListener('click', clearFile);
    document.getElementById("card-file").addEventListener('change', upload);

    listenersUpdate();
};


setup();