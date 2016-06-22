/*
What's this?

So - the kloudless JS UI file explorer makes the whole kloudless API service worth using,
however, I can't get it to build from source :
https://github.com/Kloudless/file-explorer  
(or even get it to work for that matter)
However, it does work from the jsfiddle example they give :
http://jsfiddle.net/pseudonumos/PB565/embedded/
But that uses a built version (and obfuscated version) :
(see http://jsfiddle.net/pseudonumos/PB565/?utm_source=website&utm_medium=embed&utm_campaign=PB565)
https://static-cdn.kloudless.com/p/platform/sdk/kloudless.explorer.js
SO - that JS is the only working version of the kloudless explorer we have,
and the "kloudless.explorer.js" file here is just a copy of that.
This file is simply that file run through a beautifier
(this one : http://jsbeautifier.org/)

*/
! function() {
    "use strict";

    function a(a, b) {
        a.className += " " + b
    }

    function b(a, b) {
        for (var c = a.className; - 1 != c.indexOf(b);) c = c.replace(b, ""), c = c.trim();
        a.className = c
    }

    function c() {
        return navigator.userAgent.match(/(iPad|iPhone|iPod|android|Android)/g) ? !0 : !1
    }
    var d, e;
    if (document.currentScript) d = document.currentScript;
    else {
        var f = document.getElementsByTagName("script");
        d = f[f.length - 1]
    }
    var g = d.getAttribute("data-kloudless-object") || "Kloudless";
    void 0 === window[g] && (window[g] = {}), e = window[g], e.explorerUrl = "https://static-cdn.kloudless.com/p/platform/explorer/explorer.html", e._frames = {}, e._explorers = {}, e._queuedAction = {};
    var h = e._frames,
        i = e._explorers,
        j = e._queuedAction,
        k = null,
        l = null,
        m = document.createElement("style"),
        n = "iframe.kloudless-modal,iframe.kloudless-modal-dropzone{display:block;box-sizing:border-box;position:fixed;top:50%;left:50%;width:700px;height:515px;margin-top:-250px;margin-left:-350px;border:solid 1px #ccc;border-radius:4px;box-shadow:0 14px 20px rgba(0,0,0,0.08);transition:all 0;-webkit-transition:all 0;z-index:999;}@media only screen and (max-width:750px),only screen and (max-device-width:750px){iframe.kloudless-modal,iframe.kloudless-modal-dropzone{width:100%;height:100%;position:fixed !important;margin:0;top:0;left:0}iframe.kloudless-modal html,iframe.kloudless-modal-dropzone html,iframe.kloudless-modal body,iframe.kloudless-modal-dropzone body{overflow:hidden}}iframe.kloudless-modal-dropzone{position:relative;top:0;left:0;margin-top:0;margin-left:0}.backdrop_div{position:fixed;margin:0;top:0;left:0;padding:0;width:100%;height:100%;display:none;background-color:#000;z-index:998;opacity:.6}";
    m.type = "text/css", m.styleSheet ? m.styleSheet.cssText = n : m.appendChild(document.createTextNode(n)), document.getElementsByTagName("head")[0].appendChild(m),
        function() {
            var a = e.explorerUrl.split("://", 2),
                b = a[0] + "://" + a[1].split("/")[0];
            window.addEventListener("message", function(a) {
                if (a.origin === b) {
                    var c, d = JSON.parse(a.data),
                        f = d.exp_id;
                    c = e._explorers[f], c && c._fire.apply(c, [d.action, d.data])
                }
            })
        }();
    var o = function(b, d) {
        var f = Math.floor(Math.random() * Math.pow(10, 12)),
            g = document.createElement("iframe");
        c() && g.setAttribute("scrolling", "no"), g.setAttribute("class", "kloudless-modal"), g.setAttribute("src", e.explorerUrl + "?app_id=" + b.app_id + "&exp_id=" + f + "&flavor=" + b.flavor + "&origin=" + encodeURIComponent(window.location.protocol + "//" + window.location.host) + "&multiselect=" + b.multiselect + "&link=" + b.link + "&computer=" + b.computer + "&copy_to_upload_location=" + b.copy_to_upload_location + "&services=" + JSON.stringify(b.services) + "&persist=" + JSON.stringify(b.persist) + "&account_key=" + b.account_key + "&create_folder=" + b.create_folder + "&types=" + JSON.stringify(b.types)), g.style.display = "none", h[f] = g;
        var i = document.getElementsByTagName("body")[0];
        if (d) {
            var j = document.getElementById(d);
            j.appendChild(g)
        } else i.appendChild(g);
        if (!k) {
            var l = document.createElement("div");
            k = i.appendChild(l), a(k, "backdrop_div")
        }
        return f
    };
    e._fileWidget = function(a) {
        this._setOptions(a), this.handlers = {}, this.defaultHandlers = {}
    }, e._fileWidget.prototype._setOptions = function(a) {
        if (a = a || {}, !a.app_id) throw new Error("You need to specify an app ID.");
        return this.options = a, this.app_id = a.app_id, this.exp_id = a.exp_id, this.elementId = a.elementId, this.flavor = void 0 === a.flavor ? "chooser" : a.flavor, this.multiselect = void 0 === a.multiselect ? !1 : a.multiselect, this.link = void 0 === a.link ? !0 : a.link, this.computer = void 0 === a.computer ? !1 : a.computer, this.copy_to_upload_location = void 0 === a.copy_to_upload_location ? !1 : a.copy_to_upload_location, this.create_folder = void 0 === a.create_folder ? !0 : a.create_folder, this.account_key = void 0 === a.account_key ? !1 : a.account_key, this.persist = void 0 === a.persist ? "local" : a.persist, this.display_backdrop = void 0 === a.display_backdrop ? !1 : a.display_backdrop, this.services = a.services || null, this.files = a.files || [], this.types = a.types || [], this.files instanceof Array || (this.files = []), this.types instanceof Array || (this.types = [this.types]), this.types = this.types.map(function(a) {
            return a.substr(a.lastIndexOf(".") + 1)
        }), this.options.link_options || (this.options.link_options = {}), this.options.link_options.direct = void 0 === a.direct_link ? !1 : a.direct_link, this
    }, e._fileWidget.prototype.on = function(a, b) {
        return void 0 === this.handlers[a] && (this.handlers[a] = []), this.handlers[a].push(b), this
    }, e._fileWidget.prototype._fire = function(a, b) {
        var c = this; - 1 != ["success", "cancel"].indexOf(a) && c.close();
        var d = c.defaultHandlers[a];
        if (d && window.setTimeout(function() {
                d.call(c, b)
            }, 0), void 0 !== c.handlers[a])
            for (var e = 0; e < c.handlers[a].length; e++) ! function(a) {
                window.setTimeout(function() {
                    a.call(c, b)
                }, 0)
            }(c.handlers[a][e]);
        return c
    }, e.explorer = function(a) {
        var b = new e._explorer(a);
        b.on("load", function() {
            if (b.message("INIT", {
                    options: a
                }), b.loaded = !0, j[b.exp_id]) {
                var c = j[b.exp_id].method,
                    d = j[b.exp_id].args;
                delete j[b.exp_id], c.apply(b, d)
            }
        });
        var c = o({
            app_id: b.app_id,
            exp_id: b.exp_id,
            flavor: b.flavor,
            multiselect: b.multiselect,
            link: b.link,
            computer: b.computer,
            copy_to_upload_location: b.copy_to_upload_location,
            account_key: b.account_key,
            services: b.services,
            persist: b.persist,
            types: b.types,
            create_folder: b.create_folder
        }, b.elementId);
        return b.exp_id = c, b.defaultHandlers.close = function() {
            var a = h[b.exp_id];
            p.fadeOut(a, {
                duration: 200,
                complete: function() {
                    a.style.display = "none"
                }
            })
        }, i[b.exp_id] = b, b
    }, e._explorer = function(a) {
        e._fileWidget.call(this, a)
    }, e._explorer.prototype = Object.create(e._fileWidget.prototype), e._explorer.prototype.constructor = e._explorer, Object.defineProperty(e._explorer.prototype, "constructor", {
        enumerable: !1,
        value: e._explorer
    }), e._explorer.prototype.message = function(a, b) {
        var c = this;
        h[c.exp_id].contentWindow.postMessage(JSON.stringify({
            action: a,
            data: b
        }), e.explorerUrl)
    }, e._explorer.prototype.update = function(a) {
        var b = this;
        b.message("DATA", {
            options: a
        });
        for (var c = Object.keys(a), d = 0; d < c.length; d++) {
            var e = c[d];
            this.options[e] = a[e]
        }
    }, e._explorer.prototype.choose = function() {
        var a = this;
        return a.loaded ? (a._open({
            flavor: "chooser"
        }), a) : void(j[a.exp_id] = {
            method: a.choose
        })
    }, e._explorer.prototype.save = function(a) {
        var b = this;
        return b.loaded ? (a instanceof Array || (a = []), a = b.files.concat(a), a.length < 1 ? void console.log("ERROR: No files to save") : (b._open({
            flavor: "saver",
            files: a
        }), b)) : void(j[b.exp_id] = {
            method: b.save,
            args: [a]
        })
    }, e._explorer.prototype._open = function(b) {
        var d = this,
            f = document.getElementsByTagName("body")[0];
        return b.options = this.options, d.message("DATA", b), e._fileWidget.lastScrollTop = f.scrollTop, c() && (f.scrollTop = 0), h[d.exp_id].style.display = "block", h[d.exp_id].style.opacity = 0, a(f, "kfe-active"), p.fadeIn(h[d.exp_id], {
            duration: 200
        }), d.display_backdrop && (k.style.display = "block", l = f.style.overflow, f.style.overflow = "hidden"), d._fire("open"), d
    }, e._explorer.prototype.close = function() {
        var a = this,
            d = document.getElementsByTagName("body")[0];
        if (!a.loaded) return void(j[a.exp_id] = {
            method: a.close
        });
        a.message("CLOSING"), b(d, "kfe-active");
        var f = e._fileWidget.lastScrollTop;
        "undefined" != typeof f && c && (d.scrollTop = f), a.display_backdrop && (k.style.display = "none", d.style.overflow = l), a._fire("close")
    }, e._explorer.prototype.choosify = function(a) {
        var b = this;
        if (a instanceof Array)
            for (var c = 0; c < a.length; c++) {
                var d = a[c];
                d.addEventListener("click", function() {
                    b.choose()
                })
            } else if (void 0 !== window.jQuery && a instanceof window.jQuery)
                for (var c = 0; c < a.length; c++) {
                    var d = a.get(c);
                    d.addEventListener("click", function() {
                        b.choose()
                    })
                } else a.addEventListener("click", function() {
                    b.choose()
                });
        return this
    }, e._explorer.prototype.savify = function(a, b) {
        var c = this;
        if (a instanceof Array)
            for (var d = 0; d < a.length; d++) e.addEventListener("click", function() {
                c.save(b)
            });
        else if (void 0 !== window.jQuery && a instanceof window.jQuery)
            for (var d = 0; d < a.length; d++) {
                var e = a.get(d);
                e.addEventListener("click", function() {
                    c.save(b)
                })
            } else a.addEventListener("click", function() {
                c.save(b)
            });
        return this
    }, e.dropzone = function(a) {
        return new e._dropzone(a)
    }, e._dropzone = function(a) {
        if (a = a || {}, this.elementId = a.elementId, delete a.elementId, !this.elementId) throw new Error("Please specify the elementId for the dropzone to be bound to.");
        this.dropExplorer = e.explorer({
            app_id: a.app_id,
            flavor: "dropzone",
            multiselect: a.multiselect,
            elementId: this.elementId
        }), this.clickExplorer = e.explorer(a), this.dropExplorerFrame = h[this.dropExplorer.exp_id], this.clickExplorerFrame = h[this.clickExplorer.exp_id], this._configureFrame()
    }, e._dropzone.prototype._configureFrame = function() {
        var a = document.getElementById(this.elementId),
            b = this.dropExplorerFrame,
            c = this.dropExplorer,
            d = this.clickExplorer;
        return c.defaultHandlers.close = function() {
            b.style.opacity = "1"
        }, b.style.display = "block", b.style.opacity = "1", b.style.height = "100%", b.style.width = "100%", b.setAttribute("class", "kloudless-modal-dropzone"), b.onload = function() {
            c.on("dropzoneClicked", function() {
                d._open({
                    flavor: "chooser"
                })
            }), c.on("drop", function() {
                a.style.width = "700px", a.style.height = "515px", a.style["border-style"] = "none", b.style.opacity = "1"
            });
            var e = window.getComputedStyle(a),
                f = e.height,
                g = e.width,
                h = e["border-style"];
            c.on("close", function() {
                a.style.height = f, a.style.width = g, a.style["border-style"] = h, c._open({
                    flavor: "dropzone"
                })
            })
        }, b
    }, e._dropzone.prototype.on = function(a, b) {
        return this.dropExplorer.on(a, b), this.clickExplorer.on(a, b), this
    }, e._dropzone.prototype.close = function() {
        this.dropExplorer.close(), this.clickExplorer.close()
    }, e._dropzone.prototype.update = function(a) {
        this.dropExplorer.update(a), this.clickExplorer.update(a)
    };
    var p = {
        easing: {
            linear: function(a) {
                return a
            },
            quadratic: function(a) {
                return Math.pow(a, 2)
            }
        },
        animate: function(a) {
            var b = new Date,
                c = setInterval(function() {
                    var d = new Date - b,
                        e = d / a.duration;
                    e > 1 && (e = 1), a.progress = e;
                    var f = a.delta(e);
                    a.step(f), 1 == e && (clearInterval(c), "undefined" != typeof a.complete && a.complete())
                }, a.delay || 10)
        },
        fadeOut: function(a, b) {
            var c = 1;
            this.animate({
                duration: b.duration,
                delta: function(a) {
                    return a = this.progress, p.easing.quadratic(a)
                },
                complete: b.complete,
                step: function(b) {
                    a.style.opacity = c - b
                }
            })
        },
        fadeIn: function(a, b) {
            var c = 0;
            this.animate({
                duration: b.duration,
                delta: function(a) {
                    return a = this.progress, p.easing.quadratic(a)
                },
                complete: b.complete,
                step: function(b) {
                    a.style.opacity = c + b
                }
            })
        }
    }
}(),
function() {
    "use strict";
    if (window.Event.prototype.preventDefault || (window.Event.prototype.preventDefault = function() {
            this.returnValue = !1
        }), !Element.prototype.addEventListener) {
        var a = [],
            b = function(b, c) {
                var d = this,
                    e = function(a) {
                        a.target = a.srcElement, a.currentTarget = d, c.handleEvent ? c.handleEvent(a) : c.call(d, a)
                    };
                this.attachEvent("on" + b, e), a.push({
                    object: this,
                    type: b,
                    listener: c,
                    wrapper: e
                })
            },
            c = function(b, c) {
                for (var d = 0; d < a.length;) {
                    var e = a[d];
                    if (e.object == this && e.type == b && e.listener == c) {
                        this.detachEvent("on" + b, e.wrapper);
                        break
                    }++d
                }
            };
        Element.prototype.addEventListener = b, Element.prototype.removeEventListener = c, window.HTMLDocument && (window.HTMLDocument.prototype.addEventListener = b, window.HTMLDocument.prototype.removeEventListener = c), window.Window && (window.Window.prototype.addEventListener = b, window.Window.prototype.removeEventListener = c)
    }
    window.console = window.console || {
        log: function() {}
    }
}();