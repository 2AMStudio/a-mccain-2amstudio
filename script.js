// Live Date & Time
function updateDateTime() {
    const now = new Date();
    document.getElementById("liveDateTime").textContent =
        now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Timeline scrolling
document.getElementById("scrollLeft").addEventListener("click", () => {
    document.getElementById("timeline").scrollBy({ left: -300, behavior: "smooth" });
});

document.getElementById("scrollRight").addEventListener("click", () => {
    document.getElementById("timeline").scrollBy({ left: 300, behavior: "smooth" });
});
