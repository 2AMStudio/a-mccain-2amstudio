// Add these iOS-specific enhancements at the top of your existing script
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

function enableIOSVideoPlayback() {
  if (!isIOS) return;
  
  const slideshow = document.querySelector('.hero-slideshow');
  slideshow.style.cursor = 'pointer';
  
  const playVideos = () => {
    document.querySelectorAll('.slide-video').forEach(video => {
      video.play().catch(e => console.log('iOS playback error:', e));
    });
    slideshow.style.cursor = '';
    slideshow.removeEventListener('click', playVideos);
  };
  
  slideshow.addEventListener('click', playVideos, { once: true });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  enableIOSVideoPlayback();
  
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const slideshow = document.getElementById('main-slideshow');
    const projectTitle = document.querySelector('.project-title');
    const projectDesc = document.querySelector('.project-description');
    
    // Video data
    const slides = [
        { 
            src: 'Group_8_Video.mp4', 
            title: 'Eco Urban Complex',
            description: 'Sustainable mixed-use development in downtown',
            poster: 'images/video-poster1.jpg'
        },
        { 
            src: 'Group_8_Video_1.mp4', 
            title: 'Modern Art Pavilion',
            description: 'Glass and steel structure with passive cooling',
            poster: 'images/video-poster2.jpg'
        },
        { 
            src: 'Sequence 01_3_3.mp4', 
            title: 'Design Process',
            description: 'Watch our creative workflow from concept to completion',
            poster: 'images/video-poster3.jpg'
        }
    ];
    
    // Create video elements
    slides.forEach((slide, index) => {
        const video = document.createElement('video');
        video.src = slide.src;
        video.poster = slide.poster;
        video.muted = true;
        video.loop = true;
        video.playsinline = true;
        video.classList.add('slide-video');
        
        if (index === 0) {
            video.classList.add('active');
            updateContent(slides[0]);
            video.autoplay = true;
        }
        
        slideshow.appendChild(video);
    });
    
    // Slideshow functionality
    let currentIndex = 0;
    const videos = document.querySelectorAll('.slide-video');
    let slideInterval;
    
    function updateContent(slide) {
        projectTitle.textContent = slide.title;
        projectDesc.textContent = slide.description;
    }
    
    function rotateSlides() {
        // Hide current video
        videos[currentIndex].classList.remove('active');
        videos[currentIndex].pause();
        
        // Show next video
        currentIndex = (currentIndex + 1) % videos.length;
        videos[currentIndex].classList.add('active');
        videos[currentIndex].currentTime = 0;
        videos[currentIndex].play().catch(e => console.log(e));
        updateContent(slides[currentIndex]);
    }
    
    // Start slideshow
    function startSlideshow() {
        slideInterval = setInterval(rotateSlides, 7000);
    }
    startSlideshow();
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        videos[currentIndex].pause();
    });
    
    slideshow.addEventListener('mouseleave', () => {
        videos[currentIndex].play();
        startSlideshow();
    });
});
