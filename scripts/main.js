bookmarkSwitch = 0;
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        read_display_Quote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});


function read_display_Quote() {
  //console.log("inside the function")

  //get into the right collection
  db.collection("quotes")
    .doc("Tuesday")
    .onSnapshot(function (tuesdayDoc) {
      //console.log(tuesdayDoc.data());
      document.getElementById("quote-goes-here").innerHTML =
        tuesdayDoc.data().quote;
    });
}
function insertName() {
  // no need to check if user is logged in, its called whenever the user is logged in

      // console.log(user.uid); // let me to know who is the user that logged in to get the UID
      // currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
  
      // currentUser is a global variable at line 1
      currentUser.get().then((userDoc) => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
      })
}
function populateCardsDynamically() {
  let cardTemplate = document.getElementById("featureCardtemplate");
  let cardGroup = document.getElementById("features-go-here");
  
  db.collection("features").get()
      .then(allFeatures => {
          allFeatures.forEach(doc => {
              // var hikeName = doc.data().name; //gets the name field
              // var hikeID = doc.data().code; //gets the unique ID field
              // let testHikeCard = hikeCardTemplate.content.cloneNode(true);
              
              var title = doc.data().name;        // get value of the "name" key
              var details = doc.data().details;   // get value of the "details" key
              var featureID = doc.data().code;    //get unique ID to each hike to be used for fetching right image
              let newcard = cardTemplate.content.cloneNode(true);

              newcard.querySelector('.card-title').innerHTML = title;
              newcard.querySelector('.card-text').innerHTML = details;
              newcard.querySelector('.card-image').src = `./images/${featureID}.png`; //Example: NV01.jpg
              newcard.querySelector('a').onclick = () => setFeatureData(featureID);//equiv getElementByTagName

              // testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;   //equiv getElementByTagName

              
              //next 2 lines are new for demo#11
              //this line sets the id attribute for the <i> tag in the format of "save-featureID" 
              //so later we know which feature to bookmark based on which feature was clicked
              newcard.querySelector('i').id = 'save-' + featureID;
              // this line will call a function to save the feature to the user's document
                newcard.querySelector('i').onclick = () => {
                  // if the filled-in bookmark is present
                  if (document.getElementById('save-' + featureID).innerText == 'bookmark') {
                    this.onclick = removeBookmark(featureID);
                  } else {
                    // if the filled-in bookmark is not present 
                    saveBookmark(featureID);
                }};
              newcard.querySelector('.read-more').href = "eachFeature.html?featureName=" + title + "&id=" + featureID;  
              cardGroup.appendChild(newcard);

          })
      })
}
function setFeatureData(id){
  localStorage.setItem('featureID', id);
  // href = "eachFeature.html?featureID=" + id;
}
function redirectToFeature(id) {
  
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(featureID) {
  currentUser.set({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(featureID) // adds a new item in the array
      }, {
          merge: true
      })
      .then(function () {
          console.log("bookmark has been saved for: " + currentUser);
          var iconID = 'save-' + featureID;
          //console.log(iconID);
          //this is to change the icon of the hike that was saved to "filled"
          document.getElementById(iconID).innerText = 'bookmark';
      });
}

function removeBookmark(featureID) {
  currentUser.set({
    bookmarks: firebase.firestore.FieldValue.arrayRemove(featureID)
  }, {
      merge:true
  }).then(function () {
    console.log("bookmark " + featureID + " has been deleted for: " + currentUser);
    var iconID = 'save-' + featureID;
    document.getElementById(iconID).innerText = 'bookmark_border';
  })
}