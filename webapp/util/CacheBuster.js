/**
 * Cache Buster Constructor
 * @param ts - Time stamp
 * @constructor
 */
var CacheBuster = function CacheBuster(ts, roots) {
    this.setTimestamp(ts || String(new Date().getTime()));
    this.roots = roots;
    // store the original function to intercept
    this._fnAjaxOrig = jQuery.ajax;
    this._fnIncludeScript = jQuery.sap.includeScript;
    this._fnIncludeStyleSheet = jQuery.sap.includeStyleSheet;
    this._fnValidateProperty = sap.ui.base.ManagedObject.prototype.validateProperty;
    this._fnLoadResource = jQuery.sap.loadResource;
    this.init();
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

CacheBuster.prototype.setTimestamp = function setTimestamp(ts) {
    this.timestamp = ts;
};

CacheBuster.prototype.convertURL = function convertURL(sUrl) {
    if (sUrl.match(/\?ts/)) { // dont inject it twice
        return sUrl;
    }
    
    // Avoid converting library.css if ie9
    if (sap.ui.Device.browser.msie && sap.ui.Device.browser.version <= 9 && sUrl.match("library.css$")) {
        return sUrl;
    }

    var ts = this.timestamp;
    //Get file extension
    var extension = sUrl.split(".").pop().split(/\#|\?/)[0];
    if (/(html|xml|js|json|css|properties|png|jpg|jpeg|svg)$/ig.test(extension) && sUrl.search("[?&]ts=") === -1 && sUrl.search("https?:") === -1 && sUrl.search("/resources/") === -1) {
        sUrl = sUrl + "?ts=" + ts;
    }
    return sUrl;
};

/**
 * Initialize the cache busting mechanism
 * Extend the ajax, includeScript, includeStyleSheet, validateProperty methods
 */
CacheBuster.prototype.init = function init() {
    var cacheBuster = this;
    // enhance the original ajax function with appCacheBuster functionality
    jQuery.ajax = function (url) {
        if (url && url.url) {
            url.url = cacheBuster.convertURL(url.url);
        }
        return cacheBuster._fnAjaxOrig.apply(this, arguments);
    };
    
    // enhance the includeScript function
    jQuery.sap.includeScript = function () {
        var oArgs = Array.prototype.slice.apply(arguments);
        if (oArgs[0]) { // Url
            oArgs[0] = cacheBuster.convertURL(oArgs[0]);
        }
        return cacheBuster._fnIncludeScript.apply(this, oArgs);
    };
    
    // enhance the includeStyleSheet function
    jQuery.sap.includeStyleSheet = function () {
        var oArgs = Array.prototype.slice.apply(arguments);
        if (oArgs[0]) { // Url
            oArgs[0] = cacheBuster.convertURL(oArgs[0]);
        }
        
        return cacheBuster._fnIncludeStyleSheet.apply(this, oArgs);
    };
    var fnOldSetIcons = jQuery.sap.setIcons;
    jQuery.sap.setIcons = function(oIcons) {
        ['phone', 'phone@2', 'tablet', 'tablet@2', 'favicon'].forEach(function(sName) {
            if(oIcons[sName]) {
                oIcons[sName] = cacheBuster.convertURL(oIcons[sName]);
            }
        });
        fnOldSetIcons.apply(this, [ oIcons ]);
    };
    
    // enhance the validateProperty function to intercept URI types
    //  test via: new sap.ui.commons.Image({src: "acctest/img/Employee.png"}).getSrc()
    //            new sap.ui.commons.Image({src: "./acctest/../acctest/img/Employee.png"}).getSrc()
    //        var view = new sap.ui.core.ComponentContainer({
    //            url:"/content/ui5/TestComponent/Component.js"
    //        });
    //        view.getUrl();
    sap.ui.base.ManagedObject.prototype.validateProperty = function (sPropertyName) {
        var oMetadata = this.getMetadata(),
            oProperty = oMetadata.getAllProperties()[sPropertyName],
            oArgs;
        if (oProperty && oProperty.type === "sap.ui.core.URI") {
            oArgs = Array.prototype.slice.apply(arguments);
            try {
                if (oArgs[1]) { /* Value */
                    oArgs[1] = cacheBuster.convertURL(oArgs[1]);
                }
            } catch (ignore) {
                // URI normalization or conversion failed, fall back to normal processing
            }
        }
        // either forward the modified or the original arguments
        return cacheBuster._fnValidateProperty.apply(this, oArgs || arguments);
    };
};