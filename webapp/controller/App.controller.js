sap.ui.define([
	"jquery.sap.global",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(jQuery, BaseController, JSONModel, Device) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.App", {

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable()
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			// shortcut
			this.oToolPage = this.byId("toolPage");
		},

		/*
		onAfterRendering: function() {
			// auto expand on tablet
			if (Device.system.tablet) {
				this.oToolPage.setSideExpanded(true);
			}
		},
		*/
		
		onHelp: function() {
			sap.m.URLHelper.redirect("https://uacp2.hana.ondemand.com/viewer/p/SAP_FIORI_CLIENT", true);
		},
		
		onPrint: function() {
			if (this.oFioriClient.isAvailable()) {
				var oPage = this.getView().byId("idAppControl").getCurrentPage(),
					$DomRef = oPage.$()[0];
					
				// cordova.plugins.printer.isAvailable();
				
				// print DOM element
				cordova.plugins.printer.print($DomRef);
			} else {
				// regular print
				window.print();
			}
		},
		
		onItemSelect: function(oEvent) {
			this.onNavTo(oEvent);

			if (Device.system.phone) {
				this.oToolPage.setSideExpanded(false);
			}
		},

		onSideNavButtonPress: function() {
			this.oToolPage.setSideExpanded(!this.oToolPage.getSideExpanded());
		}

	});
});