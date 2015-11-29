function getThemeAndReplace(themeId, accessToken, shopDomain) {
        console.log("themeid :: ", themeId, accessToken)
        serviceCommunicator.get(
            shopDomain, '/admin/themes/' + themeId + '/assets.json?asset[key]=layout/theme.liquid&theme_id=' + themeId,
            {'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken},
            function(err, trackingResObj) {
                console.log(" CURRENT THEME = ", trackingResObj);
                var code = trackingResObj.asset.value;
                code = code.replace('</head>', '\n\n\n' + 
                                    '<script type="text/javascript">$(document).on("submit", ".cart-form", function(e){ e.preventDefault(e); });$(document).click("click", "button[name^=\'checkout\']", function(evt) {evt.stopPropagation();$("#ajaxifyModal").removeClass("is-visible");alert("You are integrated.")});</script></head>');
                

                var url = 'https://' + shopDomain + '/admin/themes/' + themeId + '/assets.json';


                var data = {
                    'asset': {
                        'key': 'layout/theme.liquid',
                        'value': code
                    }
                }

                var reqObj = {
                    url: url,
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': accessToken
                    },
                    json: true
                };

                console.info(reqObj);
                request(
                    reqObj, function (err, resp, body) {
                        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                        console.log(err, resp, body);
                        if (err) {
                            //return cb(err);
                        }
                        //cb(null, body);
                    }
                );


            }
        );
    }

    function getAllShopThemes(accessToken, shopDomain, callback) {
        console.log("3333 " + accessToken, shopDomain)
        serviceCommunicator.get(
            shopDomain, '/admin/themes.json', 
            {'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken},
            function(err, response) {
                
                console.log("!!!!!!!!! themes !!!!!!!", err, response);
                callback(err, response, shopDomain);
            }
        );
    }


    app.get("/quinjet/shopifyAuthApp", function(req, res) {
        console.log("!!!!!!!!!!!!  APP !!!!!!!!!!!");
        console.log(req.query);
        var response = null;
        if(req.query === "string") {
            response = JSON.parse(req.query);
        } else {
            response = req.query;
        }
        console.log('https://' + response.shop + "/admin/oauth/authorize?client_id=beaa8b4a841962f4bc8e0e4d540bb1ca&scope=write_content,write_themes,read_themes&redirect_uri=http%3A%2F%2Fffb649a8.ngrok.io%2Fquinjet%2FshopifyAuthRedirect&nonce="+Math.round(Math.random() * 10000000000000));
        res.redirect('https://' + response.shop + "/admin/oauth/authorize?client_id=beaa8b4a841962f4bc8e0e4d540bb1ca&scope=write_content,write_themes,read_themes&redirect_uri=http%3A%2F%2Fffb649a8.ngrok.io%2Fquinjet%2FshopifyAuthRedirect&nonce="+Math.round(Math.random() * 10000000000000));
    });

    app.get("/quinjet/shopifyAuthRedirect", function(req, res) {
        var response = null;
        if(req.query === "string") {
            response = JSON.parse(req.query);
        } else {
            response = req.query;
        }
        var body = {
            'client_id': 'beaa8b4a841962f4bc8e0e4d540bb1ca',
            'client_secret': '4c9a21c7b27157e7205af15ecdf9aefb',
            'code': response.code
        }
        AUTH_CODE_SHOP_MAPPING[response.code] = response.shop;
        serviceCommunicator.post(response.shop, '/admin/oauth/access_token', body, function(err, resp) {
            if(typeof resp === "string") {
                resp = JSON.parse(resp)
            }
            var currentThemeId = null;
            getAllShopThemes(resp.access_token, response.shop, function(err, themesResObj, shopDomain){
                console.log("####### thems === " + themesResObj)
                //var themesResObj = JSON.parse(themes);
                if (themesResObj && themesResObj.themes !== null &&
                    themesResObj.themes.length > 0) {
                    for (var i = 0; i < themesResObj.themes.length; i++) {
                        if (themesResObj.themes[i].role === 'main') {
                            currentThemeId = themesResObj.themes[i].id;
                        }
                    }
                }
                if(currentThemeId) {
                    getThemeAndReplace(currentThemeId, resp.access_token, shopDomain, function(err, rep) {
                        console.log(rep)
                    });
                }
            });
            console.log("####", err, resp);
        });
        /************************************************************/
        // REPLACE WITH ONBOARDING URL.

        res.redirect("https://quinjet.myshopify.com");
        console.log("!!!!!!!!!!!!  REDIRECT !!!!!!!!!!!");
        console.log(req.query);
        console.log(req.body);
        console.log(body);
    });