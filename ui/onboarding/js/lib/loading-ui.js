(function() {
$.fn.showLoading = function(msg) {
    if (typeof msg === undefined) {
        msg = "<h1>Loading...</h1>";
    }
    $(this).block({
        message: msg,
        centerY: true, 
        centerX: true, 
        css: {
            border: '1px solid green',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            opacity: 0.5,
            backgroundColor: '#000',
            color: '#fff'
        }
    });
};

$.fn.hideLoading = function() {
    $(this).unblock();
};
$.fn.showMessage = function(type, msg) {
    var element = this,
        errorStyle =
            "display: none;background-color: #f2dede;border-color: #eed3d7;",
        successStyle =
            "display: none;background-color: #dff0d8;border-color: #d6e9c6;",
    html = '<div class="alert alert-' + type + '">';
    html += '<button type="button" class="close" data-dismiss="alert">×</button>';
    $(element).addClass("modal fbx-message-modal");
    if(type === "success") {
        $(element).attr("style", successStyle);
    } else {
        $(element).attr("style", errorStyle);
    }
    html += msg;
    html += '</div>';
    $(element).html(html);
    $(element).show("slow");
    $(element).delay(5000).fadeOut(400);
};
})();
