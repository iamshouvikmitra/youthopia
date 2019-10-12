var stateObj = { foo: "bar" };
history.pushState(stateObj, "page 2", "index.html");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCIYMom1ZdDRpgm3z3h8N63N4ZnCdawArE",
    authDomain: "youthopia-ditu.firebaseapp.com",
    databaseURL: "https://youthopia-ditu.firebaseio.com",
    projectId: "youthopia-ditu",
    storageBucket: "",
    messagingSenderId: "502958194174",
    appId: "1:502958194174:web:7e010a5a9d24da6982d4af",
    measurementId: "G-4DLYR2YZBF"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var gUser = {}

  // Check user auth status
  firebase.auth().onAuthStateChanged(function (user) {
    gUser = user;
    if (!user) {
      // User is not signed in.
      
      document.getElementById("profileTrigger").style.display = 'none';
      document.getElementById("regForm").style.display = 'none';
    }
    if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        document.getElementById("profileTrigger").style.display = 'block';
        document.getElementById("userDisplayName").innerText = `Hi, ${displayName}`;
        document.getElementById("participant-name").value = `${displayName}`;
        document.getElementById("participant-email").value = `${email}`;
        document.getElementById("firebaseui-auth-container-event").style.display = 'none';
        document.getElementById("regForm").style.display = 'block';
    }
  });  

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth()); 
var uiConfig = {
callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
    // User successfully signed in.
    // Return type determines whether we continue the redirect automatically
    // or whether we leave that to developer to handle.
    return true;
    },
    uiShown: function() {
    // The widget is rendered.
    // Hide the loader.
    document.getElementById('regLoading').style.display = 'none';
    }
},
// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
signInFlow: 'popup',
signInSuccessUrl: '#',
signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
],
// Terms of service url.
tosUrl: '<your-tos-url>',
// Privacy policy url.
privacyPolicyUrl: '<your-privacy-policy-url>'
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
ui.start('#firebaseui-auth-container-event', uiConfig);

function logout() {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
        location.reload();
  
    }).catch(function (error) {
      alert("Some Problem while logging out!");
    });
  }

// Open Event Modal
$('#eventModal').on('show.bs.modal', function (event) {
var trigger = $(event.relatedTarget) // Button that triggered the modal
var eventName = trigger.data('eventname') // Extract info from data-* attributes
var eid = trigger.data('eventid')
var amt = trigger.data('eventamt')
var modal = $(this)
modal.find('.modal-title').text('Register for ' + eventName)
modal.find('#event-name').val(eventName)
modal.find('#event-registration-amount').val(amt)
modal.find('#event-amount').text(amt)
modal.find('#event-id').val(eid)

fetch('http://youthopia.co.in/app/getEventById.php?id='+eid)
  .then((resp) => resp.json())
  .then(function (data) {
    eventData = data.events[0];
    document.getElementById('event-description').innerHTML = 
    URLify(eventData.desc);
    document.getElementById('event-date').innerHTML = 
    new Date(parseInt(eventData.date));

  })
  .catch((err) =>{
    alert('Unable to load event data! Please check your Internet Connectivity')
  });


if(gUser){
  var regId = "Y" + eid + "-" + gUser.displayName[0].toUpperCase() + Math.floor(Math.random() * 1000);
  modal.find('#event-registration-id').val(regId);
}

// modal.find('.modal-body input').val(eventName)
})

// URLify String
function URLify(string){
  var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
  if (urls) {
    urls.forEach(function (url) {
      string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
    });
  }
  return string.replace("(", "<br/>(");
}

// Handel MouseHover Image Manipulation
function blurImage(r){
    x = r.src;
    r.src = x.slice(0,x.lastIndexOf('/')) + '/main'+x.slice(x.lastIndexOf('.'))
} 
function UnblurImage(r){
    x = r.src;
    r.src = x.slice(0,x.lastIndexOf('/')) + '/blur'+x.slice(x.lastIndexOf('.'))
} 


// Event Register
function eventRegister(){
  var formData = new FormData();

  formData.append('uid', document.getElementById('event-registration-id').value);
  formData.append('name', document.getElementById('participant-name').value);
  formData.append('event', document.getElementById('event-name').value);
  formData.append('sex', 'X');
  formData.append('age', '0');
  formData.append('email', document.getElementById('participant-email').value);
  formData.append('phone', document.getElementById('participant-number').value);
  formData.append('cname', document.getElementById('participant-college').value);
  formData.append('ccity', document.getElementById('state').value);
  formData.append('member', document.getElementById('message-text').value);
  formData.append('tname', document.getElementById('message-text').value);
  formData.append('amount', document.getElementById('event-registration-amount').value);
  formData.append('eid', document.getElementById('event-id').value);
  // console.log(uid,name,event,sex,age,email,phone,cname,ccity,member,tname,amount,eid)
  var url = 'http://youthopia.co.in/app/eventreg1.php';

  fetch(url, { method: 'POST', body: formData, mode: 'no-cors' })
  .then(function (response) {
    return response.text();
  })
  .then(function (body) {
    var p = document.getElementById('event-registration-id').value;
    var q = document.getElementById('event-name').value
    document.getElementById('event-registration-form').innerHTML =
     `<h6 style="color:black"> 
        You have successfully registered for the event - 
          ${q} ! </br> Your Registration UID = ${p}. Please show this ID at the help desk!
    `;
    document.getElementById('showlogin').style.display = 'none'
    document.getElementById('regForm').style.display = 'none'
    document.getElementById('fott').style.display = 'none'

  })
  .catch(function (err){
   alert('Something went wrong! Please try again ... <br> '+ err);
  });
  
}

document.getElementById('eventForm').addEventListener("submit", function(event){
  event.preventDefault();
  eventRegister();
});



// fetch all events
function showAllEvents(){
  fetch('http://youthopia.co.in/app/getevents.php')
  .then((resp) => resp.json())
  .then(function (data) {
    console.log(data);
    data.events.sort(function(a, b){
      var keyA = a.club,
          keyB = b.club;
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
    data.events.forEach(event => {
      let div = document.createElement('div');
      div.setAttribute('class','col-sm-6 col-md-3 mt-sm-0');
      let a = document.createElement('a');
      a.setAttribute('href', event.img);
      a.setAttribute('data-toggle','modal');
      a.setAttribute('data-target','#eventModal');
      a.setAttribute('data-eventname',event.title);
      a.setAttribute('data-eventid', event.id);
      a.setAttribute('data-eventamt', event.price);
      a.setAttribute('data-eventregister', event.extra.split(',')[0]);
      let div2 = document.createElement('div');
      div2.setAttribute('class','img-wrap');
      div2.setAttribute('style', 
      `
      background-image: url(${event.img});
      background-size: cover;
      height: 300px;
      border: 2px solid;
      background-repeat: no-repeat;

      background-position: center;
      `);
      let h5 = document.createElement('h6');
      h5.innerText = event.title;
      h5.setAttribute('style','margin-top: 10px;')
      a.appendChild(div2);
      a.appendChild(h5);
      div.appendChild(a);
      document.getElementById('allEvents').appendChild(div);
    });
  })
  .catch((err) =>{
    alert('Unable to load events! Please check your Internet Connectivity')
  });
}

showAllEvents();