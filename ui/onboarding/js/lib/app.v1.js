(function(win, val) {
  /**
   * @param {string} qualifier
   * @return {?}
   */
  function isArraylike(qualifier) {
    var len = qualifier.length;
    var type = jQuery.type(qualifier);
    return jQuery.isWindow(qualifier) ? false : 1 === qualifier.nodeType && len ? true : "array" === type || "function" !== type && (0 === len || "number" == typeof len && (len > 0 && len - 1 in qualifier));
  }
  /**
   * @param {string} options
   * @return {?}
   */
  function createOptions(options) {
    var buf = optionsCache[options] = {};
    return jQuery.each(options.match(core_rnotwhite) || [], function(dataAndEvents, off) {
      /** @type {boolean} */
      buf[off] = true;
    }), buf;
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {string} attr
   * @param {boolean} data
   * @return {?}
   */
  function get(elem, name, attr, data) {
    if (jQuery.acceptData(elem)) {
      var index;
      var result;
      var internalKey = jQuery.expando;
      var isNode = elem.nodeType;
      var cache = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
      if (id && (cache[id] && (data || cache[id].data)) || (attr !== val || "string" != typeof name)) {
        return id || (id = isNode ? elem[internalKey] = core_deletedIds.pop() || jQuery.guid++ : internalKey), cache[id] || (cache[id] = isNode ? {} : {
          toJSON : jQuery.noop
        }), ("object" == typeof name || "function" == typeof name) && (data ? cache[id] = jQuery.extend(cache[id], name) : cache[id].data = jQuery.extend(cache[id].data, name)), result = cache[id], data || (result.data || (result.data = {}), result = result.data), attr !== val && (result[jQuery.camelCase(name)] = attr), "string" == typeof name ? (index = result[name], null == index && (index = result[jQuery.camelCase(name)])) : index = result, index;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {boolean} skipped
   * @return {undefined}
   */
  function cb(elem, name, skipped) {
    if (jQuery.acceptData(elem)) {
      var cache;
      var i;
      var isNode = elem.nodeType;
      var response = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[jQuery.expando] : jQuery.expando;
      if (response[id]) {
        if (name && (cache = skipped ? response[id] : response[id].data)) {
          if (jQuery.isArray(name)) {
            name = name.concat(jQuery.map(name, jQuery.camelCase));
          } else {
            if (name in cache) {
              /** @type {Array} */
              name = [name];
            } else {
              name = jQuery.camelCase(name);
              name = name in cache ? [name] : name.split(" ");
            }
          }
          i = name.length;
          for (;i--;) {
            delete cache[name[i]];
          }
          if (skipped ? !filter(cache) : !jQuery.isEmptyObject(cache)) {
            return;
          }
        }
        if (skipped || (delete response[id].data, filter(response[id]))) {
          if (isNode) {
            jQuery.cleanData([elem], true);
          } else {
            if (jQuery.support.deleteExpando || response != response.window) {
              delete response[id];
            } else {
              /** @type {null} */
              response[id] = null;
            }
          }
        }
      }
    }
  }
  /**
   * @param {string} qualifier
   * @param {string} key
   * @param {string} data
   * @return {?}
   */
  function dataAttr(qualifier, key, data) {
    if (data === val && 1 === qualifier.nodeType) {
      var elem = "data-" + key.replace(r20, "-$1").toLowerCase();
      if (data = qualifier.getAttribute(elem), "string" == typeof data) {
        try {
          data = "true" === data ? true : "false" === data ? false : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (o) {
        }
        jQuery.data(qualifier, key, data);
      } else {
        /** @type {string} */
        data = val;
      }
    }
    return data;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function filter(obj) {
    var name;
    for (name in obj) {
      if (("data" !== name || !jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) {
        return false;
      }
    }
    return true;
  }
  /**
   * @return {?}
   */
  function returnTrue() {
    return true;
  }
  /**
   * @return {?}
   */
  function returnFalse() {
    return false;
  }
  /**
   * @return {?}
   */
  function safeActiveElement() {
    try {
      return node.activeElement;
    } catch (e) {
    }
  }
  /**
   * @param {Object} cur
   * @param {string} dir
   * @return {?}
   */
  function sibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && 1 !== cur.nodeType);
    return cur;
  }
  /**
   * @param {string} name
   * @param {string} qualifier
   * @param {boolean} not
   * @return {?}
   */
  function winnow(name, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(name, function(elem, i) {
        return!!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(name, function(elem) {
        return elem === qualifier !== not;
      });
    }
    if ("string" == typeof qualifier) {
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, name, not);
      }
      qualifier = jQuery.filter(qualifier, name);
    }
    return jQuery.grep(name, function(arg) {
      return jQuery.inArray(arg, qualifier) >= 0 !== not;
    });
  }
  /**
   * @param {(Document|DocumentFragment)} ctx
   * @return {?}
   */
  function draw(ctx) {
    /** @type {Array.<string>} */
    var braceStack = uHostName.split("|");
    var frag = ctx.createDocumentFragment();
    if (frag.createElement) {
      for (;braceStack.length;) {
        frag.createElement(braceStack.pop());
      }
    }
    return frag;
  }
  /**
   * @param {Node} elem
   * @param {Object} content
   * @return {?}
   */
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(1 === content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function restoreScript(elem) {
    return elem.type = (null !== jQuery.find.attr(elem, "type")) + "/" + elem.type, elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function fn(elem) {
    /** @type {(Array.<string>|null)} */
    var match = rscriptTypeMasked.exec(elem.type);
    return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
  }
  /**
   * @param {(Array|NodeList)} elems
   * @param {Array} refElements
   * @return {undefined}
   */
  function setGlobalEval(elems, refElements) {
    var node;
    /** @type {number} */
    var i = 0;
    for (;null != (node = elems[i]);i++) {
      jQuery._data(node, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
  }
  /**
   * @param {Object} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneCopyEvent(src, dest) {
    if (1 === dest.nodeType && jQuery.hasData(src)) {
      var type;
      var i;
      var ilen;
      var oldData = jQuery._data(src);
      var curData = jQuery._data(dest, oldData);
      var events = oldData.events;
      if (events) {
        delete curData.handle;
        curData.events = {};
        for (type in events) {
          /** @type {number} */
          i = 0;
          ilen = events[type].length;
          for (;ilen > i;i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
      if (curData.data) {
        curData.data = jQuery.extend({}, curData.data);
      }
    }
  }
  /**
   * @param {Element} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneFixAttributes(src, dest) {
    var name;
    var type;
    var pdataCur;
    if (1 === dest.nodeType) {
      if (name = dest.nodeName.toLowerCase(), !jQuery.support.noCloneEvent && dest[jQuery.expando]) {
        pdataCur = jQuery._data(dest);
        for (type in pdataCur.events) {
          jQuery.removeEvent(dest, type, pdataCur.handle);
        }
        dest.removeAttribute(jQuery.expando);
      }
      if ("script" === name && dest.text !== src.text) {
        restoreScript(dest).text = src.text;
        fn(dest);
      } else {
        if ("object" === name) {
          if (dest.parentNode) {
            dest.outerHTML = src.outerHTML;
          }
          if (jQuery.support.html5Clone) {
            if (src.innerHTML) {
              if (!jQuery.trim(dest.innerHTML)) {
                dest.innerHTML = src.innerHTML;
              }
            }
          }
        } else {
          if ("input" === name && manipulation_rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
              dest.value = src.value;
            }
          } else {
            if ("option" === name) {
              dest.defaultSelected = dest.selected = src.defaultSelected;
            } else {
              if ("input" === name || "textarea" === name) {
                dest.defaultValue = src.defaultValue;
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {Node} context
   * @param {string} tag
   * @return {?}
   */
  function getAll(context, tag) {
    var opt_nodes;
    var node;
    /** @type {number} */
    var i = 0;
    var ret = typeof context.getElementsByTagName !== actual ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== actual ? context.querySelectorAll(tag || "*") : val;
    if (!ret) {
      /** @type {Array} */
      ret = [];
      opt_nodes = context.childNodes || context;
      for (;null != (node = opt_nodes[i]);i++) {
        if (!tag || jQuery.nodeName(node, tag)) {
          ret.push(node);
        } else {
          jQuery.merge(ret, getAll(node, tag));
        }
      }
    }
    return tag === val || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  /**
   * @param {Element} elem
   * @return {undefined}
   */
  function callback(elem) {
    if (manipulation_rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  /**
   * @param {Object} style
   * @param {string} name
   * @return {?}
   */
  function vendorPropName(style, name) {
    if (name in style) {
      return name;
    }
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    /** @type {string} */
    var origName = name;
    /** @type {number} */
    var i = cssPrefixes.length;
    for (;i--;) {
      if (name = cssPrefixes[i] + capName, name in style) {
        return name;
      }
    }
    return origName;
  }
  /**
   * @param {Object} b
   * @param {Function} a
   * @return {?}
   */
  function suiteView(b, a) {
    return b = a || b, "none" === jQuery.css(b, "display") || !jQuery.contains(b.ownerDocument, b);
  }
  /**
   * @param {Array} elements
   * @param {boolean} show
   * @return {?}
   */
  function showHide(elements, show) {
    var display;
    var elem;
    var hidden;
    /** @type {Array} */
    var values = [];
    /** @type {number} */
    var index = 0;
    var length = elements.length;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        values[index] = jQuery._data(elem, "olddisplay");
        display = elem.style.display;
        if (show) {
          if (!values[index]) {
            if (!("none" !== display)) {
              /** @type {string} */
              elem.style.display = "";
            }
          }
          if ("" === elem.style.display) {
            if (suiteView(elem)) {
              values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          }
        } else {
          if (!values[index]) {
            hidden = suiteView(elem);
            if (display && "none" !== display || !hidden) {
              jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
            }
          }
        }
      }
    }
    /** @type {number} */
    index = 0;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        if (!(show && ("none" !== elem.style.display && "" !== elem.style.display))) {
          elem.style.display = show ? values[index] || "" : "none";
        }
      }
    }
    return elements;
  }
  /**
   * @param {Object} second
   * @param {string} value
   * @param {Function} keepData
   * @return {?}
   */
  function setPositiveNumber(second, value, keepData) {
    /** @type {(Array.<string>|null)} */
    var iterator = r.exec(value);
    return iterator ? Math.max(0, iterator[1] - (keepData || 0)) + (iterator[2] || "px") : value;
  }
  /**
   * @param {string} elem
   * @param {string} keepData
   * @param {string} extra
   * @param {boolean} isBorderBox
   * @param {?} styles
   * @return {?}
   */
  function augmentWidthOrHeight(elem, keepData, extra, isBorderBox, styles) {
    /** @type {number} */
    var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === keepData ? 1 : 0;
    /** @type {number} */
    var val = 0;
    for (;4 > i;i += 2) {
      if ("margin" === extra) {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if ("content" === extra) {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if ("margin" !== extra) {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if ("padding" !== extra) {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  /**
   * @param {string} elem
   * @param {string} name
   * @param {string} extra
   * @return {?}
   */
  function getWidthOrHeight(elem, name, extra) {
    /** @type {boolean} */
    var valueIsBorderBox = true;
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight;
    var styles = getStyles(elem);
    var isBorderBox = jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles);
    if (0 >= val || null == val) {
      if (val = curCSS(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
      /** @type {number} */
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
  }
  /**
   * @param {?} nodeName
   * @return {?}
   */
  function defaultDisplay(nodeName) {
    /** @type {Document} */
    var doc = node;
    var display = elemdisplay[nodeName];
    return display || (display = actualDisplay(nodeName, doc), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement), doc = (iframe[0].contentWindow || iframe[0].contentDocument).document, doc.write("<!doctype html><html><body>"), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach()), elemdisplay[nodeName] = display), display;
  }
  /**
   * @param {?} name
   * @param {Document} doc
   * @return {?}
   */
  function actualDisplay(name, doc) {
    var el = jQuery(doc.createElement(name)).appendTo(doc.body);
    var displayStyle = jQuery.css(el[0], "display");
    return el.remove(), displayStyle;
  }
  /**
   * @param {string} prefix
   * @param {string} qualifier
   * @param {boolean} traditional
   * @param {Function} add
   * @return {undefined}
   */
  function buildParams(prefix, qualifier, traditional, add) {
    var name;
    if (jQuery.isArray(qualifier)) {
      jQuery.each(qualifier, function(i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
        }
      });
    } else {
      if (traditional || "object" !== jQuery.type(qualifier)) {
        add(prefix, qualifier);
      } else {
        for (name in qualifier) {
          buildParams(prefix + "[" + name + "]", qualifier[name], traditional, add);
        }
      }
    }
  }
  /**
   * @param {Object} structure
   * @return {?}
   */
  function addToPrefiltersOrTransports(structure) {
    return function(selector, fn) {
      if ("string" != typeof selector) {
        /** @type {(Function|string)} */
        fn = selector;
        /** @type {string} */
        selector = "*";
      }
      var node;
      /** @type {number} */
      var i = 0;
      var elem = selector.toLowerCase().match(core_rnotwhite) || [];
      if (jQuery.isFunction(fn)) {
        for (;node = elem[i++];) {
          if ("+" === node[0]) {
            node = node.slice(1) || "*";
            (structure[node] = structure[node] || []).unshift(fn);
          } else {
            (structure[node] = structure[node] || []).push(fn);
          }
        }
      }
    };
  }
  /**
   * @param {?} structure
   * @param {?} options
   * @param {Object} originalOptions
   * @param {?} jqXHR
   * @return {?}
   */
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    /**
     * @param {string} key
     * @return {?}
     */
    function inspect(key) {
      var oldName;
      return old[key] = true, jQuery.each(structure[key] || [], function(dataAndEvents, prefilterOrFactory) {
        var name = prefilterOrFactory(options, originalOptions, jqXHR);
        return "string" != typeof name || (seekingTransport || old[name]) ? seekingTransport ? !(oldName = name) : val : (options.dataTypes.unshift(name), inspect(name), false);
      }), oldName;
    }
    var old = {};
    /** @type {boolean} */
    var seekingTransport = structure === transports;
    return inspect(options.dataTypes[0]) || !old["*"] && inspect("*");
  }
  /**
   * @param {(Object|string)} target
   * @param {Object} src
   * @return {?}
   */
  function ajaxExtend(target, src) {
    var deep;
    var key;
    var flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== val) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    return deep && jQuery.extend(true, target, deep), target;
  }
  /**
   * @param {Object} s
   * @param {XMLHttpRequest} jqXHR
   * @param {Object} responses
   * @return {?}
   */
  function ajaxHandleResponses(s, jqXHR, responses) {
    var firstDataType;
    var ct;
    var finalDataType;
    var type;
    var contents = s.contents;
    var dataTypes = s.dataTypes;
    for (;"*" === dataTypes[0];) {
      dataTypes.shift();
      if (ct === val) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          /** @type {string} */
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          /** @type {string} */
          firstDataType = type;
        }
      }
      /** @type {(string|undefined)} */
      finalDataType = finalDataType || firstDataType;
    }
    return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType]) : val;
  }
  /**
   * @param {Object} s
   * @param {Object} response
   * @param {?} jqXHR
   * @param {Object} isSuccess
   * @return {?}
   */
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2;
    var current;
    var conv;
    var tmp;
    var prev;
    var converters = {};
    var dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    for (;current;) {
      if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && (isSuccess && (s.dataFilter && (response = s.dataFilter(response, s.dataType)))), prev = current, current = dataTypes.shift()) {
        if ("*" === current) {
          current = prev;
        } else {
          if ("*" !== prev && prev !== current) {
            if (conv = converters[prev + " " + current] || converters["* " + current], !conv) {
              for (conv2 in converters) {
                if (tmp = conv2.split(" "), tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else {
                    if (converters[conv2] !== true) {
                      /** @type {string} */
                      current = tmp[0];
                      dataTypes.unshift(tmp[1]);
                    }
                  }
                  break;
                }
              }
            }
            if (conv !== true) {
              if (conv && s["throws"]) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (e) {
                  return{
                    state : "parsererror",
                    error : conv ? e : "No conversion from " + prev + " to " + current
                  };
                }
              }
            }
          }
        }
      }
    }
    return{
      state : "success",
      data : response
    };
  }
  /**
   * @return {?}
   */
  function createStandardXHR() {
    try {
      return new win.XMLHttpRequest;
    } catch (t) {
    }
  }
  /**
   * @return {?}
   */
  function createActiveXHR() {
    try {
      return new win.ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {
    }
  }
  /**
   * @return {?}
   */
  function createFxNow() {
    return setTimeout(function() {
      /** @type {string} */
      fxNow = val;
    }), fxNow = jQuery.now();
  }
  /**
   * @param {?} object
   * @param {?} target
   * @param {?} arg
   * @return {?}
   */
  function clone(object, target, arg) {
    var index;
    var q = (cache[target] || []).concat(cache["*"]);
    /** @type {number} */
    var i = 0;
    var l = q.length;
    for (;l > i;i++) {
      if (index = q[i].call(arg, target, object)) {
        return index;
      }
    }
  }
  /**
   * @param {string} elem
   * @param {?} properties
   * @param {Object} options
   * @return {?}
   */
  function Animation(elem, properties, options) {
    var result;
    var i;
    /** @type {number} */
    var index = 0;
    /** @type {number} */
    var length = animationPrefilters.length;
    var deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    });
    /**
     * @return {?}
     */
    var tick = function() {
      if (i) {
        return false;
      }
      var currentTime = fxNow || createFxNow();
      /** @type {number} */
      var remaining = Math.max(0, animation.startTime + animation.duration - currentTime);
      /** @type {number} */
      var temp = remaining / animation.duration || 0;
      /** @type {number} */
      var percent = 1 - temp;
      /** @type {number} */
      var index = 0;
      var startOffset = animation.tweens.length;
      for (;startOffset > index;index++) {
        animation.tweens[index].run(percent);
      }
      return deferred.notifyWith(elem, [animation, percent, remaining]), 1 > percent && startOffset ? remaining : (deferred.resolveWith(elem, [animation]), false);
    };
    var animation = deferred.promise({
      elem : elem,
      props : jQuery.extend({}, properties),
      opts : jQuery.extend(true, {
        specialEasing : {}
      }, options),
      originalProperties : properties,
      originalOptions : options,
      startTime : fxNow || createFxNow(),
      duration : options.duration,
      tweens : [],
      /**
       * @param {string} prop
       * @param {string} end
       * @return {?}
       */
      createTween : function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        return animation.tweens.push(tween), tween;
      },
      /**
       * @param {boolean} gotoEnd
       * @return {?}
       */
      stop : function(gotoEnd) {
        /** @type {number} */
        var index = 0;
        var length = gotoEnd ? animation.tweens.length : 0;
        if (i) {
          return this;
        }
        /** @type {boolean} */
        i = true;
        for (;length > index;index++) {
          animation.tweens[index].run(1);
        }
        return gotoEnd ? deferred.resolveWith(elem, [animation, gotoEnd]) : deferred.rejectWith(elem, [animation, gotoEnd]), this;
      }
    });
    var props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (;length > index;index++) {
      if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) {
        return result;
      }
    }
    return jQuery.map(props, clone, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
      elem : elem,
      anim : animation,
      queue : animation.opts.queue
    })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  /**
   * @param {Object} obj
   * @param {Object} paramMap
   * @return {undefined}
   */
  function propFilter(obj, paramMap) {
    var key;
    var name;
    var value;
    var val;
    var hooks;
    for (key in obj) {
      if (name = jQuery.camelCase(key), value = paramMap[name], val = obj[key], jQuery.isArray(val) && (value = val[1], val = obj[key] = val[0]), key !== name && (obj[name] = val, delete obj[key]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) {
        val = hooks.expand(val);
        delete obj[name];
        for (key in val) {
          if (!(key in obj)) {
            obj[key] = val[key];
            paramMap[key] = value;
          }
        }
      } else {
        paramMap[name] = value;
      }
    }
  }
  /**
   * @param {string} qualifier
   * @param {Object} props
   * @param {Object} opts
   * @return {undefined}
   */
  function defaultPrefilter(qualifier, props, opts) {
    var name;
    var value;
    var thisp;
    var options;
    var hooks;
    var oldfire;
    var settings = this;
    var prop = {};
    var elStyle = qualifier.style;
    var hidden = qualifier.nodeType && suiteView(qualifier);
    var dataShow = jQuery._data(qualifier, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(qualifier, "fx");
      if (null == hooks.unqueued) {
        /** @type {number} */
        hooks.unqueued = 0;
        /** @type {function (): undefined} */
        oldfire = hooks.empty.fire;
        /**
         * @return {undefined}
         */
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      settings.always(function() {
        settings.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(qualifier, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (1 === qualifier.nodeType) {
      if ("height" in props || "width" in props) {
        /** @type {Array} */
        opts.overflow = [elStyle.overflow, elStyle.overflowX, elStyle.overflowY];
        if ("inline" === jQuery.css(qualifier, "display")) {
          if ("none" === jQuery.css(qualifier, "float")) {
            if (jQuery.support.inlineBlockNeedsLayout && "inline" !== defaultDisplay(qualifier.nodeName)) {
              /** @type {number} */
              elStyle.zoom = 1;
            } else {
              /** @type {string} */
              elStyle.display = "inline-block";
            }
          }
        }
      }
    }
    if (opts.overflow) {
      /** @type {string} */
      elStyle.overflow = "hidden";
      if (!jQuery.support.shrinkWrapBlocks) {
        settings.always(function() {
          elStyle.overflow = opts.overflow[0];
          elStyle.overflowX = opts.overflow[1];
          elStyle.overflowY = opts.overflow[2];
        });
      }
    }
    for (name in props) {
      if (value = props[name], rplusequals.exec(value)) {
        if (delete props[name], thisp = thisp || "toggle" === value, value === (hidden ? "hide" : "show")) {
          continue;
        }
        prop[name] = dataShow && dataShow[name] || jQuery.style(qualifier, name);
      }
    }
    if (!jQuery.isEmptyObject(prop)) {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = jQuery._data(qualifier, "fxshow", {});
      }
      if (thisp) {
        /** @type {boolean} */
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(qualifier).show();
      } else {
        settings.done(function() {
          jQuery(qualifier).hide();
        });
      }
      settings.done(function() {
        var name;
        jQuery._removeData(qualifier, "fxshow");
        for (name in prop) {
          jQuery.style(qualifier, name, prop[name]);
        }
      });
      for (name in prop) {
        options = clone(hidden ? dataShow[name] : 0, name, settings);
        if (!(name in dataShow)) {
          dataShow[name] = options.start;
          if (hidden) {
            options.end = options.start;
            /** @type {number} */
            options.start = "width" === name || "height" === name ? 1 : 0;
          }
        }
      }
    }
  }
  /**
   * @param {string} selector
   * @param {string} context
   * @param {string} prop
   * @param {string} end
   * @param {string} easing
   * @return {?}
   */
  function Tween(selector, context, prop, end, easing) {
    return new Tween.prototype.init(selector, context, prop, end, easing);
  }
  /**
   * @param {string} type
   * @param {boolean} includeWidth
   * @return {?}
   */
  function genFx(type, includeWidth) {
    var which;
    var attrs = {
      height : type
    };
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    includeWidth = includeWidth ? 1 : 0;
    for (;4 > i;i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
  }
  /**
   * @param {Object} node
   * @return {?}
   */
  function getWindow(node) {
    return jQuery.isWindow(node) ? node : 9 === node.nodeType ? node.defaultView || node.parentWindow : false;
  }
  var readyList;
  var element;
  /** @type {string} */
  var actual = typeof val;
  /** @type {Location} */
  var location = win.location;
  /** @type {Document} */
  var node = win.document;
  /** @type {Element} */
  var docElem = node.documentElement;
  var $ = win.jQuery;
  var _$ = win.$;
  var class2type = {};
  /** @type {Array} */
  var core_deletedIds = [];
  /** @type {string} */
  var core_version = "1.10.2";
  /** @type {function (this:*, ...[*]): Array} */
  var core_concat = core_deletedIds.concat;
  /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
  var core_push = core_deletedIds.push;
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var core_slice = core_deletedIds.slice;
  /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
  var core_indexOf = core_deletedIds.indexOf;
  /** @type {function (this:*): string} */
  var core_toString = class2type.toString;
  /** @type {function (this:Object, *): boolean} */
  var core_hasOwn = class2type.hasOwnProperty;
  /** @type {function (this:string): string} */
  var core_trim = core_version.trim;
  /**
   * @param {string} selector
   * @param {string} context
   * @return {?}
   */
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context, element);
  };
  /** @type {string} */
  var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  /** @type {RegExp} */
  var core_rnotwhite = /\S+/g;
  /** @type {RegExp} */
  var badChars = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  /** @type {RegExp} */
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  /** @type {RegExp} */
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  /** @type {RegExp} */
  var args = /^[\],:{}\s]*$/;
  /** @type {RegExp} */
  var normalizr = /(?:^|:|,)(?:\s*\[)+/g;
  /** @type {RegExp} */
  var rNewline = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
  /** @type {RegExp} */
  var rSlash = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
  /** @type {RegExp} */
  var rmsPrefix = /^-ms-/;
  /** @type {RegExp} */
  var emptyParagraphRegexp = /-([\da-z])/gi;
  /**
   * @param {?} all
   * @param {string} letter
   * @return {?}
   */
  var fcamelCase = function(all, letter) {
    return letter.toUpperCase();
  };
  /**
   * @param {Event} t
   * @return {undefined}
   */
  var contentLoaded = function(t) {
    if (node.addEventListener || ("load" === t.type || "complete" === node.readyState)) {
      domReady();
      jQuery.ready();
    }
  };
  /**
   * @return {undefined}
   */
  var domReady = function() {
    if (node.addEventListener) {
      node.removeEventListener("DOMContentLoaded", contentLoaded, false);
      win.removeEventListener("load", contentLoaded, false);
    } else {
      node.detachEvent("onreadystatechange", contentLoaded);
      win.detachEvent("onload", contentLoaded);
    }
  };
  jQuery.fn = jQuery.prototype = {
    jquery : core_version,
    /** @type {function (string, string): ?} */
    constructor : jQuery,
    /**
     * @param {string} selector
     * @param {Object} context
     * @param {string} rootjQuery
     * @return {?}
     */
    init : function(selector, context, rootjQuery) {
      var match;
      var elem;
      if (!selector) {
        return this;
      }
      if ("string" == typeof selector) {
        if (match = "<" === selector.charAt(0) && (">" === selector.charAt(selector.length - 1) && selector.length >= 3) ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) {
          return!context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
        }
        if (match[1]) {
          if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : node, true)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
            for (match in context) {
              if (jQuery.isFunction(this[match])) {
                this[match](context[match]);
              } else {
                this.attr(match, context[match]);
              }
            }
          }
          return this;
        }
        if (elem = node.getElementById(match[2]), elem && elem.parentNode) {
          if (elem.id !== match[2]) {
            return rootjQuery.find(selector);
          }
          /** @type {number} */
          this.length = 1;
          /** @type {HTMLElement} */
          this[0] = elem;
        }
        return this.context = node, this.selector = selector, this;
      }
      return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (selector.selector !== val && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
    },
    selector : "",
    length : 0,
    /**
     * @return {?}
     */
    toArray : function() {
      return core_slice.call(this);
    },
    /**
     * @param {string} num
     * @return {?}
     */
    get : function(num) {
      return null == num ? this.toArray() : 0 > num ? this[this.length + num] : this[num];
    },
    /**
     * @param {Array} elems
     * @return {?}
     */
    pushStack : function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      return ret.prevObject = this, ret.context = this.context, ret;
    },
    /**
     * @param {Function} opt_attributes
     * @param {Function} args
     * @return {?}
     */
    each : function(opt_attributes, args) {
      return jQuery.each(this, opt_attributes, args);
    },
    /**
     * @param {string} walkers
     * @return {?}
     */
    ready : function(walkers) {
      return jQuery.ready.promise().done(walkers), this;
    },
    /**
     * @return {?}
     */
    slice : function() {
      return this.pushStack(core_slice.apply(this, arguments));
    },
    /**
     * @return {?}
     */
    first : function() {
      return this.eq(0);
    },
    /**
     * @return {?}
     */
    last : function() {
      return this.eq(-1);
    },
    /**
     * @param {number} ind
     * @return {?}
     */
    eq : function(ind) {
      var l = this.length;
      var i = +ind + (0 > ind ? l : 0);
      return this.pushStack(i >= 0 && l > i ? [this[i]] : []);
    },
    /**
     * @param {Function} callback
     * @return {?}
     */
    map : function(callback) {
      return this.pushStack(jQuery.map(this, function(el, operation) {
        return callback.call(el, operation, el);
      }));
    },
    /**
     * @return {?}
     */
    end : function() {
      return this.prevObject || this.constructor(null);
    },
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    push : core_push,
    /** @type {function (this:(Array.<T>|{length: number}), function (T, T): number=): ?} */
    sort : [].sort,
    /** @type {function (this:(Array.<T>|{length: number}), *=, *=, ...[T]): Array.<T>} */
    splice : [].splice
  };
  jQuery.fn.init.prototype = jQuery.fn;
  /** @type {function (): ?} */
  jQuery.extend = jQuery.fn.extend = function() {
    var src;
    var copyIsArray;
    var copy;
    var name;
    var options;
    var clone;
    var target = arguments[0] || {};
    /** @type {number} */
    var b = 1;
    /** @type {number} */
    var a = arguments.length;
    /** @type {boolean} */
    var deep = false;
    if ("boolean" == typeof target) {
      /** @type {boolean} */
      deep = target;
      target = arguments[1] || {};
      /** @type {number} */
      b = 2;
    }
    if (!("object" == typeof target)) {
      if (!jQuery.isFunction(target)) {
        target = {};
      }
    }
    if (a === b) {
      target = this;
      --b;
    }
    for (;a > b;b++) {
      if (null != (options = arguments[b])) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target !== copy) {
            if (deep && (copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))) {
              if (copyIsArray) {
                /** @type {boolean} */
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, clone, copy);
            } else {
              if (copy !== val) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando : "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
    /**
     * @param {boolean} deep
     * @return {?}
     */
    noConflict : function(deep) {
      return win.$ === jQuery && (win.$ = _$), deep && (win.jQuery === jQuery && (win.jQuery = $)), jQuery;
    },
    isReady : false,
    readyWait : 1,
    /**
     * @param {?} hold
     * @return {undefined}
     */
    holdReady : function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    /**
     * @param {boolean} wait
     * @return {?}
     */
    ready : function(wait) {
      if (wait === true ? !--jQuery.readyWait : !jQuery.isReady) {
        if (!node.body) {
          return setTimeout(jQuery.ready);
        }
        /** @type {boolean} */
        jQuery.isReady = true;
        if (!(wait !== true && --jQuery.readyWait > 0)) {
          readyList.resolveWith(node, [jQuery]);
          if (jQuery.fn.trigger) {
            jQuery(node).trigger("ready").off("ready");
          }
        }
      }
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    isFunction : function(obj) {
      return "function" === jQuery.type(obj);
    },
    /** @type {function (*): boolean} */
    isArray : Array.isArray || function(obj) {
      return "array" === jQuery.type(obj);
    },
    /**
     * @param {Object} obj
     * @return {?}
     */
    isWindow : function(obj) {
      return null != obj && obj == obj.window;
    },
    /**
     * @param {number} obj
     * @return {?}
     */
    isNumeric : function(obj) {
      return!isNaN(parseFloat(obj)) && isFinite(obj);
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    type : function(obj) {
      return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[core_toString.call(obj)] || "object" : typeof obj;
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    isPlainObject : function(obj) {
      var key;
      if (!obj || ("object" !== jQuery.type(obj) || (obj.nodeType || jQuery.isWindow(obj)))) {
        return false;
      }
      try {
        if (obj.constructor && (!core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))) {
          return false;
        }
      } catch (r) {
        return false;
      }
      if (jQuery.support.ownLast) {
        for (key in obj) {
          return core_hasOwn.call(obj, key);
        }
      }
      for (key in obj) {
      }
      return key === val || core_hasOwn.call(obj, key);
    },
    /**
     * @param {?} obj
     * @return {?}
     */
    isEmptyObject : function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    error : function(obj) {
      throw Error(obj);
    },
    /**
     * @param {?} data
     * @param {boolean} context
     * @param {boolean} keepScripts
     * @return {?}
     */
    parseHTML : function(data, context, keepScripts) {
      if (!data || "string" != typeof data) {
        return null;
      }
      if ("boolean" == typeof context) {
        /** @type {boolean} */
        keepScripts = context;
        /** @type {boolean} */
        context = false;
      }
      context = context || node;
      /** @type {(Array.<string>|null)} */
      var parsed = rsingleTag.exec(data);
      /** @type {(Array|boolean)} */
      var scripts = !keepScripts && [];
      return parsed ? [context.createElement(parsed[1])] : (parsed = jQuery.buildFragment([data], context, scripts), scripts && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
    },
    /**
     * @param {string} data
     * @return {?}
     */
    parseJSON : function(data) {
      return win.JSON && win.JSON.parse ? win.JSON.parse(data) : null === data ? data : "string" == typeof data && (data = jQuery.trim(data), data && args.test(data.replace(rNewline, "@").replace(rSlash, "]").replace(normalizr, ""))) ? Function("return " + data)() : (jQuery.error("Invalid JSON: " + data), val);
    },
    /**
     * @param {string} data
     * @return {?}
     */
    parseXML : function(data) {
      var xml;
      var tmp;
      if (!data || "string" != typeof data) {
        return null;
      }
      try {
        if (win.DOMParser) {
          /** @type {DOMParser} */
          tmp = new DOMParser;
          /** @type {(Document|null)} */
          xml = tmp.parseFromString(data, "text/xml");
        } else {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          /** @type {string} */
          xml.async = "false";
          xml.loadXML(data);
        }
      } catch (o) {
        /** @type {string} */
        xml = val;
      }
      return xml && (xml.documentElement && !xml.getElementsByTagName("parsererror").length) || jQuery.error("Invalid XML: " + data), xml;
    },
    /**
     * @return {undefined}
     */
    noop : function() {
    },
    /**
     * @param {string} data
     * @return {undefined}
     */
    globalEval : function(data) {
      if (data) {
        if (jQuery.trim(data)) {
          (win.execScript || function(expr) {
            win.eval.call(win, expr);
          })(data);
        }
      }
    },
    /**
     * @param {string} string
     * @return {?}
     */
    camelCase : function(string) {
      return string.replace(rmsPrefix, "ms-").replace(emptyParagraphRegexp, fcamelCase);
    },
    /**
     * @param {Node} elem
     * @param {string} name
     * @return {?}
     */
    nodeName : function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    /**
     * @param {Function} obj
     * @param {Function} callback
     * @param {Object} args
     * @return {?}
     */
    each : function(obj, callback, args) {
      var value;
      /** @type {number} */
      var i = 0;
      var l = obj.length;
      var isArray = isArraylike(obj);
      if (args) {
        if (isArray) {
          for (;l > i;i++) {
            if (value = callback.apply(obj[i], args), value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            if (value = callback.apply(obj[i], args), value === false) {
              break;
            }
          }
        }
      } else {
        if (isArray) {
          for (;l > i;i++) {
            if (value = callback.call(obj[i], i, obj[i]), value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            if (value = callback.call(obj[i], i, obj[i]), value === false) {
              break;
            }
          }
        }
      }
      return obj;
    },
    /** @type {function (string): ?} */
    trim : core_trim && !core_trim.call("\ufeff\u00a0") ? function(text) {
      return null == text ? "" : core_trim.call(text);
    } : function(num) {
      return null == num ? "" : (num + "").replace(badChars, "");
    },
    /**
     * @param {?} arr
     * @param {Array} results
     * @return {?}
     */
    makeArray : function(arr, results) {
      var ret = results || [];
      return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : core_push.call(ret, arr)), ret;
    },
    /**
     * @param {string} elem
     * @param {Array} arr
     * @param {number} i
     * @return {?}
     */
    inArray : function(elem, arr, i) {
      var len;
      if (arr) {
        if (core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }
        len = arr.length;
        i = i ? 0 > i ? Math.max(0, len + i) : i : 0;
        for (;len > i;i++) {
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return-1;
    },
    /**
     * @param {(Function|string)} first
     * @param {?} second
     * @return {?}
     */
    merge : function(first, second) {
      var len = second.length;
      var i = first.length;
      /** @type {number} */
      var j = 0;
      if ("number" == typeof len) {
        for (;len > j;j++) {
          first[i++] = second[j];
        }
      } else {
        for (;second[j] !== val;) {
          first[i++] = second[j++];
        }
      }
      return first.length = i, first;
    },
    /**
     * @param {Array} elems
     * @param {Function} callback
     * @param {boolean} inv
     * @return {?}
     */
    grep : function(elems, callback, inv) {
      var retVal;
      /** @type {Array} */
      var ret = [];
      /** @type {number} */
      var i = 0;
      var l = elems.length;
      /** @type {boolean} */
      inv = !!inv;
      for (;l > i;i++) {
        /** @type {boolean} */
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    /**
     * @param {Object} elems
     * @param {Function} callback
     * @param {string} arg
     * @return {?}
     */
    map : function(elems, callback, arg) {
      var value;
      /** @type {number} */
      var i = 0;
      var l = elems.length;
      var isArray = isArraylike(elems);
      /** @type {Array} */
      var ret = [];
      if (isArray) {
        for (;l > i;i++) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret[ret.length] = value;
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret[ret.length] = value;
          }
        }
      }
      return core_concat.apply([], ret);
    },
    guid : 1,
    /**
     * @param {Object} fn
     * @param {Object} context
     * @return {?}
     */
    proxy : function(fn, context) {
      var args;
      var proxy;
      var tmp;
      return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(arguments)));
      }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : val;
    },
    /**
     * @param {Object} elems
     * @param {Function} fn
     * @param {string} key
     * @param {string} value
     * @param {boolean} chainable
     * @param {string} emptyGet
     * @param {boolean} raw
     * @return {?}
     */
    access : function(elems, fn, key, value, chainable, emptyGet, raw) {
      /** @type {number} */
      var i = 0;
      var length = elems.length;
      /** @type {boolean} */
      var bulk = null == key;
      if ("object" === jQuery.type(key)) {
        /** @type {boolean} */
        chainable = true;
        for (i in key) {
          jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
        }
      } else {
        if (value !== val && (chainable = true, jQuery.isFunction(value) || (raw = true), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(scripts, event, value) {
          return bulk.call(jQuery(scripts), value);
        })), fn)) {
          for (;length > i;i++) {
            fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
          }
        }
      }
      return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    },
    /**
     * @return {?}
     */
    now : function() {
      return(new Date).getTime();
    },
    /**
     * @param {Element} elem
     * @param {?} options
     * @param {Function} callback
     * @param {Array} args
     * @return {?}
     */
    swap : function(elem, options, callback, args) {
      var ret;
      var name;
      var old = {};
      for (name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }
      ret = callback.apply(elem, args || []);
      for (name in options) {
        elem.style[name] = old[name];
      }
      return ret;
    }
  });
  /**
   * @param {string} obj
   * @return {?}
   */
  jQuery.ready.promise = function(obj) {
    if (!readyList) {
      if (readyList = jQuery.Deferred(), "complete" === node.readyState) {
        setTimeout(jQuery.ready);
      } else {
        if (node.addEventListener) {
          node.addEventListener("DOMContentLoaded", contentLoaded, false);
          win.addEventListener("load", contentLoaded, false);
        } else {
          node.attachEvent("onreadystatechange", contentLoaded);
          win.attachEvent("onload", contentLoaded);
          /** @type {boolean} */
          var t = false;
          try {
            /** @type {(Element|boolean)} */
            t = null == win.frameElement && node.documentElement;
          } catch (i) {
          }
          if (t) {
            if (t.doScroll) {
              (function doScrollCheck() {
                if (!jQuery.isReady) {
                  try {
                    t.doScroll("left");
                  } catch (e) {
                    return setTimeout(doScrollCheck, 50);
                  }
                  domReady();
                  jQuery.ready();
                }
              })();
            }
          }
        }
      }
    }
    return readyList.promise(obj);
  };
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(dataAndEvents, m3) {
    class2type["[object " + m3 + "]"] = m3.toLowerCase();
  });
  element = jQuery(node);
  (function(win, obj) {
    /**
     * @param {string} selector
     * @param {Node} context
     * @param {Object} results
     * @param {?} seed
     * @return {?}
     */
    function Sizzle(selector, context, results, seed) {
      var match;
      var elem;
      var m;
      var nodeType;
      var i;
      var groups;
      var old;
      var nid;
      var newContext;
      var newSelector;
      if ((context ? context.ownerDocument || context : preferredDoc) !== doc && setDocument(context), context = context || doc, results = results || [], !selector || "string" != typeof selector) {
        return results;
      }
      if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) {
        return[];
      }
      if (documentIsHTML && !seed) {
        if (match = rquickExpr.exec(selector)) {
          if (m = match[1]) {
            if (9 === nodeType) {
              if (elem = context.getElementById(m), !elem || !elem.parentNode) {
                return results;
              }
              if (elem.id === m) {
                return results.push(elem), results;
              }
            } else {
              if (context.ownerDocument && ((elem = context.ownerDocument.getElementById(m)) && (contains(context, elem) && elem.id === m))) {
                return results.push(elem), results;
              }
            }
          } else {
            if (match[2]) {
              return push.apply(results, context.getElementsByTagName(selector)), results;
            }
            if ((m = match[3]) && (support.getElementsByClassName && context.getElementsByClassName)) {
              return push.apply(results, context.getElementsByClassName(m)), results;
            }
          }
        }
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          if (nid = old = expando, newContext = context, newSelector = 9 === nodeType && selector, 1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
            groups = tokenize(selector);
            if (old = context.getAttribute("id")) {
              nid = old.replace(r20, "\\$&");
            } else {
              context.setAttribute("id", nid);
            }
            /** @type {string} */
            nid = "[id='" + nid + "'] ";
            i = groups.length;
            for (;i--;) {
              /** @type {string} */
              groups[i] = nid + toSelector(groups[i]);
            }
            newContext = rsibling.test(selector) && context.parentNode || context;
            newSelector = groups.join(",");
          }
          if (newSelector) {
            try {
              return push.apply(results, newContext.querySelectorAll(newSelector)), results;
            } catch (T) {
            } finally {
              if (!old) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    /**
     * @return {?}
     */
    function createCache() {
      /**
       * @param {string} key
       * @param {?} value
       * @return {?}
       */
      function cache(key, value) {
        return keys.push(key += " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key] = value;
      }
      /** @type {Array} */
      var keys = [];
      return cache;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function markFunction(fn) {
      return fn[expando] = true, fn;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function assert(fn) {
      var t = doc.createElement("div");
      try {
        return!!fn(t);
      } catch (n) {
        return false;
      } finally {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
        /** @type {null} */
        t = null;
      }
    }
    /**
     * @param {string} str
     * @param {Function} handler
     * @return {undefined}
     */
    function addHandle(str, handler) {
      var arr = str.split("|");
      var i = str.length;
      for (;i--;) {
        /** @type {Function} */
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * @param {Object} a
     * @param {Object} b
     * @return {?}
     */
    function siblingCheck(a, b) {
      var cur = b && a;
      var diff = cur && (1 === a.nodeType && (1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)));
      if (diff) {
        return diff;
      }
      if (cur) {
        for (;cur = cur.nextSibling;) {
          if (cur === b) {
            return-1;
          }
        }
      }
      return a ? 1 : -1;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createInputPseudo(type) {
      return function(elem) {
        var b = elem.nodeName.toLowerCase();
        return "input" === b && elem.type === type;
      };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createButtonPseudo(type) {
      return function(elem) {
        var NULL = elem.nodeName.toLowerCase();
        return("input" === NULL || "button" === NULL) && elem.type === type;
      };
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        return argument = +argument, markFunction(function(seed, matches) {
          var j;
          var matchIndexes = fn([], seed.length, argument);
          var i = matchIndexes.length;
          for (;i--;) {
            if (seed[j = matchIndexes[i]]) {
              /** @type {boolean} */
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * @return {undefined}
     */
    function setFilters() {
    }
    /**
     * @param {string} qualifier
     * @param {boolean} parseOnly
     * @return {?}
     */
    function tokenize(qualifier, parseOnly) {
      var matched;
      var match;
      var tokens;
      var type;
      var soFar;
      var groups;
      var preFilters;
      var cached = tokenCache[qualifier + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      /** @type {string} */
      soFar = qualifier;
      /** @type {Array} */
      groups = [];
      preFilters = Expr.preFilter;
      for (;soFar;) {
        if (!matched || (match = rcombinators.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        /** @type {boolean} */
        matched = false;
        if (match = rcomma.exec(soFar)) {
          /** @type {string} */
          matched = match.shift();
          tokens.push({
            value : matched,
            type : match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if (!!(match = matchExpr[type].exec(soFar))) {
            if (!(preFilters[type] && !(match = preFilters[type](match)))) {
              matched = match.shift();
              tokens.push({
                value : matched,
                type : type,
                matches : match
              });
              soFar = soFar.slice(matched.length);
            }
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(qualifier) : tokenCache(qualifier, groups).slice(0);
    }
    /**
     * @param {Array} tokens
     * @return {?}
     */
    function toSelector(tokens) {
      /** @type {number} */
      var i = 0;
      var nTokens = tokens.length;
      /** @type {string} */
      var selector = "";
      for (;nTokens > i;i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    /**
     * @param {Function} matcher
     * @param {Object} combinator
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    function addCombinator(matcher, combinator, dataAndEvents) {
      var dir = combinator.dir;
      var o = dataAndEvents && "parentNode" === dir;
      /** @type {number} */
      var doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir];) {
          if (1 === elem.nodeType || o) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var data;
        var cache;
        var outerCache;
        var dirkey = dirruns + " " + doneName;
        if (xml) {
          for (;elem = elem[dir];) {
            if ((1 === elem.nodeType || o) && matcher(elem, context, xml)) {
              return true;
            }
          }
        } else {
          for (;elem = elem[dir];) {
            if (1 === elem.nodeType || o) {
              if (outerCache = elem[expando] || (elem[expando] = {}), (cache = outerCache[dir]) && cache[0] === dirkey) {
                if ((data = cache[1]) === true || data === cachedruns) {
                  return data === true;
                }
              } else {
                if (cache = outerCache[dir] = [dirkey], cache[1] = matcher(elem, context, xml) || cachedruns, cache[1] === true) {
                  return true;
                }
              }
            }
          }
        }
      };
    }
    /**
     * @param {Object} matchers
     * @return {?}
     */
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        for (;i--;) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    /**
     * @param {Array} collection
     * @param {Object} array
     * @param {Object} fn
     * @param {Object} selector
     * @param {Object} arr
     * @return {?}
     */
    function clean(collection, array, fn, selector, arr) {
      var element;
      /** @type {Array} */
      var ret = [];
      /** @type {number} */
      var method = 0;
      var e = collection.length;
      /** @type {boolean} */
      var defaultScrollbars = null != array;
      for (;e > method;method++) {
        if (element = collection[method]) {
          if (!fn || fn(element, selector, arr)) {
            ret.push(element);
            if (defaultScrollbars) {
              array.push(method);
            }
          }
        }
      }
      return ret;
    }
    /**
     * @param {Object} preFilter
     * @param {string} selector
     * @param {boolean} matcher
     * @param {Object} postFilter
     * @param {Object} postFinder
     * @param {string} postSelector
     * @return {?}
     */
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      return postFilter && (!postFilter[expando] && (postFilter = setMatcher(postFilter))), postFinder && (!postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector))), markFunction(function(seed, key, context, results) {
        var walkers;
        var i;
        var value;
        /** @type {Array} */
        var checkSet = [];
        /** @type {Array} */
        var parts = [];
        var preexisting = key.length;
        var dontCloseTags = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []);
        var obj = !preFilter || !seed && selector ? dontCloseTags : clean(dontCloseTags, checkSet, preFilter, context, results);
        var data = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : key : obj;
        if (matcher && matcher(obj, data, context, results), postFilter) {
          walkers = clean(data, parts);
          postFilter(walkers, [], context, results);
          i = walkers.length;
          for (;i--;) {
            if (value = walkers[i]) {
              /** @type {boolean} */
              data[parts[i]] = !(obj[parts[i]] = value);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              /** @type {Array} */
              walkers = [];
              i = data.length;
              for (;i--;) {
                if (value = data[i]) {
                  walkers.push(obj[i] = value);
                }
              }
              postFinder(null, data = [], walkers, results);
            }
            i = data.length;
            for (;i--;) {
              if (value = data[i]) {
                if ((walkers = postFinder ? callback.call(seed, value) : checkSet[i]) > -1) {
                  /** @type {boolean} */
                  seed[walkers] = !(key[walkers] = value);
                }
              }
            }
          }
        } else {
          data = clean(data === key ? data.splice(preexisting, data.length) : data);
          if (postFinder) {
            postFinder(null, key, data, results);
          } else {
            push.apply(key, data);
          }
        }
      });
    }
    /**
     * @param {Object} tokens
     * @return {?}
     */
    function matcherFromTokens(tokens) {
      var elem;
      var matcher;
      var j;
      var len = tokens.length;
      var leadingRelative = Expr.relative[tokens[0].type];
      var implicitRelative = leadingRelative || Expr.relative[" "];
      /** @type {number} */
      var i = leadingRelative ? 1 : 0;
      var matchContext = addCombinator(function(activeSlide) {
        return activeSlide === elem;
      }, implicitRelative, true);
      var matchAnyContext = addCombinator(function(operation) {
        return callback.call(elem, operation) > -1;
      }, implicitRelative, true);
      /** @type {Array} */
      var matchers = [function(nodeType, context, xml) {
        return!leadingRelative && (xml || context !== outermostContext) || ((elem = context).nodeType ? matchContext(nodeType, context, xml) : matchAnyContext(nodeType, context, xml));
      }];
      for (;len > i;i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          /** @type {Array} */
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
            /** @type {number} */
            j = ++i;
            for (;len > j;j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
              value : " " === tokens[i - 2].type ? "*" : ""
            })).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    /**
     * @param {Array} elementMatchers
     * @param {Array} setMatchers
     * @return {?}
     */
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      /** @type {number} */
      var matcherCachedRuns = 0;
      /** @type {boolean} */
      var bySet = setMatchers.length > 0;
      /** @type {boolean} */
      var byElement = elementMatchers.length > 0;
      /**
       * @param {boolean} seed
       * @param {string} context
       * @param {?} xml
       * @param {Array} results
       * @param {?} expandContext
       * @return {?}
       */
      var superMatcher = function(seed, context, xml, results, expandContext) {
        var elem;
        var j;
        var matcher;
        /** @type {Array} */
        var args = [];
        /** @type {number} */
        var matchedCount = 0;
        /** @type {string} */
        var i = "0";
        var unmatched = seed && [];
        /** @type {boolean} */
        var w = null != expandContext;
        var contextBackup = outermostContext;
        var elems = seed || byElement && Expr.find.TAG("*", expandContext && context.parentNode || context);
        var dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || 0.1;
        if (w) {
          outermostContext = context !== doc && context;
          cachedruns = matcherCachedRuns;
        }
        for (;null != (elem = elems[i]);i++) {
          if (byElement && elem) {
            /** @type {number} */
            j = 0;
            for (;matcher = elementMatchers[j++];) {
              if (matcher(elem, context, xml)) {
                results.push(elem);
                break;
              }
            }
            if (w) {
              dirruns = dirrunsUnique;
              /** @type {number} */
              cachedruns = ++matcherCachedRuns;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (seed) {
              unmatched.push(elem);
            }
          }
        }
        if (matchedCount += i, bySet && i !== matchedCount) {
          /** @type {number} */
          j = 0;
          for (;matcher = setMatchers[j++];) {
            matcher(unmatched, args, context, xml);
          }
          if (seed) {
            if (matchedCount > 0) {
              for (;i--;) {
                if (!unmatched[i]) {
                  if (!args[i]) {
                    args[i] = pop.call(results);
                  }
                }
              }
            }
            args = clean(args);
          }
          push.apply(results, args);
          if (w) {
            if (!seed) {
              if (args.length > 0) {
                if (matchedCount + setMatchers.length > 1) {
                  Sizzle.uniqueSort(results);
                }
              }
            }
          }
        }
        return w && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched;
      };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    /**
     * @param {string} selector
     * @param {Array} contexts
     * @param {Object} results
     * @return {?}
     */
    function multipleContexts(selector, contexts, results) {
      /** @type {number} */
      var i = 0;
      var len = contexts.length;
      for (;len > i;i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    /**
     * @param {Object} selector
     * @param {Node} context
     * @param {?} results
     * @param {?} seed
     * @return {?}
     */
    function select(selector, context, results, seed) {
      var i;
      var tokens;
      var token;
      var type;
      var find;
      var match = tokenize(selector);
      if (!seed && 1 === match.length) {
        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && ("ID" === (token = tokens[0]).type && (support.getById && (9 === context.nodeType && (documentIsHTML && Expr.relative[tokens[1].type]))))) {
          if (context = (Expr.find.ID(token.matches[0].replace(r, funescape), context) || [])[0], !context) {
            return results;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
        for (;i--;) {
          if (token = tokens[i], Expr.relative[type = token.type]) {
            break;
          }
          if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(r, funescape), rsibling.test(tokens[0].type) && context.parentNode || context))) {
            if (tokens.splice(i, 1), selector = seed.length && toSelector(tokens), !selector) {
              return push.apply(results, seed), results;
            }
            break;
          }
        }
      }
      return compile(selector, match)(seed, context, !documentIsHTML, results, rsibling.test(selector)), results;
    }
    var i;
    var support;
    var cachedruns;
    var Expr;
    var getText;
    var objectToString;
    var compile;
    var outermostContext;
    var sortInput;
    var setDocument;
    var doc;
    var docElem;
    var documentIsHTML;
    var rbuggyQSA;
    var params;
    var matches;
    var contains;
    /** @type {string} */
    var expando = "sizzle" + -new Date;
    /** @type {Document} */
    var preferredDoc = win.document;
    /** @type {number} */
    var dirruns = 0;
    /** @type {number} */
    var done = 0;
    var classCache = createCache();
    var tokenCache = createCache();
    var compilerCache = createCache();
    /** @type {boolean} */
    var hasDuplicate = false;
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    var sortOrder = function(a, b) {
      return a === b ? (hasDuplicate = true, 0) : 0;
    };
    /** @type {string} */
    var strundefined = typeof obj;
    /** @type {number} */
    var MAX_NEGATIVE = 1 << 31;
    /** @type {function (this:Object, *): boolean} */
    var hasOwn = {}.hasOwnProperty;
    /** @type {Array} */
    var arr = [];
    /** @type {function (this:(Array.<T>|{length: number})): T} */
    var pop = arr.pop;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var e = arr.push;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push = arr.push;
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var slice = arr.slice;
    /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
    var callback = arr.indexOf || function(value) {
      /** @type {number} */
      var i = 0;
      var l = this.length;
      for (;l > i;i++) {
        if (this[i] === value) {
          return i;
        }
      }
      return-1;
    };
    /** @type {string} */
    var errStr = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
    /** @type {string} */
    var P = "[\\x20\\t\\r\\n\\f]";
    /** @type {string} */
    var characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
    /** @type {string} */
    var identifier = characterEncoding.replace("w", "w#");
    /** @type {string} */
    var base = "\\[" + P + "*(" + characterEncoding + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + P + "*\\]";
    /** @type {string} */
    var value = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + base.replace(3, 8) + ")*)|.*)\\)|)";
    /** @type {RegExp} */
    var rtrim = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g");
    /** @type {RegExp} */
    var rcombinators = RegExp("^" + P + "*," + P + "*");
    /** @type {RegExp} */
    var rcomma = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*");
    /** @type {RegExp} */
    var rsibling = RegExp(P + "*[+~]");
    /** @type {RegExp} */
    var reTrimSpace = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g");
    /** @type {RegExp} */
    var isFunction = RegExp(value);
    /** @type {RegExp} */
    var ridentifier = RegExp("^" + identifier + "$");
    var matchExpr = {
      ID : RegExp("^#(" + characterEncoding + ")"),
      CLASS : RegExp("^\\.(" + characterEncoding + ")"),
      TAG : RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
      ATTR : RegExp("^" + base),
      PSEUDO : RegExp("^" + value),
      CHILD : RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"),
      bool : RegExp("^(?:" + errStr + ")$", "i"),
      needsContext : RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i")
    };
    /** @type {RegExp} */
    var rnative = /^[^{]+\{\s*\[native \w/;
    /** @type {RegExp} */
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    /** @type {RegExp} */
    var rchecked = /^(?:input|select|textarea|button)$/i;
    /** @type {RegExp} */
    var rinputs = /^h\d$/i;
    /** @type {RegExp} */
    var r20 = /'|\\/g;
    /** @type {RegExp} */
    var r = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig");
    /**
     * @param {?} _
     * @param {(number|string)} escaped
     * @param {boolean} escapedWhitespace
     * @return {?}
     */
    var funescape = function(_, escaped, escapedWhitespace) {
      /** @type {number} */
      var high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(55296 | high >> 10, 56320 | 1023 & high);
    };
    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (ot) {
      push = {
        /** @type {function (?, Array): undefined} */
        apply : arr.length ? function(a, array) {
          e.apply(a, slice.call(array));
        } : function(target, array) {
          var j = target.length;
          /** @type {number} */
          var headNode = 0;
          for (;target[j++] = array[headNode++];) {
          }
          /** @type {number} */
          target.length = j - 1;
        }
      };
    }
    /** @type {function (?): ?} */
    objectToString = Sizzle.isXML = function(elem) {
      var node = elem && (elem.ownerDocument || elem).documentElement;
      return node ? "HTML" !== node.nodeName : false;
    };
    support = Sizzle.support = {};
    /** @type {function (Object): ?} */
    setDocument = Sizzle.setDocument = function(node) {
      var d = node ? node.ownerDocument || node : preferredDoc;
      var parent = d.defaultView;
      return d !== doc && (9 === d.nodeType && d.documentElement) ? (doc = d, docElem = d.documentElement, documentIsHTML = !objectToString(d), parent && (parent.attachEvent && (parent !== parent.top && parent.attachEvent("onbeforeunload", function() {
        setDocument();
      }))), support.attributes = assert(function(div) {
        return div.className = "i", !div.getAttribute("className");
      }), support.getElementsByTagName = assert(function(div) {
        return div.appendChild(d.createComment("")), !div.getElementsByTagName("*").length;
      }), support.getElementsByClassName = assert(function(div) {
        return div.innerHTML = "<div class='a'></div><div class='a i'></div>", div.firstChild.className = "i", 2 === div.getElementsByClassName("i").length;
      }), support.getById = assert(function(div) {
        return docElem.appendChild(div).id = expando, !d.getElementsByName || !d.getElementsByName(expando).length;
      }), support.getById ? (Expr.find.ID = function(id, context) {
        if (typeof context.getElementById !== strundefined && documentIsHTML) {
          var m = context.getElementById(id);
          return m && m.parentNode ? [m] : [];
        }
      }, Expr.filter.ID = function(comp) {
        var match = comp.replace(r, funescape);
        return function(elem) {
          return elem.getAttribute("id") === match;
        };
      }) : (delete Expr.find.ID, Expr.filter.ID = function(comp) {
        var match = comp.replace(r, funescape);
        return function(elem) {
          var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
          return node && node.value === match;
        };
      }), Expr.find.TAG = support.getElementsByTagName ? function(tag, root) {
        return typeof root.getElementsByTagName !== strundefined ? root.getElementsByTagName(tag) : obj;
      } : function(tagName, root) {
        var node;
        /** @type {Array} */
        var tmp = [];
        /** @type {number} */
        var i = 0;
        var elem = root.getElementsByTagName(tagName);
        if ("*" === tagName) {
          for (;node = elem[i++];) {
            if (1 === node.nodeType) {
              tmp.push(node);
            }
          }
          return tmp;
        }
        return elem;
      }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
        return typeof context.getElementsByClassName !== strundefined && documentIsHTML ? context.getElementsByClassName(className) : obj;
      }, params = [], rbuggyQSA = [], (support.qsa = rnative.test(d.querySelectorAll)) && (assert(function(div) {
        /** @type {string} */
        div.innerHTML = "<select><option selected=''></option></select>";
        if (!div.querySelectorAll("[selected]").length) {
          rbuggyQSA.push("\\[" + P + "*(?:value|" + errStr + ")");
        }
        if (!div.querySelectorAll(":checked").length) {
          rbuggyQSA.push(":checked");
        }
      }), assert(function(div) {
        var input = d.createElement("input");
        input.setAttribute("type", "hidden");
        div.appendChild(input).setAttribute("t", "");
        if (div.querySelectorAll("[t^='']").length) {
          rbuggyQSA.push("[*^$]=" + P + "*(?:''|\"\")");
        }
        if (!div.querySelectorAll(":enabled").length) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        div.querySelectorAll("*,:x");
        rbuggyQSA.push(",.*:");
      })), (support.matchesSelector = rnative.test(matches = docElem.webkitMatchesSelector || (docElem.mozMatchesSelector || (docElem.oMatchesSelector || docElem.msMatchesSelector)))) && assert(function(div) {
        support.disconnectedMatch = matches.call(div, "div");
        matches.call(div, "[s!='']:x");
        params.push("!=", value);
      }), rbuggyQSA = rbuggyQSA.length && RegExp(rbuggyQSA.join("|")), params = params.length && RegExp(params.join("|")), contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a;
        var bup = b && b.parentNode;
        return a === bup || !(!bup || (1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup))));
      } : function(a, b) {
        if (b) {
          for (;b = b.parentNode;) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      }, sortOrder = docElem.compareDocumentPosition ? function(a, b) {
        if (a === b) {
          return hasDuplicate = true, 0;
        }
        var compare = b.compareDocumentPosition && (a.compareDocumentPosition && a.compareDocumentPosition(b));
        return compare ? 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === d || contains(preferredDoc, a) ? -1 : b === d || contains(preferredDoc, b) ? 1 : sortInput ? callback.call(sortInput, a) - callback.call(sortInput, b) : 0 : 4 & compare ? -1 : 1 : a.compareDocumentPosition ? -1 : 1;
      } : function(a, b) {
        var cur;
        /** @type {number} */
        var i = 0;
        var aup = a.parentNode;
        var bup = b.parentNode;
        /** @type {Array} */
        var ap = [a];
        /** @type {Array} */
        var bp = [b];
        if (a === b) {
          return hasDuplicate = true, 0;
        }
        if (!aup || !bup) {
          return a === d ? -1 : b === d ? 1 : aup ? -1 : bup ? 1 : sortInput ? callback.call(sortInput, a) - callback.call(sortInput, b) : 0;
        }
        if (aup === bup) {
          return siblingCheck(a, b);
        }
        /** @type {HTMLElement} */
        cur = a;
        for (;cur = cur.parentNode;) {
          ap.unshift(cur);
        }
        /** @type {HTMLElement} */
        cur = b;
        for (;cur = cur.parentNode;) {
          bp.unshift(cur);
        }
        for (;ap[i] === bp[i];) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      }, d) : doc;
    };
    /**
     * @param {string} expr
     * @param {?} elements
     * @return {?}
     */
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    /**
     * @param {HTMLElement} elem
     * @param {string} expr
     * @return {?}
     */
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== doc && setDocument(elem), expr = expr.replace(reTrimSpace, "='$1']"), !(!support.matchesSelector || (!documentIsHTML || (params && params.test(expr) || rbuggyQSA && rbuggyQSA.test(expr))))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || (support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType)) {
            return ret;
          }
        } catch (i) {
        }
      }
      return Sizzle(expr, doc, null, [elem]).length > 0;
    };
    /**
     * @param {Node} context
     * @param {string} b
     * @return {?}
     */
    Sizzle.contains = function(context, b) {
      return(context.ownerDocument || context) !== doc && setDocument(context), contains(context, b);
    };
    /**
     * @param {string} elem
     * @param {string} name
     * @return {?}
     */
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()];
      var val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : obj;
      return val === obj ? support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null : val;
    };
    /**
     * @param {string} obj
     * @return {?}
     */
    Sizzle.error = function(obj) {
      throw Error("Syntax error, unrecognized expression: " + obj);
    };
    /**
     * @param {Array} results
     * @return {?}
     */
    Sizzle.uniqueSort = function(results) {
      var elem;
      /** @type {Array} */
      var duplicates = [];
      /** @type {number} */
      var j = 0;
      /** @type {number} */
      var i = 0;
      if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder), hasDuplicate) {
        for (;elem = results[i++];) {
          if (elem === results[i]) {
            /** @type {number} */
            j = duplicates.push(i);
          }
        }
        for (;j--;) {
          results.splice(duplicates[j], 1);
        }
      }
      return results;
    };
    /** @type {function (string): ?} */
    getText = Sizzle.getText = function(obj) {
      var node;
      /** @type {string} */
      var ret = "";
      /** @type {number} */
      var key = 0;
      var type = obj.nodeType;
      if (type) {
        if (1 === type || (9 === type || 11 === type)) {
          if ("string" == typeof obj.textContent) {
            return obj.textContent;
          }
          obj = obj.firstChild;
          for (;obj;obj = obj.nextSibling) {
            ret += getText(obj);
          }
        } else {
          if (3 === type || 4 === type) {
            return obj.nodeValue;
          }
        }
      } else {
        for (;node = obj[key];key++) {
          ret += getText(node);
        }
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength : 50,
      /** @type {function (Function): ?} */
      createPseudo : markFunction,
      match : matchExpr,
      attrHandle : {},
      find : {},
      relative : {
        ">" : {
          dir : "parentNode",
          first : true
        },
        " " : {
          dir : "parentNode"
        },
        "+" : {
          dir : "previousSibling",
          first : true
        },
        "~" : {
          dir : "previousSibling"
        }
      },
      preFilter : {
        /**
         * @param {Array} match
         * @return {?}
         */
        ATTR : function(match) {
          return match[1] = match[1].replace(r, funescape), match[3] = (match[4] || (match[5] || "")).replace(r, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        CHILD : function(match) {
          return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match;
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        PSEUDO : function(match) {
          var excess;
          var unquoted = !match[5] && match[2];
          return matchExpr.CHILD.test(match[0]) ? null : (match[3] && match[4] !== obj ? match[2] = match[4] : unquoted && (isFunction.test(unquoted) && ((excess = tokenize(unquoted, true)) && ((excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess))))), match.slice(0, 3));
        }
      },
      filter : {
        /**
         * @param {string} str
         * @return {?}
         */
        TAG : function(str) {
          var nodeName = str.replace(r, funescape).toLowerCase();
          return "*" === str ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        /**
         * @param {string} className
         * @return {?}
         */
        CLASS : function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = RegExp("(^|" + P + ")" + className + "(" + P + "|$)")) && classCache(className, function(elem) {
            return pattern.test("string" == typeof elem.className && elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || ""));
          });
        },
        /**
         * @param {string} name
         * @param {string} not
         * @param {string} b
         * @return {?}
         */
        ATTR : function(name, not, b) {
          return function(elem) {
            var a = Sizzle.attr(elem, name);
            return null == a ? "!=" === not : not ? (a += "", "=" === not ? a === b : "!=" === not ? a !== b : "^=" === not ? b && 0 === a.indexOf(b) : "*=" === not ? b && a.indexOf(b) > -1 : "$=" === not ? b && a.slice(-b.length) === b : "~=" === not ? (" " + a + " ").indexOf(b) > -1 : "|=" === not ? a === b || a.slice(0, b.length + 1) === b + "-" : false) : true;
          };
        },
        /**
         * @param {string} type
         * @param {string} argument
         * @param {?} dataAndEvents
         * @param {number} first
         * @param {number} last
         * @return {?}
         */
        CHILD : function(type, argument, dataAndEvents, first, last) {
          /** @type {boolean} */
          var simple = "nth" !== type.slice(0, 3);
          /** @type {boolean} */
          var forward = "last" !== type.slice(-4);
          /** @type {boolean} */
          var ofType = "of-type" === argument;
          return 1 === first && 0 === last ? function(contestant) {
            return!!contestant.parentNode;
          } : function(elem, dataAndEvents, xml) {
            var cache;
            var outerCache;
            var node;
            var diff;
            var nodeIndex;
            var eventPath;
            /** @type {string} */
            var which = simple !== forward ? "nextSibling" : "previousSibling";
            var parent = elem.parentNode;
            var name = ofType && elem.nodeName.toLowerCase();
            /** @type {boolean} */
            var useCache = !xml && !ofType;
            if (parent) {
              if (simple) {
                for (;which;) {
                  /** @type {Node} */
                  node = elem;
                  for (;node = node[which];) {
                    if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) {
                      return false;
                    }
                  }
                  /** @type {(boolean|string)} */
                  eventPath = which = "only" === type && (!eventPath && "nextSibling");
                }
                return true;
              }
              if (eventPath = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
                outerCache = parent[expando] || (parent[expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = cache[0] === dirruns && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                  if (1 === node.nodeType && (++diff && node === elem)) {
                    /** @type {Array} */
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (useCache && ((cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns)) {
                  diff = cache[1];
                } else {
                  for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                    if ((ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) && (++diff && (useCache && ((node[expando] || (node[expando] = {}))[type] = [dirruns, diff]), node === elem))) {
                      break;
                    }
                  }
                }
              }
              return diff -= last, diff === first || 0 === diff % first && diff / first >= 0;
            }
          };
        },
        /**
         * @param {string} pseudo
         * @param {?} context
         * @return {?}
         */
        PSEUDO : function(pseudo, context) {
          var args;
          var fn = Expr.pseudos[pseudo] || (Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo));
          return fn[expando] ? fn(context) : fn.length > 1 ? (args = [pseudo, pseudo, "", context], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(el, order) {
            var key;
            var arr = fn(el, context);
            var j = arr.length;
            for (;j--;) {
              /** @type {number} */
              key = callback.call(el, arr[j]);
              /** @type {boolean} */
              el[key] = !(order[key] = arr[j]);
            }
          }) : function(err) {
            return fn(err, 0, args);
          }) : fn;
        }
      },
      pseudos : {
        not : markFunction(function(selector) {
          /** @type {Array} */
          var elem = [];
          /** @type {Array} */
          var memory = [];
          var matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, qs, dataAndEvents, xml) {
            var val;
            var unmatched = matcher(seed, null, xml, []);
            var i = seed.length;
            for (;i--;) {
              if (val = unmatched[i]) {
                /** @type {boolean} */
                seed[i] = !(qs[i] = val);
              }
            }
          }) : function(value, dataAndEvents, xml) {
            return elem[0] = value, matcher(elem, null, xml, memory), !memory.pop();
          };
        }),
        has : markFunction(function(expr) {
          return function(elem) {
            return Sizzle(expr, elem).length > 0;
          };
        }),
        contains : markFunction(function(objId) {
          return function(elem) {
            return(elem.textContent || (elem.innerText || getText(elem))).indexOf(objId) > -1;
          };
        }),
        lang : markFunction(function(lang) {
          return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(r, funescape).toLowerCase(), function(elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
              }
            } while ((elem = elem.parentNode) && 1 === elem.nodeType);
            return false;
          };
        }),
        /**
         * @param {string} obj
         * @return {?}
         */
        target : function(obj) {
          /** @type {string} */
          var models = win.location && win.location.hash;
          return models && models.slice(1) === obj.id;
        },
        /**
         * @param {string} elem
         * @return {?}
         */
        root : function(elem) {
          return elem === docElem;
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        focus : function(obj) {
          return obj === doc.activeElement && ((!doc.hasFocus || doc.hasFocus()) && !!(obj.type || (obj.href || ~obj.tabIndex)));
        },
        /**
         * @param {EventTarget} a
         * @return {?}
         */
        enabled : function(a) {
          return a.disabled === false;
        },
        /**
         * @param {EventTarget} elem
         * @return {?}
         */
        disabled : function(elem) {
          return elem.disabled === true;
        },
        /**
         * @param {Node} node
         * @return {?}
         */
        checked : function(node) {
          var b = node.nodeName.toLowerCase();
          return "input" === b && !!node.checked || "option" === b && !!node.selected;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        selected : function(elem) {
          return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === true;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        empty : function(elem) {
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            if (elem.nodeName > "@" || (3 === elem.nodeType || 4 === elem.nodeType)) {
              return false;
            }
          }
          return true;
        },
        /**
         * @param {string} elem
         * @return {?}
         */
        parent : function(elem) {
          return!Expr.pseudos.empty(elem);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        header : function(elem) {
          return rinputs.test(elem.nodeName);
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        input : function(obj) {
          return rchecked.test(obj.nodeName);
        },
        /**
         * @param {Node} el
         * @return {?}
         */
        button : function(el) {
          var b = el.nodeName.toLowerCase();
          return "input" === b && "button" === el.type || "button" === b;
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        text : function(obj) {
          var evt;
          return "input" === obj.nodeName.toLowerCase() && ("text" === obj.type && (null == (evt = obj.getAttribute("type")) || evt.toLowerCase() === obj.type));
        },
        first : createPositionalPseudo(function() {
          return[0];
        }),
        last : createPositionalPseudo(function(dataAndEvents, deepDataAndEvents) {
          return[deepDataAndEvents - 1];
        }),
        eq : createPositionalPseudo(function(dataAndEvents, length, index) {
          return[0 > index ? index + length : index];
        }),
        even : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 0;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        odd : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 1;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        lt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;--vvar >= 0;) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        gt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;length > ++vvar;) {
            assigns.push(vvar);
          }
          return assigns;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in{
      radio : true,
      checkbox : true,
      file : true,
      password : true,
      image : true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in{
      submit : true,
      reset : true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters;
    /** @type {function (string, Object): ?} */
    compile = Sizzle.compile = function(selector, group) {
      var i;
      /** @type {Array} */
      var setMatchers = [];
      /** @type {Array} */
      var elementMatchers = [];
      var cached = compilerCache[selector + " "];
      if (!cached) {
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        for (;i--;) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
      }
      return cached;
    };
    /** @type {boolean} */
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.detectDuplicates = hasDuplicate;
    setDocument();
    support.sortDetached = assert(function(div1) {
      return 1 & div1.compareDocumentPosition(doc.createElement("div"));
    });
    if (!assert(function(div) {
      return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
    })) {
      addHandle("type|href|height|width", function(elem, name, flag_xml) {
        return flag_xml ? obj : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
      });
    }
    if (!(support.attributes && assert(function(div) {
      return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
    }))) {
      addHandle("value", function(target, dataAndEvents, defaultValue) {
        return defaultValue || "input" !== target.nodeName.toLowerCase() ? obj : target.defaultValue;
      });
    }
    if (!assert(function(div) {
      return null == div.getAttribute("disabled");
    })) {
      addHandle(errStr, function(elem, name, hasKeys) {
        var val;
        return hasKeys ? obj : (val = elem.getAttributeNode(name)) && val.specified ? val.value : elem[name] === true ? name.toLowerCase() : null;
      });
    }
    /** @type {function (string, Node, Object, ?): ?} */
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    /** @type {function (Array): ?} */
    jQuery.unique = Sizzle.uniqueSort;
    /** @type {function (string): ?} */
    jQuery.text = Sizzle.getText;
    /** @type {function (?): ?} */
    jQuery.isXMLDoc = Sizzle.isXML;
    /** @type {function (Node, string): ?} */
    jQuery.contains = Sizzle.contains;
  })(win);
  var optionsCache = {};
  /**
   * @param {Object} options
   * @return {?}
   */
  jQuery.Callbacks = function(options) {
    options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var r;
    var memory;
    var i;
    var _len;
    var firingIndex;
    var firingStart;
    /** @type {Array} */
    var list = [];
    /** @type {(Array|boolean)} */
    var stack = !options.once && [];
    /**
     * @param {Array} data
     * @return {undefined}
     */
    var fire = function(data) {
      memory = options.memory && data;
      /** @type {boolean} */
      i = true;
      firingIndex = firingStart || 0;
      /** @type {number} */
      firingStart = 0;
      _len = list.length;
      /** @type {boolean} */
      r = true;
      for (;list && _len > firingIndex;firingIndex++) {
        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
          /** @type {boolean} */
          memory = false;
          break;
        }
      }
      /** @type {boolean} */
      r = false;
      if (list) {
        if (stack) {
          if (stack.length) {
            fire(stack.shift());
          }
        } else {
          if (memory) {
            /** @type {Array} */
            list = [];
          } else {
            self.disable();
          }
        }
      }
    };
    var self = {
      /**
       * @return {?}
       */
      add : function() {
        if (list) {
          var start = list.length;
          (function add(args) {
            jQuery.each(args, function(dataAndEvents, qualifier) {
              var type = jQuery.type(qualifier);
              if ("function" === type) {
                if (!(options.unique && self.has(qualifier))) {
                  list.push(qualifier);
                }
              } else {
                if (qualifier) {
                  if (qualifier.length) {
                    if ("string" !== type) {
                      add(qualifier);
                    }
                  }
                }
              }
            });
          })(arguments);
          if (r) {
            _len = list.length;
          } else {
            if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
        }
        return this;
      },
      /**
       * @return {?}
       */
      remove : function() {
        return list && jQuery.each(arguments, function(dataAndEvents, arg) {
          var index;
          for (;(index = jQuery.inArray(arg, list, index)) > -1;) {
            list.splice(index, 1);
            if (r) {
              if (_len >= index) {
                _len--;
              }
              if (firingIndex >= index) {
                firingIndex--;
              }
            }
          }
        }), this;
      },
      /**
       * @param {string} fn
       * @return {?}
       */
      has : function(fn) {
        return fn ? jQuery.inArray(fn, list) > -1 : !(!list || !list.length);
      },
      /**
       * @return {?}
       */
      empty : function() {
        return list = [], _len = 0, this;
      },
      /**
       * @return {?}
       */
      disable : function() {
        return list = stack = memory = val, this;
      },
      /**
       * @return {?}
       */
      disabled : function() {
        return!list;
      },
      /**
       * @return {?}
       */
      lock : function() {
        return stack = val, memory || self.disable(), this;
      },
      /**
       * @return {?}
       */
      locked : function() {
        return!stack;
      },
      /**
       * @param {?} context
       * @param {Array} args
       * @return {?}
       */
      fireWith : function(context, args) {
        return!list || (i && !stack || (args = args || [], args = [context, args.slice ? args.slice() : args], r ? stack.push(args) : fire(args))), this;
      },
      /**
       * @return {?}
       */
      fire : function() {
        return self.fireWith(this, arguments), this;
      },
      /**
       * @return {?}
       */
      fired : function() {
        return!!i;
      }
    };
    return self;
  };
  jQuery.extend({
    /**
     * @param {Function} func
     * @return {?}
     */
    Deferred : function(func) {
      /** @type {Array} */
      var which = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]];
      /** @type {string} */
      var state = "pending";
      var promise = {
        /**
         * @return {?}
         */
        state : function() {
          return state;
        },
        /**
         * @return {?}
         */
        always : function() {
          return deferred.done(arguments).fail(arguments), this;
        },
        /**
         * @return {?}
         */
        then : function() {
          /** @type {Arguments} */
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(which, function(i, tuple) {
              var action = tuple[0];
              var fn = jQuery.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && jQuery.isFunction(returned.promise)) {
                  returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                } else {
                  newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                }
              });
            });
            /** @type {null} */
            fns = null;
          }).promise();
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        promise : function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      };
      var deferred = {};
      return promise.pipe = promise.then, jQuery.each(which, function(dataAndEvents, tuple) {
        var list = tuple[2];
        var stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, which[1 ^ dataAndEvents][2].disable, which[2][2].lock);
        }
        /**
         * @return {?}
         */
        deferred[tuple[0]] = function() {
          return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
    },
    /**
     * @param {Object} subordinate
     * @return {?}
     */
    when : function(subordinate) {
      /** @type {number} */
      var i = 0;
      /** @type {Array.<?>} */
      var resolveValues = core_slice.call(arguments);
      /** @type {number} */
      var length = resolveValues.length;
      /** @type {number} */
      var remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0;
      var deferred = 1 === remaining ? subordinate : jQuery.Deferred();
      /**
       * @param {number} i
       * @param {(Array|NodeList)} contexts
       * @param {Array} values
       * @return {?}
       */
      var updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
          if (values === progressValues) {
            deferred.notifyWith(contexts, values);
          } else {
            if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          }
        };
      };
      var progressValues;
      var progressContexts;
      var resolveContexts;
      if (length > 1) {
        /** @type {Array} */
        progressValues = Array(length);
        /** @type {Array} */
        progressContexts = Array(length);
        /** @type {Array} */
        resolveContexts = Array(length);
        for (;length > i;i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
  });
  jQuery.support = function(support) {
    var codeSegments;
    var a;
    var input;
    var select;
    var fragment;
    var opt;
    var eventName;
    var isSupported;
    var i;
    /** @type {Element} */
    var div = node.createElement("div");
    if (div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", codeSegments = div.getElementsByTagName("*") || [], a = div.getElementsByTagName("a")[0], !a || (!a.style || !codeSegments.length)) {
      return support;
    }
    /** @type {Element} */
    select = node.createElement("select");
    /** @type {(Node|null)} */
    opt = select.appendChild(node.createElement("option"));
    input = div.getElementsByTagName("input")[0];
    /** @type {string} */
    a.style.cssText = "top:1px;float:left;opacity:.5";
    /** @type {boolean} */
    support.getSetAttribute = "t" !== div.className;
    /** @type {boolean} */
    support.leadingWhitespace = 3 === div.firstChild.nodeType;
    /** @type {boolean} */
    support.tbody = !div.getElementsByTagName("tbody").length;
    /** @type {boolean} */
    support.htmlSerialize = !!div.getElementsByTagName("link").length;
    /** @type {boolean} */
    support.style = /top/.test(a.getAttribute("style"));
    /** @type {boolean} */
    support.hrefNormalized = "/a" === a.getAttribute("href");
    /** @type {boolean} */
    support.opacity = /^0.5/.test(a.style.opacity);
    /** @type {boolean} */
    support.cssFloat = !!a.style.cssFloat;
    /** @type {boolean} */
    support.checkOn = !!input.value;
    support.optSelected = opt.selected;
    /** @type {boolean} */
    support.enctype = !!node.createElement("form").enctype;
    /** @type {boolean} */
    support.html5Clone = "<:nav></:nav>" !== node.createElement("nav").cloneNode(true).outerHTML;
    /** @type {boolean} */
    support.inlineBlockNeedsLayout = false;
    /** @type {boolean} */
    support.shrinkWrapBlocks = false;
    /** @type {boolean} */
    support.pixelPosition = false;
    /** @type {boolean} */
    support.deleteExpando = true;
    /** @type {boolean} */
    support.noCloneEvent = true;
    /** @type {boolean} */
    support.reliableMarginRight = true;
    /** @type {boolean} */
    support.boxSizingReliable = true;
    /** @type {boolean} */
    input.checked = true;
    support.noCloneChecked = input.cloneNode(true).checked;
    /** @type {boolean} */
    select.disabled = true;
    /** @type {boolean} */
    support.optDisabled = !opt.disabled;
    try {
      delete div.test;
    } catch (h) {
      /** @type {boolean} */
      support.deleteExpando = false;
    }
    /** @type {Element} */
    input = node.createElement("input");
    input.setAttribute("value", "");
    /** @type {boolean} */
    support.input = "" === input.getAttribute("value");
    /** @type {string} */
    input.value = "t";
    input.setAttribute("type", "radio");
    /** @type {boolean} */
    support.radioValue = "t" === input.value;
    input.setAttribute("checked", "t");
    input.setAttribute("name", "t");
    /** @type {DocumentFragment} */
    fragment = node.createDocumentFragment();
    fragment.appendChild(input);
    /** @type {boolean} */
    support.appendChecked = input.checked;
    support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
    if (div.attachEvent) {
      div.attachEvent("onclick", function() {
        /** @type {boolean} */
        support.noCloneEvent = false;
      });
      div.cloneNode(true).click();
    }
    for (i in{
      submit : true,
      change : true,
      focusin : true
    }) {
      div.setAttribute(eventName = "on" + i, "t");
      /** @type {boolean} */
      support[i + "Bubbles"] = eventName in win || div.attributes[eventName].expando === false;
    }
    /** @type {string} */
    div.style.backgroundClip = "content-box";
    /** @type {string} */
    div.cloneNode(true).style.backgroundClip = "";
    /** @type {boolean} */
    support.clearCloneStyle = "content-box" === div.style.backgroundClip;
    for (i in jQuery(support)) {
      break;
    }
    return support.ownLast = "0" !== i, jQuery(function() {
      var container;
      var marginDiv;
      var tds;
      /** @type {string} */
      var divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;";
      var body = node.getElementsByTagName("body")[0];
      if (body) {
        /** @type {Element} */
        container = node.createElement("div");
        /** @type {string} */
        container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        body.appendChild(container).appendChild(div);
        /** @type {string} */
        div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName("td");
        /** @type {string} */
        tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        /** @type {boolean} */
        isSupported = 0 === tds[0].offsetHeight;
        /** @type {string} */
        tds[0].style.display = "";
        /** @type {string} */
        tds[1].style.display = "none";
        /** @type {boolean} */
        support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight;
        /** @type {string} */
        div.innerHTML = "";
        /** @type {string} */
        div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        jQuery.swap(body, null != body.style.zoom ? {
          zoom : 1
        } : {}, function() {
          /** @type {boolean} */
          support.boxSizing = 4 === div.offsetWidth;
        });
        if (win.getComputedStyle) {
          /** @type {boolean} */
          support.pixelPosition = "1%" !== (win.getComputedStyle(div, null) || {}).top;
          /** @type {boolean} */
          support.boxSizingReliable = "4px" === (win.getComputedStyle(div, null) || {
            width : "4px"
          }).width;
          marginDiv = div.appendChild(node.createElement("div"));
          /** @type {string} */
          marginDiv.style.cssText = div.style.cssText = divReset;
          /** @type {string} */
          marginDiv.style.marginRight = marginDiv.style.width = "0";
          /** @type {string} */
          div.style.width = "1px";
          /** @type {boolean} */
          support.reliableMarginRight = !parseFloat((win.getComputedStyle(marginDiv, null) || {}).marginRight);
        }
        if (typeof div.style.zoom !== actual) {
          /** @type {string} */
          div.innerHTML = "";
          /** @type {string} */
          div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
          /** @type {boolean} */
          support.inlineBlockNeedsLayout = 3 === div.offsetWidth;
          /** @type {string} */
          div.style.display = "block";
          /** @type {string} */
          div.innerHTML = "<div></div>";
          /** @type {string} */
          div.firstChild.style.width = "5px";
          /** @type {boolean} */
          support.shrinkWrapBlocks = 3 !== div.offsetWidth;
          if (support.inlineBlockNeedsLayout) {
            /** @type {number} */
            body.style.zoom = 1;
          }
        }
        body.removeChild(container);
        /** @type {null} */
        container = div = tds = marginDiv = null;
      }
    }), codeSegments = select = fragment = opt = a = input = null, support;
  }({});
  /** @type {RegExp} */
  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;
  /** @type {RegExp} */
  var r20 = /([A-Z])/g;
  jQuery.extend({
    cache : {},
    noData : {
      applet : true,
      embed : true,
      object : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    hasData : function(elem) {
      return elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando], !!elem && !filter(elem);
    },
    /**
     * @param {string} obj
     * @param {?} keepData
     * @param {?} name
     * @return {?}
     */
    data : function(obj, keepData, name) {
      return get(obj, keepData, name);
    },
    /**
     * @param {string} key
     * @param {string} name
     * @return {?}
     */
    removeData : function(key, name) {
      return cb(key, name);
    },
    /**
     * @param {string} owner
     * @param {string} name
     * @param {boolean} expectedNumberOfNonCommentArgs
     * @return {?}
     */
    _data : function(owner, name, expectedNumberOfNonCommentArgs) {
      return get(owner, name, expectedNumberOfNonCommentArgs, true);
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @return {?}
     */
    _removeData : function(elem, name) {
      return cb(elem, name, true);
    },
    /**
     * @param {Node} elem
     * @return {?}
     */
    acceptData : function(elem) {
      if (elem.nodeType && (1 !== elem.nodeType && 9 !== elem.nodeType)) {
        return false;
      }
      var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
      return!noData || noData !== true && elem.getAttribute("classid") === noData;
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} obj
     * @param {?} keepData
     * @return {?}
     */
    data : function(obj, keepData) {
      var attrs;
      var name;
      /** @type {null} */
      var data = null;
      /** @type {number} */
      var a = 0;
      var qualifier = this[0];
      if (obj === val) {
        if (this.length && (data = jQuery.data(qualifier), 1 === qualifier.nodeType && !jQuery._data(qualifier, "parsedAttrs"))) {
          attrs = qualifier.attributes;
          for (;attrs.length > a;a++) {
            name = attrs[a].name;
            if (0 === name.indexOf("data-")) {
              name = jQuery.camelCase(name.slice(5));
              dataAttr(qualifier, name, data[name]);
            }
          }
          jQuery._data(qualifier, "parsedAttrs", true);
        }
        return data;
      }
      return "object" == typeof obj ? this.each(function() {
        jQuery.data(this, obj);
      }) : arguments.length > 1 ? this.each(function() {
        jQuery.data(this, obj, keepData);
      }) : qualifier ? dataAttr(qualifier, obj, jQuery.data(qualifier, obj)) : null;
    },
    /**
     * @param {string} key
     * @return {?}
     */
    removeData : function(key) {
      return this.each(function() {
        jQuery.removeData(this, key);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {string} obj
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    queue : function(obj, type, data) {
      var queue;
      return obj ? (type = (type || "fx") + "queue", queue = jQuery._data(obj, type), data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(obj, type, jQuery.makeArray(data)) : queue.push(data)), queue || []) : val;
    },
    /**
     * @param {string} qualifier
     * @param {string} type
     * @return {undefined}
     */
    dequeue : function(qualifier, type) {
      type = type || "fx";
      var queue = jQuery.queue(qualifier, type);
      var ln = queue.length;
      var fn = queue.shift();
      var hooks = jQuery._queueHooks(qualifier, type);
      /**
       * @return {undefined}
       */
      var next = function() {
        jQuery.dequeue(qualifier, type);
      };
      if ("inprogress" === fn) {
        fn = queue.shift();
        ln--;
      }
      if (fn) {
        if ("fx" === type) {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(qualifier, next, hooks);
      }
      if (!ln) {
        if (hooks) {
          hooks.empty.fire();
        }
      }
    },
    /**
     * @param {string} elem
     * @param {string} type
     * @return {?}
     */
    _queueHooks : function(elem, type) {
      /** @type {string} */
      var key = type + "queueHooks";
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty : jQuery.Callbacks("once memory").add(function() {
          jQuery._removeData(elem, type + "queue");
          jQuery._removeData(elem, key);
        })
      });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} obj
     * @param {string} name
     * @return {?}
     */
    queue : function(obj, name) {
      /** @type {number} */
      var num = 2;
      return "string" != typeof obj && (name = obj, obj = "fx", num--), num > arguments.length ? jQuery.queue(this[0], obj) : name === val ? this : this.each(function() {
        var i = jQuery.queue(this, obj, name);
        jQuery._queueHooks(this, obj);
        if ("fx" === obj) {
          if ("inprogress" !== i[0]) {
            jQuery.dequeue(this, obj);
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    dequeue : function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    /**
     * @param {Object} time
     * @param {string} walkers
     * @return {?}
     */
    delay : function(time, walkers) {
      return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, walkers = walkers || "fx", this.queue(walkers, function(next, event) {
        /** @type {number} */
        var timeout = setTimeout(next, time);
        /**
         * @return {undefined}
         */
        event.stop = function() {
          clearTimeout(timeout);
        };
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    clearQueue : function(type) {
      return this.queue(type || "fx", []);
    },
    /**
     * @param {string} type
     * @param {string} obj
     * @return {?}
     */
    promise : function(type, obj) {
      var body;
      /** @type {number} */
      var i = 1;
      var defer = jQuery.Deferred();
      var elements = this;
      var j = this.length;
      /**
       * @return {undefined}
       */
      var resolve = function() {
        if (!--i) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if ("string" != typeof type) {
        /** @type {string} */
        obj = type;
        /** @type {string} */
        type = val;
      }
      type = type || "fx";
      for (;j--;) {
        body = jQuery._data(elements[j], type + "queueHooks");
        if (body) {
          if (body.empty) {
            i++;
            body.empty.add(resolve);
          }
        }
      }
      return resolve(), defer.promise(obj);
    }
  });
  var nodeHook;
  var boolHook;
  /** @type {RegExp} */
  var rclass = /[\t\r\n\f]/g;
  /** @type {RegExp} */
  var rreturn = /\r/g;
  /** @type {RegExp} */
  var rinputs = /^(?:input|select|textarea|button|object)$/i;
  /** @type {RegExp} */
  var rheader = /^(?:a|area)$/i;
  /** @type {RegExp} */
  var exclude = /^(?:checked|selected)$/i;
  var getSetAttribute = jQuery.support.getSetAttribute;
  var str = jQuery.support.input;
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    attr : function(name, value) {
      return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    /**
     * @param {string} name
     * @return {?}
     */
    removeAttr : function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    },
    /**
     * @param {string} name
     * @param {boolean} value
     * @return {?}
     */
    prop : function(name, value) {
      return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    /**
     * @param {Text} name
     * @return {?}
     */
    removeProp : function(name) {
      return name = jQuery.propFix[name] || name, this.each(function() {
        try {
          /** @type {string} */
          this[name] = val;
          delete this[name];
        } catch (n) {
        }
      });
    },
    /**
     * @param {string} value
     * @return {?}
     */
    addClass : function(value) {
      var classes;
      var elem;
      var cur;
      var clazz;
      var j;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {(boolean|string)} */
      var proceed = "string" == typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || "").match(core_rnotwhite) || [];
        for (;l > i;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
            /** @type {number} */
            j = 0;
            for (;clazz = classes[j++];) {
              if (0 > cur.indexOf(" " + clazz + " ")) {
                cur += clazz + " ";
              }
            }
            elem.className = jQuery.trim(cur);
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @return {?}
     */
    removeClass : function(value) {
      var lines;
      var elem;
      var cur;
      var line;
      var c;
      /** @type {number} */
      var i = 0;
      var len = this.length;
      /** @type {(boolean|string)} */
      var l = 0 === arguments.length || "string" == typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (l) {
        lines = (value || "").match(core_rnotwhite) || [];
        for (;len > i;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
            /** @type {number} */
            c = 0;
            for (;line = lines[c++];) {
              for (;cur.indexOf(" " + line + " ") >= 0;) {
                /** @type {string} */
                cur = cur.replace(" " + line + " ", " ");
              }
            }
            elem.className = value ? jQuery.trim(cur) : "";
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @param {?} stateVal
     * @return {?}
     */
    toggleClass : function(value, stateVal) {
      /** @type {string} */
      var type = typeof value;
      return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
      }) : this.each(function() {
        if ("string" === type) {
          var className;
          /** @type {number} */
          var i = 0;
          var self = jQuery(this);
          var classNames = value.match(core_rnotwhite) || [];
          for (;className = classNames[i++];) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else {
          if (type === actual || "boolean" === type) {
            if (this.className) {
              jQuery._data(this, "__className__", this.className);
            }
            this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    hasClass : function(type) {
      /** @type {string} */
      var expectation = " " + type + " ";
      /** @type {number} */
      var i = 0;
      var l = this.length;
      for (;l > i;i++) {
        if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(expectation) >= 0) {
          return true;
        }
      }
      return false;
    },
    /**
     * @param {string} html
     * @return {?}
     */
    val : function(html) {
      var ret;
      var hooks;
      var isFunction;
      var elem = this[0];
      if (arguments.length) {
        return isFunction = jQuery.isFunction(html), this.each(function(i) {
          var value;
          if (1 === this.nodeType) {
            value = isFunction ? html.call(this, i, jQuery(this).val()) : html;
            if (null == value) {
              /** @type {string} */
              value = "";
            } else {
              if ("number" == typeof value) {
                value += "";
              } else {
                if (jQuery.isArray(value)) {
                  value = jQuery.map(value, function(month) {
                    return null == month ? "" : month + "";
                  });
                }
              }
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!(hooks && ("set" in hooks && hooks.set(this, value, "value") !== val))) {
              this.value = value;
            }
          }
        });
      }
      if (elem) {
        return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && ("get" in hooks && (ret = hooks.get(elem, "value")) !== val) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
      }
    }
  });
  jQuery.extend({
    valHooks : {
      option : {
        /**
         * @param {string} elem
         * @return {?}
         */
        get : function(elem) {
          var text = jQuery.find.attr(elem, "value");
          return null != text ? text : elem.text;
        }
      },
      select : {
        /**
         * @param {Element} elem
         * @return {?}
         */
        get : function(elem) {
          var copies;
          var option;
          var options = elem.options;
          var index = elem.selectedIndex;
          /** @type {boolean} */
          var one = "select-one" === elem.type || 0 > index;
          /** @type {(Array|null)} */
          var out = one ? null : [];
          var max = one ? index + 1 : options.length;
          var i = 0 > index ? max : one ? index : 0;
          for (;max > i;i++) {
            if (option = options[i], !(!option.selected && i !== index || ((jQuery.support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup")))) {
              if (copies = jQuery(option).val(), one) {
                return copies;
              }
              out.push(copies);
            }
          }
          return out;
        },
        /**
         * @param {Object} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          var n;
          var option;
          var options = elem.options;
          var values = jQuery.makeArray(value);
          var i = options.length;
          for (;i--;) {
            option = options[i];
            if (option.selected = jQuery.inArray(jQuery(option).val(), values) >= 0) {
              /** @type {boolean} */
              n = true;
            }
          }
          return n || (elem.selectedIndex = -1), values;
        }
      }
    },
    /**
     * @param {string} elem
     * @param {Object} name
     * @param {string} value
     * @return {?}
     */
    attr : function(elem, name, value) {
      var hooks;
      var ret;
      var nodeType = elem.nodeType;
      if (elem && (3 !== nodeType && (8 !== nodeType && 2 !== nodeType))) {
        return typeof elem.getAttribute === actual ? jQuery.prop(elem, name, value) : (1 === nodeType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), value === val ? hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? val : ret) : null !== value ? hooks && ("set" in hooks && (ret = hooks.set(elem, value, name)) !== val) ?
        ret : (elem.setAttribute(name, value + ""), value) : (jQuery.removeAttr(elem, name), val));
      }
    },
    /**
     * @param {Object} elem
     * @param {string} value
     * @return {undefined}
     */
    removeAttr : function(elem, value) {
      var name;
      var propName;
      /** @type {number} */
      var i = 0;
      var attrNames = value && value.match(core_rnotwhite);
      if (attrNames && 1 === elem.nodeType) {
        for (;name = attrNames[i++];) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            if (str && getSetAttribute || !exclude.test(name)) {
              /** @type {boolean} */
              elem[propName] = false;
            } else {
              /** @type {boolean} */
              elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
            }
          } else {
            jQuery.attr(elem, name, "");
          }
          elem.removeAttribute(getSetAttribute ? name : propName);
        }
      }
    },
    attrHooks : {
      type : {
        /**
         * @param {Object} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          if (!jQuery.support.radioValue && ("radio" === value && jQuery.nodeName(elem, "input"))) {
            var val = elem.value;
            return elem.setAttribute("type", value), val && (elem.value = val), value;
          }
        }
      }
    },
    propFix : {
      "for" : "htmlFor",
      "class" : "className"
    },
    /**
     * @param {Object} elem
     * @param {Object} name
     * @param {string} value
     * @return {?}
     */
    prop : function(elem, name, value) {
      var ret;
      var hooks;
      var n;
      var nodeType = elem.nodeType;
      if (elem && (3 !== nodeType && (8 !== nodeType && 2 !== nodeType))) {
        return n = 1 !== nodeType || !jQuery.isXMLDoc(elem), n && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), value !== val ? hooks && ("set" in hooks && (ret = hooks.set(elem, value, name)) !== val) ? ret : elem[name] = value : hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : elem[name];
      }
    },
    propHooks : {
      tabIndex : {
        /**
         * @param {(Object|string)} elem
         * @return {?}
         */
        get : function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          return tabindex ? parseInt(tabindex, 10) : rinputs.test(elem.nodeName) || rheader.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    }
  });
  boolHook = {
    /**
     * @param {Object} elem
     * @param {string} novisibility
     * @param {string} name
     * @return {?}
     */
    set : function(elem, novisibility, name) {
      return novisibility === false ? jQuery.removeAttr(elem, name) : str && getSetAttribute || !exclude.test(name) ? elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name) : elem[jQuery.camelCase("default-" + name)] = elem[name] = true, name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(dataAndEvents, name) {
    var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;
    /** @type {function (string, string, boolean): ?} */
    jQuery.expr.attrHandle[name] = str && getSetAttribute || !exclude.test(name) ? function(elem, name, isXML) {
      var ref = jQuery.expr.attrHandle[name];
      var ret = isXML ? val : (jQuery.expr.attrHandle[name] = val) != getter(elem, name, isXML) ? name.toLowerCase() : null;
      return jQuery.expr.attrHandle[name] = ref, ret;
    } : function(dataAndEvents, name, isBinary) {
      return isBinary ? val : dataAndEvents[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
    };
  });
  if (!(str && getSetAttribute)) {
    jQuery.attrHooks.value = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {Object} name
       * @return {?}
       */
      set : function(elem, value, name) {
        return jQuery.nodeName(elem, "input") ? (elem.defaultValue = value, val) : nodeHook && nodeHook.set(elem, value, name);
      }
    };
  }
  if (!getSetAttribute) {
    nodeHook = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {string} name
       * @return {?}
       */
      set : function(elem, value, name) {
        var ret = elem.getAttributeNode(name);
        return ret || elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name)), ret.value = value += "", "value" === name || value === elem.getAttribute(name) ? value : val;
      }
    };
    /** @type {function (Object, ?, boolean): ?} */
    jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords = function(elem, name, isXML) {
      var weight;
      return isXML ? val : (weight = elem.getAttributeNode(name)) && "" !== weight.value ? weight.value : null;
    };
    jQuery.valHooks.button = {
      /**
       * @param {Object} elem
       * @param {boolean} name
       * @return {?}
       */
      get : function(elem, name) {
        var node = elem.getAttributeNode(name);
        return node && node.specified ? node.value : val;
      },
      /** @type {function (Object, string, string): ?} */
      set : nodeHook.set
    };
    jQuery.attrHooks.contenteditable = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {Object} name
       * @return {undefined}
       */
      set : function(elem, value, name) {
        nodeHook.set(elem, "" === value ? false : value, name);
      }
    };
    jQuery.each(["width", "height"], function(dataAndEvents, name) {
      jQuery.attrHooks[name] = {
        /**
         * @param {Object} elem
         * @param {string} novisibility
         * @return {?}
         */
        set : function(elem, novisibility) {
          return "" === novisibility ? (elem.setAttribute(name, "auto"), novisibility) : val;
        }
      };
    });
  }
  if (!jQuery.support.hrefNormalized) {
    jQuery.each(["href", "src"], function(dataAndEvents, name) {
      jQuery.propHooks[name] = {
        /**
         * @param {Node} elem
         * @return {?}
         */
        get : function(elem) {
          return elem.getAttribute(name, 4);
        }
      };
    });
  }
  if (!jQuery.support.style) {
    jQuery.attrHooks.style = {
      /**
       * @param {Node} elem
       * @return {?}
       */
      get : function(elem) {
        return elem.style.cssText || val;
      },
      /**
       * @param {Object} elem
       * @param {string} value
       * @return {?}
       */
      set : function(elem, value) {
        return elem.style.cssText = value + "";
      }
    };
  }
  if (!jQuery.support.optSelected) {
    jQuery.propHooks.selected = {
      /**
       * @param {string} elem
       * @return {?}
       */
      get : function(elem) {
        var parent = elem.parentNode;
        return parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex), null;
      }
    };
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  if (!jQuery.support.enctype) {
    /** @type {string} */
    jQuery.propFix.enctype = "encoding";
  }
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      /**
       * @param {string} elem
       * @param {string} values
       * @return {?}
       */
      set : function(elem, values) {
        return jQuery.isArray(values) ? elem.checked = jQuery.inArray(jQuery(elem).val(), values) >= 0 : val;
      }
    };
    if (!jQuery.support.checkOn) {
      /**
       * @param {Node} elem
       * @return {?}
       */
      jQuery.valHooks[this].get = function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      };
    }
  });
  /** @type {RegExp} */
  var rformElems = /^(?:input|select|textarea)$/i;
  /** @type {RegExp} */
  var rmouseEvent = /^key/;
  /** @type {RegExp} */
  var rkeyEvent = /^(?:mouse|contextmenu)|click/;
  /** @type {RegExp} */
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  /** @type {RegExp} */
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  jQuery.event = {
    global : {},
    /**
     * @param {Object} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {Object} e
     * @param {Object} selector
     * @return {undefined}
     */
    add : function(elem, types, handler, e, selector) {
      var segmentMatch;
      var events;
      var t;
      var handleObjIn;
      var special;
      var eventHandle;
      var handleObj;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery._data(elem);
      if (elemData) {
        if (handler.handler) {
          /** @type {Function} */
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (!handler.guid) {
          /** @type {number} */
          handler.guid = jQuery.guid++;
        }
        if (!(events = elemData.events)) {
          events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
          /** @type {function (Event): ?} */
          eventHandle = elemData.handle = function(src) {
            return typeof jQuery === actual || src && jQuery.event.triggered === src.type ? val : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
          };
          /** @type {Object} */
          eventHandle.elem = elem;
        }
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          /** @type {Array} */
          segmentMatch = rtypenamespace.exec(types[t]) || [];
          type = origType = segmentMatch[1];
          namespaces = (segmentMatch[2] || "").split(".").sort();
          if (type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type : type,
              origType : origType,
              data : e,
              /** @type {Function} */
              handler : handler,
              guid : handler.guid,
              selector : selector,
              needsContext : selector && jQuery.expr.match.needsContext.test(selector),
              namespace : namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              /** @type {Array} */
              handlers = events[type] = [];
              /** @type {number} */
              handlers.delegateCount = 0;
              if (!(special.setup && special.setup.call(elem, e, namespaces, eventHandle) !== false)) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle, false);
                } else {
                  if (elem.attachEvent) {
                    elem.attachEvent("on" + type, eventHandle);
                  }
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            /** @type {boolean} */
            jQuery.event.global[type] = true;
          }
        }
        /** @type {null} */
        elem = null;
      }
    },
    /**
     * @param {string} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {string} selector
     * @param {boolean} keepData
     * @return {undefined}
     */
    remove : function(elem, types, handler, selector, keepData) {
      var j;
      var handleObj;
      var tmp;
      var origCount;
      var t;
      var events;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (elemData && (events = elemData.events)) {
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            for (;j--;) {
              handleObj = handlers[j];
              if (!(!keepData && origType !== handleObj.origType)) {
                if (!(handler && handler.guid !== handleObj.guid)) {
                  if (!(tmp && !tmp.test(handleObj.namespace))) {
                    if (!(selector && (selector !== handleObj.selector && ("**" !== selector || !handleObj.selector)))) {
                      handlers.splice(j, 1);
                      if (handleObj.selector) {
                        handlers.delegateCount--;
                      }
                      if (special.remove) {
                        special.remove.call(elem, handleObj);
                      }
                    }
                  }
                }
              }
            }
            if (origCount) {
              if (!handlers.length) {
                if (!(special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== false)) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
          } else {
            for (type in events) {
              jQuery.event.remove(elem, type + types[t], handler, selector, true);
            }
          }
        }
        if (jQuery.isEmptyObject(events)) {
          delete elemData.handle;
          jQuery._removeData(elem, "events");
        }
      }
    },
    /**
     * @param {Object} event
     * @param {?} data
     * @param {Object} elem
     * @param {boolean} onlyHandlers
     * @return {?}
     */
    trigger : function(event, data, elem, onlyHandlers) {
      var handle;
      var ontype;
      var cur;
      var bubbleType;
      var special;
      var tmp;
      var i;
      /** @type {Array} */
      var eventPath = [elem || node];
      var type = core_hasOwn.call(event, "type") ? event.type : event;
      var namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      if (cur = tmp = elem = elem || node, 3 !== elem.nodeType && (8 !== elem.nodeType && (!rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = 0 > type.indexOf(":") && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ?
      RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = val, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || (!special.trigger || special.trigger.apply(elem, data) !== false))))) {
        if (!onlyHandlers && (!special.noBubble && !jQuery.isWindow(elem))) {
          bubbleType = special.delegateType || type;
          if (!rfocusMorph.test(bubbleType + type)) {
            cur = cur.parentNode;
          }
          for (;cur;cur = cur.parentNode) {
            eventPath.push(cur);
            tmp = cur;
          }
          if (tmp === (elem.ownerDocument || node)) {
            eventPath.push(tmp.defaultView || (tmp.parentWindow || win));
          }
        }
        /** @type {number} */
        i = 0;
        for (;(cur = eventPath[i++]) && !event.isPropagationStopped();) {
          event.type = i > 1 ? bubbleType : special.bindType || type;
          handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
          if (handle) {
            handle.apply(cur, data);
          }
          handle = ontype && cur[ontype];
          if (handle) {
            if (jQuery.acceptData(cur)) {
              if (handle.apply) {
                if (handle.apply(cur, data) === false) {
                  event.preventDefault();
                }
              }
            }
          }
        }
        if (event.type = type, !onlyHandlers && (!event.isDefaultPrevented() && ((!special._default || special._default.apply(eventPath.pop(), data) === false) && (jQuery.acceptData(elem) && (ontype && (elem[type] && !jQuery.isWindow(elem))))))) {
          tmp = elem[ontype];
          if (tmp) {
            /** @type {null} */
            elem[ontype] = null;
          }
          jQuery.event.triggered = type;
          try {
            elem[type]();
          } catch (y) {
          }
          /** @type {string} */
          jQuery.event.triggered = val;
          if (tmp) {
            elem[ontype] = tmp;
          }
        }
        return event.result;
      }
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    dispatch : function(event) {
      event = jQuery.event.fix(event);
      var i;
      var ret;
      var handleObj;
      var matched;
      var j;
      /** @type {Array} */
      var handlerQueue = [];
      /** @type {Array.<?>} */
      var args = core_slice.call(arguments);
      var handlers = (jQuery._data(this, "events") || {})[event.type] || [];
      var special = jQuery.event.special[event.type] || {};
      if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== false) {
        handlerQueue = jQuery.event.handlers.call(this, event, handlers);
        /** @type {number} */
        i = 0;
        for (;(matched = handlerQueue[i++]) && !event.isPropagationStopped();) {
          event.currentTarget = matched.elem;
          /** @type {number} */
          j = 0;
          for (;(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) {
            if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
              event.handleObj = handleObj;
              event.data = handleObj.data;
              ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
              if (ret !== val) {
                if ((event.result = ret) === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }
          }
        }
        return special.postDispatch && special.postDispatch.call(this, event), event.result;
      }
    },
    /**
     * @param {Event} event
     * @param {Object} handlers
     * @return {?}
     */
    handlers : function(event, handlers) {
      var sel;
      var handleObj;
      var matches;
      var j;
      /** @type {Array} */
      var handlerQueue = [];
      var delegateCount = handlers.delegateCount;
      var cur = event.target;
      if (delegateCount && (cur.nodeType && (!event.button || "click" !== event.type))) {
        for (;cur != this;cur = cur.parentNode || this) {
          if (1 === cur.nodeType && (cur.disabled !== true || "click" !== event.type)) {
            /** @type {Array} */
            matches = [];
            /** @type {number} */
            j = 0;
            for (;delegateCount > j;j++) {
              handleObj = handlers[j];
              /** @type {string} */
              sel = handleObj.selector + " ";
              if (matches[sel] === val) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem : cur,
                handlers : matches
              });
            }
          }
        }
      }
      return handlers.length > delegateCount && handlerQueue.push({
        elem : this,
        handlers : handlers.slice(delegateCount)
      }), handlerQueue;
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    fix : function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i;
      var prop;
      var copy;
      var type = event.type;
      /** @type {Object} */
      var originalEvent = event;
      var fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rkeyEvent.test(type) ? this.mouseHooks : rmouseEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      i = copy.length;
      for (;i--;) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      return event.target || (event.target = originalEvent.srcElement || node), 3 === event.target.nodeType && (event.target = event.target.parentNode), event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    props : "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks : {},
    keyHooks : {
      props : "char charCode key keyCode".split(" "),
      /**
       * @param {string} obj
       * @param {Object} keepData
       * @return {?}
       */
      filter : function(obj, keepData) {
        return null == obj.which && (obj.which = null != keepData.charCode ? keepData.charCode : keepData.keyCode), obj;
      }
    },
    mouseHooks : {
      props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      /**
       * @param {string} obj
       * @param {Object} keepData
       * @return {?}
       */
      filter : function(obj, keepData) {
        var b;
        var d;
        var de;
        var old = keepData.button;
        var fromElement = keepData.fromElement;
        return null == obj.pageX && (null != keepData.clientX && (d = obj.target.ownerDocument || node, de = d.documentElement, b = d.body, obj.pageX = keepData.clientX + (de && de.scrollLeft || (b && b.scrollLeft || 0)) - (de && de.clientLeft || (b && b.clientLeft || 0)), obj.pageY = keepData.clientY + (de && de.scrollTop || (b && b.scrollTop || 0)) - (de && de.clientTop || (b && b.clientTop || 0)))), !obj.relatedTarget && (fromElement && (obj.relatedTarget = fromElement === obj.target ? keepData.toElement :
        fromElement)), obj.which || (old === val || (obj.which = 1 & old ? 1 : 2 & old ? 3 : 4 & old ? 2 : 0)), obj;
      }
    },
    special : {
      load : {
        noBubble : true
      },
      focus : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (this !== safeActiveElement() && this.focus) {
            try {
              return this.focus(), false;
            } catch (e) {
            }
          }
        },
        delegateType : "focusin"
      },
      blur : {
        /**
         * @return {?}
         */
        trigger : function() {
          return this === safeActiveElement() && this.blur ? (this.blur(), false) : val;
        },
        delegateType : "focusout"
      },
      click : {
        /**
         * @return {?}
         */
        trigger : function() {
          return jQuery.nodeName(this, "input") && ("checkbox" === this.type && this.click) ? (this.click(), false) : val;
        },
        /**
         * @param {Function} selector
         * @return {?}
         */
        _default : function(selector) {
          return jQuery.nodeName(selector.target, "a");
        }
      },
      beforeunload : {
        /**
         * @param {Object} event
         * @return {undefined}
         */
        postDispatch : function(event) {
          if (event.result !== val) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },
    /**
     * @param {string} type
     * @param {?} elem
     * @param {Event} event
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    simulate : function(type, elem, event, dataAndEvents) {
      var e = jQuery.extend(new jQuery.Event, event, {
        type : type,
        isSimulated : true,
        originalEvent : {}
      });
      if (dataAndEvents) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  /** @type {function (?, ?, ?): undefined} */
  jQuery.removeEvent = node.removeEventListener ? function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  } : function(elem, keepData, listener) {
    /** @type {string} */
    var type = "on" + keepData;
    if (elem.detachEvent) {
      if (typeof elem[type] === actual) {
        /** @type {null} */
        elem[type] = null;
      }
      elem.detachEvent(type, listener);
    }
  };
  /**
   * @param {Object} src
   * @param {?} props
   * @return {?}
   */
  jQuery.Event = function(src, props) {
    return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || (src.returnValue === false || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), this[jQuery.expando] = true, val) : new jQuery.Event(src, props);
  };
  jQuery.Event.prototype = {
    /** @type {function (): ?} */
    isDefaultPrevented : returnFalse,
    /** @type {function (): ?} */
    isPropagationStopped : returnFalse,
    /** @type {function (): ?} */
    isImmediatePropagationStopped : returnFalse,
    /**
     * @return {undefined}
     */
    preventDefault : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isDefaultPrevented = returnTrue;
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
      }
    },
    /**
     * @return {undefined}
     */
    stopPropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isPropagationStopped = returnTrue;
      if (e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        /** @type {boolean} */
        e.cancelBubble = true;
      }
    },
    /**
     * @return {undefined}
     */
    stopImmediatePropagation : function() {
      /** @type {function (): ?} */
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter : "mouseover",
    mouseleave : "mouseout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType : fix,
      bindType : fix,
      /**
       * @param {Object} event
       * @return {?}
       */
      handle : function(event) {
        var returnValue;
        var target = this;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        return(!related || related !== target && !jQuery.contains(target, related)) && (event.type = handleObj.origType, returnValue = handleObj.handler.apply(this, arguments), event.type = fix), returnValue;
      }
    };
  });
  if (!jQuery.support.submitBubbles) {
    jQuery.event.special.submit = {
      /**
       * @return {?}
       */
      setup : function() {
        return jQuery.nodeName(this, "form") ? false : (jQuery.event.add(this, "click._submit keypress._submit", function(e) {
          var elem = e.target;
          var dest = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : val;
          if (dest) {
            if (!jQuery._data(dest, "submitBubbles")) {
              jQuery.event.add(dest, "submit._submit", function(event) {
                /** @type {boolean} */
                event._submit_bubble = true;
              });
              jQuery._data(dest, "submitBubbles", true);
            }
          }
        }), val);
      },
      /**
       * @param {Event} event
       * @return {undefined}
       */
      postDispatch : function(event) {
        if (event._submit_bubble) {
          delete event._submit_bubble;
          if (this.parentNode) {
            if (!event.isTrigger) {
              jQuery.event.simulate("submit", this.parentNode, event, true);
            }
          }
        }
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.nodeName(this, "form") ? false : (jQuery.event.remove(this, "._submit"), val);
      }
    };
  }
  if (!jQuery.support.changeBubbles) {
    jQuery.event.special.change = {
      /**
       * @return {?}
       */
      setup : function() {
        return rformElems.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (jQuery.event.add(this, "propertychange._change", function(event) {
          if ("checked" === event.originalEvent.propertyName) {
            /** @type {boolean} */
            this._just_changed = true;
          }
        }), jQuery.event.add(this, "click._change", function(event) {
          if (this._just_changed) {
            if (!event.isTrigger) {
              /** @type {boolean} */
              this._just_changed = false;
            }
          }
          jQuery.event.simulate("change", this, event, true);
        })), false) : (jQuery.event.add(this, "beforeactivate._change", function(ev) {
          var node = ev.target;
          if (rformElems.test(node.nodeName)) {
            if (!jQuery._data(node, "changeBubbles")) {
              jQuery.event.add(node, "change._change", function(event) {
                if (!!this.parentNode) {
                  if (!event.isSimulated) {
                    if (!event.isTrigger) {
                      jQuery.event.simulate("change", this.parentNode, event, true);
                    }
                  }
                }
              });
              jQuery._data(node, "changeBubbles", true);
            }
          }
        }), val);
      },
      /**
       * @param {Event} event
       * @return {?}
       */
      handle : function(event) {
        var current = event.target;
        return this !== current || (event.isSimulated || (event.isTrigger || "radio" !== current.type && "checkbox" !== current.type)) ? event.handleObj.handler.apply(this, arguments) : val;
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
      }
    };
  }
  if (!jQuery.support.focusinBubbles) {
    jQuery.each({
      focus : "focusin",
      blur : "focusout"
    }, function(orig, fix) {
      /** @type {number} */
      var n = 0;
      /**
       * @param {Object} event
       * @return {undefined}
       */
      var handler = function(event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
      };
      jQuery.event.special[fix] = {
        /**
         * @return {undefined}
         */
        setup : function() {
          if (0 === n++) {
            node.addEventListener(orig, handler, true);
          }
        },
        /**
         * @return {undefined}
         */
        teardown : function() {
          if (0 === --n) {
            node.removeEventListener(orig, handler, true);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    /**
     * @param {string} types
     * @param {string} selector
     * @param {Function} data
     * @param {Function} fn
     * @param {(number|string)} one
     * @return {?}
     */
    on : function(types, selector, data, fn, one) {
      var type;
      var origFn;
      if ("object" == typeof types) {
        if ("string" != typeof selector) {
          data = data || selector;
          /** @type {string} */
          selector = val;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (null == data && null == fn ? (fn = selector, data = selector = val) : null == fn && ("string" == typeof selector ? (fn = data, data = val) : (fn = data, data = selector, selector = val)), fn === false) {
        /** @type {function (): ?} */
        fn = returnFalse;
      } else {
        if (!fn) {
          return this;
        }
      }
      return 1 === one && (origFn = fn, fn = function(obj) {
        return jQuery().off(obj), origFn.apply(this, arguments);
      }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    /**
     * @param {string} types
     * @param {Function} callback
     * @param {Function} data
     * @param {Function} fn
     * @return {?}
     */
    one : function(types, callback, data, fn) {
      return this.on(types, callback, data, fn, 1);
    },
    /**
     * @param {Object} types
     * @param {Object} selector
     * @param {Function} fn
     * @return {?}
     */
    off : function(types, selector, fn) {
      var handleObj;
      var type;
      if (types && (types.preventDefault && types.handleObj)) {
        return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
      }
      if ("object" == typeof types) {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      return(selector === false || "function" == typeof selector) && (fn = selector, selector = val), fn === false && (fn = returnFalse), this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    trigger : function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    triggerHandler : function(type, data) {
      var parent = this[0];
      return parent ? jQuery.event.trigger(type, data, parent, true) : val;
    }
  });
  /** @type {RegExp} */
  var isSimple = /^.[^:#\[\.,]*$/;
  /** @type {RegExp} */
  var eventSplitter = /^(?:parents|prev(?:Until|All))/;
  var rneedsContext = jQuery.expr.match.needsContext;
  var guaranteedUnique = {
    children : true,
    contents : true,
    next : true,
    prev : true
  };
  jQuery.fn.extend({
    /**
     * @param {string} selector
     * @return {?}
     */
    find : function(selector) {
      var i;
      /** @type {Array} */
      var ret = [];
      var self = this;
      var len = self.length;
      if ("string" != typeof selector) {
        return this.pushStack(jQuery(selector).filter(function() {
          /** @type {number} */
          i = 0;
          for (;len > i;i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      /** @type {number} */
      i = 0;
      for (;len > i;i++) {
        jQuery.find(selector, self[i], ret);
      }
      return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret;
    },
    /**
     * @param {string} scripts
     * @return {?}
     */
    has : function(scripts) {
      var i;
      var targets = jQuery(scripts, this);
      var l = targets.length;
      return this.filter(function() {
        /** @type {number} */
        i = 0;
        for (;l > i;i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    /**
     * @param {Array} selector
     * @return {?}
     */
    not : function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    filter : function(obj) {
      return this.pushStack(winnow(this, obj || [], false));
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    is : function(selector) {
      return!!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    },
    /**
     * @param {string} selectors
     * @param {Node} context
     * @return {?}
     */
    closest : function(selectors, context) {
      var cur;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {Array} */
      var matched = [];
      var pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
      for (;l > i;i++) {
        cur = this[i];
        for (;cur && cur !== context;cur = cur.parentNode) {
          if (11 > cur.nodeType && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
            /** @type {number} */
            cur = matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    index : function(elem) {
      return elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    /**
     * @param {Object} selector
     * @param {string} options
     * @return {?}
     */
    add : function(selector, options) {
      var set = "string" == typeof selector ? jQuery(selector, options) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector);
      var all = jQuery.merge(this.get(), set);
      return this.pushStack(jQuery.unique(all));
    },
    /**
     * @param {string} qualifier
     * @return {?}
     */
    addBack : function(qualifier) {
      return this.add(null == qualifier ? this.prevObject : this.prevObject.filter(qualifier));
    }
  });
  jQuery.each({
    /**
     * @param {Node} elem
     * @return {?}
     */
    parent : function(elem) {
      var parent = elem.parentNode;
      return parent && 11 !== parent.nodeType ? parent : null;
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    parents : function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    /**
     * @param {Object} elem
     * @param {string} i
     * @param {string} until
     * @return {?}
     */
    parentsUntil : function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    next : function(elem) {
      return sibling(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prev : function(elem) {
      return sibling(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    nextAll : function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prevAll : function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    nextUntil : function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    prevUntil : function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    siblings : function(elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    children : function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    contents : function(elem) {
      return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    /**
     * @param {string} until
     * @param {string} qualifier
     * @return {?}
     */
    jQuery.fn[name] = function(until, qualifier) {
      var key = jQuery.map(this, fn, until);
      return "Until" !== name.slice(-5) && (qualifier = until), qualifier && ("string" == typeof qualifier && (key = jQuery.filter(qualifier, key))), this.length > 1 && (guaranteedUnique[name] || (key = jQuery.unique(key)), eventSplitter.test(name) && (key = key.reverse())), this.pushStack(key);
    };
  });
  jQuery.extend({
    /**
     * @param {string} obj
     * @param {?} keepData
     * @param {Object} value
     * @return {?}
     */
    filter : function(obj, keepData, value) {
      var elem = keepData[0];
      return value && (obj = ":not(" + obj + ")"), 1 === keepData.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, obj) ? [elem] : [] : jQuery.find.matches(obj, jQuery.grep(keepData, function(dest) {
        return 1 === dest.nodeType;
      }));
    },
    /**
     * @param {Object} elem
     * @param {string} dir
     * @param {string} until
     * @return {?}
     */
    dir : function(elem, dir, until) {
      /** @type {Array} */
      var matched = [];
      var scripts = elem[dir];
      for (;scripts && (9 !== scripts.nodeType && (until === val || (1 !== scripts.nodeType || !jQuery(scripts).is(until))));) {
        if (1 === scripts.nodeType) {
          matched.push(scripts);
        }
        scripts = scripts[dir];
      }
      return matched;
    },
    /**
     * @param {Object} n
     * @param {Object} elem
     * @return {?}
     */
    sibling : function(n, elem) {
      /** @type {Array} */
      var r = [];
      for (;n;n = n.nextSibling) {
        if (1 === n.nodeType) {
          if (n !== elem) {
            r.push(n);
          }
        }
      }
      return r;
    }
  });
  /** @type {string} */
  var uHostName = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";
  /** @type {RegExp} */
  var newlineRe = / jQuery\d+="(?:null|\d+)"/g;
  /** @type {RegExp} */
  var rchecked = RegExp("<(?:" + uHostName + ")[\\s/>]", "i");
  /** @type {RegExp} */
  var spaceRe = /^\s+/;
  /** @type {RegExp} */
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
  /** @type {RegExp} */
  var result = /<([\w:]+)/;
  /** @type {RegExp} */
  var rhtml = /<tbody/i;
  /** @type {RegExp} */
  var selector = /<|&#?\w+;/;
  /** @type {RegExp} */
  var rRadial = /<(?:script|style|link)/i;
  /** @type {RegExp} */
  var manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
  /** @type {RegExp} */
  var BEGIN_TAG_REGEXP = /checked\s*(?:[^=]|=\s*.checked.)/i;
  /** @type {RegExp} */
  var stopParent = /^$|\/(?:java|ecma)script/i;
  /** @type {RegExp} */
  var rscriptTypeMasked = /^true\/(.*)/;
  /** @type {RegExp} */
  var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  var wrapMap = {
    option : [1, "<select multiple='multiple'>", "</select>"],
    legend : [1, "<fieldset>", "</fieldset>"],
    area : [1, "<map>", "</map>"],
    param : [1, "<object>", "</object>"],
    thead : [1, "<table>", "</table>"],
    tr : [2, "<table><tbody>", "</tbody></table>"],
    col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default : jQuery.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
  };
  var fragment = draw(node);
  var fragmentDiv = fragment.appendChild(node.createElement("div"));
  /** @type {Array} */
  wrapMap.optgroup = wrapMap.option;
  /** @type {Array} */
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  /** @type {Array} */
  wrapMap.th = wrapMap.td;
  jQuery.fn.extend({
    /**
     * @param {string} obj
     * @return {?}
     */
    text : function(obj) {
      return jQuery.access(this, function(text) {
        return text === val ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || node).createTextNode(text));
      }, null, obj, arguments.length);
    },
    /**
     * @return {?}
     */
    append : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    /**
     * @return {?}
     */
    prepend : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    /**
     * @return {?}
     */
    before : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    /**
     * @return {?}
     */
    after : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    /**
     * @param {string} qualifier
     * @param {string} keepData
     * @return {?}
     */
    remove : function(qualifier, keepData) {
      var elem;
      var curLoop = qualifier ? jQuery.filter(qualifier, this) : this;
      /** @type {number} */
      var i = 0;
      for (;null != (elem = curLoop[i]);i++) {
        if (!keepData) {
          if (!(1 !== elem.nodeType)) {
            jQuery.cleanData(getAll(elem));
          }
        }
        if (elem.parentNode) {
          if (keepData) {
            if (jQuery.contains(elem.ownerDocument, elem)) {
              setGlobalEval(getAll(elem, "script"));
            }
          }
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    },
    /**
     * @return {?}
     */
    empty : function() {
      var elem;
      /** @type {number} */
      var unlock = 0;
      for (;null != (elem = this[unlock]);unlock++) {
        if (1 === elem.nodeType) {
          jQuery.cleanData(getAll(elem, false));
        }
        for (;elem.firstChild;) {
          elem.removeChild(elem.firstChild);
        }
        if (elem.options) {
          if (jQuery.nodeName(elem, "select")) {
            /** @type {number} */
            elem.options.length = 0;
          }
        }
      }
      return this;
    },
    /**
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(dataAndEvents, deepDataAndEvents) {
      return dataAndEvents = null == dataAndEvents ? false : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    /**
     * @param {(Array|string)} value
     * @return {?}
     */
    html : function(value) {
      return jQuery.access(this, function(value) {
        var elem = this[0] || {};
        /** @type {number} */
        var i = 0;
        var l = this.length;
        if (value === val) {
          return 1 === elem.nodeType ? elem.innerHTML.replace(newlineRe, "") : val;
        }
        if (!("string" != typeof value || (rRadial.test(value) || (!jQuery.support.htmlSerialize && rchecked.test(value) || (!jQuery.support.leadingWhitespace && spaceRe.test(value) || wrapMap[(result.exec(value) || ["", ""])[1].toLowerCase()]))))) {
          /** @type {string} */
          value = value.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (;l > i;i++) {
              elem = this[i] || {};
              if (1 === elem.nodeType) {
                jQuery.cleanData(getAll(elem, false));
                /** @type {string} */
                elem.innerHTML = value;
              }
            }
            /** @type {number} */
            elem = 0;
          } catch (o) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    /**
     * @return {?}
     */
    replaceWith : function() {
      var args = jQuery.map(this, function(lineEndNode) {
        return[lineEndNode.nextSibling, lineEndNode.parentNode];
      });
      /** @type {number} */
      var i = 0;
      return this.domManip(arguments, function(child) {
        var next = args[i++];
        var parent = args[i++];
        if (parent) {
          if (next) {
            if (next.parentNode !== parent) {
              next = this.nextSibling;
            }
          }
          jQuery(this).remove();
          parent.insertBefore(child, next);
        }
      }, true), i ? this : this.remove();
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    detach : function(selector) {
      return this.remove(selector, true);
    },
    /**
     * @param {Object} args
     * @param {Function} callback
     * @param {boolean} allowIntersection
     * @return {?}
     */
    domManip : function(args, callback, allowIntersection) {
      /** @type {Array} */
      args = core_concat.apply([], args);
      var first;
      var node;
      var _len;
      var scripts;
      var doc;
      var fragment;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      var set = this;
      /** @type {number} */
      var iNoClone = l - 1;
      var html = args[0];
      var isFunction = jQuery.isFunction(html);
      if (isFunction || !(1 >= l || ("string" != typeof html || jQuery.support.checkClone)) && BEGIN_TAG_REGEXP.test(html)) {
        return this.each(function(index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = html.call(this, index, self.html());
          }
          self.domManip(args, callback, allowIntersection);
        });
      }
      if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, !allowIntersection && this), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
        scripts = jQuery.map(getAll(fragment, "script"), restoreScript);
        _len = scripts.length;
        for (;l > i;i++) {
          node = fragment;
          if (i !== iNoClone) {
            node = jQuery.clone(node, true, true);
            if (_len) {
              jQuery.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(this[i], node, i);
        }
        if (_len) {
          doc = scripts[scripts.length - 1].ownerDocument;
          jQuery.map(scripts, fn);
          /** @type {number} */
          i = 0;
          for (;_len > i;i++) {
            node = scripts[i];
            if (stopParent.test(node.type || "")) {
              if (!jQuery._data(node, "globalEval")) {
                if (jQuery.contains(doc, node)) {
                  if (node.src) {
                    jQuery._evalUrl(node.src);
                  } else {
                    jQuery.globalEval((node.text || (node.textContent || (node.innerHTML || ""))).replace(rcleanScript, ""));
                  }
                }
              }
            }
          }
        }
        /** @type {null} */
        fragment = first = null;
      }
      return this;
    }
  });
  jQuery.each({
    appendTo : "append",
    prependTo : "prepend",
    insertBefore : "before",
    insertAfter : "after",
    replaceAll : "replaceWith"
  }, function(original, method) {
    /**
     * @param {string} scripts
     * @return {?}
     */
    jQuery.fn[original] = function(scripts) {
      var resp;
      /** @type {number} */
      var i = 0;
      /** @type {Array} */
      var ret = [];
      var insert = jQuery(scripts);
      /** @type {number} */
      var segments = insert.length - 1;
      for (;segments >= i;i++) {
        resp = i === segments ? this : this.clone(true);
        jQuery(insert[i])[method](resp);
        core_push.apply(ret, resp.get());
      }
      return this.pushStack(ret);
    };
  });
  jQuery.extend({
    /**
     * @param {Object} node
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(node, dataAndEvents, deepDataAndEvents) {
      var destElements;
      var elem;
      var clone;
      var i;
      var tmp;
      var inPage = jQuery.contains(node.ownerDocument, node);
      if (jQuery.support.html5Clone || (jQuery.isXMLDoc(node) || !rchecked.test("<" + node.nodeName + ">")) ? clone = node.cloneNode(true) : (fragmentDiv.innerHTML = node.outerHTML, fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), !(jQuery.support.noCloneEvent && jQuery.support.noCloneChecked || (1 !== node.nodeType && 11 !== node.nodeType || jQuery.isXMLDoc(node)))) {
        destElements = getAll(clone);
        tmp = getAll(node);
        /** @type {number} */
        i = 0;
        for (;null != (elem = tmp[i]);++i) {
          if (destElements[i]) {
            cloneFixAttributes(elem, destElements[i]);
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          tmp = tmp || getAll(node);
          destElements = destElements || getAll(clone);
          /** @type {number} */
          i = 0;
          for (;null != (elem = tmp[i]);i++) {
            cloneCopyEvent(elem, destElements[i]);
          }
        } else {
          cloneCopyEvent(node, clone);
        }
      }
      return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(node, "script")), destElements = tmp = elem = null, clone;
    },
    /**
     * @param {Array} elems
     * @param {Document} context
     * @param {boolean} scripts
     * @param {Object} selection
     * @return {?}
     */
    buildFragment : function(elems, context, scripts, selection) {
      var j;
      var elem;
      var contains;
      var tmp;
      var tag;
      var tbody;
      var wrap;
      var l = elems.length;
      var safe = draw(context);
      /** @type {Array} */
      var nodes = [];
      /** @type {number} */
      var i = 0;
      for (;l > i;i++) {
        if (elem = elems[i], elem || 0 === elem) {
          if ("object" === jQuery.type(elem)) {
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
          } else {
            if (selector.test(elem)) {
              tmp = tmp || safe.appendChild(context.createElement("div"));
              tag = (result.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
              j = wrap[0];
              for (;j--;) {
                tmp = tmp.lastChild;
              }
              if (!jQuery.support.leadingWhitespace && (spaceRe.test(elem) && nodes.push(context.createTextNode(spaceRe.exec(elem)[0]))), !jQuery.support.tbody) {
                elem = "table" !== tag || rhtml.test(elem) ? "<table>" !== wrap[1] || rhtml.test(elem) ? 0 : tmp : tmp.firstChild;
                j = elem && elem.childNodes.length;
                for (;j--;) {
                  if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody")) {
                    if (!tbody.childNodes.length) {
                      elem.removeChild(tbody);
                    }
                  }
                }
              }
              jQuery.merge(nodes, tmp.childNodes);
              /** @type {string} */
              tmp.textContent = "";
              for (;tmp.firstChild;) {
                tmp.removeChild(tmp.firstChild);
              }
              tmp = safe.lastChild;
            } else {
              nodes.push(context.createTextNode(elem));
            }
          }
        }
      }
      if (tmp) {
        safe.removeChild(tmp);
      }
      if (!jQuery.support.appendChecked) {
        jQuery.grep(getAll(nodes, "input"), callback);
      }
      /** @type {number} */
      i = 0;
      for (;elem = nodes[i++];) {
        if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) {
          /** @type {number} */
          j = 0;
          for (;elem = tmp[j++];) {
            if (stopParent.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
      return tmp = null, safe;
    },
    /**
     * @param {Array} elems
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    cleanData : function(elems, dataAndEvents) {
      var elem;
      var type;
      var id;
      var data;
      /** @type {number} */
      var i = 0;
      var expando = jQuery.expando;
      var cache = jQuery.cache;
      var deleteExpando = jQuery.support.deleteExpando;
      var special = jQuery.event.special;
      for (;null != (elem = elems[i]);i++) {
        if ((dataAndEvents || jQuery.acceptData(elem)) && (id = elem[expando], data = id && cache[id])) {
          if (data.events) {
            for (type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type);
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
          }
          if (cache[id]) {
            delete cache[id];
            if (deleteExpando) {
              delete elem[expando];
            } else {
              if (typeof elem.removeAttribute !== actual) {
                elem.removeAttribute(expando);
              } else {
                /** @type {null} */
                elem[expando] = null;
              }
            }
            core_deletedIds.push(id);
          }
        }
      }
    },
    /**
     * @param {string} url
     * @return {?}
     */
    _evalUrl : function(url) {
      return jQuery.ajax({
        url : url,
        type : "GET",
        dataType : "script",
        async : false,
        global : false,
        "throws" : true
      });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} qualifier
     * @return {?}
     */
    wrapAll : function(qualifier) {
      if (jQuery.isFunction(qualifier)) {
        return this.each(function(i) {
          jQuery(this).wrapAll(qualifier.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(qualifier, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var sandbox = this;
          for (;sandbox.firstChild && 1 === sandbox.firstChild.nodeType;) {
            sandbox = sandbox.firstChild;
          }
          return sandbox;
        }).append(this);
      }
      return this;
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapInner : function(html) {
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      }) : this.each(function() {
        var self = jQuery(this);
        var contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrap : function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    /**
     * @return {?}
     */
    unwrap : function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  var iframe;
  var getStyles;
  var curCSS;
  /** @type {RegExp} */
  var ralpha = /alpha\([^)]*\)/i;
  /** @type {RegExp} */
  var emptyType = /opacity\s*=\s*([^)]*)/;
  /** @type {RegExp} */
  var isint = /^(top|right|bottom|left)$/;
  /** @type {RegExp} */
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  /** @type {RegExp} */
  var rparentsprev = /^margin/;
  /** @type {RegExp} */
  var r = RegExp("^(" + core_pnum + ")(.*)$", "i");
  /** @type {RegExp} */
  var rnumnonpx = RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
  /** @type {RegExp} */
  var re = RegExp("^([+-])=(" + core_pnum + ")", "i");
  var elemdisplay = {
    BODY : "block"
  };
  var props = {
    position : "absolute",
    visibility : "hidden",
    display : "block"
  };
  var cssNormalTransform = {
    letterSpacing : 0,
    fontWeight : 400
  };
  /** @type {Array} */
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  /** @type {Array} */
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    css : function(name, value) {
      return jQuery.access(this, function(qualifier, name, value) {
        var _len;
        var styles;
        var map = {};
        /** @type {number} */
        var key = 0;
        if (jQuery.isArray(name)) {
          styles = getStyles(qualifier);
          _len = name.length;
          for (;_len > key;key++) {
            map[name[key]] = jQuery.css(qualifier, name[key], false, styles);
          }
          return map;
        }
        return value !== val ? jQuery.style(qualifier, name, value) : jQuery.css(qualifier, name);
      }, name, value, arguments.length > 1);
    },
    /**
     * @return {?}
     */
    show : function() {
      return showHide(this, true);
    },
    /**
     * @return {?}
     */
    hide : function() {
      return showHide(this);
    },
    /**
     * @param {?} state
     * @return {?}
     */
    toggle : function(state) {
      return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
        if (suiteView(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  jQuery.extend({
    cssHooks : {
      opacity : {
        /**
         * @param {string} elem
         * @param {boolean} computed
         * @return {?}
         */
        get : function(elem, computed) {
          if (computed) {
            var ret = curCSS(elem, "opacity");
            return "" === ret ? "1" : ret;
          }
        }
      }
    },
    cssNumber : {
      columnCount : true,
      fillOpacity : true,
      fontWeight : true,
      lineHeight : true,
      opacity : true,
      order : true,
      orphans : true,
      widows : true,
      zIndex : true,
      zoom : true
    },
    cssProps : {
      "float" : jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    /**
     * @param {string} obj
     * @param {string} name
     * @param {string} value
     * @param {Object} extra
     * @return {?}
     */
    style : function(obj, name, value, extra) {
      if (obj && (3 !== obj.nodeType && (8 !== obj.nodeType && obj.style))) {
        var ret;
        var current;
        var hooks;
        var origName = jQuery.camelCase(name);
        var style = obj.style;
        if (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], value === val) {
          return hooks && ("get" in hooks && (ret = hooks.get(obj, false, extra)) !== val) ? ret : style[name];
        }
        if (current = typeof value, "string" === current && ((ret = re.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(obj, name)), current = "number")), !(null == value || ("number" === current && isNaN(value) || ("number" !== current || (jQuery.cssNumber[origName] || (value += "px")), jQuery.support.clearCloneStyle || ("" !== value || (0 !== name.indexOf("background") || (style[name] = "inherit"))), hooks && ("set" in hooks && (value = hooks.set(obj, value, extra)) === val))))) {
          try {
            /** @type {string} */
            style[name] = value;
          } catch (c) {
          }
        }
      }
    },
    /**
     * @param {string} arg
     * @param {string} name
     * @param {boolean} recurring
     * @param {?} styles
     * @return {?}
     */
    css : function(arg, name, recurring, styles) {
      var a;
      var i;
      var result;
      var origName = jQuery.camelCase(name);
      return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(arg.style, origName)), result = jQuery.cssHooks[name] || jQuery.cssHooks[origName], result && ("get" in result && (i = result.get(arg, true, recurring))), i === val && (i = curCSS(arg, name, styles)), "normal" === i && (name in cssNormalTransform && (i = cssNormalTransform[name])), "" === recurring || recurring ? (a = parseFloat(i), recurring === true || jQuery.isNumeric(a) ? a || 0 : i) : i;
    }
  });
  if (win.getComputedStyle) {
    /**
     * @param {?} selector
     * @return {?}
     */
    getStyles = function(selector) {
      return win.getComputedStyle(selector, null);
    };
    /**
     * @param {string} qualifier
     * @param {string} name
     * @param {Object} _computed
     * @return {?}
     */
    curCSS = function(qualifier, name, _computed) {
      var width;
      var minWidth;
      var maxWidth;
      var computed = _computed || getStyles(qualifier);
      var ret = computed ? computed.getPropertyValue(name) || computed[name] : val;
      var style = qualifier.style;
      return computed && ("" !== ret || (jQuery.contains(qualifier.ownerDocument, qualifier) || (ret = jQuery.style(qualifier, name))), rnumnonpx.test(ret) && (rparentsprev.test(name) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth))), ret;
    };
  } else {
    if (node.documentElement.currentStyle) {
      /**
       * @param {Node} selector
       * @return {?}
       */
      getStyles = function(selector) {
        return selector.currentStyle;
      };
      /**
       * @param {Element} elem
       * @param {string} key
       * @param {Array} _computed
       * @return {?}
       */
      curCSS = function(elem, key, _computed) {
        var left;
        var rs;
        var rsLeft;
        var fill_using = _computed || getStyles(elem);
        var value = fill_using ? fill_using[key] : val;
        var style = elem.style;
        return null == value && (style && (style[key] && (value = style[key]))), rnumnonpx.test(value) && (!isint.test(key) && (left = style.left, rs = elem.runtimeStyle, rsLeft = rs && rs.left, rsLeft && (rs.left = elem.currentStyle.left), style.left = "fontSize" === key ? "1em" : value, value = style.pixelLeft + "px", style.left = left, rsLeft && (rs.left = rsLeft))), "" === value ? "auto" : value;
      };
    }
  }
  jQuery.each(["height", "width"], function(dataAndEvents, name) {
    jQuery.cssHooks[name] = {
      /**
       * @param {string} elem
       * @param {boolean} computed
       * @param {Object} extra
       * @return {?}
       */
      get : function(elem, computed, extra) {
        return computed ? 0 === elem.offsetWidth && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, props, function() {
          return getWidthOrHeight(elem, name, extra);
        }) : getWidthOrHeight(elem, name, extra) : val;
      },
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {Object} extra
       * @return {?}
       */
      set : function(elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles), styles) : 0);
      }
    };
  });
  if (!jQuery.support.opacity) {
    jQuery.cssHooks.opacity = {
      /**
       * @param {Node} elem
       * @param {boolean} computed
       * @return {?}
       */
      get : function(elem, computed) {
        return emptyType.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
      },
      /**
       * @param {Object} elem
       * @param {number} value
       * @return {undefined}
       */
      set : function(elem, value) {
        var elemStyle = elem.style;
        var currentStyle = elem.currentStyle;
        /** @type {string} */
        var opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "";
        var filter = currentStyle && currentStyle.filter || (elemStyle.filter || "");
        /** @type {number} */
        elemStyle.zoom = 1;
        if (!((value >= 1 || "" === value) && ("" === jQuery.trim(filter.replace(ralpha, "")) && (elemStyle.removeAttribute && (elemStyle.removeAttribute("filter"), "" === value || currentStyle && !currentStyle.filter))))) {
          elemStyle.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
        }
      }
    };
  }
  jQuery(function() {
    if (!jQuery.support.reliableMarginRight) {
      jQuery.cssHooks.marginRight = {
        /**
         * @param {string} elem
         * @param {boolean} computed
         * @return {?}
         */
        get : function(elem, computed) {
          return computed ? jQuery.swap(elem, {
            display : "inline-block"
          }, curCSS, [elem, "marginRight"]) : val;
        }
      };
    }
    if (!jQuery.support.pixelPosition) {
      if (jQuery.fn.position) {
        jQuery.each(["top", "left"], function(dataAndEvents, prop) {
          jQuery.cssHooks[prop] = {
            /**
             * @param {string} elem
             * @param {boolean} computed
             * @return {?}
             */
            get : function(elem, computed) {
              return computed ? (computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed) : val;
            }
          };
        });
      }
    }
  });
  if (jQuery.expr) {
    if (jQuery.expr.filters) {
      /**
       * @param {string} obj
       * @return {?}
       */
      jQuery.expr.filters.hidden = function(obj) {
        return 0 >= obj.offsetWidth && 0 >= obj.offsetHeight || !jQuery.support.reliableHiddenOffsets && "none" === (obj.style && obj.style.display || jQuery.css(obj, "display"));
      };
      /**
       * @param {string} walkers
       * @return {?}
       */
      jQuery.expr.filters.visible = function(walkers) {
        return!jQuery.expr.filters.hidden(walkers);
      };
    }
  }
  jQuery.each({
    margin : "",
    padding : "",
    border : "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      /**
       * @param {string} line
       * @return {?}
       */
      expand : function(line) {
        /** @type {number} */
        var i = 0;
        var expanded = {};
        /** @type {Array} */
        var tokens = "string" == typeof line ? line.split(" ") : [line];
        for (;4 > i;i++) {
          expanded[prefix + cssExpand[i] + suffix] = tokens[i] || (tokens[i - 2] || tokens[0]);
        }
        return expanded;
      }
    };
    if (!rparentsprev.test(prefix)) {
      /** @type {function (Object, string, Function): ?} */
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  /** @type {RegExp} */
  var rQuot = /%20/g;
  /** @type {RegExp} */
  var rbracket = /\[\]$/;
  /** @type {RegExp} */
  var rCRLF = /\r?\n/g;
  /** @type {RegExp} */
  var mouseTypeRegex = /^(?:submit|button|image|reset|file)$/i;
  /** @type {RegExp} */
  var rsubmittable = /^(?:input|select|textarea|keygen)/i;
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    serialize : function() {
      return jQuery.param(this.serializeArray());
    },
    /**
     * @return {?}
     */
    serializeArray : function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && (!jQuery(this).is(":disabled") && (rsubmittable.test(this.nodeName) && (!mouseTypeRegex.test(type) && (this.checked || !manipulation_rcheckableType.test(type)))));
      }).map(function(dataAndEvents, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return{
            name : elem.name,
            value : val.replace(rCRLF, "\r\n")
          };
        }) : {
          name : elem.name,
          value : val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  /**
   * @param {Object} a
   * @param {string} traditional
   * @return {?}
   */
  jQuery.param = function(a, traditional) {
    var prefix;
    /** @type {Array} */
    var klass = [];
    /**
     * @param {?} key
     * @param {string} value
     * @return {undefined}
     */
    var add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value;
      /** @type {string} */
      klass[klass.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (traditional === val && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return klass.join("&").replace(rQuot, "+");
  };
  jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(dataAndEvents, name) {
    /**
     * @param {Function} data
     * @param {Function} fn
     * @return {?}
     */
    jQuery.fn[name] = function(data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {Function} fnOver
     * @param {Function} fnOut
     * @return {?}
     */
    hover : function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    /**
     * @param {string} event
     * @param {Function} data
     * @param {Function} fn
     * @return {?}
     */
    bind : function(event, data, fn) {
      return this.on(event, null, data, fn);
    },
    /**
     * @param {string} types
     * @param {Function} fn
     * @return {?}
     */
    unbind : function(types, fn) {
      return this.off(types, null, fn);
    },
    /**
     * @param {string} selector
     * @param {string} types
     * @param {Function} data
     * @param {Function} fn
     * @return {?}
     */
    delegate : function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    /**
     * @param {string} selector
     * @param {Object} types
     * @param {Function} fn
     * @return {?}
     */
    undelegate : function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  var match;
  var ajaxLocation;
  var iIdCounter = jQuery.now();
  /** @type {RegExp} */
  var rquery = /\?/;
  /** @type {RegExp} */
  var currDirRegExp = /#.*$/;
  /** @type {RegExp} */
  var rts = /([?&])_=[^&]*/;
  /** @type {RegExp} */
  var pattern = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm;
  /** @type {RegExp} */
  var matches = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
  /** @type {RegExp} */
  var rnoContent = /^(?:GET|HEAD)$/;
  /** @type {RegExp} */
  var rprotocol = /^\/\//;
  /** @type {RegExp} */
  var quickExpr = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
  /** @type {function ((Function|string), Object, string): ?} */
  var matcherFunction = jQuery.fn.load;
  var prefilters = {};
  var transports = {};
  /** @type {string} */
  var Dn = "*/".concat("*");
  try {
    /** @type {string} */
    ajaxLocation = location.href;
  } catch (Ln) {
    /** @type {Element} */
    ajaxLocation = node.createElement("a");
    /** @type {string} */
    ajaxLocation.href = "";
    /** @type {string} */
    ajaxLocation = ajaxLocation.href;
  }
  /** @type {Array} */
  match = quickExpr.exec(ajaxLocation.toLowerCase()) || [];
  /**
   * @param {(Function|string)} url
   * @param {Object} data
   * @param {string} attributes
   * @return {?}
   */
  jQuery.fn.load = function(url, data, attributes) {
    if ("string" != typeof url && matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
    var selector;
    var response;
    var type;
    var self = this;
    var off = url.indexOf(" ");
    return off >= 0 && (selector = url.slice(off, url.length), url = url.slice(0, off)), jQuery.isFunction(data) ? (attributes = data, data = val) : data && ("object" == typeof data && (type = "POST")), self.length > 0 && jQuery.ajax({
      url : url,
      type : type,
      dataType : "html",
      data : data
    }).done(function(responseText) {
      /** @type {Arguments} */
      response = arguments;
      self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
    }).complete(attributes && function(obj, keepData) {
      self.each(attributes, response || [obj.responseText, keepData, obj]);
    }), this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(dataAndEvents, name) {
    /**
     * @param {string} selector
     * @return {?}
     */
    jQuery.fn[name] = function(selector) {
      return this.on(name, selector);
    };
  });
  jQuery.extend({
    active : 0,
    lastModified : {},
    etag : {},
    ajaxSettings : {
      url : ajaxLocation,
      type : "GET",
      isLocal : matches.test(match[1]),
      global : true,
      processData : true,
      async : true,
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      accepts : {
        "*" : Dn,
        text : "text/plain",
        html : "text/html",
        xml : "application/xml, text/xml",
        json : "application/json, text/javascript"
      },
      contents : {
        xml : /xml/,
        html : /html/,
        json : /json/
      },
      responseFields : {
        xml : "responseXML",
        text : "responseText",
        json : "responseJSON"
      },
      converters : {
        /** @type {function (new:String, *=): string} */
        "* text" : String,
        "text html" : true,
        "text json" : jQuery.parseJSON,
        "text xml" : jQuery.parseXML
      },
      flatOptions : {
        url : true,
        context : true
      }
    },
    /**
     * @param {(Object|string)} target
     * @param {Object} settings
     * @return {?}
     */
    ajaxSetup : function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
    ajaxTransport : addToPrefiltersOrTransports(transports),
    /**
     * @param {string} url
     * @param {Object} options
     * @return {?}
     */
    ajax : function(url, options) {
      /**
       * @param {number} status
       * @param {Node} nativeStatusText
       * @param {Object} responses
       * @param {string} total
       * @return {undefined}
       */
      function done(status, nativeStatusText, responses, total) {
        var isSuccess;
        var success;
        var error;
        var response;
        var modified;
        /** @type {Node} */
        var statusText = nativeStatusText;
        if (2 !== b) {
          /** @type {number} */
          b = 2;
          if (tref) {
            clearTimeout(tref);
          }
          /** @type {string} */
          transport = val;
          ua = total || "";
          /** @type {number} */
          jqXHR.readyState = status > 0 ? 4 : 0;
          /** @type {boolean} */
          isSuccess = status >= 200 && 300 > status || 304 === status;
          if (responses) {
            response = ajaxHandleResponses(s, jqXHR, responses);
          }
          response = ajaxConvert(s, response, jqXHR, isSuccess);
          if (isSuccess) {
            if (s.ifModified) {
              modified = jqXHR.getResponseHeader("Last-Modified");
              if (modified) {
                jQuery.lastModified[cacheURL] = modified;
              }
              modified = jqXHR.getResponseHeader("etag");
              if (modified) {
                jQuery.etag[cacheURL] = modified;
              }
            }
            if (204 === status || "HEAD" === s.type) {
              /** @type {string} */
              statusText = "nocontent";
            } else {
              if (304 === status) {
                /** @type {string} */
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                /** @type {boolean} */
                isSuccess = !error;
              }
            }
          } else {
            error = statusText;
            if (status || !statusText) {
              /** @type {string} */
              statusText = "error";
              if (0 > status) {
                /** @type {number} */
                status = 0;
              }
            }
          }
          /** @type {number} */
          jqXHR.status = status;
          /** @type {string} */
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(scripts, [success, statusText, jqXHR]);
          } else {
            deferred.rejectWith(scripts, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(suiteView);
          /** @type {string} */
          suiteView = val;
          if (g) {
            globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
          }
          completeDeferred.fireWith(scripts, [jqXHR, statusText]);
          if (g) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
            if (!--jQuery.active) {
              jQuery.event.trigger("ajaxStop");
            }
          }
        }
      }
      if ("object" == typeof url) {
        /** @type {string} */
        options = url;
        /** @type {string} */
        url = val;
      }
      options = options || {};
      var t;
      var i;
      var cacheURL;
      var ua;
      var tref;
      var g;
      var transport;
      var cache;
      var s = jQuery.ajaxSetup({}, options);
      var scripts = s.context || s;
      var globalEventContext = s.context && (scripts.nodeType || scripts.jquery) ? jQuery(scripts) : jQuery.event;
      var deferred = jQuery.Deferred();
      var completeDeferred = jQuery.Callbacks("once memory");
      var suiteView = s.statusCode || {};
      var requestHeaders = {};
      var requestHeadersNames = {};
      /** @type {number} */
      var b = 0;
      /** @type {string} */
      var strAbort = "canceled";
      var jqXHR = {
        readyState : 0,
        /**
         * @param {string} key
         * @return {?}
         */
        getResponseHeader : function(key) {
          var data;
          if (2 === b) {
            if (!cache) {
              cache = {};
              for (;data = pattern.exec(ua);) {
                /** @type {string} */
                cache[data[1].toLowerCase()] = data[2];
              }
            }
            data = cache[key.toLowerCase()];
          }
          return null == data ? null : data;
        },
        /**
         * @return {?}
         */
        getAllResponseHeaders : function() {
          return 2 === b ? ua : null;
        },
        /**
         * @param {string} name
         * @param {?} value
         * @return {?}
         */
        setRequestHeader : function(name, value) {
          var lname = name.toLowerCase();
          return b || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
        },
        /**
         * @param {?} type
         * @return {?}
         */
        overrideMimeType : function(type) {
          return b || (s.mimeType = type), this;
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        statusCode : function(obj) {
          var prop;
          if (obj) {
            if (2 > b) {
              for (prop in obj) {
                /** @type {Array} */
                suiteView[prop] = [suiteView[prop], obj[prop]];
              }
            } else {
              jqXHR.always(obj[jqXHR.status]);
            }
          }
          return this;
        },
        /**
         * @param {string} statusText
         * @return {?}
         */
        abort : function(statusText) {
          var finalText = statusText || strAbort;
          return transport && transport.abort(finalText), done(0, finalText), this;
        }
      };
      if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((url || (s.url || ajaxLocation)) + "").replace(currDirRegExp, "").replace(rprotocol, match[1] + "//"), s.type = options.method || (options.type || (s.method || s.type)), s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""], null == s.crossDomain && (t = quickExpr.exec(s.url.toLowerCase()), s.crossDomain = !(!t || t[1] === match[1] &&
      (t[2] === match[2] && (t[3] || ("http:" === t[1] ? "80" : "443")) === (match[3] || ("http:" === match[1] ? "80" : "443"))))), s.data && (s.processData && ("string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)))), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === b) {
        return jqXHR;
      }
      g = s.global;
      if (g) {
        if (0 === jQuery.active++) {
          jQuery.event.trigger("ajaxStart");
        }
      }
      s.type = s.type.toUpperCase();
      /** @type {boolean} */
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          /** @type {string} */
          cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + iIdCounter++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + iIdCounter++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && (s.hasContent && s.contentType !== false) || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(scripts, jqXHR, s) === false || 2 === b)) {
        return jqXHR.abort();
      }
      /** @type {string} */
      strAbort = "abort";
      for (i in{
        success : 1,
        error : 1,
        complete : 1
      }) {
        jqXHR[i](s[i]);
      }
      if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
        /** @type {number} */
        jqXHR.readyState = 1;
        if (g) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (s.async) {
          if (s.timeout > 0) {
            /** @type {number} */
            tref = setTimeout(function() {
              jqXHR.abort("timeout");
            }, s.timeout);
          }
        }
        try {
          /** @type {number} */
          b = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (!(2 > b)) {
            throw e;
          }
          done(-1, e);
        }
      } else {
        done(-1, "No Transport");
      }
      return jqXHR;
    },
    /**
     * @param {string} cur
     * @param {boolean} name
     * @param {Object} callback
     * @return {?}
     */
    getJSON : function(cur, name, callback) {
      return jQuery.get(cur, name, callback, "json");
    },
    /**
     * @param {string} cur
     * @param {Object} callback
     * @return {?}
     */
    getScript : function(cur, callback) {
      return jQuery.get(cur, val, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(dataAndEvents, method) {
    /**
     * @param {string} requestUrl
     * @param {Object} data
     * @param {Object} success
     * @param {boolean} dataType
     * @return {?}
     */
    jQuery[method] = function(requestUrl, data, success, dataType) {
      return jQuery.isFunction(data) && (dataType = dataType || success, success = data, data = val), jQuery.ajax({
        url : requestUrl,
        type : method,
        dataType : dataType,
        data : data,
        success : success
      });
    };
  });
  jQuery.ajaxSetup({
    accepts : {
      script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents : {
      script : /(?:java|ecma)script/
    },
    converters : {
      /**
       * @param {string} value
       * @return {?}
       */
      "text script" : function(value) {
        return jQuery.globalEval(value), value;
      }
    }
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (s.cache === val) {
      /** @type {boolean} */
      s.cache = false;
    }
    if (s.crossDomain) {
      /** @type {string} */
      s.type = "GET";
      /** @type {boolean} */
      s.global = false;
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script;
      var head = node.head || (jQuery("head")[0] || node.documentElement);
      return{
        /**
         * @param {?} _
         * @param {Function} callback
         * @return {undefined}
         */
        send : function(_, callback) {
          /** @type {Element} */
          script = node.createElement("script");
          /** @type {boolean} */
          script.async = true;
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          /** @type {function (string, ?): undefined} */
          script.onload = script.onreadystatechange = function(obj, keepData) {
            if (keepData || (!script.readyState || /loaded|complete/.test(script.readyState))) {
              /** @type {null} */
              script.onload = script.onreadystatechange = null;
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              /** @type {null} */
              script = null;
              if (!keepData) {
                callback(200, "success");
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        /**
         * @return {undefined}
         */
        abort : function() {
          if (script) {
            script.onload(val, true);
          }
        }
      };
    }
  });
  /** @type {Array} */
  var eventPath = [];
  /** @type {RegExp} */
  var rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp : "callback",
    /**
     * @return {?}
     */
    jsonpCallback : function() {
      var unlock = eventPath.pop() || jQuery.expando + "_" + iIdCounter++;
      return this[unlock] = true, unlock;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName;
    var func;
    var objects;
    /** @type {(boolean|string)} */
    var jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && (!(s.contentType || "").indexOf("application/x-www-form-urlencoded") && (rjsonp.test(s.data) && "data")));
    return jsonProp || "jsonp" === s.dataTypes[0] ? (callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== false && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
      return objects || jQuery.error(callbackName + " was not called"), objects[0];
    }, s.dataTypes[0] = "json", func = win[callbackName], win[callbackName] = function() {
      /** @type {Arguments} */
      objects = arguments;
    }, jqXHR.always(function() {
      win[callbackName] = func;
      if (s[callbackName]) {
        s.jsonpCallback = originalSettings.jsonpCallback;
        eventPath.push(callbackName);
      }
      if (objects) {
        if (jQuery.isFunction(func)) {
          func(objects[0]);
        }
      }
      objects = func = val;
    }), "script") : val;
  });
  var iteratee;
  var nativeXHR;
  /** @type {number} */
  var _i = 0;
  /** @type {function (): undefined} */
  var xhrOnUnloadAbort = win.ActiveXObject && function() {
    var index;
    for (index in iteratee) {
      iteratee[index](val, true);
    }
  };
  /** @type {function (): ?} */
  jQuery.ajaxSettings.xhr = win.ActiveXObject ? function() {
    return!this.isLocal && createStandardXHR() || createActiveXHR();
  } : createStandardXHR;
  nativeXHR = jQuery.ajaxSettings.xhr();
  /** @type {boolean} */
  jQuery.support.cors = !!nativeXHR && "withCredentials" in nativeXHR;
  /** @type {boolean} */
  nativeXHR = jQuery.support.ajax = !!nativeXHR;
  if (nativeXHR) {
    jQuery.ajaxTransport(function(s) {
      if (!s.crossDomain || jQuery.support.cors) {
        var callback;
        return{
          /**
           * @param {Object} headers
           * @param {Function} cb
           * @return {undefined}
           */
          send : function(headers, cb) {
            var index;
            var i;
            var xhr = s.xhr();
            if (s.username ? xhr.open(s.type, s.url, s.async, s.username, s.password) : xhr.open(s.type, s.url, s.async), s.xhrFields) {
              for (i in s.xhrFields) {
                xhr[i] = s.xhrFields[i];
              }
            }
            if (s.mimeType) {
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType(s.mimeType);
              }
            }
            if (!s.crossDomain) {
              if (!headers["X-Requested-With"]) {
                /** @type {string} */
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
            }
            try {
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
            } catch (u) {
            }
            xhr.send(s.hasContent && s.data || null);
            /**
             * @param {string} obj
             * @param {string} keepData
             * @return {undefined}
             */
            callback = function(obj, keepData) {
              var e;
              var comment2;
              var res;
              var container;
              try {
                if (callback && (keepData || 4 === xhr.readyState)) {
                  if (callback = val, index && (xhr.onreadystatechange = jQuery.noop, xhrOnUnloadAbort && delete iteratee[index]), keepData) {
                    if (4 !== xhr.readyState) {
                      xhr.abort();
                    }
                  } else {
                    container = {};
                    e = xhr.status;
                    comment2 = xhr.getAllResponseHeaders();
                    if ("string" == typeof xhr.responseText) {
                      /** @type {string} */
                      container.text = xhr.responseText;
                    }
                    try {
                      res = xhr.statusText;
                    } catch (f) {
                      /** @type {string} */
                      res = "";
                    }
                    if (e || (!s.isLocal || s.crossDomain)) {
                      if (1223 === e) {
                        /** @type {number} */
                        e = 204;
                      }
                    } else {
                      /** @type {number} */
                      e = container.text ? 200 : 404;
                    }
                  }
                }
              } catch (modelData) {
                if (!keepData) {
                  cb(-1, modelData);
                }
              }
              if (container) {
                cb(e, res, container, comment2);
              }
            };
            if (s.async) {
              if (4 === xhr.readyState) {
                setTimeout(callback);
              } else {
                /** @type {number} */
                index = ++_i;
                if (xhrOnUnloadAbort) {
                  if (!iteratee) {
                    iteratee = {};
                    jQuery(win).unload(xhrOnUnloadAbort);
                  }
                  /** @type {function (string, string): undefined} */
                  iteratee[index] = callback;
                }
                /** @type {function (string, string): undefined} */
                xhr.onreadystatechange = callback;
              }
            } else {
              callback();
            }
          },
          /**
           * @return {undefined}
           */
          abort : function() {
            if (callback) {
              callback(val, true);
            }
          }
        };
      }
    });
  }
  var fxNow;
  var scrollIntervalId;
  /** @type {RegExp} */
  var rplusequals = /^(?:toggle|show|hide)$/;
  /** @type {RegExp} */
  var rtagName = RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i");
  /** @type {RegExp} */
  var rrun = /queueHooks$/;
  /** @type {Array} */
  var animationPrefilters = [defaultPrefilter];
  var cache = {
    "*" : [function(name, value) {
      var tween = this.createTween(name, value);
      var l0 = tween.cur();
      /** @type {(Array.<string>|null)} */
      var parts = rtagName.exec(value);
      /** @type {string} */
      var unit = parts && parts[3] || (jQuery.cssNumber[name] ? "" : "px");
      var start = (jQuery.cssNumber[name] || "px" !== unit && +l0) && rtagName.exec(jQuery.css(tween.elem, name));
      /** @type {number} */
      var scale = 1;
      /** @type {number} */
      var l = 20;
      if (start && start[3] !== unit) {
        unit = unit || start[3];
        /** @type {Array} */
        parts = parts || [];
        /** @type {number} */
        start = +l0 || 1;
        do {
          /** @type {(number|string)} */
          scale = scale || ".5";
          start /= scale;
          jQuery.style(tween.elem, name, start + unit);
        } while (scale !== (scale = tween.cur() / l0) && (1 !== scale && --l));
      }
      return parts && (start = tween.start = +start || (+l0 || 0), tween.unit = unit, tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]), tween;
    }]
  };
  jQuery.Animation = jQuery.extend(Animation, {
    /**
     * @param {Object} props
     * @param {Function} callback
     * @return {undefined}
     */
    tweener : function(props, callback) {
      if (jQuery.isFunction(props)) {
        /** @type {Object} */
        callback = props;
        /** @type {Array} */
        props = ["*"];
      } else {
        props = props.split(" ");
      }
      var prop;
      /** @type {number} */
      var index = 0;
      var length = props.length;
      for (;length > index;index++) {
        prop = props[index];
        cache[prop] = cache[prop] || [];
        cache[prop].unshift(callback);
      }
    },
    /**
     * @param {?} callback
     * @param {?} prepend
     * @return {undefined}
     */
    prefilter : function(callback, prepend) {
      if (prepend) {
        animationPrefilters.unshift(callback);
      } else {
        animationPrefilters.push(callback);
      }
    }
  });
  /** @type {function (string, string, string, string, string): ?} */
  jQuery.Tween = Tween;
  Tween.prototype = {
    /** @type {function (string, string, string, string, string): ?} */
    constructor : Tween,
    /**
     * @param {string} type
     * @param {Object} options
     * @param {string} prop
     * @param {?} to
     * @param {string} easing
     * @param {string} unit
     * @return {undefined}
     */
    init : function(type, options, prop, to, easing, unit) {
      /** @type {string} */
      this.elem = type;
      /** @type {string} */
      this.prop = prop;
      this.easing = easing || "swing";
      /** @type {Object} */
      this.options = options;
      this.start = this.now = this.cur();
      this.end = to;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    /**
     * @return {?}
     */
    cur : function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    /**
     * @param {number} percent
     * @return {?}
     */
    run : function(percent) {
      var eased;
      var hooks = Tween.propHooks[this.prop];
      return this.pos = eased = this.options.duration ? jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default : {
      /**
       * @param {Object} elem
       * @return {?}
       */
      get : function(elem) {
        var node;
        return null == elem.elem[elem.prop] || elem.elem.style && null != elem.elem.style[elem.prop] ? (node = jQuery.css(elem.elem, elem.prop, ""), node && "auto" !== node ? node : 0) : elem.elem[elem.prop];
      },
      /**
       * @param {Object} tween
       * @return {undefined}
       */
      set : function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else {
          if (tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop])) {
            jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
          } else {
            tween.elem[tween.prop] = tween.now;
          }
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    /**
     * @param {Object} tween
     * @return {undefined}
     */
    set : function(tween) {
      if (tween.elem.nodeType) {
        if (tween.elem.parentNode) {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  jQuery.each(["toggle", "show", "hide"], function(dataAndEvents, name) {
    var matcherFunction = jQuery.fn[name];
    /**
     * @param {number} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[name] = function(speed, callback, next_callback) {
      return null == speed || "boolean" == typeof speed ? matcherFunction.apply(this, arguments) : this.animate(genFx(name, true), speed, callback, next_callback);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {number} speed
     * @param {boolean} to
     * @param {Object} callback
     * @param {Object} _callback
     * @return {?}
     */
    fadeTo : function(speed, to, callback, _callback) {
      return this.filter(suiteView).css("opacity", 0).show().end().animate({
        opacity : to
      }, speed, callback, _callback);
    },
    /**
     * @param {?} prop
     * @param {number} speed
     * @param {Object} easing
     * @param {Object} callback
     * @return {?}
     */
    animate : function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop);
      var optall = jQuery.speed(speed, easing, callback);
      /**
       * @return {undefined}
       */
      var name = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        if (empty || jQuery._data(this, "finish")) {
          anim.stop(true);
        }
      };
      return name.finish = name, empty || optall.queue === false ? this.each(name) : this.queue(optall.queue, name);
    },
    /**
     * @param {boolean} type
     * @param {boolean} dataAndEvents
     * @param {boolean} gotoEnd
     * @return {?}
     */
    stop : function(type, dataAndEvents, gotoEnd) {
      /**
       * @param {Object} e
       * @return {undefined}
       */
      var stop = function(e) {
        var stop = e.stop;
        delete e.stop;
        stop(gotoEnd);
      };
      return "string" != typeof type && (gotoEnd = dataAndEvents, dataAndEvents = type, type = val), dataAndEvents && (type !== false && this.queue(type || "fx", [])), this.each(function() {
        /** @type {boolean} */
        var dequeue = true;
        var index = null != type && type + "queueHooks";
        /** @type {Array} */
        var timers = jQuery.timers;
        var iteratee = jQuery._data(this);
        if (index) {
          if (iteratee[index]) {
            if (iteratee[index].stop) {
              stop(iteratee[index]);
            }
          }
        } else {
          for (index in iteratee) {
            if (iteratee[index]) {
              if (iteratee[index].stop) {
                if (rrun.test(index)) {
                  stop(iteratee[index]);
                }
              }
            }
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (!(timers[index].elem !== this)) {
            if (!(null != type && timers[index].queue !== type)) {
              timers[index].anim.stop(gotoEnd);
              /** @type {boolean} */
              dequeue = false;
              timers.splice(index, 1);
            }
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    finish : function(type) {
      return type !== false && (type = type || "fx"), this.each(function() {
        var index;
        var data = jQuery._data(this);
        var array = data[type + "queue"];
        var event = data[type + "queueHooks"];
        /** @type {Array} */
        var timers = jQuery.timers;
        var length = array ? array.length : 0;
        /** @type {boolean} */
        data.finish = true;
        jQuery.queue(this, type, []);
        if (event) {
          if (event.stop) {
            event.stop.call(this, true);
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this) {
            if (timers[index].queue === type) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
        }
        /** @type {number} */
        index = 0;
        for (;length > index;index++) {
          if (array[index]) {
            if (array[index].finish) {
              array[index].finish.call(this);
            }
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each({
    slideDown : genFx("show"),
    slideUp : genFx("hide"),
    slideToggle : genFx("toggle"),
    fadeIn : {
      opacity : "show"
    },
    fadeOut : {
      opacity : "hide"
    },
    fadeToggle : {
      opacity : "toggle"
    }
  }, function(original, props) {
    /**
     * @param {number} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[original] = function(speed, callback, next_callback) {
      return this.animate(props, speed, callback, next_callback);
    };
  });
  /**
   * @param {Object} speed
   * @param {Object} easing
   * @param {Object} fn
   * @return {?}
   */
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
      complete : fn || (!fn && easing || jQuery.isFunction(speed) && speed),
      duration : speed,
      easing : fn && easing || easing && (!jQuery.isFunction(easing) && easing)
    };
    return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, (null == opt.queue || opt.queue === true) && (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    }, opt;
  };
  jQuery.easing = {
    /**
     * @param {?} t
     * @return {?}
     */
    linear : function(t) {
      return t;
    },
    /**
     * @param {number} p
     * @return {?}
     */
    swing : function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  /** @type {Array} */
  jQuery.timers = [];
  /** @type {function (string, Object, string, ?, string, string): undefined} */
  jQuery.fx = Tween.prototype.init;
  /**
   * @return {undefined}
   */
  jQuery.fx.tick = function() {
    var last;
    /** @type {Array} */
    var timers = jQuery.timers;
    /** @type {number} */
    var i = 0;
    fxNow = jQuery.now();
    for (;timers.length > i;i++) {
      last = timers[i];
      if (!last()) {
        if (!(timers[i] !== last)) {
          timers.splice(i--, 1);
        }
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    /** @type {string} */
    fxNow = val;
  };
  /**
   * @param {?} timer
   * @return {undefined}
   */
  jQuery.fx.timer = function(timer) {
    if (timer()) {
      if (jQuery.timers.push(timer)) {
        jQuery.fx.start();
      }
    }
  };
  /** @type {number} */
  jQuery.fx.interval = 13;
  /**
   * @return {undefined}
   */
  jQuery.fx.start = function() {
    if (!scrollIntervalId) {
      /** @type {number} */
      scrollIntervalId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  /**
   * @return {undefined}
   */
  jQuery.fx.stop = function() {
    clearInterval(scrollIntervalId);
    /** @type {null} */
    scrollIntervalId = null;
  };
  jQuery.fx.speeds = {
    slow : 600,
    fast : 200,
    _default : 400
  };
  jQuery.fx.step = {};
  if (jQuery.expr) {
    if (jQuery.expr.filters) {
      /**
       * @param {string} elem
       * @return {?}
       */
      jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
    }
  }
  /**
   * @param {string} options
   * @return {?}
   */
  jQuery.fn.offset = function(options) {
    if (arguments.length) {
      return options === val ? this : this.each(function(dataName) {
        jQuery.offset.setOffset(this, options, dataName);
      });
    }
    var doc;
    var win;
    var animation = {
      top : 0,
      left : 0
    };
    var b = this[0];
    var node = b && b.ownerDocument;
    if (node) {
      return doc = node.documentElement, jQuery.contains(doc, b) ? (typeof b.getBoundingClientRect !== actual && (animation = b.getBoundingClientRect()), win = getWindow(node), {
        top : animation.top + (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
        left : animation.left + (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      }) : animation;
    }
  };
  jQuery.offset = {
    /**
     * @param {string} elem
     * @param {Object} options
     * @param {number} i
     * @return {undefined}
     */
    setOffset : function(elem, options, i) {
      var position = jQuery.css(elem, "position");
      if ("static" === position) {
        /** @type {string} */
        elem.style.position = "relative";
      }
      var curElem = jQuery(elem);
      var curOffset = curElem.offset();
      var curCSSTop = jQuery.css(elem, "top");
      var curCSSLeft = jQuery.css(elem, "left");
      /** @type {boolean} */
      var l = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;
      var props = {};
      var curPosition = {};
      var curTop;
      var curLeft;
      if (l) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        /** @type {number} */
        curTop = parseFloat(curCSSTop) || 0;
        /** @type {number} */
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (null != options.top) {
        /** @type {number} */
        props.top = options.top - curOffset.top + curTop;
      }
      if (null != options.left) {
        /** @type {number} */
        props.left = options.left - curOffset.left + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    position : function() {
      if (this[0]) {
        var offsetParent;
        var offset;
        var parentOffset = {
          top : 0,
          left : 0
        };
        var n = this[0];
        return "fixed" === jQuery.css(n, "position") ? offset = n.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true)), {
          top : offset.top - parentOffset.top - jQuery.css(n, "marginTop", true),
          left : offset.left - parentOffset.left - jQuery.css(n, "marginLeft", true)
        };
      }
    },
    /**
     * @return {?}
     */
    offsetParent : function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;
        for (;offsetParent && (!jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"));) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft : "pageXOffset",
    scrollTop : "pageYOffset"
  }, function(name, src) {
    /** @type {boolean} */
    var listener = /Y/.test(src);
    /**
     * @param {string} value
     * @return {?}
     */
    jQuery.fn[name] = function(value) {
      return jQuery.access(this, function(doc, name, value) {
        var scripts = getWindow(doc);
        return value === val ? scripts ? src in scripts ? scripts[src] : scripts.document.documentElement[name] : doc[name] : (scripts ? scripts.scrollTo(listener ? jQuery(scripts).scrollLeft() : value, listener ? value : jQuery(scripts).scrollTop()) : doc[name] = value, val);
      }, name, value, arguments.length, null);
    };
  });
  jQuery.each({
    Height : "height",
    Width : "width"
  }, function(name, i) {
    jQuery.each({
      padding : "inner" + name,
      content : i,
      "" : "outer" + name
    }, function(defaultExtra, original) {
      /**
       * @param {Object} margin
       * @param {boolean} value
       * @return {?}
       */
      jQuery.fn[original] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin);
        var extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return jQuery.access(this, function(qualifier, type, value) {
          var doc;
          return jQuery.isWindow(qualifier) ? qualifier.document.documentElement["client" + name] : 9 === qualifier.nodeType ? (doc = qualifier.documentElement, Math.max(qualifier.body["scroll" + name], doc["scroll" + name], qualifier.body["offset" + name], doc["offset" + name], doc["client" + name])) : value === val ? jQuery.css(qualifier, type, extra) : jQuery.style(qualifier, type, value, extra);
        }, i, chainable ? margin : val, chainable, null);
      };
    });
  });
  /**
   * @return {?}
   */
  jQuery.fn.size = function() {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if ("object" == typeof module && (module && "object" == typeof module.exports)) {
    /** @type {function (string, string): ?} */
    module.exports = jQuery;
  } else {
    /** @type {function (string, string): ?} */
    win.jQuery = win.$ = jQuery;
    if ("function" == typeof define) {
      if (define.amd) {
        define("jquery", [], function() {
          return jQuery;
        });
      }
    }
  }
})(window);
if (typeof jQuery === "undefined") {
  throw new Error("Bootstrap's JavaScript requires jQuery");
}
+function($) {
  /**
   * @return {?}
   */
  function transitionEnd() {
    /** @type {Element} */
    var el = document.createElement("bootstrap");
    var transEndEventNames = {
      WebkitTransition : "webkitTransitionEnd",
      MozTransition : "transitionend",
      OTransition : "oTransitionEnd otransitionend",
      transition : "transitionend"
    };
    var name;
    for (name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return{
          end : transEndEventNames[name]
        };
      }
    }
    return false;
  }
  /**
   * @param {number} opt_attributes
   * @return {?}
   */
  $.fn.emulateTransitionEnd = function(opt_attributes) {
    /** @type {boolean} */
    var called = false;
    var $el = this;
    $(this).one("bsTransitionEnd", function() {
      /** @type {boolean} */
      called = true;
    });
    /**
     * @return {undefined}
     */
    var callback = function() {
      if (!called) {
        $($el).trigger($.support.transition.end);
      }
    };
    setTimeout(callback, opt_attributes);
    return this;
  };
  $(function() {
    $.support.transition = transitionEnd();
    if (!$.support.transition) {
      return;
    }
    $.event.special.bsTransitionEnd = {
      bindType : $.support.transition.end,
      delegateType : $.support.transition.end,
      /**
       * @param {Event} event
       * @return {?}
       */
      handle : function(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments);
        }
      }
    };
  });
}(jQuery);
+function($) {
  /**
   * @param {?} option
   * @return {?}
   */
  function initialize(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.alert");
      if (!data) {
        $this.data("bs.alert", data = new Alert(this));
      }
      if (typeof option == "string") {
        data[option].call($this);
      }
    });
  }
  /** @type {string} */
  var className = '[data-dismiss="alert"]';
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Alert = function(selector) {
    $(selector).on("click", className, this.close);
  };
  /** @type {string} */
  Alert.VERSION = "3.2.0";
  /**
   * @param {Object} e
   * @return {undefined}
   */
  Alert.prototype.close = function(e) {
    /**
     * @return {undefined}
     */
    function removeElement() {
      $parent.detach().trigger("closed.bs.alert").remove();
    }
    var $this = $(this);
    var selector = $this.attr("data-target");
    if (!selector) {
      selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    var $parent = $(selector);
    if (e) {
      e.preventDefault();
    }
    if (!$parent.length) {
      $parent = $this.hasClass("alert") ? $this : $this.parent();
    }
    $parent.trigger(e = $.Event("close.bs.alert"));
    if (e.isDefaultPrevented()) {
      return;
    }
    $parent.removeClass("in");
    if ($.support.transition && $parent.hasClass("fade")) {
      $parent.one("bsTransitionEnd", removeElement).emulateTransitionEnd(150);
    } else {
      removeElement();
    }
  };
  var old = $.fn.alert;
  /** @type {function (?): ?} */
  $.fn.alert = initialize;
  /** @type {function (string): undefined} */
  $.fn.alert.Constructor = Alert;
  /**
   * @return {?}
   */
  $.fn.alert.noConflict = function() {
    $.fn.alert = old;
    return this;
  };
  $(document).on("click.bs.alert.data-api", className, Alert.prototype.close);
}(jQuery);
+function($) {
  /**
   * @param {string} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.button");
      var options = typeof option == "object" && option;
      if (!data) {
        $this.data("bs.button", data = new Button(this, options));
      }
      if (option == "toggle") {
        data.toggle();
      } else {
        if (option) {
          data.setState(option);
        }
      }
    });
  }
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Button = function(selector, options) {
    this.$element = $(selector);
    this.options = $.extend({}, Button.DEFAULTS, options);
    /** @type {boolean} */
    this.isLoading = false;
  };
  /** @type {string} */
  Button.VERSION = "3.2.0";
  Button.DEFAULTS = {
    loadingText : "loading..."
  };
  /**
   * @param {string} state
   * @return {undefined}
   */
  Button.prototype.setState = function(state) {
    /** @type {string} */
    var elem = "disabled";
    var $el = this.$element;
    /** @type {string} */
    var val = $el.is("input") ? "val" : "html";
    var data = $el.data();
    /** @type {string} */
    state = state + "Text";
    if (data.resetText == null) {
      $el.data("resetText", $el[val]());
    }
    $el[val](data[state] == null ? this.options[state] : data[state]);
    setTimeout($.proxy(function() {
      if (state == "loadingText") {
        /** @type {boolean} */
        this.isLoading = true;
        $el.addClass(elem).attr(elem, elem);
      } else {
        if (this.isLoading) {
          /** @type {boolean} */
          this.isLoading = false;
          $el.removeClass(elem).removeAttr(elem);
        }
      }
    }, this), 0);
  };
  /**
   * @return {undefined}
   */
  Button.prototype.toggle = function() {
    /** @type {boolean} */
    var changed = true;
    var $shcell = this.$element.closest('[data-toggle="buttons"]');
    if ($shcell.length) {
      var $input = this.$element.find("input");
      if ($input.prop("type") == "radio") {
        if ($input.prop("checked") && this.$element.hasClass("active")) {
          /** @type {boolean} */
          changed = false;
        } else {
          $shcell.find(".active").removeClass("active");
        }
      }
      if (changed) {
        $input.prop("checked", !this.$element.hasClass("active")).trigger("change");
      }
    }
    if (changed) {
      this.$element.toggleClass("active");
    }
  };
  var old = $.fn.button;
  /** @type {function (string): ?} */
  $.fn.button = init;
  /** @type {function (string, ?): undefined} */
  $.fn.button.Constructor = Button;
  /**
   * @return {?}
   */
  $.fn.button.noConflict = function() {
    $.fn.button = old;
    return this;
  };
  $(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(evt) {
    var self = $(evt.target);
    if (!self.hasClass("btn")) {
      self = self.closest(".btn");
    }
    init.call(self, "toggle");
    evt.preventDefault();
  });
}(jQuery);
+function($) {
  /**
   * @param {number} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.carousel");
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
      var action = typeof option == "string" ? option : options.slide;
      if (!data) {
        $this.data("bs.carousel", data = new Carousel(this, options));
      }
      if (typeof option == "number") {
        data.to(option);
      } else {
        if (action) {
          data[action]();
        } else {
          if (options.interval) {
            data.pause().cycle();
          }
        }
      }
    });
  }
  /**
   * @param {string} selector
   * @param {Object} options
   * @return {undefined}
   */
  var Carousel = function(selector, options) {
    this.$element = $(selector).on("keydown.bs.carousel", $.proxy(this.keydown, this));
    this.$indicators = this.$element.find(".carousel-indicators");
    /** @type {Object} */
    this.options = options;
    /** @type {null} */
    this.paused = this.sliding = this.interval = this.$active = this.$items = null;
    if (this.options.pause == "hover") {
      this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
    }
  };
  /** @type {string} */
  Carousel.VERSION = "3.2.0";
  Carousel.DEFAULTS = {
    interval : 5E3,
    pause : "hover",
    wrap : true
  };
  /**
   * @param {Event} e
   * @return {undefined}
   */
  Carousel.prototype.keydown = function(e) {
    switch(e.which) {
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
      default:
        return;
    }
    e.preventDefault();
  };
  /**
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  Carousel.prototype.cycle = function(dataAndEvents) {
    if (!dataAndEvents) {
      /** @type {boolean} */
      this.paused = false;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.options.interval) {
      if (!this.paused) {
        /** @type {number} */
        this.interval = setInterval($.proxy(this.next, this), this.options.interval);
      }
    }
    return this;
  };
  /**
   * @param {Window} $item
   * @return {?}
   */
  Carousel.prototype.getItemIndex = function($item) {
    this.$items = $item.parent().children(".item");
    return this.$items.index($item || this.$active);
  };
  /**
   * @param {number} pos
   * @return {?}
   */
  Carousel.prototype.to = function(pos) {
    var that = this;
    var activePos = this.getItemIndex(this.$active = this.$element.find(".item.active"));
    if (pos > this.$items.length - 1 || pos < 0) {
      return;
    }
    if (this.sliding) {
      return this.$element.one("slid.bs.carousel", function() {
        that.to(pos);
      });
    }
    if (activePos == pos) {
      return this.pause().cycle();
    }
    return this.slide(pos > activePos ? "next" : "prev", $(this.$items[pos]));
  };
  /**
   * @param {?} $vid
   * @return {?}
   */
  Carousel.prototype.pause = function($vid) {
    if (!$vid) {
      /** @type {boolean} */
      this.paused = true;
    }
    if (this.$element.find(".next, .prev").length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }
    this.interval = clearInterval(this.interval);
    return this;
  };
  /**
   * @return {?}
   */
  Carousel.prototype.next = function() {
    if (this.sliding) {
      return;
    }
    return this.slide("next");
  };
  /**
   * @return {?}
   */
  Carousel.prototype.prev = function() {
    if (this.sliding) {
      return;
    }
    return this.slide("prev");
  };
  /**
   * @param {string} type
   * @param {string} next
   * @return {?}
   */
  Carousel.prototype.slide = function(type, next) {
    var $active = this.$element.find(".item.active");
    var $next = next || $active[type]();
    var isCycling = this.interval;
    /** @type {string} */
    var direction = type == "next" ? "left" : "right";
    /** @type {string} */
    var fallback = type == "next" ? "first" : "last";
    var that = this;
    if (!$next.length) {
      if (!this.options.wrap) {
        return;
      }
      $next = this.$element.find(".item")[fallback]();
    }
    if ($next.hasClass("active")) {
      return this.sliding = false;
    }
    var previous = $next[0];
    var e = $.Event("slide.bs.carousel", {
      relatedTarget : previous,
      direction : direction
    });
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    /** @type {boolean} */
    this.sliding = true;
    if (isCycling) {
      this.pause();
    }
    if (this.$indicators.length) {
      this.$indicators.find(".active").removeClass("active");
      var $listing = $(this.$indicators.children()[this.getItemIndex($next)]);
      if ($listing) {
        $listing.addClass("active");
      }
    }
    var startEvent = $.Event("slid.bs.carousel", {
      relatedTarget : previous,
      direction : direction
    });
    if ($.support.transition && this.$element.hasClass("slide")) {
      $next.addClass(type);
      $next[0].offsetWidth;
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one("bsTransitionEnd", function() {
        $next.removeClass([type, direction].join(" ")).addClass("active");
        $active.removeClass(["active", direction].join(" "));
        /** @type {boolean} */
        that.sliding = false;
        setTimeout(function() {
          that.$element.trigger(startEvent);
        }, 0);
      }).emulateTransitionEnd($active.css("transition-duration").slice(0, -1) * 1E3);
    } else {
      $active.removeClass("active");
      $next.addClass("active");
      /** @type {boolean} */
      this.sliding = false;
      this.$element.trigger(startEvent);
    }
    if (isCycling) {
      this.cycle();
    }
    return this;
  };
  var old = $.fn.carousel;
  /** @type {function (number): ?} */
  $.fn.carousel = init;
  /** @type {function (string, Object): undefined} */
  $.fn.carousel.Constructor = Carousel;
  /**
   * @return {?}
   */
  $.fn.carousel.noConflict = function() {
    $.fn.carousel = old;
    return this;
  };
  $(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(types) {
    var href;
    var $this = $(this);
    var panel = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""));
    if (!panel.hasClass("carousel")) {
      return;
    }
    var next = $.extend({}, panel.data(), $this.data());
    var slideIndex = $this.attr("data-slide-to");
    if (slideIndex) {
      /** @type {boolean} */
      next.interval = false;
    }
    init.call(panel, next);
    if (slideIndex) {
      panel.data("bs.carousel").to(slideIndex);
    }
    types.preventDefault();
  });
  $(window).on("load", function() {
    $('[data-ride="carousel"]').each(function() {
      var self = $(this);
      init.call(self, self.data());
    });
  });
}(jQuery);
+function($) {
  /**
   * @param {boolean} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.collapse");
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == "object" && option);
      if (!data && (options.toggle && option == "show")) {
        /** @type {boolean} */
        option = !option;
      }
      if (!data) {
        $this.data("bs.collapse", data = new Collapse(this, options));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Collapse = function(selector, options) {
    this.$element = $(selector);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    /** @type {null} */
    this.transitioning = null;
    if (this.options.parent) {
      this.$parent = $(this.options.parent);
    }
    if (this.options.toggle) {
      this.toggle();
    }
  };
  /** @type {string} */
  Collapse.VERSION = "3.2.0";
  Collapse.DEFAULTS = {
    toggle : true
  };
  /**
   * @return {?}
   */
  Collapse.prototype.dimension = function() {
    var hasWidth = this.$element.hasClass("width");
    return hasWidth ? "width" : "height";
  };
  /**
   * @return {?}
   */
  Collapse.prototype.show = function() {
    if (this.transitioning || this.$element.hasClass("in")) {
      return;
    }
    var e = $.Event("show.bs.collapse");
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    var obj = this.$parent && this.$parent.find("> .panel > .in");
    if (obj && obj.length) {
      var hasData = obj.data("bs.collapse");
      if (hasData && hasData.transitioning) {
        return;
      }
      init.call(obj, "hide");
      if (!hasData) {
        obj.data("bs.collapse", null);
      }
    }
    var dimension = this.dimension();
    this.$element.removeClass("collapse").addClass("collapsing")[dimension](0);
    /** @type {number} */
    this.transitioning = 1;
    /**
     * @return {undefined}
     */
    var complete = function() {
      this.$element.removeClass("collapsing").addClass("collapse in")[dimension]("");
      /** @type {number} */
      this.transitioning = 0;
      this.$element.trigger("shown.bs.collapse");
    };
    if (!$.support.transition) {
      return complete.call(this);
    }
    var scrollSize = $.camelCase(["scroll", dimension].join("-"));
    this.$element.one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize]);
  };
  /**
   * @return {?}
   */
  Collapse.prototype.hide = function() {
    if (this.transitioning || !this.$element.hasClass("in")) {
      return;
    }
    var e = $.Event("hide.bs.collapse");
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    var dimension = this.dimension();
    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
    this.$element.addClass("collapsing").removeClass("collapse").removeClass("in");
    /** @type {number} */
    this.transitioning = 1;
    /**
     * @return {undefined}
     */
    var complete = function() {
      /** @type {number} */
      this.transitioning = 0;
      this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse");
    };
    if (!$.support.transition) {
      return complete.call(this);
    }
    this.$element[dimension](0).one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(350);
  };
  /**
   * @return {undefined}
   */
  Collapse.prototype.toggle = function() {
    this[this.$element.hasClass("in") ? "hide" : "show"]();
  };
  var old = $.fn.collapse;
  /** @type {function (boolean): ?} */
  $.fn.collapse = init;
  /** @type {function (string, ?): undefined} */
  $.fn.collapse.Constructor = Collapse;
  /**
   * @return {?}
   */
  $.fn.collapse.noConflict = function() {
    $.fn.collapse = old;
    return this;
  };
  $(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(types) {
    var href;
    var $this = $(this);
    var form = $this.attr("data-target") || (types.preventDefault() || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""));
    var self = $(form);
    var data = self.data("bs.collapse");
    var option = data ? "toggle" : $this.data();
    var parent = $this.attr("data-parent");
    var $parent = parent && $(parent);
    if (!data || !data.transitioning) {
      if ($parent) {
        $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass("collapsed");
      }
      $this[self.hasClass("in") ? "addClass" : "removeClass"]("collapsed");
    }
    init.call(self, option);
  });
}(jQuery);
+function($) {
  /**
   * @param {Object} e
   * @return {undefined}
   */
  function clearMenus(e) {
    if (e && e.which === 3) {
      return;
    }
    $(backdrop).remove();
    $(selector).each(function() {
      var $parent = getParent($(this));
      var data = {
        relatedTarget : this
      };
      if (!$parent.hasClass("open")) {
        return;
      }
      $parent.trigger(e = $.Event("hide.bs.dropdown", data));
      if (e.isDefaultPrevented()) {
        return;
      }
      $parent.removeClass("open").trigger("hidden.bs.dropdown", data);
    });
  }
  /**
   * @param {Element} $this
   * @return {?}
   */
  function getParent($this) {
    var selector = $this.attr("data-target");
    if (!selector) {
      selector = $this.attr("href");
      selector = selector && (/#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ""));
    }
    var $parent = selector && $(selector);
    return $parent && $parent.length ? $parent : $this.parent();
  }
  /**
   * @param {?} option
   * @return {?}
   */
  function initialize(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.dropdown");
      if (!data) {
        $this.data("bs.dropdown", data = new Dropdown(this));
      }
      if (typeof option == "string") {
        data[option].call($this);
      }
    });
  }
  /** @type {string} */
  var backdrop = ".dropdown-backdrop";
  /** @type {string} */
  var selector = '[data-toggle="dropdown"]';
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Dropdown = function(selector) {
    $(selector).on("click.bs.dropdown", this.toggle);
  };
  /** @type {string} */
  Dropdown.VERSION = "3.2.0";
  /**
   * @param {Object} e
   * @return {?}
   */
  Dropdown.prototype.toggle = function(e) {
    var $this = $(this);
    if ($this.is(".disabled, :disabled")) {
      return;
    }
    var $parent = getParent($this);
    var isActive = $parent.hasClass("open");
    clearMenus();
    if (!isActive) {
      if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length) {
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click", clearMenus);
      }
      var data = {
        relatedTarget : this
      };
      $parent.trigger(e = $.Event("show.bs.dropdown", data));
      if (e.isDefaultPrevented()) {
        return;
      }
      $this.trigger("focus");
      $parent.toggleClass("open").trigger("shown.bs.dropdown", data);
    }
    return false;
  };
  /**
   * @param {Event} e
   * @return {?}
   */
  Dropdown.prototype.keydown = function(e) {
    if (!/(38|40|27)/.test(e.keyCode)) {
      return;
    }
    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();
    if ($this.is(".disabled, :disabled")) {
      return;
    }
    var $parent = getParent($this);
    var isActive = $parent.hasClass("open");
    if (!isActive || isActive && e.keyCode == 27) {
      if (e.which == 27) {
        $parent.find(selector).trigger("focus");
      }
      return $this.trigger("click");
    }
    /** @type {string} */
    var desc = " li:not(.divider):visible a";
    var set = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);
    if (!set.length) {
      return;
    }
    var index = set.index(set.filter(":focus"));
    if (e.keyCode == 38 && index > 0) {
      index--;
    }
    if (e.keyCode == 40 && index < set.length - 1) {
      index++;
    }
    if (!~index) {
      /** @type {number} */
      index = 0;
    }
    set.eq(index).trigger("focus");
  };
  var old = $.fn.dropdown;
  /** @type {function (?): ?} */
  $.fn.dropdown = initialize;
  /** @type {function (string): undefined} */
  $.fn.dropdown.Constructor = Dropdown;
  /**
   * @return {?}
   */
  $.fn.dropdown.noConflict = function() {
    $.fn.dropdown = old;
    return this;
  };
  $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(event) {
    event.stopPropagation();
  }).on("click.bs.dropdown.data-api", selector, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", selector + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown);
}(jQuery);
+function($) {
  /**
   * @param {boolean} option
   * @param {Object} val
   * @return {?}
   */
  function init(option, val) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.modal");
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == "object" && option);
      if (!data) {
        $this.data("bs.modal", data = new Modal(this, options));
      }
      if (typeof option == "string") {
        data[option](val);
      } else {
        if (options.show) {
          data.show(val);
        }
      }
    });
  }
  /**
   * @param {string} selector
   * @param {Object} options
   * @return {undefined}
   */
  var Modal = function(selector, options) {
    /** @type {Object} */
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(selector);
    /** @type {null} */
    this.$backdrop = this.isShown = null;
    /** @type {number} */
    this.scrollbarWidth = 0;
    if (this.options.remote) {
      this.$element.find(".modal-content").load(this.options.remote, $.proxy(function() {
        this.$element.trigger("loaded.bs.modal");
      }, this));
    }
  };
  /** @type {string} */
  Modal.VERSION = "3.2.0";
  Modal.DEFAULTS = {
    backdrop : true,
    keyboard : true,
    show : true
  };
  /**
   * @param {Object} active
   * @return {?}
   */
  Modal.prototype.toggle = function(active) {
    return this.isShown ? this.hide() : this.show(active);
  };
  /**
   * @param {EventTarget} node
   * @return {undefined}
   */
  Modal.prototype.show = function(node) {
    var that = this;
    var e = $.Event("show.bs.modal", {
      relatedTarget : node
    });
    this.$element.trigger(e);
    if (this.isShown || e.isDefaultPrevented()) {
      return;
    }
    /** @type {boolean} */
    this.isShown = true;
    this.checkScrollbar();
    this.$body.addClass("modal-open");
    this.setScrollbar();
    this.escape();
    this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
    this.backdrop(function() {
      var transition = $.support.transition && that.$element.hasClass("fade");
      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body);
      }
      that.$element.show().scrollTop(0);
      if (transition) {
        that.$element[0].offsetWidth;
      }
      that.$element.addClass("in").attr("aria-hidden", false);
      that.enforceFocus();
      var type = $.Event("shown.bs.modal", {
        relatedTarget : node
      });
      if (transition) {
        that.$element.find(".modal-dialog").one("bsTransitionEnd", function() {
          that.$element.trigger("focus").trigger(type);
        }).emulateTransitionEnd(300);
      } else {
        that.$element.trigger("focus").trigger(type);
      }
    });
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  Modal.prototype.hide = function(e) {
    if (e) {
      e.preventDefault();
    }
    e = $.Event("hide.bs.modal");
    this.$element.trigger(e);
    if (!this.isShown || e.isDefaultPrevented()) {
      return;
    }
    /** @type {boolean} */
    this.isShown = false;
    this.$body.removeClass("modal-open");
    this.resetScrollbar();
    this.escape();
    $(document).off("focusin.bs.modal");
    this.$element.removeClass("in").attr("aria-hidden", true).off("click.dismiss.bs.modal");
    if ($.support.transition && this.$element.hasClass("fade")) {
      this.$element.one("bsTransitionEnd", $.proxy(this.hideModal, this)).emulateTransitionEnd(300);
    } else {
      this.hideModal();
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.enforceFocus = function() {
    $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function(e) {
      if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger("focus");
      }
    }, this));
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.escape = function() {
    if (this.isShown && this.options.keyboard) {
      this.$element.on("keyup.dismiss.bs.modal", $.proxy(function(event) {
        if (event.which == 27) {
          this.hide();
        }
      }, this));
    } else {
      if (!this.isShown) {
        this.$element.off("keyup.dismiss.bs.modal");
      }
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.hideModal = function() {
    var that = this;
    this.$element.hide();
    this.backdrop(function() {
      that.$element.trigger("hidden.bs.modal");
    });
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.removeBackdrop = function() {
    if (this.$backdrop) {
      this.$backdrop.remove();
    }
    /** @type {null} */
    this.$backdrop = null;
  };
  /**
   * @param {Function} callback
   * @return {undefined}
   */
  Modal.prototype.backdrop = function(callback) {
    var that = this;
    /** @type {string} */
    var animate = this.$element.hasClass("fade") ? "fade" : "";
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(this.$body);
      this.$element.on("click.dismiss.bs.modal", $.proxy(function(e) {
        if (e.target !== e.currentTarget) {
          return;
        }
        if (this.options.backdrop == "static") {
          this.$element[0].focus.call(this.$element[0]);
        } else {
          this.hide.call(this);
        }
      }, this));
      if (doAnimate) {
        this.$backdrop[0].offsetWidth;
      }
      this.$backdrop.addClass("in");
      if (!callback) {
        return;
      }
      if (doAnimate) {
        this.$backdrop.one("bsTransitionEnd", callback).emulateTransitionEnd(150);
      } else {
        callback();
      }
    } else {
      if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");
        /**
         * @return {undefined}
         */
        var removeElement = function() {
          that.removeBackdrop();
          if (callback) {
            callback();
          }
        };
        if ($.support.transition && this.$element.hasClass("fade")) {
          this.$backdrop.one("bsTransitionEnd", removeElement).emulateTransitionEnd(150);
        } else {
          removeElement();
        }
      } else {
        if (callback) {
          callback();
        }
      }
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.checkScrollbar = function() {
    if (document.body.clientWidth >= window.innerWidth) {
      return;
    }
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar();
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.setScrollbar = function() {
    /** @type {number} */
    var top = parseInt(this.$body.css("padding-right") || 0, 10);
    if (this.scrollbarWidth) {
      this.$body.css("padding-right", top + this.scrollbarWidth);
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.resetScrollbar = function() {
    this.$body.css("padding-right", "");
  };
  /**
   * @return {?}
   */
  Modal.prototype.measureScrollbar = function() {
    /** @type {Element} */
    var testNode = document.createElement("div");
    /** @type {string} */
    testNode.className = "modal-scrollbar-measure";
    this.$body.append(testNode);
    /** @type {number} */
    var dim = testNode.offsetWidth - testNode.clientWidth;
    this.$body[0].removeChild(testNode);
    return dim;
  };
  var old = $.fn.modal;
  /** @type {function (boolean, Object): ?} */
  $.fn.modal = init;
  /** @type {function (string, Object): undefined} */
  $.fn.modal.Constructor = Modal;
  /**
   * @return {?}
   */
  $.fn.modal.noConflict = function() {
    $.fn.modal = old;
    return this;
  };
  $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(types) {
    var $this = $(this);
    var href = $this.attr("href");
    var self = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, ""));
    var entityType = self.data("bs.modal") ? "toggle" : $.extend({
      remote : !/#/.test(href) && href
    }, self.data(), $this.data());
    if ($this.is("a")) {
      types.preventDefault();
    }
    self.one("show.bs.modal", function(event) {
      if (event.isDefaultPrevented()) {
        return;
      }
      self.one("hidden.bs.modal", function() {
        if ($this.is(":visible")) {
          $this.trigger("focus");
        }
      });
    });
    init.call(self, entityType, this);
  });
}(jQuery);
+function($) {
  /**
   * @param {string} option
   * @return {?}
   */
  function initialize(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.tooltip");
      var options = typeof option == "object" && option;
      if (!data && option == "destroy") {
        return;
      }
      if (!data) {
        $this.data("bs.tooltip", data = new Tooltip(this, options));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /**
   * @param {string} selector
   * @param {string} options
   * @return {undefined}
   */
  var Tooltip = function(selector, options) {
    /** @type {null} */
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
    this.init("tooltip", selector, options);
  };
  /** @type {string} */
  Tooltip.VERSION = "3.2.0";
  Tooltip.DEFAULTS = {
    animation : true,
    placement : "top",
    selector : false,
    template : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger : "hover focus",
    title : "",
    delay : 0,
    html : false,
    container : false,
    viewport : {
      selector : "body",
      padding : 0
    }
  };
  /**
   * @param {string} type
   * @param {string} element
   * @param {string} options
   * @return {undefined}
   */
  Tooltip.prototype.init = function(type, element, options) {
    /** @type {boolean} */
    this.enabled = true;
    /** @type {string} */
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);
    var triggers = this.options.trigger.split(" ");
    var i = triggers.length;
    for (;i--;) {
      var trigger = triggers[i];
      if (trigger == "click") {
        this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else {
        if (trigger != "manual") {
          /** @type {string} */
          var eventIn = trigger == "hover" ? "mouseenter" : "focusin";
          /** @type {string} */
          var eventOut = trigger == "hover" ? "mouseleave" : "focusout";
          this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
          this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
        }
      }
    }
    if (this.options.selector) {
      this._options = $.extend({}, this.options, {
        trigger : "manual",
        selector : ""
      });
    } else {
      this.fixTitle();
    }
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getDefaults = function() {
    return Tooltip.DEFAULTS;
  };
  /**
   * @param {Object} options
   * @return {?}
   */
  Tooltip.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);
    if (options.delay && typeof options.delay == "number") {
      options.delay = {
        show : options.delay,
        hide : options.delay
      };
    }
    return options;
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getDelegateOptions = function() {
    var flags = {};
    var defaults = this.getDefaults();
    if (this._options) {
      $.each(this._options, function(key, value) {
        if (defaults[key] != value) {
          flags[key] = value;
        }
      });
    }
    return flags;
  };
  /**
   * @param {Object} obj
   * @return {?}
   */
  Tooltip.prototype.enter = function(obj) {
    var events = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
    if (!events) {
      events = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data("bs." + this.type, events);
    }
    clearTimeout(events.timeout);
    /** @type {string} */
    events.hoverState = "in";
    if (!events.options.delay || !events.options.delay.show) {
      return events.show();
    }
    /** @type {number} */
    events.timeout = setTimeout(function() {
      if (events.hoverState == "in") {
        events.show();
      }
    }, events.options.delay.show);
  };
  /**
   * @param {Object} obj
   * @return {?}
   */
  Tooltip.prototype.leave = function(obj) {
    var events = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
    if (!events) {
      events = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data("bs." + this.type, events);
    }
    clearTimeout(events.timeout);
    /** @type {string} */
    events.hoverState = "out";
    if (!events.options.delay || !events.options.delay.hide) {
      return events.hide();
    }
    /** @type {number} */
    events.timeout = setTimeout(function() {
      if (events.hoverState == "out") {
        events.hide();
      }
    }, events.options.delay.hide);
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.show = function() {
    var e = $.Event("show.bs." + this.type);
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);
      var inDom = $.contains(document.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) {
        return;
      }
      var self = this;
      var $tip = this.tip();
      var tag = this.getUID(this.type);
      this.setContent();
      $tip.attr("id", tag);
      this.$element.attr("aria-describedby", tag);
      if (this.options.animation) {
        $tip.addClass("fade");
      }
      var placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
      /** @type {RegExp} */
      var autoToken = /\s?auto?\s?/i;
      /** @type {boolean} */
      var autoPlace = autoToken.test(placement);
      if (autoPlace) {
        placement = placement.replace(autoToken, "") || "top";
      }
      $tip.detach().css({
        top : 0,
        left : 0,
        display : "block"
      }).addClass(placement).data("bs." + this.type, this);
      if (this.options.container) {
        $tip.appendTo(this.options.container);
      } else {
        $tip.insertAfter(this.$element);
      }
      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      if (autoPlace) {
        var orgPlacement = placement;
        var failuresLink = this.$element.parent();
        var p = this.getPosition(failuresLink);
        placement = placement == "bottom" && pos.top + pos.height + actualHeight - p.scroll > p.height ? "top" : placement == "top" && pos.top - p.scroll - actualHeight < 0 ? "bottom" : placement == "right" && pos.right + actualWidth > p.width ? "left" : placement == "left" && pos.left - actualWidth < p.left ? "right" : placement;
        $tip.removeClass(orgPlacement).addClass(placement);
      }
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
      this.applyPlacement(calculatedOffset, placement);
      /**
       * @return {undefined}
       */
      var complete = function() {
        self.$element.trigger("shown.bs." + self.type);
        /** @type {null} */
        self.hoverState = null;
      };
      if ($.support.transition && this.$tip.hasClass("fade")) {
        $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(150);
      } else {
        complete();
      }
    }
  };
  /**
   * @param {?} offset
   * @param {string} placement
   * @return {undefined}
   */
  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var $tip = this.tip();
    var x = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;
    /** @type {number} */
    var marginTop = parseInt($tip.css("margin-top"), 10);
    /** @type {number} */
    var marginLeft = parseInt($tip.css("margin-left"), 10);
    if (isNaN(marginTop)) {
      /** @type {number} */
      marginTop = 0;
    }
    if (isNaN(marginLeft)) {
      /** @type {number} */
      marginLeft = 0;
    }
    offset.top = offset.top + marginTop;
    offset.left = offset.left + marginLeft;
    $.offset.setOffset($tip[0], $.extend({
      /**
       * @param {?} props
       * @return {undefined}
       */
      using : function(props) {
        $tip.css({
          top : Math.round(props.top),
          left : Math.round(props.left)
        });
      }
    }, offset), 0);
    $tip.addClass("in");
    var labelWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;
    if (placement == "top" && actualHeight != height) {
      /** @type {number} */
      offset.top = offset.top + height - actualHeight;
    }
    var o = this.getViewportAdjustedDelta(placement, offset, labelWidth, actualHeight);
    if (o.left) {
      offset.left += o.left;
    } else {
      offset.top += o.top;
    }
    var curZoomSpeed = o.left ? o.left * 2 - x + labelWidth : o.top * 2 - height + actualHeight;
    /** @type {string} */
    var camelKey = o.left ? "left" : "top";
    /** @type {string} */
    var dim = o.left ? "offsetWidth" : "offsetHeight";
    $tip.offset(offset);
    this.replaceArrow(curZoomSpeed, $tip[0][dim], camelKey);
  };
  /**
   * @param {boolean} delta
   * @param {boolean} dimension
   * @param {string} key
   * @return {undefined}
   */
  Tooltip.prototype.replaceArrow = function(delta, dimension, key) {
    this.arrow().css(key, delta ? 50 * (1 - delta / dimension) + "%" : "");
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.setContent = function() {
    var $tip = this.tip();
    var title = this.getTitle();
    $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
    $tip.removeClass("fade in top bottom left right");
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.hide = function() {
    /**
     * @return {undefined}
     */
    function complete() {
      if (that.hoverState != "in") {
        $tip.detach();
      }
      that.$element.trigger("hidden.bs." + that.type);
    }
    var that = this;
    var $tip = this.tip();
    var e = $.Event("hide.bs." + this.type);
    this.$element.removeAttr("aria-describedby");
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    $tip.removeClass("in");
    if ($.support.transition && this.$tip.hasClass("fade")) {
      $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(150);
    } else {
      complete();
    }
    /** @type {null} */
    this.hoverState = null;
    return this;
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.fixTitle = function() {
    var $e = this.$element;
    if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") {
      $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
    }
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.hasContent = function() {
    return this.getTitle();
  };
  /**
   * @param {Object} el
   * @return {?}
   */
  Tooltip.prototype.getPosition = function(el) {
    el = el || this.$element;
    var n = el[0];
    /** @type {boolean} */
    var hasOverflowY = n.tagName == "BODY";
    return $.extend({}, typeof n.getBoundingClientRect == "function" ? n.getBoundingClientRect() : null, {
      scroll : hasOverflowY ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop(),
      width : hasOverflowY ? $(window).width() : el.outerWidth(),
      height : hasOverflowY ? $(window).height() : el.outerHeight()
    }, hasOverflowY ? {
      top : 0,
      left : 0
    } : el.offset());
  };
  /**
   * @param {string} placement
   * @param {?} pos
   * @param {number} actualWidth
   * @param {number} actualHeight
   * @return {?}
   */
  Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
    return placement == "bottom" ? {
      top : pos.top + pos.height,
      left : pos.left + pos.width / 2 - actualWidth / 2
    } : placement == "top" ? {
      top : pos.top - actualHeight,
      left : pos.left + pos.width / 2 - actualWidth / 2
    } : placement == "left" ? {
      top : pos.top + pos.height / 2 - actualHeight / 2,
      left : pos.left - actualWidth
    } : {
      top : pos.top + pos.height / 2 - actualHeight / 2,
      left : pos.left + pos.width
    };
  };
  /**
   * @param {string} placement
   * @param {?} layout
   * @param {?} labelWidth
   * @param {number} value
   * @return {?}
   */
  Tooltip.prototype.getViewportAdjustedDelta = function(placement, layout, labelWidth, value) {
    var result = {
      top : 0,
      left : 0
    };
    if (!this.$viewport) {
      return result;
    }
    var bounce = this.options.viewport && this.options.viewport.padding || 0;
    var p = this.getPosition(this.$viewport);
    if (/right|left/.test(placement)) {
      /** @type {number} */
      var y = layout.top - bounce - p.scroll;
      var tval = layout.top + bounce - p.scroll + value;
      if (y < p.top) {
        /** @type {number} */
        result.top = p.top - y;
      } else {
        if (tval > p.top + p.height) {
          /** @type {number} */
          result.top = p.top + p.height - tval;
        }
      }
    } else {
      /** @type {number} */
      var x = layout.left - bounce;
      var imageWidth = layout.left + bounce + labelWidth;
      if (x < p.left) {
        /** @type {number} */
        result.left = p.left - x;
      } else {
        if (imageWidth > p.width) {
          /** @type {number} */
          result.left = p.left + p.width - imageWidth;
        }
      }
    }
    return result;
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getTitle = function() {
    var title;
    var $e = this.$element;
    var o = this.options;
    title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
    return title;
  };
  /**
   * @param {number} id
   * @return {?}
   */
  Tooltip.prototype.getUID = function(id) {
    do {
      id += ~~(Math.random() * 1E6);
    } while (document.getElementById(id));
    return id;
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.tip = function() {
    return this.$tip = this.$tip || $(this.options.template);
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.arrow = function() {
    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.validate = function() {
    if (!this.$element[0].parentNode) {
      this.hide();
      /** @type {null} */
      this.$element = null;
      /** @type {null} */
      this.options = null;
    }
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.enable = function() {
    /** @type {boolean} */
    this.enabled = true;
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.disable = function() {
    /** @type {boolean} */
    this.enabled = false;
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.toggleEnabled = function() {
    /** @type {boolean} */
    this.enabled = !this.enabled;
  };
  /**
   * @param {Event} e
   * @return {undefined}
   */
  Tooltip.prototype.toggle = function(e) {
    var events = this;
    if (e) {
      events = $(e.currentTarget).data("bs." + this.type);
      if (!events) {
        events = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data("bs." + this.type, events);
      }
    }
    if (events.tip().hasClass("in")) {
      events.leave(events);
    } else {
      events.enter(events);
    }
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.destroy = function() {
    clearTimeout(this.timeout);
    this.hide().$element.off("." + this.type).removeData("bs." + this.type);
  };
  var old = $.fn.tooltip;
  /** @type {function (string): ?} */
  $.fn.tooltip = initialize;
  /** @type {function (string, string): undefined} */
  $.fn.tooltip.Constructor = Tooltip;
  /**
   * @return {?}
   */
  $.fn.tooltip.noConflict = function() {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);
+function($) {
  /**
   * @param {string} option
   * @return {?}
   */
  function initialize(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.popover");
      var options = typeof option == "object" && option;
      if (!data && option == "destroy") {
        return;
      }
      if (!data) {
        $this.data("bs.popover", data = new Popover(this, options));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /**
   * @param {string} selector
   * @param {string} options
   * @return {undefined}
   */
  var Popover = function(selector, options) {
    this.init("popover", selector, options);
  };
  if (!$.fn.tooltip) {
    throw new Error("Popover requires tooltip.js");
  }
  /** @type {string} */
  Popover.VERSION = "3.2.0";
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement : "right",
    trigger : "click",
    content : "",
    template : '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
  /** @type {function (string, string): undefined} */
  Popover.prototype.constructor = Popover;
  /**
   * @return {?}
   */
  Popover.prototype.getDefaults = function() {
    return Popover.DEFAULTS;
  };
  /**
   * @return {undefined}
   */
  Popover.prototype.setContent = function() {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();
    $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
    $tip.find(".popover-content").empty()[this.options.html ? typeof content == "string" ? "html" : "append" : "text"](content);
    $tip.removeClass("fade top bottom left right in");
    if (!$tip.find(".popover-title").html()) {
      $tip.find(".popover-title").hide();
    }
  };
  /**
   * @return {?}
   */
  Popover.prototype.hasContent = function() {
    return this.getTitle() || this.getContent();
  };
  /**
   * @return {?}
   */
  Popover.prototype.getContent = function() {
    var $e = this.$element;
    var o = this.options;
    return $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) : o.content);
  };
  /**
   * @return {?}
   */
  Popover.prototype.arrow = function() {
    return this.$arrow = this.$arrow || this.tip().find(".arrow");
  };
  /**
   * @return {?}
   */
  Popover.prototype.tip = function() {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
    }
    return this.$tip;
  };
  var old = $.fn.popover;
  /** @type {function (string): ?} */
  $.fn.popover = initialize;
  /** @type {function (string, string): undefined} */
  $.fn.popover.Constructor = Popover;
  /**
   * @return {?}
   */
  $.fn.popover.noConflict = function() {
    $.fn.popover = old;
    return this;
  };
}(jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  function ScrollSpy(selector, options) {
    var className = $.proxy(this.process, this);
    this.$body = $("body");
    this.$scrollElement = $(selector).is("body") ? $(window) : $(selector);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    /** @type {string} */
    this.selector = (this.options.target || "") + " .nav li > a";
    /** @type {Array} */
    this.offsets = [];
    /** @type {Array} */
    this.targets = [];
    /** @type {null} */
    this.activeTarget = null;
    /** @type {number} */
    this.scrollHeight = 0;
    this.$scrollElement.on("scroll.bs.scrollspy", className);
    this.refresh();
    this.process();
  }
  /**
   * @param {number} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.scrollspy");
      var options = typeof option == "object" && option;
      if (!data) {
        $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /** @type {string} */
  ScrollSpy.VERSION = "3.2.0";
  ScrollSpy.DEFAULTS = {
    offset : 10
  };
  /**
   * @return {?}
   */
  ScrollSpy.prototype.getScrollHeight = function() {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };
  /**
   * @return {undefined}
   */
  ScrollSpy.prototype.refresh = function() {
    /** @type {string} */
    var i = "offset";
    /** @type {number} */
    var nub_height = 0;
    if (!$.isWindow(this.$scrollElement[0])) {
      /** @type {string} */
      i = "position";
      nub_height = this.$scrollElement.scrollTop();
    }
    /** @type {Array} */
    this.offsets = [];
    /** @type {Array} */
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();
    var self = this;
    this.$body.find(this.selector).map(function() {
      var $el = $(this);
      var href = $el.data("target") || $el.attr("href");
      var codeSegments = /^#./.test(href) && $(href);
      return codeSegments && (codeSegments.length && (codeSegments.is(":visible") && [[codeSegments[i]().top + nub_height, href]])) || null;
    }).sort(function(mat0, mat1) {
      return mat0[0] - mat1[0];
    }).each(function() {
      self.offsets.push(this[0]);
      self.targets.push(this[1]);
    });
  };
  /**
   * @return {?}
   */
  ScrollSpy.prototype.process = function() {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var offset = this.getScrollHeight();
    /** @type {number} */
    var maxScroll = this.options.offset + offset - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;
    if (this.scrollHeight != offset) {
      this.refresh();
    }
    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }
    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i);
    }
    i = offsets.length;
    for (;i--;) {
      if (activeTarget != targets[i]) {
        if (scrollTop >= offsets[i]) {
          if (!offsets[i + 1] || scrollTop <= offsets[i + 1]) {
            this.activate(targets[i]);
          }
        }
      }
    }
  };
  /**
   * @param {string} target
   * @return {undefined}
   */
  ScrollSpy.prototype.activate = function(target) {
    /** @type {string} */
    this.activeTarget = target;
    $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
    /** @type {string} */
    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
    var active = $(selector).parents("li").addClass("active");
    if (active.parent(".dropdown-menu").length) {
      active = active.closest("li.dropdown").addClass("active");
    }
    active.trigger("activate.bs.scrollspy");
  };
  var old = $.fn.scrollspy;
  /** @type {function (number): ?} */
  $.fn.scrollspy = init;
  /** @type {function (string, ?): undefined} */
  $.fn.scrollspy.Constructor = ScrollSpy;
  /**
   * @return {?}
   */
  $.fn.scrollspy.noConflict = function() {
    $.fn.scrollspy = old;
    return this;
  };
  $(window).on("load.bs.scrollspy.data-api", function() {
    $('[data-spy="scroll"]').each(function() {
      var self = $(this);
      init.call(self, self.data());
    });
  });
}(jQuery);
+function($) {
  /**
   * @param {?} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.tab");
      if (!data) {
        $this.data("bs.tab", data = new Tab(this));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Tab = function(selector) {
    this.element = $(selector);
  };
  /** @type {string} */
  Tab.VERSION = "3.2.0";
  /**
   * @return {undefined}
   */
  Tab.prototype.show = function() {
    var $this = this.element;
    var $ul = $this.closest("ul:not(.dropdown-menu)");
    var selector = $this.data("target");
    if (!selector) {
      selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    if ($this.parent("li").hasClass("active")) {
      return;
    }
    var previous = $ul.find(".active:last a")[0];
    var e = $.Event("show.bs.tab", {
      relatedTarget : previous
    });
    $this.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    var $target = $(selector);
    this.activate($this.closest("li"), $ul);
    this.activate($target, $target.parent(), function() {
      $this.trigger({
        type : "shown.bs.tab",
        relatedTarget : previous
      });
    });
  };
  /**
   * @param {Object} element
   * @param {Object} container
   * @param {?} value
   * @return {undefined}
   */
  Tab.prototype.activate = function(element, container, value) {
    /**
     * @return {undefined}
     */
    function next() {
      $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
      element.addClass("active");
      if (attrNames) {
        element[0].offsetWidth;
        element.addClass("in");
      } else {
        element.removeClass("fade");
      }
      if (element.parent(".dropdown-menu")) {
        element.closest("li.dropdown").addClass("active");
      }
      if (value) {
        value();
      }
    }
    var $active = container.find("> .active");
    var attrNames = value && ($.support.transition && $active.hasClass("fade"));
    if (attrNames) {
      $active.one("bsTransitionEnd", next).emulateTransitionEnd(150);
    } else {
      next();
    }
    $active.removeClass("in");
  };
  var old = $.fn.tab;
  /** @type {function (?): ?} */
  $.fn.tab = init;
  /** @type {function (string): undefined} */
  $.fn.tab.Constructor = Tab;
  /**
   * @return {?}
   */
  $.fn.tab.noConflict = function() {
    $.fn.tab = old;
    return this;
  };
  $(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(types) {
    types.preventDefault();
    init.call($(this), "show");
  });
}(jQuery);
+function($) {
  /**
   * @param {number} option
   * @return {?}
   */
  function init(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.affix");
      var options = typeof option == "object" && option;
      if (!data) {
        $this.data("bs.affix", data = new Affix(this, options));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  }
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Affix = function(selector, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);
    this.$target = $(this.options.target).on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
    this.$element = $(selector);
    /** @type {null} */
    this.affixed = this.unpin = this.pinnedOffset = null;
    this.checkPosition();
  };
  /** @type {string} */
  Affix.VERSION = "3.2.0";
  /** @type {string} */
  Affix.RESET = "affix affix-top affix-bottom";
  Affix.DEFAULTS = {
    offset : 0,
    target : window
  };
  /**
   * @return {?}
   */
  Affix.prototype.getPinnedOffset = function() {
    if (this.pinnedOffset) {
      return this.pinnedOffset;
    }
    this.$element.removeClass(Affix.RESET).addClass("affix");
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };
  /**
   * @return {undefined}
   */
  Affix.prototype.checkPositionWithEventLoop = function() {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };
  /**
   * @return {undefined}
   */
  Affix.prototype.checkPosition = function() {
    if (!this.$element.is(":visible")) {
      return;
    }
    var scrollHeight = $(document).height();
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    if (typeof offset != "object") {
      offsetBottom = offsetTop = offset;
    }
    if (typeof offsetTop == "function") {
      offsetTop = offset.top(this.$element);
    }
    if (typeof offsetBottom == "function") {
      offsetBottom = offset.bottom(this.$element);
    }
    /** @type {(boolean|string)} */
    var affix = this.unpin != null && scrollTop + this.unpin <= position.top ? false : offsetBottom != null && position.top + this.$element.height() >= scrollHeight - offsetBottom ? "bottom" : offsetTop != null && scrollTop <= offsetTop ? "top" : false;
    if (this.affixed === affix) {
      return;
    }
    if (this.unpin != null) {
      this.$element.css("top", "");
    }
    /** @type {string} */
    var affixType = "affix" + (affix ? "-" + affix : "");
    var e = $.Event(affixType + ".bs.affix");
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) {
      return;
    }
    /** @type {(boolean|string)} */
    this.affixed = affix;
    this.unpin = affix == "bottom" ? this.getPinnedOffset() : null;
    this.$element.removeClass(Affix.RESET).addClass(affixType).trigger($.Event(affixType.replace("affix", "affixed")));
    if (affix == "bottom") {
      this.$element.offset({
        top : scrollHeight - this.$element.height() - offsetBottom
      });
    }
  };
  var old = $.fn.affix;
  /** @type {function (number): ?} */
  $.fn.affix = init;
  /** @type {function (string, ?): undefined} */
  $.fn.affix.Constructor = Affix;
  /**
   * @return {?}
   */
  $.fn.affix.noConflict = function() {
    $.fn.affix = old;
    return this;
  };
  $(window).on("load", function() {
    $('[data-spy="affix"]').each(function() {
      var self = $(this);
      var options = self.data();
      options.offset = options.offset || {};
      if (options.offsetBottom) {
        options.offset.bottom = options.offsetBottom;
      }
      if (options.offsetTop) {
        options.offset.top = options.offsetTop;
      }
      init.call(self, options);
    });
  });
}(jQuery);
(function(elems, doc, $) {
  /**
   * @param {Object} elem
   * @return {?}
   */
  function args(elem) {
    var newAttrs = {};
    /** @type {RegExp} */
    var rinlinejQuery = /^jQuery\d+$/;
    $.each(elem.attributes, function(dataAndEvents, attr) {
      if (attr.specified && !rinlinejQuery.test(attr.name)) {
        newAttrs[attr.name] = attr.value;
      }
    });
    return newAttrs;
  }
  /**
   * @param {boolean} event
   * @param {?} value
   * @return {?}
   */
  function clearPlaceholder(event, value) {
    var input = this;
    var $input = $(input);
    if (input.value == $input.attr("placeholder") && $input.hasClass("placeholder")) {
      if ($input.data("placeholder-password")) {
        $input = $input.hide().next().show().attr("id", $input.removeAttr("id").data("placeholder-id"));
        if (event === true) {
          return $input[0].value = value;
        }
        $input.focus();
      } else {
        /** @type {string} */
        input.value = "";
        $input.removeClass("placeholder");
        if (input == doc.activeElement) {
          input.select();
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function setPlaceholder() {
    var $replacement;
    var input = this;
    var $input = $(input);
    var id = this.id;
    if (input.value == "") {
      if (input.type == "password") {
        if (!$input.data("placeholder-textinput")) {
          try {
            $replacement = $input.clone().attr({
              type : "text"
            });
          } catch (o) {
            $replacement = $("<input>").attr($.extend(args(this), {
              type : "text"
            }));
          }
          $replacement.removeAttr("name").data({
            "placeholder-password" : $input,
            "placeholder-id" : id
          }).bind("focus.placeholder", clearPlaceholder);
          $input.data({
            "placeholder-textinput" : $replacement,
            "placeholder-id" : id
          }).before($replacement);
        }
        $input = $input.removeAttr("id").hide().prev().attr("id", id).show();
      }
      $input.addClass("placeholder");
      $input[0].value = $input.attr("placeholder");
    } else {
      $input.removeClass("placeholder");
    }
  }
  /** @type {boolean} */
  var isInputSupported = "placeholder" in doc.createElement("input");
  /** @type {boolean} */
  var isTextareaSupported = "placeholder" in doc.createElement("textarea");
  var prototype = $.fn;
  var valHooks = $.valHooks;
  var propHooks = $.propHooks;
  var hooks;
  var placeholder;
  if (isInputSupported && isTextareaSupported) {
    /** @type {function (): ?} */
    placeholder = prototype.placeholder = function() {
      return this;
    };
    /** @type {boolean} */
    placeholder.input = placeholder.textarea = true;
  } else {
    /** @type {function (): ?} */
    placeholder = prototype.placeholder = function() {
      var $this = this;
      $this.filter((isInputSupported ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
        /** @type {function (boolean, ?): ?} */
        "focus.placeholder" : clearPlaceholder,
        /** @type {function (): undefined} */
        "blur.placeholder" : setPlaceholder
      }).data("placeholder-enabled", true).trigger("blur.placeholder");
      return $this;
    };
    /** @type {boolean} */
    placeholder.input = isInputSupported;
    /** @type {boolean} */
    placeholder.textarea = isTextareaSupported;
    hooks = {
      /**
       * @param {string} elem
       * @return {?}
       */
      get : function(elem) {
        var $elem = $(elem);
        var $passwordInput = $elem.data("placeholder-password");
        if ($passwordInput) {
          return $passwordInput[0].value;
        }
        return $elem.data("placeholder-enabled") && $elem.hasClass("placeholder") ? "" : elem.value;
      },
      /**
       * @param {Object} element
       * @param {string} value
       * @return {?}
       */
      set : function(element, value) {
        var $element = $(element);
        var $passwordInput = $element.data("placeholder-password");
        if ($passwordInput) {
          return $passwordInput[0].value = value;
        }
        if (!$element.data("placeholder-enabled")) {
          return element.value = value;
        }
        if (value == "") {
          /** @type {string} */
          element.value = value;
          if (element != doc.activeElement) {
            setPlaceholder.call(element);
          }
        } else {
          if ($element.hasClass("placeholder")) {
            if (!clearPlaceholder.call(element, true, value)) {
              /** @type {string} */
              element.value = value;
            }
          } else {
            /** @type {string} */
            element.value = value;
          }
        }
        return $element;
      }
    };
    if (!isInputSupported) {
      valHooks.input = hooks;
      propHooks.value = hooks;
    }
    if (!isTextareaSupported) {
      valHooks.textarea = hooks;
      propHooks.value = hooks;
    }
    $(function() {
      $(doc).delegate("form", "submit.placeholder", function() {
        var $inputs = $(".placeholder", this).each(clearPlaceholder);
        setTimeout(function() {
          $inputs.each(setPlaceholder);
        }, 10);
      });
    });
    $(elems).bind("beforeunload.placeholder", function() {
      $(".placeholder").each(function() {
        /** @type {string} */
        this.value = "";
      });
    });
  }
})(this, document, jQuery);
window.Modernizr = function(a, doc, rejectedItem) {
  /**
   * @param {string} str
   * @return {undefined}
   */
  function setCss(str) {
    /** @type {string} */
    mStyle.cssText = str;
  }
  /**
   * @param {string} str1
   * @param {string} str2
   * @return {?}
   */
  function setCssAll(str1, str2) {
    return setCss(prefixes.join(str1 + ";") + (str2 || ""));
  }
  /**
   * @param {Function} obj
   * @param {string} type
   * @return {?}
   */
  function is(obj, type) {
    return typeof obj === type;
  }
  /**
   * @param {string} str
   * @param {string} suffix
   * @return {?}
   */
  function endsWith(str, suffix) {
    return!!~("" + str).indexOf(suffix);
  }
  /**
   * @param {Object} attrs
   * @param {Function} obj
   * @param {string} elem
   * @return {?}
   */
  function get(attrs, obj, elem) {
    var attr;
    for (attr in attrs) {
      var item = obj[attrs[attr]];
      if (item !== rejectedItem) {
        return elem === false ? attrs[attr] : is(item, "function") ? item.bind(elem || obj) : item;
      }
    }
    return false;
  }
  /** @type {string} */
  var version = "2.6.2";
  var Modernizr = {};
  /** @type {boolean} */
  var f = true;
  /** @type {Element} */
  var docElement = doc.documentElement;
  /** @type {string} */
  var mod = "modernizr";
  /** @type {Element} */
  var modElem = doc.createElement(mod);
  /** @type {(CSSStyleDeclaration|null)} */
  var mStyle = modElem.style;
  var inputElem;
  /** @type {function (this:*): string} */
  var ostring = {}.toString;
  /** @type {Array.<string>} */
  var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  var tests = {};
  var o = {};
  var p = {};
  /** @type {Array} */
  var classes = [];
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var __slice = classes.slice;
  var featureName;
  /**
   * @param {string} rule
   * @param {Function} callback
   * @param {number} nodes
   * @param {Array} testnames
   * @return {?}
   */
  var injectElementWithStyles = function(rule, callback, nodes, testnames) {
    var style;
    var ret;
    var node;
    var docOverflow;
    /** @type {Element} */
    var div = doc.createElement("div");
    /** @type {(HTMLElement|null)} */
    var body = doc.body;
    /** @type {Element} */
    var fakeBody = body || doc.createElement("body");
    if (parseInt(nodes, 10)) {
      for (;nodes--;) {
        /** @type {Element} */
        node = doc.createElement("div");
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }
    return style = ["&#173;", '<style id="s', mod, '">', rule, "</style>"].join(""), div.id = mod, (body ? div : fakeBody).innerHTML += style, fakeBody.appendChild(div), body || (fakeBody.style.background = "", fakeBody.style.overflow = "hidden", docOverflow = docElement.style.overflow, docElement.style.overflow = "hidden", docElement.appendChild(fakeBody)), ret = callback(div, rule), body ? div.parentNode.removeChild(div) : (fakeBody.parentNode.removeChild(fakeBody), docElement.style.overflow =
    docOverflow), !!ret;
  };
  /** @type {function (this:Object, *): boolean} */
  var _hasOwnProperty = {}.hasOwnProperty;
  var hasOwnProp;
  if (!is(_hasOwnProperty, "undefined") && !is(_hasOwnProperty.call, "undefined")) {
    /**
     * @param {string} object
     * @param {string} property
     * @return {?}
     */
    hasOwnProp = function(object, property) {
      return _hasOwnProperty.call(object, property);
    };
  } else {
    /**
     * @param {Object} object
     * @param {string} property
     * @return {?}
     */
    hasOwnProp = function(object, property) {
      return property in object && is(object.constructor.prototype[property], "undefined");
    };
  }
  if (!Function.prototype.bind) {
    /**
     * @param {(Object|null|undefined)} handler
     * @return {Function}
     */
    Function.prototype.bind = function(handler) {
      /** @type {Function} */
      var target = this;
      if (typeof target != "function") {
        throw new TypeError;
      }
      /** @type {Array.<?>} */
      var args = __slice.call(arguments, 1);
      /**
       * @return {?}
       */
      var bound = function() {
        if (this instanceof bound) {
          /**
           * @return {undefined}
           */
          var F = function() {
          };
          F.prototype = target.prototype;
          var self = new F;
          var result = target.apply(self, args.concat(__slice.call(arguments)));
          return Object(result) === result ? result : self;
        }
        return target.apply(handler, args.concat(__slice.call(arguments)));
      };
      return bound;
    };
  }
  /**
   * @return {?}
   */
  tests.touch = function() {
    var c;
    return "ontouchstart" in a || a.DocumentTouch && doc instanceof DocumentTouch ? c = true : injectElementWithStyles(["@media (", prefixes.join("touch-enabled),("), mod, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(td) {
      /** @type {boolean} */
      c = td.offsetTop === 9;
    }), c;
  };
  var feature;
  for (feature in tests) {
    if (hasOwnProp(tests, feature)) {
      /** @type {string} */
      featureName = feature.toLowerCase();
      Modernizr[featureName] = tests[feature]();
      classes.push((Modernizr[featureName] ? "" : "no-") + featureName);
    }
  }
  return Modernizr.addTest = function(feature, test) {
    if (typeof feature == "object") {
      var key;
      for (key in feature) {
        if (hasOwnProp(feature, key)) {
          Modernizr.addTest(key, feature[key]);
        }
      }
    } else {
      feature = feature.toLowerCase();
      if (Modernizr[feature] !== rejectedItem) {
        return Modernizr;
      }
      test = typeof test == "function" ? test() : test;
      if (typeof f != "undefined") {
        if (f) {
          docElement.className += " " + (test ? "" : "no-") + feature;
        }
      }
      /** @type {boolean} */
      Modernizr[feature] = test;
    }
    return Modernizr;
  }, setCss(""), modElem = inputElem = null, Modernizr._version = version, Modernizr._prefixes = prefixes, Modernizr.testStyles = injectElementWithStyles, docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + classes.join(" ") : ""), Modernizr;
}(this, this.document);
Modernizr.addTest("android", function() {
  return!!navigator.userAgent.match(/Android/i);
});
Modernizr.addTest("chrome", function() {
  return!!navigator.userAgent.match(/Chrome/i);
});
Modernizr.addTest("firefox", function() {
  return!!navigator.userAgent.match(/Firefox/i);
});
Modernizr.addTest("iemobile", function() {
  return!!navigator.userAgent.match(/IEMobile/i);
});
Modernizr.addTest("ie", function() {
  return!!navigator.userAgent.match(/MSIE/i);
});
Modernizr.addTest("ie10", function() {
  return!!navigator.userAgent.match(/MSIE 10/i);
});
Modernizr.addTest("ie11", function() {
  return!!navigator.userAgent.match(/Trident.*rv:11\./);
});
Modernizr.addTest("ios", function() {
  return!!navigator.userAgent.match(/iPhone|iPad|iPod/i);
});
Modernizr.addTest("ios7 ipad", function() {
  return!!navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i);
});
(function($, doc) {
  /** @type {boolean} */
  var keyboardAllowed = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element;
  var fn = function() {
    var a;
    var len;
    /** @type {Array} */
    var buffer = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen",
    "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"]];
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var l = buffer.length;
    var target = {};
    for (;l > i;i++) {
      if (a = buffer[i], a && a[1] in doc) {
        /** @type {number} */
        i = 0;
        len = a.length;
        for (;len > i;i++) {
          target[buffer[0][i]] = a[i];
        }
        return target;
      }
    }
    return false;
  }();
  var screenfull = {
    /**
     * @param {Node} body
     * @return {undefined}
     */
    request : function(body) {
      var request = fn.requestFullscreen;
      body = body || doc.documentElement;
      if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
        body[request]();
      } else {
        body[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      }
    },
    /**
     * @return {undefined}
     */
    exit : function() {
      doc[fn.exitFullscreen]();
    },
    /**
     * @param {Node} path
     * @return {undefined}
     */
    toggle : function(path) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(path);
      }
    },
    /**
     * @return {undefined}
     */
    onchange : function() {
    },
    /**
     * @return {undefined}
     */
    onerror : function() {
    },
    raw : fn
  };
  return fn ? (Object.defineProperties(screenfull, {
    isFullscreen : {
      /**
       * @return {?}
       */
      get : function() {
        return!!doc[fn.fullscreenElement];
      }
    },
    element : {
      enumerable : true,
      /**
       * @return {?}
       */
      get : function() {
        return doc[fn.fullscreenElement];
      }
    },
    enabled : {
      enumerable : true,
      /**
       * @return {?}
       */
      get : function() {
        return!!doc[fn.fullscreenEnabled];
      }
    }
  }), doc.addEventListener(fn.fullscreenchange, function(mapper) {
    screenfull.onchange.call(screenfull, mapper);
  }), doc.addEventListener(fn.fullscreenerror, function(mapper) {
    screenfull.onerror.call(screenfull, mapper);
  }), $.screenfull = screenfull, void 0) : $.screenfull = false;
})(window, document);
+function($) {
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Editable = function(selector) {
    this.$element = $(selector);
    this.$prev = this.$element.prev();
    if (!this.$prev.length) {
      this.$parent = this.$element.parent();
    }
  };
  Editable.prototype = {
    /** @type {function (string): undefined} */
    constructor : Editable,
    /**
     * @return {undefined}
     */
    init : function() {
      var element = this.$element;
      var method = element.data()["toggle"].split(":")[1];
      var selector = element.data("target");
      if (!element.hasClass("in")) {
        element[method](selector).addClass("in");
      }
    },
    /**
     * @return {undefined}
     */
    reset : function() {
      if (this.$parent) {
        this.$parent["prepend"](this.$element);
      }
      if (!this.$parent) {
        this.$element["insertAfter"](this.$prev);
      }
      this.$element.removeClass("in");
    }
  };
  /**
   * @param {string} option
   * @return {?}
   */
  $.fn.shift = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("shift");
      if (!data) {
        $this.data("shift", data = new Editable(this));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  };
  /** @type {function (string): undefined} */
  $.fn.shift.Constructor = Editable;
}(jQuery);
/** @type {function (): number} */
Date.now = Date.now || function() {
  return+new Date;
};
+function($) {
  $(function() {
    $(document).on("click", "[data-toggle=fullscreen]", function(dataAndEvents) {
      if (screenfull.enabled) {
        screenfull.request();
      }
    });
    $("input[placeholder], textarea[placeholder]").placeholder();
    $("[data-toggle=popover]").popover();
    $(document).on("click", ".popover-title .close", function(ev) {
      var relatedTarget = $(ev.target);
      var popover = relatedTarget.closest(".popover").prev();
      if (popover) {
        popover.popover("hide");
      }
    });
    $(document).on("click", '[data-toggle="ajaxModal"]', function(types) {
      $("#ajaxModal").remove();
      types.preventDefault();
      var link = $(this);
      var href = link.data("remote") || link.attr("href");
      var div = $('<div class="modal" id="ajaxModal"><div class="modal-body"></div></div>');
      $("body").append(div);
      div.modal();
      div.load(href);
    });
    /**
     * @param {Event} event
     * @return {undefined}
     */
    $.fn.dropdown.Constructor.prototype.change = function(event) {
      event.preventDefault();
      var $el = $(event.target);
      var $input;
      /** @type {boolean} */
      var boolVal = false;
      var ul;
      var $this;
      if (!$el.is("a")) {
        $el = $el.closest("a");
      }
      ul = $el.closest(".dropdown-menu");
      $this = ul.parent().find(".dropdown-label");
      $labelHolder = $this.text();
      $input = $el.find("input");
      boolVal = $input.is(":checked");
      if ($input.is(":disabled")) {
        return;
      }
      if ($input.attr("type") == "radio" && boolVal) {
        return;
      }
      if ($input.attr("type") == "radio") {
        ul.find("li").removeClass("active");
      }
      $el.parent().removeClass("active");
      if (!boolVal) {
        $el.parent().addClass("active");
      }
      $input.prop("checked", !$input.prop("checked"));
      $items = ul.find("li > a > input:checked");
      if ($items.length) {
        /** @type {Array} */
        $text = [];
        $items.each(function() {
          var cur = $(this).parent().text();
          if (cur) {
            $text.push($.trim(cur));
          }
        });
        /** @type {string} */
        $text = $text.length < 4 ? $text.join(", ") : $text.length + " selected";
        $this.html($text);
      } else {
        $this.html($this.data("placeholder"));
      }
    };
    $(document).on("click.dropdown-menu", ".dropdown-select > li > a", $.fn.dropdown.Constructor.prototype.change);
    $("[data-toggle=tooltip]").tooltip();
    $(document).on("click", '[data-toggle^="class"]', function(evt) {
      if (evt) {
        evt.preventDefault();
      }
      var $el = $(evt.target);
      var uHostName;
      var oldClasses;
      var param;
      var toolbars;
      var elements;
      if (!$el.data("toggle")) {
        $el = $el.closest('[data-toggle^="class"]');
      }
      uHostName = $el.data()["toggle"];
      oldClasses = $el.data("target") || $el.attr("href");
      if (uHostName) {
        if (param = uHostName.split(":")[1]) {
          toolbars = param.split(",");
        }
      }
      if (oldClasses) {
        elements = oldClasses.split(",");
      }
      if (elements) {
        if (elements.length) {
          $.each(elements, function(j, dataAndEvents) {
            if (elements[j] != "#") {
              $(elements[j]).toggleClass(toolbars[j]);
            }
          });
        }
      }
      $el.toggleClass("active");
    });
    $(document).on("click", ".panel-toggle", function(evt) {
      if (evt) {
        evt.preventDefault();
      }
      var $el = $(evt.target);
      /** @type {string} */
      var udataCur = "collapse";
      var rule;
      if (!$el.is("a")) {
        $el = $el.closest("a");
      }
      rule = $el.closest(".panel");
      rule.find(".panel-body").toggleClass(udataCur);
      $el.toggleClass("active");
    });
    $(".carousel.auto").carousel();
    $(document).on("click.button.data-api", "[data-loading-text]", function(ev) {
      var btn = $(ev.target);
      if (btn.is("i")) {
        btn = btn.parent();
      }
      btn.button("loading");
    });
    var $window = $(window);
    /**
     * @param {string} direction
     * @return {?}
     */
    var init = function(direction) {
      if (direction == "reset") {
        $('[data-toggle^="shift"]').shift("reset");
        return true;
      }
      $('[data-toggle^="shift"]').shift("init");
      return true;
    };
    if ($window.width() < 768) {
      init();
    }
    var tref;
    var $width = $window.width();
    $window.resize(function() {
      if ($width !== $window.width()) {
        clearTimeout(tref);
        /** @type {number} */
        tref = setTimeout(function() {
          setHeight();
          if ($window.width() < 767) {
            init();
          }
          if ($window.width() >= 768) {
            if (init("reset")) {
              createNewTagForm();
            }
          }
          $width = $window.width();
        }, 500);
      }
    });
    /**
     * @return {?}
     */
    var setHeight = function() {
      $(".app-fluid #nav > *").css("min-height", $(window).height());
      return true;
    };
    setHeight();
    /**
     * @return {undefined}
     */
    var createNewTagForm = function() {
      $(".ie11 .vbox").each(function() {
        $(this).height($(this).parent().height());
      });
    };
    createNewTagForm();
    $(document).on("click", ".nav-primary a", function(evt) {
      var link = $(evt.target);
      var $parent;
      if (!link.is("a")) {
        link = link.closest("a");
      }
      if ($(".nav-vertical").length) {
        return;
      }
      $parent = link.parent().siblings(".active");
      if ($parent) {
        if ($parent.find("> a").toggleClass("active")) {
          $parent.toggleClass("active").find("> ul:visible").slideUp(200);
        }
      }
      if (!(link.hasClass("active") && link.next().slideUp(200))) {
        link.next().slideDown(200);
      }
      link.toggleClass("active").parent().toggleClass("active");
      if (link.next().is("ul")) {
        evt.preventDefault();
      }
      setTimeout(function() {
        $(document).trigger("updateNav");
      }, 300);
    });
    $(document).on("click.bs.dropdown.data-api", ".dropdown .on, .dropup .on", function(event) {
      event.stopPropagation();
    });
  });
}(jQuery);
(function($) {
  jQuery.fn.extend({
    /**
     * @param {Object} options
     * @return {?}
     */
    slimScroll : function(options) {
      var o = $.extend({
        width : "auto",
        height : "250px",
        size : "7px",
        color : "#000",
        position : "right",
        distance : "1px",
        start : "top",
        opacity : 0.4,
        alwaysVisible : false,
        disableFadeOut : false,
        railVisible : false,
        railColor : "#333",
        railOpacity : 0.2,
        railDraggable : true,
        railClass : "slimScrollRail",
        barClass : "slimScrollBar",
        wrapperClass : "slimScrollDiv",
        allowPageScroll : false,
        wheelStep : 20,
        touchScrollStep : 200,
        borderRadius : "7px",
        railBorderRadius : "7px"
      }, options);
      this.each(function() {
        /**
         * @param {Object} e
         * @return {undefined}
         */
        function _onWheel(e) {
          if (isOverPanel) {
            e = e || window.event;
            /** @type {number} */
            var udataCur = 0;
            if (e.wheelDelta) {
              /** @type {number} */
              udataCur = -e.wheelDelta / 120;
            }
            if (e.detail) {
              /** @type {number} */
              udataCur = e.detail / 3;
            }
            if ($(e.target || (e.srcTarget || e.srcElement)).closest("." + o.wrapperClass).is(me.parent())) {
              scrollContent(udataCur, true);
            }
            if (e.preventDefault) {
              if (!releaseScroll) {
                e.preventDefault();
              }
            }
            if (!releaseScroll) {
              /** @type {boolean} */
              e.returnValue = false;
            }
          }
        }
        /**
         * @param {number} value
         * @param {boolean} recurring
         * @param {boolean} v33
         * @return {undefined}
         */
        function scrollContent(value, recurring, v33) {
          /** @type {boolean} */
          releaseScroll = false;
          /** @type {number} */
          var suiteView = value;
          /** @type {number} */
          var max = me.outerHeight() - bar.outerHeight();
          if (recurring) {
            /** @type {number} */
            suiteView = parseInt(bar.css("top")) + value * parseInt(o.wheelStep) / 100 * bar.outerHeight();
            /** @type {number} */
            suiteView = Math.min(Math.max(suiteView, 0), max);
            /** @type {number} */
            suiteView = 0 < value ? Math.ceil(suiteView) : Math.floor(suiteView);
            bar.css({
              top : suiteView + "px"
            });
          }
          /** @type {number} */
          currentCookies = parseInt(bar.css("top")) / (me.outerHeight() - bar.outerHeight());
          /** @type {number} */
          suiteView = currentCookies * (me[0].scrollHeight - me.outerHeight());
          if (v33) {
            /** @type {number} */
            suiteView = value;
            /** @type {number} */
            value = suiteView / me[0].scrollHeight * me.outerHeight();
            /** @type {number} */
            value = Math.min(Math.max(value, 0), max);
            bar.css({
              top : value + "px"
            });
          }
          me.scrollTop(suiteView);
          me.trigger("slimscrolling", ~~suiteView);
          showBar();
          hideBar();
        }
        /**
         * @return {undefined}
         */
        function attachWheel() {
          if (window.addEventListener) {
            this.addEventListener("DOMMouseScroll", _onWheel, false);
            this.addEventListener("mousewheel", _onWheel, false);
            this.addEventListener("MozMousePixelScroll", _onWheel, false);
          } else {
            document.attachEvent("onmousewheel", _onWheel);
          }
        }
        /**
         * @return {undefined}
         */
        function getBarHeight() {
          /** @type {number} */
          barHeight = Math.max(me.outerHeight() / me[0].scrollHeight * me.outerHeight(), minBarHeight);
          bar.css({
            height : barHeight + "px"
          });
          /** @type {string} */
          var display = barHeight == me.outerHeight() ? "none" : "block";
          bar.css({
            display : display
          });
        }
        /**
         * @return {undefined}
         */
        function showBar() {
          getBarHeight();
          clearTimeout(tref);
          if (currentCookies == ~~currentCookies) {
            releaseScroll = o.allowPageScroll;
            if (lastBrowserCookies != currentCookies) {
              me.trigger("slimscroll", 0 == ~~currentCookies ? "top" : "bottom");
            }
          } else {
            /** @type {boolean} */
            releaseScroll = false;
          }
          lastBrowserCookies = currentCookies;
          if (barHeight >= me.outerHeight()) {
            /** @type {boolean} */
            releaseScroll = true;
          } else {
            bar.stop(true, true).fadeIn("fast");
            if (o.railVisible) {
              rail.stop(true, true).fadeIn("fast");
            }
          }
        }
        /**
         * @return {undefined}
         */
        function hideBar() {
          if (!o.alwaysVisible) {
            /** @type {number} */
            tref = setTimeout(function() {
              if (!(o.disableFadeOut && isOverPanel)) {
                if (!(program || inverse)) {
                  bar.fadeOut("slow");
                  rail.fadeOut("slow");
                }
              }
            }, 1E3);
          }
        }
        var isOverPanel;
        var program;
        var inverse;
        var tref;
        var touchDif;
        var barHeight;
        var currentCookies;
        var lastBrowserCookies;
        /** @type {number} */
        var minBarHeight = 30;
        /** @type {boolean} */
        var releaseScroll = false;
        var me = $(this);
        if (me.parent().hasClass(o.wrapperClass)) {
          var val = me.scrollTop();
          var bar = me.parent().find("." + o.barClass);
          var rail = me.parent().find("." + o.railClass);
          getBarHeight();
          if ($.isPlainObject(options)) {
            if ("height" in options && "auto" == options.height) {
              me.parent().css("height", "auto");
              me.css("height", "auto");
              var width = me.parent().parent().height();
              me.parent().css("height", width);
              me.css("height", width);
            }
            if ("scrollTo" in options) {
              /** @type {number} */
              val = parseInt(o.scrollTo);
            } else {
              if ("scrollBy" in options) {
                val += parseInt(o.scrollBy);
              } else {
                if ("destroy" in options) {
                  bar.remove();
                  rail.remove();
                  me.unwrap();
                  return;
                }
              }
            }
            scrollContent(val, false, true);
          }
        } else {
          o.height = "auto" == o.height ? me.parent().height() : o.height;
          val = $("<div></div>").addClass(o.wrapperClass).css({
            position : "relative",
            overflow : "hidden",
            width : o.width,
            height : o.height
          });
          me.css({
            overflow : "hidden",
            width : o.width,
            height : o.height
          });
          rail = $("<div></div>").addClass(o.railClass).css({
            width : o.size,
            height : "100%",
            position : "absolute",
            top : 0,
            display : o.alwaysVisible && o.railVisible ? "block" : "none",
            "border-radius" : o.railBorderRadius,
            background : o.railColor,
            opacity : o.railOpacity,
            zIndex : 90
          });
          bar = $("<div></div>").addClass(o.barClass).css({
            background : o.color,
            width : o.size,
            position : "absolute",
            top : 0,
            opacity : o.opacity,
            display : o.alwaysVisible ? "block" : "none",
            "border-radius" : o.borderRadius,
            BorderRadius : o.borderRadius,
            MozBorderRadius : o.borderRadius,
            WebkitBorderRadius : o.borderRadius,
            zIndex : 99
          });
          /** @type {({left: ?}|{right: ?})} */
          width = "right" == o.position ? {
            right : o.distance
          } : {
            left : o.distance
          };
          rail.css(width);
          bar.css(width);
          me.wrap(val);
          me.parent().append(bar);
          me.parent().append(rail);
          if (o.railDraggable) {
            bar.bind("mousedown", function(e) {
              var $d = $(document);
              /** @type {boolean} */
              inverse = true;
              /** @type {number} */
              t = parseFloat(bar.css("top"));
              pageY = e.pageY;
              $d.bind("mousemove.slimscroll", function(touches) {
                /** @type {number} */
                currTop = t + touches.pageY - pageY;
                bar.css("top", currTop);
                scrollContent(0, bar.position().top, false);
              });
              $d.bind("mouseup.slimscroll", function(dataAndEvents) {
                /** @type {boolean} */
                inverse = false;
                hideBar();
                $d.unbind(".slimscroll");
              });
              return false;
            }).bind("selectstart.slimscroll", function(event) {
              event.stopPropagation();
              event.preventDefault();
              return false;
            });
          }
          rail.hover(function() {
            showBar();
          }, function() {
            hideBar();
          });
          bar.hover(function() {
            /** @type {boolean} */
            program = true;
          }, function() {
            /** @type {boolean} */
            program = false;
          });
          me.hover(function() {
            /** @type {boolean} */
            isOverPanel = true;
            showBar();
            hideBar();
          }, function() {
            /** @type {boolean} */
            isOverPanel = false;
            hideBar();
          });
          me.bind("touchstart", function(e, dataAndEvents) {
            if (e.originalEvent.touches.length) {
              touchDif = e.originalEvent.touches[0].pageY;
            }
          });
          me.bind("touchmove", function(e) {
            if (!releaseScroll) {
              e.originalEvent.preventDefault();
            }
            if (e.originalEvent.touches.length) {
              scrollContent((touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep, true);
              touchDif = e.originalEvent.touches[0].pageY;
            }
          });
          getBarHeight();
          if ("bottom" === o.start) {
            bar.css({
              top : me.outerHeight() - bar.outerHeight()
            });
            scrollContent(0, true);
          } else {
            if ("top" !== o.start) {
              scrollContent($(o.start).position().top, null, true);
              if (!o.alwaysVisible) {
                bar.hide();
              }
            }
          }
          attachWheel();
        }
      });
      return this;
    }
  });
  jQuery.fn.extend({
    slimscroll : jQuery.fn.slimScroll
  });
})(jQuery);
