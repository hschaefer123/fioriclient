/*global history */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function(jQuery, Controller, History, Device, MessageToast) {
	"use strict";

	return Controller.extend("de.blogspot.openui5.fc.controller.BaseController", {

		getComponent: function() {
			return sap.ui.core.Component.getOwnerComponentFor(
				this.getView()
			);
		},

		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method for getting the resource bundle text.
		 * @public
		 * @param {string} sKey  the property to read
		 * @param {string[]} aArgs? List of parameters which should replace the place holders "{n}" (n is the index) in the found locale-specific string value.
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getText: function(sKey, aArgs) {
			return this.getResourceBundle().getText(sKey, aArgs);
		},

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("system", {}, bReplace);
			}
		},

		/**
		 * Event handler for navigating to defined route.
		 * You have to define a custom data route name property
		 * e.g. XMLView -> data:routeName="routeName"
		 * e.g. JSView  -> customData : [{ key : "routeName", value : "routeName" }]
		 *
		 * @param {sap.ui.base.Event} oEvent - the navigate to event.
		 * @returns {undefined} undefined
		 * @public
		 */
		onNavTo: function(oEvent) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getParameter("item") || oEvent.getSource(),
				sRouteName = oItem.data("routeName") || oItem.data("route"),
				oRouteConfig = oItem.data("routeConfig") || {},
				//oConfig = oItem.data("config") || {},
				sTitle = oItem.data("title"),
				sUrl = oItem.data("url") || undefined;

			// title detection
			if (!sTitle) {
				if (typeof oItem.getTitle === "function") {
					sTitle = oItem.getTitle();
				} else if (typeof oItem.getHeader === "function") {
					sTitle = oItem.getHeader();
				}
			}

			// special iframe handling
			/*
			if (sUrl) {
				var sTarget = (sRouteName) ? "onpremise" : "window";
				oConfig.page = "/" + sTarget + "/" + sUrl;
				oRouteConfig.src = encodeURIComponent(sUrl);
				oRouteConfig.title = encodeURIComponent(sTitle);
			}
			*/

			// route handling
			if (sRouteName) {
				// nav to with history
				this.navTo(sRouteName, oRouteConfig, false);
			} else if (sUrl && sUrl.length > 0) {
				//window.open(sUrl);
				sap.m.URLHelper.redirect(sUrl, true);
			}
		},

		navTo: function(sRoute, mData, bReplace) {
			if (bReplace === undefined) {
				// If we're on a phone, include nav in history; if not, don't.
				bReplace = Device.system.phone ? false : true;
			}
			this.getRouter().navTo(sRoute, mData, bReplace);
		},
		
		messageToast: function(mMessage, sPrefix) {
			var sMessage = (mMessage === Object(mMessage)) ? this.jsonfy(mMessage) : mMessage;
			
			MessageToast.show(((sPrefix) ? sPrefix + "\r\n" : "") + sMessage);
		},

		jsonfy: function(oData, bPretty, iSpace) {
			var sData = (bPretty) ? JSON.stringify(oData, undefined, (iSpace) ? iSpace : 4) : JSON.stringify(oData);
			return (bPretty) ? this.jsonSyntaxHighlight(sData) : sData;
		},

		jsonToast: function(oData, sPrefix) {
			MessageToast.show(
				((sPrefix) ? this.getText(sPrefix) + "\r\n" : "") + this.jsonfy(oData)
			);
		},

		jsonSyntaxHighlight: function(sJson) {
			sJson = sJson.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			return "<pre>" + sJson.replace(
				/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
				function(match) {
					var cls = "number";
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = "key";
						} else {
							cls = "string";
						}
					} else if (/true|false/.test(match)) {
						cls = "boolean";
					} else if (/null/.test(match)) {
						cls = "null";
					}
					return '<span class="' + cls + '">' + match + '</span>';
				}) + "</pre>";
		}

	});

});