const envelope = document.getElementById('envelope');
const textElement = document.getElementById('text-content');
const audioOpen = new Audio('open-sound.mp3'); // فایل صدای خود را جایگزین کنید

const text = "سلام! این یک نامه جادویی است که به صورت تایپی نمایش داده می‌شود.";
let i = 0;

envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
        audioOpen.play();
        typeWriter();
    }
});

function typeWriter() {
    if (i < text.length) {
        textElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}
