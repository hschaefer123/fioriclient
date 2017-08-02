sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"de/blogspot/openui5/fc/model/models",
	"./util/FioriClient"
], function(UIComponent, Device, models, FioriClient) {
	"use strict";

	return UIComponent.extend("de.blogspot.openui5.fc.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialide.blogspot.openui5zed by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// initialize FioriClient
			this._oFioriClient = new FioriClient();

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		getFioriClient: function() {
			return this._oFioriClient;
		}
	});
});