(function() {
  // Check Tor status
  let secureserver = "https://secure.publeaks.nl"
    , securereceipt = "https://secure.publeaks.nl/#/receipt"
    , checktor = "https://secure.publeaks.nl/checktor"
    , hiddenserver = "http://5karyquenden4d6k.onion"
    , hiddenreceipt = "http://5karyquenden4d6k.onion/#/receipt";
  var tor = false;

  // I could rewrite this block with JQuery since its precense is guaranteed
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
    // Register upload button click event
    //   show security modal if not on Tor
    //   otherwise just redirect...
    $("button.upload").click(function(evt) {
      if (tor) {
        window.location.href = hiddenserver;
      } else {
        $("#security-modal a.btn-danger").attr("href", secureserver);
        $("#security-modal").modal("show");
      }
    });

    // Similarly register login button click event
    $("button.login").click(function(evt) {
      if (tor) {
        window.location.href = hiddenreceipt;
      } else {
        $("#security-modal a.btn-danger").attr("href", securereceipt);
        $("#security-modal").modal("show");
      }
    });

    // Register video playback controls
    $("#jumbotron button").click(function(evt) {
      // console.log($("#jumbotron video")[0]);
      $("#jumbotron video")[0].requestFullScreen();
    });

    // Register smooth-scrolling events
    //   can I normalize for scroll speed rather than time?
    $(".smooth-scrolling").click(function(evt) {
      var target = $(evt.delegateTarget).attr("href");
      $("html, body").animate(
        { scrollTop: $(target).offset().top
        }, 800);
    });
  });
})();
