sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.BarcodeScanner", {

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable" : this.oFioriClient.isAvailable(),
				"scanValue" : "",
				"scanFormat" : null
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;
		},

		onBarCodeScan: function() {
			if (this.oFioriClient.isAvailable()) {
				window.cordova.plugins.barcodeScanner.scan(
					this.onSuccess.bind(this),
					this.onError.bind(this)
				);
			}
		},

		// onSuccess Callback 
		onSuccess: function(result) {
			var bCancelled = result.cancelled;
			
			this.oViewModel.setProperty("/scanValue", result.text);
			this.oViewModel.setProperty("/scanFormat", result.format);
			
			if (bCancelled) {
				this.messageToast("Scan has been cancelled!");
			}
			
			//this.messageToast(result);
		},

		// onError Callback
		onError: function(error) {
			this.messageToast(error, "Error");
		}

	});
});