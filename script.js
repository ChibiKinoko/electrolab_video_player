document.addEventListener("DOMContentLoaded", function(event) { 

  var video = document.getElementById("videoSample");
  // var chapters = textTracks.cues;
  // console.log(textTracks);
  // console.log(textTracks.getCueById("Chapter 1"));
  // 
  document.querySelector('track').addEventListener('load', function () {
            var textTracks = video.textTracks[0];
            chapters = textTracks.cues;
            // console.log(chapters);
            for (i = 0; i < chapters.length; i++) {
                console.log(chapters[i].endTime);
            }
  })
});