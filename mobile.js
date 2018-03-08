(function() {

  // Check Tor status...
  let checktor = "https://secure.publeaks.nl/checktor"
  var tor = false;

  // Taken from:
  //   https://github.com/globaleaks/Tor2web/blob/master/misc/checktor.js
  // I could rewrite this using JQuery because its precense is guaranteed
  try {
    if (window.XMLHttpRequest) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
          if (xmlhttp.getResponseHeader("x-check-tor") === "true") {
            console.log("Detected a known Tor exit node");
            tor = true;
          } else {
            console.log("No known Tor exit node detected");
          }
        }
      }
      xmlhttp.open("GET", checktor, true);
      xmlhttp.send();
    }
  } catch(err) {
    console.log("Error checking Tor status");
    console.log(err);
  }

  $(document).ready(function() {
    // Show security modal if appropriate
    if (!tor) {
      $("#security-modal").modal("show");
    }
  });

})();
