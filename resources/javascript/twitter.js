function loadTweets() {
    var doc = new XMLHttpRequest()
    doc.onreadystatechange = function() {
        if(doc.readyState === XMLHttpRequest.DONE) {
            if (doc.status === 200) {
                var response = JSON.parse(doc.responseText)
                var today = Qt.formatDateTime(new Date(), "yyMMdd")
                model.clear()
                for (var i = 0; i < response.length; i++) {
                    if (Qt.formatDateTime(new Date(Date.parse(response[i].created_at)), "yyMMdd") == today)
                        model.append(response[i])
                }
            }
            else {
                console.log("Status: " + doc.status + ", Status Text: " + doc.statusText)
            }
        }
    }
    doc.open("GET", "https://api.twitter.com/1.1/direct_messages.json")
    var accessor = { consumerSecret: ""
                   , tokenSecret   : ""}
    var message = { method: "GET"
                  , action: "https://api.twitter.com/1.1/direct_messages.json"
                  , parameters: OAuthJS.OAuth.decodeForm("")
                  }
    message.parameters.push(["oauth_version", "1.0"])
    message.parameters.push(["oauth_consumer_key", ""])
    message.parameters.push(["oauth_token", ""])
    message.parameters.push(["oauth_timestamp", OAuthJS.OAuth.timestamp()])
    message.parameters.push(["oauth_nonce", OAuthJS.OAuth.nonce(11)])
    message.parameters.push(["oauth_signature_method", "HMAC-SHA1"])
    OAuthJS.OAuth.SignatureMethod.sign(message, accessor)
    OAuthJS.OAuth.SignatureMethod.normalizeParameters(message.parameters)
    OAuthJS.OAuth.SignatureMethod.getBaseString(message)
    OAuthJS.OAuth.getParameter(message.parameters, "oauth_signature")
    doc.setRequestHeader("Authorization", OAuthJS.OAuth.getAuthorizationHeader("", message.parameters))
    doc.send()
}
