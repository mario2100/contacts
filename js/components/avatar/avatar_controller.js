angular.module('contactsApp')
.controller('avatarCtrl', function(ContactService) {
	var ctrl = this;

	ctrl.import = ContactService.import.bind(ContactService);

	ctrl.removePhoto = function() {
		ctrl.contact.removeProperty('photo', ctrl.contact.getProperty('photo'));
		ContactService.update(ctrl.contact);
		$('avatar').removeClass('maximized');
	};

	ctrl.downloadPhoto = function() {
		/* globals ArrayBuffer, Uint8Array */
		var img = document.getElementById('contact-avatar');
		// atob to base64_decode the data-URI
		var imageSplit = img.src.split(',');
		// "data:image/png;base64" -> "png"
		var extension = '.' + imageSplit[0].split(';')[0].split('/')[1];
		var imageData = atob(imageSplit[1]);
		// Use typed arrays to convert the binary data to a Blob
		var arrayBuffer = new ArrayBuffer(imageData.length);
		var view = new Uint8Array(arrayBuffer);
		for (var i=0; i<imageData.length; i++) {
			view[i] = imageData.charCodeAt(i) & 0xff;
		}
		var blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});

		// Use the URL object to create a temporary URL
		var url = (window.webkitURL || window.URL).createObjectURL(blob);

		var a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';
		a.href = url;
		a.download = ctrl.contact.uid() + extension;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
	};

	ctrl.openPhoto = function() {
		$('avatar').toggleClass('maximized');
	};

	ctrl.t = {
		uploadNewPhoto : t('contacts', 'Upload new image'),
		deletePhoto : t('contacts', 'Delete'),
		closePhoto : t('contacts', 'Close'),
		downloadPhoto : t('contacts', 'Download')
	};

	// Quit avatar preview
	$('avatar').click(function() {
		$('avatar').removeClass('maximized');
	});
	$('avatar img, avatar .avatar-options').click(function(e) {
		e.stopPropagation();
	});
	$(document).keyup(function(e) {
		if (e.keyCode === 27) {
			$('avatar').removeClass('maximized');
		}
	});

	ctrl.closeMenus = function() {
		ctrl.openedMenu = false;
	};

	ctrl.openMenu = function(index) {
		ctrl.closeMenus();
		ctrl.openedMenu = index;
	};

	ctrl.toggleMenu = function(index) {
		if (ctrl.openedMenu === index) {
			ctrl.closeMenus();
		} else {
			ctrl.openMenu(index);
		}
	};

	$('#selectavatar').click(function () {
		OC.dialogs.filepicker(
			t('settings', "Select a profile picture"),
			function (path) {
				$('#displayavatar img').hide();
				$('#displayavatar .avatardiv').addClass('loading');
				$.ajax({
					type: "POST",
					url: OC.generateUrl('/avatar/'),
					data: { path: path }
				}).done(avatarResponseHandler)
					.fail(function(jqXHR) {
						var msg = jqXHR.statusText + ' (' + jqXHR.status + ')';
						if (!_.isUndefined(jqXHR.responseJSON) &&
							!_.isUndefined(jqXHR.responseJSON.data) &&
							!_.isUndefined(jqXHR.responseJSON.data.message)
						) {
							msg = jqXHR.responseJSON.data.message;
						}
						avatarResponseHandler({
							data: {
								message: msg
							}
						});
					});
			},
			false,
			["image/png", "image/jpeg"]
		);
	});

});
