// Live Date/Time
function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    });
    document.getElementById('liveDateTime').textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Horizontal Scroll Controls
const timeline = document.getElementById('timeline');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

let scrollAmount = 0;
const scrollStep = 320;

scrollLeftBtn.addEventListener('click', () => {
    scrollAmount -= scrollStep;
    if (scrollAmount < 0) scrollAmount = 0;
    timeline.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});

scrollRightBtn.addEventListener('click', () => {
    scrollAmount += scrollStep;
    if (scrollAmount > timeline.scrollWidth) scrollAmount = timeline.scrollWidth;
    timeline.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});
