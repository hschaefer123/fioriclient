sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.Contact", {

		oContacts: null,

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable(),
				"pickData": null,
				"options": {
					"givenName": "Holger",
					"familyName": "Schäfer",
					"nickname": "hoschi",
					"note": "created by SAP Fiori Client"
						/*
						"phoneNumbers": An array of all the contact 's phone numbers. (ContactField[])
						"emails": An array of all the contact 's email addresses. (ContactField[])
						"addresses": An array of all the contact 's addresses. (ContactAddress[])
						"ims": An array of all the contact 's IM addresses. (ContactField[])
						"organizations": An array of all the contact 's organizations. (ContactOrganization[])
						"birthday": The birthday of the contact.(Date)
						"note": A note about the contact.(DOMString)
						"photos": An array of the contact 's photos. (ContactField[])
						"categories": An array of all the user - defined categories associated with the contact.(ContactField[])
						"urls": An array of web pages associated with the contact.(ContactField[])
						*/
				}
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			if (this.oFioriClient.isAvailable()) {
				this.oContacts = navigator.contacts;
			}
		},

		onAddContact: function() {
			if (this.oContacts) {
				var oOptions = this.oViewModel.getProperty("/options");

				// create contact
				var oContact = this.oContacts.create({
					//"id": "hschaefer",
					"displayName": oOptions.givenName + " " + oOptions.familyName,
					"nickname": oOptions.nickname,
					"name": {
						"givenName": oOptions.givenName,
						"familyName": oOptions.familyName
					},
					"note": oOptions.note
				});

				// save contact
				oContact.save(this.onSuccess.bind(this), this.onError.bind(this));
			}
		},

		onPickContact: function() {
			if (this.oContacts) {
				this.oContacts.pickContact(function(contact) {
					/*
					this.oViewModel.setProperty("/options", {
						"givenName": contact.name.givenName,
						"familyName": contact.name.familyName,
						"nickname": contact.nickname,
						"note": contact.note
					});
					*/
					//this.oViewModel.setProperty("/pickData", JSON.stringify(contact, undefined, 4));
					this.oViewModel.setProperty("/pickData", this.jsonfy(contact, true));
				}.bind(this), function(error) {
					this.messageToast(error, "Error");
				}.bind(this));
			}
		},

		// onSuccess Callback 
		onSuccess: function(message) {
			this.messageToast("Contact created inside your device");
		},

		// onError Callback
		onError: function(error) {
			this.messageToast(error, "Error");
		},

		// highlight json entries
		// see style.css for color set
		syntaxHighlight: function(sJson) {
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