document.addEventListener("DOMContentLoaded", function(event) { 

	var video = document.getElementById("videoSample");
	
	document.querySelector('track').addEventListener('load', function () {
						var textTracks = video.textTracks[0],
								chapters   = textTracks.cues,
								list       = document.querySelector('#chapterList'),
								i;
						
						
						var optionClick = function (e) {
								var start = e.target.dataset.start;
								video.currentTime = start;
						};
						
						list.seize = chapters.length < 5 ? chapters.length : 5;
						
						for (i = 0; i < chapters.length; i++) {
								console.log(chapters[i]);
								var option = document.createElement('option');
								option.setAttribute('data-start', chapters[i].startTime);
								option.text = chapters[i].id;
								option.onclick = optionClick;
								list.appendChild(option);
								console.log(chapters[i].endTime);
						}
	});
});