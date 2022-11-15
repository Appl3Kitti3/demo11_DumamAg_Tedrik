firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getBookmarks(user)
    } else {
        console.log("No user is signed in!");
    }
});

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let cardTemplate = document.getElementById("featureCardtemplate");
            let cardGroup = document.getElementById("features-go-here");
            bookmarks.forEach(thisfeatureID => {
                console.log(thisfeatureID);
                db.collection("features").where("code", "==", thisfeatureID).get().then(snap => {
                    size = snap.size;
                    queryData = snap.docs;
                    
                    if (size == 1) {
                        var doc = queryData[0].data();
                        var title = doc.name; //gets the name field
                        var details = doc.details; // gets value of details
                        var featureID = doc.code; //gets the unique ID field

                        let newCard = cardTemplate.content.cloneNode(true);
                        
                        newCard.querySelector('.card-title').innerHTML = title;
                        newCard.querySelector('.card-text').innerHTML = details;
                        newCard.querySelector('.card-image').src = `./images/${featureID}.png`; 
                        
                        newCard.querySelector('a').onclick = () => setHikeData(featureID);
                        
                        newCard.querySelector('.read-more').href = "eachFeature.html?featureName=" + title + "&id=" + featureID;
                        
                        cardGroup.appendChild(newCard);
                    } else {
                        console.log("Query has more than one data")
                    }

                })

            });
        })
}