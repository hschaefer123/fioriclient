sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.Geolocation", {

		oGeoLocation: null,

		onInit: function() {
			// ui view model
			var oViewModel = new JSONModel({});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			if (this.oFioriClient.isAvailable()) {
				this.oGeoLocation = navigator.geolocation;

				this.oGeoLocation.getCurrentPosition(
					this.onSuccess.bind(this),
					this.onError.bind(this)
				);
			} else {
				this.setGeoData(null);
			}
		},

		// onSuccess Callback 
		onSuccess: function(position) {
			this.setGeoData(position);
		},

		// onError Callback
		onError: function(error) {
			this.messageToast(error, "Error");
		},

		setGeoData: function(position) {
			var aData = [{
					key: "Latitude",
					value: this.getValue(position, "latitude")
				}, {
					key: "Longitude",
					value: this.getValue(position, "longitude")
				}, {
					key: "Altitude",
					value: this.getValue(position, "altitude")
				}, {
					key: "Accuracy",
					value: this.getValue(position, "accuracy")
				}, {
					key: "Altitude Accuracy",
					value: this.getValue(position, "altitudeAccuracy")
				}, {
					key: "Heading",
					value: this.getValue(position, "heading")
				}, {
					key: "Speed",
					value: this.getValue(position, "speed")
				}
				//{ key: "Timestamp", value: position.timestamp }
			];

			this.oViewModel.setProperty("/Items", aData);
		},

		getValue: function(oPosition, sKey) {
			return (oPosition) ? oPosition.coords[sKey] : "- unknown -";
		}

	});
});