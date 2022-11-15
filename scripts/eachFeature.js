function populateReviews() {
    console.log("asdasd");
    let featureCardtemplate = document.getElementById("cardTemplate");
    let featureCardGroup = document.getElementById("cardGroup");

    let params = new URL(window.location.href);         //get URL of search bar
    let featureID = params.searchParams.get("id");       //get value for key "id"
    let featureName = params.searchParams.get("featureName"); //get value for key "featureName"
    document.getElementById("FeatureName").innerHTML = featureName + " <img src='./images/" + featureID + ".png' width=45px>"; 
    let message = "All reviews submitted for " + featureName;
    message += " &nbsp | Document id is:  " + featureID;
    document.getElementById("details-go-here").innerHTML = message; 
    
    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("Reviews").where( "code", "==", featureID).get()
        .then(allReviews => {
            reviews = allReviews.docs
            // console.log(reviews);
            reviews.forEach(doc => {

                var title = doc.data().title; //gets the name field
                var usability = doc.data().easyToUse; //gets the unique ID field
                var recommend = doc.data().doesRecommend;
                var description = doc.data().description; //gets the length field

                let reviewCard = featureCardtemplate.content.cloneNode(true);
                reviewCard.querySelector('.title').innerHTML = title;     //equiv getElementByClassName
                reviewCard.querySelector('.usability').innerHTML = (usability == "Yes") ? "Easy to use" : "Difficult to use";     //equiv getElementByClassName
                reviewCard.querySelector('.recommend').innerHTML = (recommend=="Yes") ? "Does recommend" : "Does not recommend";     //equiv getElementByClassName
                reviewCard.querySelector('.description').innerHTML = "Description: <br/>" + description;     //equiv getElementByClassName

                // reviewCard.querySelector('.level').innerHTML = `level: ${level}`;
                // reviewCard.querySelector('.season').innerHTML = `season: ${season}`;
                // reviewCard.querySelector('.scrambled').innerHTML = `scrambled: ${scrambled}`;  //equiv getElementByClassName
                // reviewCard.querySelector('.flooded').innerHTML = `flooded: ${flooded}`;  //equiv getElementByClassName
                // reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
                featureCardGroup.appendChild(reviewCard);
            })
        })
}

populateReviews();