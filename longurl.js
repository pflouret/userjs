// ==UserScript==
// @name longurl
// @author quux.com.ar
// @description Resolves shortened urls with the longurl service
// @license BSD License http://www.opensource.org/licenses/bsd-license.php
// ==/UserScript==

// probably a good idea to just include it for some sites, otherwise it might
// get annoying, e.g. add includes like the one below in the ==UserScript==
// section above.
// @include http://*twitter.com/*

(function () {
    // set to true to put a link with the original short url besides the expanded link
    var SHORT_URL_LINK = false;

    var services = {
        "0rz.tw": true, "2tu.us": true, "307.to": true, "6url.com": true,
        "a.gg": true, "a.nf": true, "a2n.eu": true, "ad.vu": true,
        "adf.ly": true, "adjix.com": true, "alturl.com": true, "atu.ca": true,
        "azqq.com": true, "b23.ru": true, "b65.com": true, "bacn.me": true,
        "bit.ly": true, "bloat.me": true, "budurl.com": true, "buk.me": true,
        "canurl.com": true, "chilp.it": true, "clck.ru": true, "cli.gs": true,
        "cliccami.info": true, "clipurl.us": true, "clop.in": true, "cort.as": true,
        "cuturls.com": true, "decenturl.com": true, "doiop.com": true,
        "dwarfurl.com": true, "easyurl.net": true, "eepurl.com": true, "ewerl.com": true,
        "ff.im": true, "fff.to": true, "fhurl.com": true, "flingk.com": true,
        "flq.us": true, "fly2.ws": true, "fwd4.me": true, "fwdurl.net": true,
        "g8l.us": true, "gl.am": true, "go.9nl.com": true, "goshrink.com": true,
        "hex.io": true, "href.in": true, "htxt.it": true, "hugeurl.com": true,
        "hurl.ws": true, "icanhaz.com": true, "idek.net": true, "is.gd": true,
        "jijr.com": true, "kissa.be": true, "kl.am": true, "klck.me": true,
        "korta.nu": true, "l9k.net": true, "liip.to": true, "liltext.com": true,
        "lin.cr": true, "linkgap.com": true, "liurl.cn": true, "ln-s.net": true,
        "ln-s.ru": true, "lnkurl.com": true, "lru.jp": true, "lu.to": true,
        "lurl.no": true, "memurl.com": true, "merky.de": true, "migre.me": true,
        "minilien.com": true, "moourl.com": true, "myurl.in": true, "nanoref.com": true,
        "nanourl.se": true, "netnet.me": true, "ni.to": true, "nn.nf": true,
        "notlong.com": true, "nutshellurl.com": true, "o-x.fr": true, "offur.com": true,
        "omf.gd": true, "onsaas.info": true, "ow.ly": true, "parv.us": true,
        "peaurl.com": true, "ping.fm": true, "piurl.com": true, "plumurl.com": true,
        "plurl.me": true, "pnt.me": true, "poprl.com": true, "post.ly": true,
        "ptiturl.com": true, "qlnk.net": true, "qurlyq.com": true, "r.im": true,
        "rb6.me": true, "rde.me": true, "reallytinyurl.com": true, "redir.ec": true,
        "redirects.ca": true, "redirx.com": true, "ri.ms": true, "rickroll.it": true,
        "rubyurl.com": true, "s3nt.com": true, "s7y.us": true, "shink.de": true,
        "short.ie": true, "short.to": true, "shortenurl.com": true, "shorterlink.com": true,
        "shortlinks.co.uk": true, "shoturl.us": true, "shredurl.com": true, "shrinkify.com": true,
        "shrinkr.com": true, "shrinkurl.us": true, "shrtnd.com": true, "shurl.net": true,
        "shw.me": true, "smallr.com": true, "smurl.com": true, "sn.im": true,
        "sn.vc": true, "snadr.it": true, "snipr.com": true, "snipurl.com": true,
        "snurl.com": true, "sp2.ro": true, "spedr.com": true, "srnk.net": true,
        "srs.li": true, "starturl.com": true, "surl.co.uk": true, "ta.gd": true,
        "tcrn.ch": true, "tgr.me": true, "tighturl.com": true, "tiny.cc": true,
        "tiny.pl": true, "tinylink.com": true, "tinyurl.com": true, "to.ly": true,
        "togoto.us": true, "tr.im": true, "tra.kz": true, "trunc.it": true,
        "tubeurl.com": true, "twitclicks.com": true, "twitterurl.net": true, "twiturl.de": true,
        "twurl.cc": true, "twurl.nl": true, "u.mavrev.com": true, "u.nu": true,
        "u76.org": true, "ub0.cc": true, "ulu.lu": true, "updating.me": true,
        "ur1.ca": true, "url.az": true, "url.co.uk": true, "url.ie": true,
        "urlborg.com": true, "urlbrief.com": true, "urlcut.com": true, "urlcutter.com": true,
        "urlhawk.com": true, "urlkiss.com": true, "urlpire.com": true, "urlvi.be": true,
        "urlx.ie": true, "virl.com": true, "wapurl.co.uk": true, "wipi.es": true,
        "x.se": true, "xil.in": true, "xrl.in": true, "xrl.us": true,
        "xurl.jp": true, "xzb.cc": true, "yatuc.com": true, "yep.it": true,
        "yfrog.com": true, "zi.ma": true, "zurl.ws": true, "zz.gd": true,
        "zzang.kr": true, "›.ws": true, "✩.ws": true, "✿.ws": true,
        "❥.ws": true, "➔.ws": true, "➞.ws": true, "➡.ws": true,
        "➨.ws": true, "➯.ws": true, "➹.ws": true, "➽.ws": true
    }

    function getDomain(url) {
        var domain = url.match(/^http:\/\/(?:(?:[^@]+@)?(?:www\.)?(?:[^\.]+\.(notlong\.com|qlnk\.net|ni\.to|lu\.to|zzang\.kr)|([^\.]+\.[^\/]+)))/i);
        return domain && (domain[1] || domain[2]) || false;
    }

    function replaceLink(link, info) {
        if (SHORT_URL_LINK) {
            // FIXME? these links could probably be re-expanded
            var sup = document.createElement("sup");
            sup.innerHTML = ' <a href="'+link.href+'" title="original short url">o</a>';
            link.parentNode.insertBefore(sup, l.nextSibling);
        }

        if (link.innerHTML == link.href) {
            link.innerHTML = info["long-url"];
            if (!link.title) {
                link.title = info["title"];
            }
        }
        link.href = info["long-url"];
    }

    document.addEventListener("DOMContentLoaded",
        function() {
            var links = document.getElementsByTagName("a");
            var cur_domain = getDomain(document.location.href);

            if (opera.scriptStorage && opera.scriptStorage.length > 500) {
                opera.scriptStorage.clear(); // nuke it every once in a while
            }

            for (var i=0; i < links.length; i++) {
                var link = links[i];
                var domain = getDomain(link.href);
                if (link.href && domain != cur_domain && services[domain]) {
                    if (opera.scriptStorage && opera.scriptStorage[link.href]) {
                        try {
                            replaceLink(link, JSON.parse(opera.scriptStorage[link.href]));
                            continue;
                        } catch(e) {};
                    }

                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "http://api.longurl.org/v2/expand?format=json&title=1&url="+escape(link.href)+"&callback=cb"+i;
                    (function (l) {
                        window['cb'+i] = function (r) {
                            if (opera.scriptStorage) {
                                opera.scriptStorage[l.href] = JSON.stringify(r);
                            }
                            replaceLink(l, r);
                        }
                    })(link);
                    document.body.appendChild(script);
                }
            }
        }, false);
})();

