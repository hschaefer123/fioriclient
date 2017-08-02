sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.VoiceRecording", {

		oVoiceRecording: null,
		aRecordings: null,

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable(),
				"options": {
					"maxLength": 120000
				},
				"Recordings": []
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			// shortcut
			if (this.oFioriClient.isAvailable()) {
				this.oVoiceRecording = sap.VoiceRecording;
				this.aRecordings = [];
			}
		},

		onRecord: function() {
			this.audioCapture();
		},

		onPlay: function(oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				oContext = oItem.getBindingContext("ui").getObject();

			//this.play(this.getRecording(oContext.id));
			this.play(this.aRecordings[oContext.id]);
		},

		onDelete: function(oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				oContext = oItem.getBindingContext("ui").getObject();

			// destroy recording
			this.deleteRecording(oContext.id);
			
			// refresh list
			this.getView().byId("list").getBinding("items").refresh();

			// send a delete request to the odata service
			//oList.removeItem(oItem);
		},
		
		audioCapture: function(mArgs) {
			if (this.oVoiceRecording) {
				var oOptions = this.oViewModel.getProperty("/options");

				this.oVoiceRecording.audioCapture(
					function(recording) {
						this.addRecording(recording);
					}.bind(this),
					function(error) {
						this.messageToast(error, "Error");
					}.bind(this), [oOptions.maxLength]
					// args
				);
			}
		},

		addRecording: function(recording) {
			var aRecordings = this.oViewModel.getProperty("/Recordings");

			aRecordings.push({
				"id": recording.id,
				"duration": recording.getDuration(),
				"creationDate": recording.getCreationDate(),
				"fileName": recording.getFileName()
			});

			this.oViewModel.setProperty("/Recordings", aRecordings);

			//this.aRecordings.push(recording);
			this.aRecordings[recording.id] = recording;
		},
		
		deleteRecording: function(sID) {
			var aRecordings = this.oViewModel.getProperty("/Recordings", true);
				
			// delete ui recording entry
			for (var i = 0; i < aRecordings.length; i++) {
				if (aRecordings[i].id === sID) {
					delete aRecordings[i];
					aRecordings.splice(i, 1);
					this.oViewModel.setProperty("/Recordings", aRecordings);
					break;
				}
			}
			
			// destroy recording
			this.destroy(this.aRecordings[sID]);
			
			// delete reference
			delete this.aRecordings[sID];
		},		
		
		setFilename: function(sFilename) {
			if (this.oVoiceRecording && this.oRecording) {
				this.oRecording.setFileName(sFilename, function() {
						// success callback
						this.messageToast("Filename set to " + sFilename);
					},
					function(error) {
						// error callback
						this.messageToast(error, "Error");
					});
			}
		},

		play: function(recording) {
			if (this.oVoiceRecording && recording) {
				recording.play(
					function() {
						this.messageToast("Play finished Successfully");
					},
					function(error) {
						this.messageToast(error, "Error");
					}
				);
			}
		},

		getById: function(sId) {
			if (this.oVoiceRecording) {
				this.oVoiceRecording.get(
					function(recording) {
						// success callback with the retrieved Recording as parameter
						this.messageToast(recording, "Error");
					},
					function(error_code, extra) {
						// error callback (for example, recording does not exist for the given id)
						this.messageToast(error_code, "Error");
					},
					sId
				);
			}
		},

		getAll: function() {
			if (this.oVoiceRecording) {
				this.oVoiceRecording.getAll(
					function(returnValue) {
						// success callback with an array of Recordings as parameter
						this.messageToast(returnValue);
					},
					function(error_code, extra) {
						// error callback
						this.messageToast(error_code, "Error");
					}
				);
			}
		},

		destroy: function(recording) {
			if (this.oVoiceRecording && recording) {
				recording.destroy(
					function() {
						this.messageToast("Recording destroyed!");
						//this.oViewModel.setProperty("/hasRecord", false);
					},
					function(error, extra) {
						this.messageToast(error, "Error");
					}
				);
			}
		},

		destroyAll: function() {
			if (this.oVoiceRecording) {
				this.oVoiceRecording.destroyAll(
					function() {
						this.messageToast("All recordings destroyed!");
						this.oViewModel.setProperty("/hasRecord", false);
					},
					function(error, extra) {
						this.messageToast(error, "Error");
					}
				);
			}
		}

	});
});