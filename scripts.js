(function() {
  // Modified from https://github.com/rafrex/fscreen
  //   I should wrap this with a module loader
  var fscreen = (function () {
    const key = {
      fullscreenEnabled: 0,
      fullscreenElement: 1,
      requestFullscreen: 2,
      exitFullscreen: 3,
      fullscreenchange: 4,
      fullscreenerror: 5,
    };

    const webkit = [
      'webkitFullscreenEnabled',
      'webkitFullscreenElement',
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitfullscreenchange',
      'webkitfullscreenerror',
    ];

    const moz = [
      'mozFullScreenEnabled',
      'mozFullScreenElement',
      'mozRequestFullScreen',
      'mozCancelFullScreen',
      'mozfullscreenchange',
      'mozfullscreenerror',
    ];

    const ms = [
      'msFullscreenEnabled',
      'msFullscreenElement',
      'msRequestFullscreen',
      'msExitFullscreen',
      'MSFullscreenChange',
      'MSFullscreenError',
    ];

    // so it doesn't throw if no window or document
    const document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};

    const vendor = (
      ('fullscreenEnabled' in document && Object.keys(key)) ||
      (webkit[0] in document && webkit) ||
      (moz[0] in document && moz) ||
      (ms[0] in document && ms) ||
      []
    );

    return {
      requestFullscreen: element => element[vendor[key.requestFullscreen]](),
      requestFullscreenFunction: element => element[vendor[key.requestFullscreen]],
      get exitFullscreen() { return document[vendor[key.exitFullscreen]].bind(document); },
      addEventListener: (type, handler, options) => document.addEventListener(vendor[key[type]], handler, options),
      removeEventListener: (type, handler, options) => document.removeEventListener(vendor[key[type]], handler, options),
      get fullscreenEnabled() { return Boolean(document[vendor[key.fullscreenEnabled]]); },
      set fullscreenEnabled(val) {},
      get fullscreenElement() { return document[vendor[key.fullscreenElement]]; },
      set fullscreenElement(val) {},
      get onfullscreenchange() { return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()]; },
      set onfullscreenchange(handler) { return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()] = handler; },
      get onfullscreenerror() { return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()]; },
      set onfullscreenerror(handler) { return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()] = handler; },
    };
  })();

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
    $(".video-toggle").click(function(evt) {
      if (fscreen.fullscreenElement !== null) {
        fscreen.exitFullscreen();
      } else {
        var target = $($(evt.delegateTarget).attr("data-target"));
        var attrs = $(evt.delegateTarget).attr("data-attributes").split(",");
        var video = target.find("video")[0]
          , posterControls  = target.find(".poster-controls")
          , fullscreenControls  = target.find(".fullscreen-controls")
          , div = target[0]
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
        $(target).addClass("bg-primary text-white");
      }
    });

    // Start the background video with volume down
    (function(){
      var video = $("#video-welkom video")[0];
      video.volume = 0.0;
      video.loop = true;
      video.play();
    })();

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
