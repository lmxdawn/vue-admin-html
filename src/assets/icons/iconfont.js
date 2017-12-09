(function (window) {
    var svgSprite = '<svg><symbol id="icon-user" viewBox="0 0 1024 1024"><path d="M576 706.624l0-52.768c70.496-39.712 128-138.784 128-237.824 0-159.072 0-288-192-288s-192 128.928-192 288c0 99.072 57.504 198.112 128 237.824l0 52.768c-217.088 17.76-384 124.416-384 253.376l896 0c0-128.96-166.912-235.648-384-253.376z"  ></path></symbol><symbol id="icon-pwd" viewBox="0 0 1024 1024"><path d="M812.8 409.6H356.266667v-170.666667c0-55.466667 68.266667-119.466667 153.6-119.466666s153.6 64 153.6 119.466666v51.2c4.266667 29.866667 29.866667 51.2 55.466666 51.2 29.866667 0 55.466667-21.333333 59.733334-51.2V238.933333C778.666667 106.666667 659.2 0 509.866667 0S241.066667 106.666667 241.066667 238.933333v170.666667h-34.133334C151.466667 409.6 104.533333 456.533333 104.533333 512v409.6C104.533333 977.066667 151.466667 1024 206.933333 1024h610.133334c55.466667 0 102.4-46.933333 102.4-102.4V512c-4.266667-55.466667-51.2-102.4-106.666667-102.4z m-251.733333 379.733333v46.933334c0 29.866667-21.333333 51.2-51.2 51.2s-51.2-25.6-51.2-51.2v-46.933334c-38.4-21.333333-68.266667-59.733333-68.266667-106.666666 0-64 51.2-119.466667 119.466667-119.466667 64 0 119.466667 51.2 119.466666 119.466667 0 46.933333-29.866667 85.333333-68.266666 106.666666z"  ></path></symbol><symbol id="icon-eye" viewBox="0 0 2389 1024"><path d="M2389.333333 457.927683l-54.805799 65.426623-223.506733-215.761159A1062.669188 1062.669188 0 0 1 1754.489714 613.191221l104.037133 233.59945-75.754055 40.810956-105.621454-237.178843a1248.621626 1248.621626 0 0 1-447.541574 100.897828V1023.941321h-69.886195v-272.855423c-202.441121 5.251733-372.902412-37.877027-515.021947-105.621455L536.90906 887.454931l-75.842072-40.810956 107.587187-241.609077c-133.640479-77.309037-238.645808-175.419632-318.507364-270.273566l-195.341012 188.592974L0 457.927683l197.042691-190.235975C89.015415 122.051458 41.89651 0 41.89651 0h139.743052C539.842989 641.004871 1159.752908 614.423471 1159.752908 614.423471 1801.637958 644.261532 2137.836915 0 2137.836915 0h139.743052a1279.193169 1279.193169 0 0 1-117.650565 236.445361l229.433271 221.482322z" fill="#2C2C2C" ></path></symbol></svg>'
    var script = (function () {
        var scripts = document.getElementsByTagName('script')
        return scripts[scripts.length - 1]
    }())
    var shouldInjectCss = script.getAttribute('data-injectcss')
    var ready = function (fn) {
        if (document.addEventListener) {
            if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) { setTimeout(fn, 0) } else {
                var loadFn = function () {
                    document.removeEventListener('DOMContentLoaded', loadFn, false)
                    fn()
                }
                document.addEventListener('DOMContentLoaded', loadFn, false)
            }
        } else if (document.attachEvent) { IEContentLoaded(window, fn) }
        function IEContentLoaded (w, fn) {
            var d = w.document
            var done = false
            var init = function () {
                if (!done) {
                    done = true
                    fn()
                }
            }
            var polling = function () {
                try { d.documentElement.doScroll('left') } catch (e) {
                    setTimeout(polling, 50)
                    return
                }
                init()
            }
            polling()
            d.onreadystatechange = function () {
                if (d.readyState === 'complete') {
                    d.onreadystatechange = null
                    init()
                }
            }
        }
    }
    var before = function (el, target) { target.parentNode.insertBefore(el, target) }
    var prepend = function (el, target) { if (target.firstChild) { before(el, target.firstChild) } else { target.appendChild(el) } }

    function appendSvg () {
        var div, svg
        div = document.createElement('div')
        div.innerHTML = svgSprite
        svgSprite = null
        svg = div.getElementsByTagName('svg')[0]
        if (svg) {
            svg.setAttribute('aria-hidden', 'true')
            svg.style.position = 'absolute'
            svg.style.width = 0
            svg.style.height = 0
            svg.style.overflow = 'hidden'
            prepend(svg, document.body)
        }
    }

    if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
        window.__iconfont__svg__cssinject__ = true
        try { document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>') } catch (e) { console && console.log(e) }
    }
    ready(appendSvg)
})(window)
