console.log("hello");

function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60); // Get the minutes part
    const remainingSeconds = Math.floor(seconds % 60);  // Get the remaining seconds part

    // Format minutes and seconds to always show two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`https://github.com/PrabhatPrajapati09/Potifier-music-player/tree/main/songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML =songUL.innerHTML + `
                        <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("%2", " ")}</div>
                                <div>Hello</div>
                            </div>
                            <div class="playnow">
                                <span>
                                    Play Now
                                    <img class="invert" src="img/play.svg" alt="">
                                </span>
                            </div>
                        </li>`;
    }

    //attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })

    })

    return songs;
}

const playMusic = (track, pause=false) => {
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`https://github.com/PrabhatPrajapati09/Potifier-music-player/tree/main/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs/")){
            let folder = (e.href.split("/").slice(-1)[0]);
            //get the metadata of the folder
            let a = await fetch(`https://github.com/PrabhatPrajapati09/Potifier-music-player/tree/main/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" fill="#000000" stroke-width="1.5" stroke-linejoin="round"/>
                                </svg>
                          </div>
                          
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    };

    //add an eventlistener to card to load the playlist(load the playlist when the card is clicked)
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    });


}

async function main() {
    //get the list of songs
    await getSongs("songs/liked");
    playMusic(songs[0],true);

    //display all the albums on the page
    displayAlbums();

    

    //attach an eevnt listener to play, next and previous
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src="img/pause.svg";
        }else{
            currentSong.pause();
            play.src="img/play.svg";
        }
    });

    //add an eventlistener for spacebar to play/pause the song

    // play.addEventListener("keydown", e => {
    //     if (e.key === " ") {
    //       const audioElement = document.querySelector("audio");
    //       if (currentSong.paused) {
    //         currentSong.play();
    //         play.src="pause.svg";
    //       } else {
    //         currentSong.pause();
    //         play.src="play.svg";
    //       }
    //     }
    // })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });

    //add an eventlistener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent =(e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100;
    });

    //add an eventlistener to the hamburger
    document.querySelector(".hamburger").addEventListener("click" , () =>{
        document.querySelector(".left").style.left = "0" ;
    });

    //add an eventlistener to the close button
    document.querySelector(".close").addEventListener("click" , () =>{
        document.querySelector(".left").style.left = "-130%"  ;
    })
    
    //add eventlistener to previous button
    previous.addEventListener("click" ,() =>{
        currentSong.pause();
        console.log("previous clicked");
        let index = songs .indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index - 1]);
        }
    });

     //add eventlistener to next button
     next.addEventListener("click" ,() =>{
        currentSong.pause();
        console.log("next clicked");
        let index = songs .indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index + 1]);
        }
    });

    //add an eventlistener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        console.log("setting volume to " + e.target.value +"/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }else{
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg");
        }
    });

    //add eventlistener to mute the track
    document.querySelector(".volume>img").addEventListener("click" , e =>{  
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentSong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })

    

}

main();