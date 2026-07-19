const audio = document.getElementById('bg-music');

function openLetter() {
    audio.play();
    document.getElementById('letter').classList.add('active');
    typeText("سلام عزیزم، این یک نامه مخصوص برای توست...");
}

function typeText(text) {
    let i = 0;
    const target = document.getElementById('lines');
    function typing() {
        if (i < text.length) {
            target.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 100);
        }
    }
    typing();
}
