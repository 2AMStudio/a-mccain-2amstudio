document.addEventListener("DOMContentLoaded", () => {
    // Live Date & Time
    function updateDateTime() {
        const now = new Date();
        document.getElementById("liveDateTime").textContent = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Timeline scrolling
    const scrollLeftBtn = document.getElementById("scrollLeft");
    const scrollRightBtn = document.getElementById("scrollRight");
    const timeline = document.getElementById("timeline");

    if (scrollLeftBtn && scrollRightBtn && timeline) {
        scrollLeftBtn.addEventListener("click", () => {
            timeline.scrollBy({ left: -300, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            timeline.scrollBy({ left: 300, behavior: "smooth" });
        });
    }
});

