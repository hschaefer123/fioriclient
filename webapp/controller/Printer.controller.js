sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.Printer", {

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable(),
				"printText": "Hallo World, this text should be printed out..."
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;
		},

		onPrint: function() {
			if (this.oFioriClient.isAvailable()) {
				cordova.plugins.printer.print("<p>" + this.oViewModel.getProperty("/printText") + "</p>");
			}
		}

	});
});