document.addEventListener("DOMContentLoaded", () => {
  // Live Date & Time Update
  function updateDateTime() {
    const now = new Date();
    document.getElementById("liveDateTime").textContent = now.toLocaleString();
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // Vertical Timeline Scrolling
  const scrollUpBtn = document.getElementById("scrollUp");
  const scrollDownBtn = document.getElementById("scrollDown");
  const timeline = document.getElementById("timeline");

  if (scrollUpBtn && scrollDownBtn && timeline) {
    scrollUpBtn.addEventListener("click", () => {
      timeline.scrollBy({ top: -150, behavior: "smooth" });
    });

    scrollDownBtn.addEventListener("click", () => {
      timeline.scrollBy({ top: 150, behavior: "smooth" });
    });
  }
});
