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
document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.querySelector('.slideshow');
    
    // Array of slides - can mix images and videos
    const slides = [
        { type: 'video', src: 'Group_8_Video.mp4', alt: 'Project Video' }, 
        { type: 'image', src: 'images/slideshow/image2.jpg', alt: 'Project 2' },
        { type: 'video', src: 'Sequence 01_3_3.mp4', alt: 'Project Video' }, // Your MP4 video
        { type: 'image', src: 'images/slideshow/image3.jpg', alt: 'Project 3' }
    ];
    
    // Create slide elements
    slides.forEach((slide, index) => {
        let mediaElement;
        
        if (slide.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = slide.src;
            mediaElement.alt = slide.alt;
            mediaElement.autoplay = true;
            mediaElement.muted = true;
            mediaElement.loop = true;
            mediaElement.playsinline = true;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = slide.src;
            mediaElement.alt = slide.alt;
        }
        
        if (index === 0) {
            mediaElement.classList.add('active');
            if (slide.type === 'video') mediaElement.play();
        }
        
        slideshow.appendChild(mediaElement);
    });
    
    // Auto-rotate slides every 7 seconds
    let currentIndex = 0;
    const mediaElements = slideshow.querySelectorAll('img, video');
    
    function rotateSlides() {
        // Pause current video if it exists
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].pause();
        }
        
        // Hide current slide
        mediaElements[currentIndex].classList.remove('active');
        
        // Move to next slide
        currentIndex = (currentIndex + 1) % mediaElements.length;
        
        // Show new slide
        mediaElements[currentIndex].classList.add('active');
        
        // Play video if it exists
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].currentTime = 0;
            mediaElements[currentIndex].play();
        }
    }
    
    // Start rotation
    let slideInterval = setInterval(rotateSlides, 7000);
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        // Also pause video if currently showing
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].pause();
        }
    });
    
    slideshow.addEventListener('mouseleave', () => {
        // Resume video if it's the current slide
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].play();
        }
        slideInterval = setInterval(rotateSlides, 7000);
    });
});
