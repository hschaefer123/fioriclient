/* global Camera */
sap.ui.define([
	"jquery.sap.global",
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(jQuery, BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.blogspot.openui5.fc.controller.Camera", {

		onInit: function() {
			// shortcut to FioriClient helper
			this.oFioriClient = this.getComponent().getFioriClient();

			// ui view model
			var oViewModel = new JSONModel({
				"isFioriClientAvailable": this.oFioriClient.isAvailable(),
				"sourceType": null,
				"sourceTypes": [],
				"encodingType": null,
				"encodingTypes": [],
				"options": {
					"quality": 50,
					"allowEdit": true,
					"correctOrientation": true,
					"saveToPhotoAlbum": false
				}
			});
			this.setModel(oViewModel, "ui");
			this.oViewModel = oViewModel;

			if (this.oFioriClient.isAvailable()) {
				oViewModel.setProperty("/options", {
					"quality": 50,
					"allowEdit": true,
					"destinationType": Camera.DestinationType.DATA_URL, // [DATA_URL|FILE_URI (default)|NATIVE_URI]
					"sourceType": Camera.PictureSourceType.CAMERA, // [PHOTOLIBRARY|CAMERA (default)|SAVEDPHOTOALBUM]
					"encodingType": Camera.EncodingType.JPEG, // [JPEG (default)|PNG]
					"mediaType": Camera.MediaType.PICTURE, // [PICTURE|VIDEO|ALLMEDIA]
					"correctOrientation": true,
					"saveToPhotoAlbum": false,
					//"targetWidth": 100,
					//targetHeight: 100
					"cameraDirection": Camera.Direction.BACK // [BACK|FRONT]	
				});

				oViewModel.setProperty("/destinationTypes", [{
					value: "DATA_URL",
					key: Camera.DestinationType.DATA_URL
				}, {
					value: "FILE_URI",
					key: Camera.DestinationType.FILE_URI
				}, {
					value: "NATIVE_URI",
					key: Camera.DestinationType.NATIVE_URI
				}]);

				oViewModel.setProperty("/sourceTypes", [{
					value: "PHOTOLIBRARY",
					key: Camera.PictureSourceType.PHOTOLIBRARY
				}, {
					value: "CAMERA",
					key: Camera.PictureSourceType.CAMERA
				}, {
					value: "SAVEDPHOTOALBUM",
					key: Camera.PictureSourceType.SAVEDPHOTOALBUM
				}]);

				oViewModel.setProperty("/encodingTypes", [{
					value: "JPEG",
					key: Camera.EncodingType.JPEG
				}, {
					value: "PNG",
					key: Camera.EncodingType.PNG
				}]);

				oViewModel.setProperty("/cameraDirections", [{
					value: "BACK",
					key: Camera.Direction.BACK
				}, {
					value: "FRONT",
					key: Camera.Direction.FRONT
				}]);
			}
		},

		onCamera: function() {
			if (this.oFioriClient.isAvailable()) {
				//this.messageToast(this.oViewModel.getProperty("/options"));
				navigator.camera.getPicture(
					//navigator.device.capture.captureImage(
					this.onSuccess.bind(this),
					this.onError.bind(this),
					this.oViewModel.getProperty("/options")
				);
			}
		},

		// onSuccess Callback 
		onSuccess: function(imageData) {
			var oOptions = this.oViewModel.getProperty("/options"),
				sEncoding = (oOptions.encodingType === Camera.EncodingType.JPEG) ? "jpeg" : "png",
				sData = (oOptions.destinationType === Camera.DestinationType.DATA_URL) ? "data:image/" + sEncoding + ";base64," + imageData :
				imageData;

			this.getView().byId("cameraImage").setSrc(sData);
			//this.getView().byId("lightBoxItemImage").setImageSrc(sData);

			//this.messageToast(imageData);
		},

		// onError Callback
		onError: function(error) {
			this.messageToast(error, "Error");
		},

		getFileEntry: function(imgUri) {
			window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
				// Do something with the FileEntry object, like write to it, upload it, etc. 
				// writeFile(fileEntry, imgUri); 
				this.messageToast(fileEntry.fullPath, "filePath");
				// displayFileData(fileEntry.nativeURL, "Native URL"); 

			}, function() {
				// If don't get the FileEntry (which may happen when testing 
				// on some emulators), copy to a new FileEntry. 
				this.createNewFileEntry(imgUri).bind(this);
			});
		},

		createNewFileEntry: function(imgUri) {
			window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
				// JPEG file 
				dirEntry.getFile("tempFile.jpeg", {
					create: true,
					exclusive: false
				}, function(fileEntry) {

					// Do something with it, like write to it, upload it, etc. 
					// writeFile(fileEntry, imgUri); 
					this.messageToast(fileEntry.fullPath, "file");
					// displayFileData(fileEntry.fullPath, "File copied to"); 

				}, this.onErrorCreateFile.bind(this));

			}, this.onErrorResolveUrl.bind(this));
		},

		// onSuccess Callback 
		fileConversion: function(mediaFiles) {
			var that = this;
			var i, path, len;

			for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				path = mediaFiles[i].fullPath;
				window.resolveLocalFileSystemURI("file://" + path,
					function(fileEntry) {
						this.messageToast("x: " + path);
						fileEntry.file(
							function(file) {
								//alert("size: " + file.size);
								this.messageToast("size: " + file.size);
								var reader = new FileReader();
								reader.onloadend = function(evt) {
									this.messageToast("reader end");
									that.getView().byId("cameraImage").setSrc(
										evt.target.result
									);
									that.getView().byId("cameraImageDataURL").setText(
										evt.target.result.substr(0, 128) + "..."
									);
								};
								reader.readAsDataURL(file);
							},
							that.onCameraError
						);
					},
					that.onCameraError
				);
			}
		}

	});
});