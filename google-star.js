// ==UserScript==
// @include http://www.google.*/search*
// @name google-star
// @author quux.com.ar
// @description Remove the annoying star from google results
// @license BSD License http://www.opensource.org/licenses/bsd-license.php
// ==/UserScript==

(function () {
    document.addEventListener("DOMContentLoaded",
        function() {
            var r = document.querySelectorAll("button.ws");
            for (var i=0; i < r.length; i++) {
                r[i].parentNode.removeChild(r[i]);
            }
        }, false);
})();

