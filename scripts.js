import fscreen from 'fscreen';

// Check Tor status
var secureserver = "https://secure.publeaks.nl/#/submission?lang=nl&context=ef6db39c-e913-4abf-bc17-1ec21b78fead&contexts_selectable=false"
  , securereceipt = "https://secure.publeaks.nl/#/receipt?lang=nl"
  , checktor = "https://secure.publeaks.nl/checktor"
  , hiddenserver = "http://5karyquenden4d6k.onion/#/submission?lang=nl&context=ef6db39c-e913-4abf-bc17-1ec21b78fead&contexts_selectable=false"
  , hiddenreceipt = "http://5karyquenden4d6k.onion/#/receipt?lang=nl";
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
      $("#security-modal a.btn-primary").attr("href", secureserver);
      $("#security-modal").modal("show");
    }
  });

  // Similarly register login button click event
  $("button.login").click(function(evt) {
    if (tor) {
      window.location.href = hiddenreceipt;
    } else {
      $("#security-modal a.btn-primary").attr("href", securereceipt);
      $("#security-modal").modal("show");
    }
  });

  // Register video playback controls
  $(".video-toggle").click(function(evt) {
    if (fscreen.fullscreenElement !== null) {
      fscreen.exitFullscreen();
    } else {
      var target = $($(evt.delegateTarget).attr("data-target"))
        .find(".embed-responsive");
      var video = target.find("video")[0]
        , posterControls = target.find(".poster-controls")
        , fullscreenControls = target.find(".fullscreen-controls")
        , div = target[0];
      var attrs = $(video).attr("data-attributes").split(",");
      var handler = function () {
        if (fscreen.fullscreenElement !== null) {
          posterControls.addClass("invisible");
          fullscreenControls.removeClass("invisible");
          attrs.forEach(function(attr) {
            if (false) { }
            else if (attr === "pause") video.play()
            else if (attr === "rewind") video.currentTime = 0.0;
            else if (attr === "volume") video.volume = 1.0;
            else if (attr === "loop") video.loop = false;
          });
        } else {
          fscreen.removeEventListener('fullscreenchange', handler, false);
          fullscreenControls.addClass("invisible");
          posterControls.removeClass("invisible");
          attrs.forEach(function(attr) {
            if (false) { }
            else if (attr === "pause") video.pause();
            else if (attr === "loop") {
              video.loop = true;
              video.play();
            }
            else if (attr === "volume") video.volume = 0.0;
          });
        };
      };
      fscreen.addEventListener('fullscreenchange', handler, false);
      // I might want to add an error handler also
      fscreen.requestFullscreen(div);
    }
  });

  // Register video ended events
  $("video").on("ended", function(evt){
    fscreen.exitFullscreen();
    var target = $(evt.delegateTarget).attr("data-target");
    if (target !== undefined) {
      $(target).find("div.poster-controls button.video-toggle")
        .removeClass("animated infinite pulse");
      $(target).find("div.featured-list-icon")
        .addClass("bg-primary text-white animated infinite pulse");
    }
  });

  // Start the background video with volume down
  (function(){
    var video = $("#jumbotron video")[0];
    video.volume = 0.0;
    video.loop = true;
    video.play();
  })();

  // Register smooth-scrolling events
  //   can I normalize for scroll speed rather than time?
  $(".smooth-scrolling").click(function(evt) {
    evt.preventDefault();
    var target = $(evt.delegateTarget).attr("href");
    $("html, body").animate(
      { scrollTop: $(target).offset().top
      }, 800);
  });
});
