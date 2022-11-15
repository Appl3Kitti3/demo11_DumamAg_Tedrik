let featureID = localStorage.getItem("featureID");

db.collection("features").where("code", "==", featureID)
            .get()
            .then(queryFeature => {
                //see how many results you have got from the query
                size = queryFeature.size;
                // get the documents of query
                Features = queryFeature.docs;

                // We want to have one document per hike, so if the the result of 
                //the query is more than one, we can check it right now and clean the DB if needed.
                if (size = 1) {
                    var thisFeature = Features[0].data();
                    name = thisFeature.name;
                    document.getElementById("FeatureName").innerHTML = name;
                } else {
                    console.log("Query has more than one data")
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });


function writeReview() {
    console.log("in");
    let Title = document.getElementById("title").value;
    let Description = document.getElementById("description").value;
    let Usability = document.querySelector('input[name="usability"]:checked').value;
    let Recommend = document.querySelector('input[name="recommend"]:checked').value;
    console.log(Title, Description, Usability, Recommend);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            console.log("Failure");
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("Reviews").add({
                        code: featureID,
                        userID: userID,
                        title: Title,
                        description: Description,
                        easyToUse: Usability,
                        doesRecommend: Recommend,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(()=>{
                        window.location.href = "thanks.html"; //new line added
                    })
                })
                   
        } else {
            // No user is signed in.
        }
    });

}