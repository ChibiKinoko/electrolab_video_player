document.addEventListener("DOMContentLoaded", function(event) { 

  var video = document.getElementById("videoSample");
  // var chapters = textTracks.cues;
  // console.log(textTracks);
  // console.log(textTracks.getCueById("Chapter 1"));
  // 
  document.querySelector('track').addEventListener('load', function () {
            var textTracks = video.textTracks[0],
                chapters   = textTracks.cues,
                list       = document.querySelector('#chapterList');
            
            list.seize = chapters.length < 5 ? chapters.length : 5;
            
            for (i = 0; i < chapters.length; i++) {
                console.log(chapters[i]);
                var option = document.createElement('option');
                option.text = chapters[i].id;
                list.appendChild(option);
                console.log(chapters[i].endTime);
            }
  })
});