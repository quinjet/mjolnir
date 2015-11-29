
var cookieOptions = {
        "domain": SOKRATI.COOKIE_OPTIONS.DOMAIN,
        "path": SOKRATI.COOKIE_OPTIONS.PATH
};

var checkCookie = function() {
    var targetURL = '';
    if ((document.cookie.indexOf(SOKRATI.TOKENS.UA_TOKEN) == -1)) {
        // user's url contains #
        targetURL = encodeURIComponent(location.href);
        if(location.href.indexOf("#") != -1){
            location.href = SOKRATI.URLS.LOGIN_URL + "&targetURL=" + targetURL;
        } else {
            location.href = SOKRATI.URLS.LOGIN_URL + "#targetURL=" + targetURL;
        }
    }
};

var signOut = function() {
    eraseCookieFromAllPaths(SOKRATI.TOKENS.UA_TOKEN);
    eraseCookieFromAllPaths(SOKRATI.TOKENS.UBID);
    checkCookie();
};

var eraseCookieFromAllPaths = function(name) {
    // This function will attempt to remove a cookie from all paths.
    var pathCurrent = ' path=' + SOKRATI.COOKIE_OPTIONS.PATH,
    domain = ' domain=' + SOKRATI.COOKIE_OPTIONS.DOMAIN;
    // do a simple pathless delete first.
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';

    document.cookie = name + '=; ' + domain +
        '; expires=Thu, 01-Jan-70 00:00:01 GMT;' + pathCurrent + ';';
};


checkCookie();
