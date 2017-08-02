/*eslint node: true */
"use strict";

// The app is running in standalone mode.
if (bAddToHomescreen) {
	loadStyle("css/addtohomescreen.css");
	loadScript("util/addtohomescreen.min.js");
}

/**
 * Main method to be executed once SAPUI5 has been initialized.
 */
function main() {
	"use strict";

	// remove no-js class
	//$("html").removeClass("no-js");

	// CacheBuster	
	if (window["openui5-timestamp"]) {
		window["openui5-cache-buster"] = new CacheBuster(
			window["openui5-timestamp"], ["/"]
		);
	}

	// device APIs are available
	function onDeviceReady() {
		jQuery.sap.initMobile({});

		var sIconPath = "mime/icon/";

		jQuery.sap.setIcons({
			'phone': sIconPath + 'icon-57.png',
			'phone@2': sIconPath + 'icon-57-2x.png',
			'tablet': sIconPath + 'icon-72.png',
			'tablet@2': sIconPath + 'icon-72-2x.png',
			'favicon': sIconPath + 'icon.png',
			'precomposed': true
		});

		if (bAddToHomescreen) {
			// http://cubiq.org/add-to-home-screen
			addToHomescreen({
				displayPace: 10
			});
		}

		// create our application
		sap.ui.require([
			"sap/ui/core/ComponentContainer"
		], function(ComponentContainer) {
			// sync (cachebuster issue on Component-preload)
			new ComponentContainer("app", {
				height: "100%",
				name: "de.blogspot.openui5.fc",
				manifestFirst: true
			}).placeAt("content");
		});
	}

	// check if running inside SAP Fiori Client v1.2.4
	window["uniorg-ui-issapfioriclient"] = (location.search.indexOf("smphomebuster") !== -1);
	// handle SAP Fiori Client (native cordova app)
	if (window["uniorg-ui-issapfioriclient"]) {
		// on native client wait for device ready event from cordova/phonegap to call app
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		// on browser directly call app
		onDeviceReady();
	}
}