console.log("Hello!");
$(document).ready(function(){
    $(".sideMenuToggler").on("click", function() {
        console.log("World");
        $(".wrapper").toggleClass("active");
    });

    var adjustSidebar = function() {
        $(".sidebar").slimScroll({
            height: document.documentElement.clientHeight - $(".navbar").outerHeight()
        });
    };

    adjustSidebar();
    $(window).resize(function() {
        adjustSidebar();
    });
});