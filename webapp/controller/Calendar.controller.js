sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.Calendar", {

		oCalendar: null,

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			var dNow = new Date(),
				iYear = dNow.getFullYear(),
				iMonth = dNow.getMonth(),
				iDay = dNow.getDate(),
				iHours = dNow.getHours();

			if (iHours >= 23) {
				iHours = 23;
			}

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable(),
				"options": {
					"startDate": new Date(iYear, iMonth, iDay, iHours, 0, 0, 0, 0), // beware: month 0 = january, 11 = december
					"endDate": new Date(iYear, iMonth, iDay, iHours + 1, 30, 0, 0, 0),
					"title": "My nice event",
					"eventLocation": "Home",
					"notes": "Some notes about this event"
				}
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			if (this.oFioriClient.isAvailable()) {
				this.oCalendar = window.plugins.calendar;
			}
		},

		onCalendar: function() {
			if (this.oCalendar) {
				var oOptions = this.oViewModel.getProperty("/options");

				// create an event silently (on Android < 4 an interactive dialog is shown which doesn't use this options) with options:
				//var oCalOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
				//MessageToast.show("oOptions" + JSON.stringify(oOptions));
				/*
				oCalOptions.firstReminderMinutes = 120; // default is 60, pass in null for no reminder (alarm)
				oCalOptions.secondReminderMinutes = 5;

				// Added these options in version 4.2.4:
				oCalOptions.recurrence = "monthly"; // supported are: daily, weekly, monthly, yearly
				oCalOptions.recurrenceEndDate = new Date(2016, 10, 1, 0, 0, 0, 0, 0); // leave null to add events into infinity and beyond
				oCalOptions.calendarName = "MyCreatedCalendar"; // iOS only
				oCalOptions.calendarId = 1; // Android only, use id obtained from listCalendars() call which is described below. This will be ignored on iOS in favor of calendarName and vice versa. Default: 1.

				// This is new since 4.2.7:
				oCalOptions.recurrenceInterval = 2; // once every 2 months in this case, default: 1

				// And the URL can be passed since 4.3.2 (will be appended to the notes on Android as there doesn't seem to be a sep field)
				oCalOptions.url = "https://www.google.com";
				*/

				// on iOS the success handler receives the event ID (since 4.3.6)
				/*
				var sId = window.plugins.calendar.createEventWithOptions(
					oOptions.title, 
					oOptions.eventLocation, 
					oOptions.notes, 
					oOptions.startDate,
					oOptions.endDate, 
					oCalOptions,
					this.onSuccess,
					this.onError
				);
				*/

				// create an event interactively
				/*
				this.oCalendar.createEventInteractively(
					oOptions.title, 
					oOptions.eventLocation, 
					oOptions.notes, 
					oOptions.startDate,
					oOptions.endDate, 
					this.onSuccess,
					this.onError
				);
				*/

				this.oCalendar.createEvent(
					oOptions.title,
					oOptions.eventLocation,
					oOptions.notes,
					oOptions.startDate,
					oOptions.endDate,
					this.onSuccess,
					this.onError
				);

				//this.messageToast(this.oViewModel.getProperty("/options"));
				
				this.messageToast("Event created inside your device calendar");
			}
		},

		// onSuccess Callback 
		onSuccess: function(message) {
			this.messageToast("Event created inside your device calendar");
		},

		// onError Callback
		onError: function(error) {
			this.messageToast(error, "Error");
		}

	});
});