document.addEventListener('DOMContentLoaded', function() {
  const slideshow = document.getElementById('main-slideshow');
  const projectTitle = document.querySelector('.project-title');
  const projectDesc = document.querySelector('.project-description');
  
  // Video data with absolute paths
  const slides = [
    { 
      src: 'Group_8_Video.mp4',
      title: 'CONSUL',
      description: 'A community driven urban planning device',
      poster: 'images/video-poster1.jpg'
    },
      { 
      src: 'Group_8_Video_1.mp4',
      title: 'Saline Threshold',
      description: 'Rainwater collection and ritual shared space',
      poster: 'images/video-poster1.jpg'
    },
    // ... other slides ...
  ];

  // Create video elements
  const videoElements = slides.map((slide, index) => {
    const video = document.createElement('video');
    video.src = slide.src;
    video.poster = slide.poster;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.classList.add('slide-video');
    video.load(); // Preload videos
    
    // Error handling
    video.addEventListener('error', () => {
      console.error(`Failed to load: ${slide.src}`);
    });
    
    slideshow.appendChild(video);
    return video;
  });

  // Slideshow state
  let currentIndex = 0;
  let slideInterval;
  
  function showSlide(index) {
    // Hide all videos
    videoElements.forEach(video => {
      video.classList.remove('active');
      video.pause();
    });
    
    // Show selected video
    videoElements[index].classList.add('active');
    videoElements[index].currentTime = 0;
    videoElements[index].play()
      .then(() => updateContent(slides[index]))
      .catch(e => console.log('Playback error:', e));
  }

  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % videoElements.length;
      showSlide(currentIndex);
    }, 7000);
  }

  // Initial setup
  showSlide(0);
  startSlideshow();
  
  // Pause on hover
  slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slideshow.addEventListener('mouseleave', startSlideshow);
});
