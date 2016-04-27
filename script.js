document.addEventListener("DOMContentLoaded", function(event) { 

	var video = document.getElementById("videoSample");
	var subtitles = [];

	function toggleSub(lang) {
		for (var a = 0; a < video.textTracks.length; a++) {
			if (video.textTracks[a].kind === 'subtitles') {
				if (video.textTracks[a].language === lang) {
					video.textTracks[a].mode = "showing";
				} else {
					video.textTracks[a].mode = "disabled";
				}
			}
		};

		// console.log(subtitles);
	}

	document.querySelector('track').addEventListener('load', function () {

		for (var a = 0; a < video.textTracks.length; a++) {
			if (video.textTracks[a].kind === 'subtitles') {
				subtitles.push(video.textTracks[a]);
			} else {
				var chapters = video.textTracks[a].cues;
			}
		};


		

		// console.log(subtitles);
		// console.log(chapters);

		var chaptersList = document.createElement("ul");
		document.getElementById('chapters').appendChild(chaptersList);

		for (i = 0; i < chapters.length; i++) {
			var chapterElem = document.createElement("li");
			chapterElem.innerHTML = ' - ' + chapters[i].id;
			chapterElem.setAttribute('data-start', chapters[i].startTime);
			chapterElem.setAttribute('data-end', chapters[i].endTime);
			chaptersList.appendChild(chapterElem);

			chapterElem.addEventListener('click', function () {
				video.currentTime = this.dataset.start;
  				if(video.paused) { 
  					video.play();
  				}
			})
		}

		for (var j = 0; j < subtitles.length; j++) {
			var optSRT = document.createElement("option");
			optSRT.innerHTML = subtitles[j].language;

			if (optSRT.id !== "default") {
				optSRT.setAttribute('data-show', 'hidden');
			} else {
				optSRT.setAttribute('data-show', 'showing');
			}
			document.getElementById('subtitles').appendChild(optSRT);
		};

		// console.log(document.querySelector('\[data-start="' + 0 + '"]'));

		video.ontimeupdate = function (e) {
			
			// console.log(Math.round(video.currentTime));

			for (var c = 0; c < chapters.length; c++) {
				var myData = document.querySelector('\[data-start="' + chapters[c].startTime + '"]');
				if (video.currentTime >= chapters[c].startTime && video.currentTime <= chapters[c].endTime && myData.className.split(' ').indexOf("selected") === -1) {
					// console.log('current');
					myData.className += ' selected';
					if (c !== 0) {
						myData.previousSibling.classList.remove('selected');
					};
					break;
				};
			};
		};
	});


	document.getElementById('subtitles').addEventListener('change', function(e) {
		toggleSub(e.target.options[e.target['selectedIndex']].value);
	})

});