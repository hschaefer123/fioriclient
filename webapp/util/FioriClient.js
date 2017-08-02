/*global cordova*/
sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast"
], function(UI5Object, MessageToast) {
	"use strict";

	return UI5Object.extend("de.blogspot.openui5.fc.FioriClient", {
		
		_bIsCordova: false,

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias bonvendo2.crud.controller.ErrorHandler
		 */
		constructor: function() {
			this._bIsCordova = (typeof window.cordova !== "undefined");
			
			if (this._bIsCordova) {
				window.open = cordova.InAppBrowser.open;
			}
			
			//MessageToast.show("Fiory Client supported: " + this._bIsCordova);
		},

		isCordova: function() {
			return this._bIsCordova;
			
			//return (typeof window.cordova !== "undefined");
			/*
			return (cordova || PhoneGap || phonegap)
			    && /^file:\/{3}[^\/]/i.test(window.location.href)
			    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
			*/
		},
		
		isAvailable: function() {
			return this._bIsCordova;
		},
		
		inAppBrowser: function(sUrl, sTarget, mOptions) {
			return cordova.InAppBrowser.open(sUrl, sTarget, mOptions);	
		}
		
		/*
		https://github.com/apache/cordova-plugin-inappbrowser
		
		window.open = cordova.InAppBrowser.open;
		var ref = cordova.InAppBrowser.open(url, target, options);
		*/
	});

});