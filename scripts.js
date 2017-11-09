(function() {
  // Upload buttons (security check and modal)
  $(document).ready(function() {
    $(".upload").click(function(evt) {
      $("#security-modal").modal("show");
    });
  });

  // Navbar location update
  $(document).ready(function() {
    let offset = $(".navbar").outerHeight();
    // Cache selectors alongside destinations
    // > map is used as filter here; I don't like it
    var links = $(".navbar .nav-bordered .nav-link").map(function(){
      var href = $(this).attr("data-destination");
      if ($(href).length)
        return { "link": this, "href": href };
    });
    // Bind to scroll event
    $(window).scroll(function() {
      var top = $(this).scrollTop();
      // > map is used as filter/reduce here; I don't like it
      var progress = links.map(function() {
        // Remove the active class now; since we might as well
        $(this["link"]).removeClass("active");
        if ($(this["href"]).offset().top <= top+offset) return this["link"];
      });
      // Add the active class to the last matched selector
      $(progress[progress.length-1]).addClass("active");
    });
  });

  // Smooth scrolling
  $(document).ready(function() {
    // Register smooth-scrolling events
    $(".smooth-scrolling").click(function(evt) {
      var target = $(evt.delegateTarget).attr("data-destination");
      $("html, body").animate(
        { scrollTop: $(target).offset().top
        }, 500);
    });
  });
})();
