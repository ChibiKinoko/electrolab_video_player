document.addEventListener("DOMContentLoaded", function(event) { 

	var video = document.getElementById("videoSample");
	var subtitles = [];
	var timestamp;
	var currentPdfPage = 1;

	/*
	*
	* Initialize by getting Timestamp Json data
	* 
	 */
	function init()
	{
		var getTimestamp = new Promise(function(resolve, reject) {
			var req = new XMLHttpRequest();
			
			req.open('GET', 'videos/Timestamp.json', true);
			
			req.onreadystatechange = function () {
			  	if (req.readyState == 4) {
			     	if(req.status == 200)
			     		resolve(JSON.parse(req.responseText));
			     	else
			      		reject('Could not get timestamp.json');
			  	}
			};

			req.send(null);
		});

		getTimestamp.then(function(data) {
			// console.log(data);
			main(data);
		}, function(error) {
			// console.log(error);
			main();
		});
	}


	/*
	*
	* Switch with the given subtitle
	* 
	 */
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
	}

	/*
	*
	* Get Chapters and display in DOM
	* 
	 */	
	function displayChapters(chapters)
	{
		var chaptersList = document.createElement("ul");
			document.getElementById('chapters').appendChild(chaptersList);

			for (i = 0; i < chapters.length; i++) {
				var chapterElem = document.createElement("li");
				chapterElem.innerHTML = ' - ' + chapters[i].id;
				chapterElem.setAttribute('data-id', i+1);
				chapterElem.setAttribute('data-start', chapters[i].startTime);
				chapterElem.setAttribute('data-end', chapters[i].endTime);
				chaptersList.appendChild(chapterElem);

				chapterElem.onclick = function (e) {
					video.currentTime = this.dataset.start;
					// console.log(this.dataset.id);
					// displayPdf(this.dataset.id);
					console.log(e.target.dataset.id);
					/*if (e.target.dataset.id == 1) {
						console.log('i pass');
						currentPdfPage = 0;
					}*/
	  				if(video.paused) { 
	  					video.play();
	  				}
				};
			}
	}

	/*
	*
	* Get subtitles and diplay in DOM select
	*
	 */
	function displaySubtitle(subtitles)
	{
		for (var j = 0; j < subtitles.length; j++) {
			var optSRT = document.createElement("option");
			optSRT.innerHTML = subtitles[j].language;

			// console.log(subtitles[j].id); 

			if (subtitles[j].id !== "default") {
				optSRT.setAttribute('data-show', 'hidden');
			} else {
				optSRT.setAttribute('data-show', 'showing');
			}
			document.getElementById('subtitles').appendChild(optSRT);
		};
	}

	function convert(time)
	{
		var seconds = Math.round(time);
		var hours = parseInt( seconds / 3600 );
		var minutes = parseInt( seconds / 60 );
		// var seconds = seconds % 60;

		var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		return result;
	}

	function displayPdf(page)
	{
		var canvas = document.getElementById('canvasSlide');
		var context = canvas.getContext('2d');

		PDFJS.getDocument('cahier_des_charges.pdf').then(function (pdf) {
			pdf.getPage(page).then(function (pageDisplay) {

				var viewport = pageDisplay.getViewport(1);
				viewport.height = canvas.height;
				viewport.width = canvas.width;

				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};

				pageDisplay.render(renderContext);
			});
		});
	}

	function synchronisePdfViaVideo(timestamp) {

		for(index in timestamp) {
			if (convert(video.currentTime) > timestamp[index].start && convert(video.currentTime) < timestamp[index].end) {
				// console.log(typeof parseInt(index, 10));
				if (parseInt(index, 10) !== currentPdfPage) {
					currentPdfPage = parseInt(index, 10);

					displayPdf(parseInt(index, 10));
					
				}
			};
			// console.log(video.currentTime);
		}
		// console.log(convert(video.currentTime));
	}

	function main(timestamp) {
		timestamp = timestamp || null;

		if (timestamp == null ) {
			var newItem = document.createElement("p");
			var textnode = document.createTextNode("Synchronisation Off");
			newItem.appendChild(textnode);

			var list = document.getElementById("container");

			list.insertBefore(newItem, list.childNodes[0]);
		};

		/*
		*
		* If track isn't load, cannot use it
		* 
		 */	
		document.querySelector('track').addEventListener('load', function () {

			/*
			*
			* Listen on the subtitle select
			*
			 */	
			document.getElementById('subtitles').addEventListener('change', function(e) {
				toggleSub(e.target.options[e.target['selectedIndex']].value);
			});

			// separate chapters from subtitle because it's both tracks html element
			for (var a = 0; a < video.textTracks.length; a++) {
				if (video.textTracks[a].kind === 'subtitles') {
					subtitles.push(video.textTracks[a]);
				} else {
					var chapters = video.textTracks[a].cues;
				}
			};

			// console.log(subtitles);
			// console.log(chapters);

			displayChapters(chapters);
			
			displaySubtitle(subtitles);

			displayPdf(currentPdfPage);


			/**
			 * 
			 * Listen video change and update chapters and slide
			 * 			 
			*/
			video.ontimeupdate = function (e) {
				
				// console.log(Math.round(video.currentTime));

				for (var c = 0; c < chapters.length; c++) {
					var myData = document.querySelector('\[data-start="' + chapters[c].startTime + '"]');
					if (video.currentTime >= chapters[c].startTime && video.currentTime <= chapters[c].endTime && myData.className.split(' ').indexOf("selected") === -1) {
						// console.log('current');
						
						var previousSelected = document.querySelectorAll('.selected');

						for (var p = 0; p < previousSelected.length; p++) {
							// console.log(previousSelected[p]);
							previousSelected[p].classList.remove('selected');
						};
						myData.classList.add('selected');
						break;
		
					};
				};

				if (timestamp !== null) {
					console.log('je suis la');
					synchronisePdfViaVideo(timestamp);
				};
			};
		});

		document.getElementById('previous').addEventListener('click', function () {
			console.log('previous');
		});
	}
	

	init();

});