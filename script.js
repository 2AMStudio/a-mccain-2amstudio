document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.querySelector('.slideshow');
    const captionTitle = document.querySelector('.caption-title');
    const captionDescription = document.querySelector('.caption-description');
    
    // Array of video slides with captions
    const slides = [
        { 
            type: 'video', 
            src: 'Group_8_Video.mp4', 
            alt: 'Project 1',
            title: 'Eco Urban Complex',
            description: 'Sustainable mixed-use development in downtown',
            poster: 'images/video-poster1.jpg'
        },
        { 
            type: 'video', 
            src: 'Group_8_Video_1.mp4', 
            alt: 'Project 2',
            title: 'Modern Art Pavilion',
            description: 'Glass and steel structure with passive cooling',
            poster: 'images/video-poster2.jpg'
        },
        { 
            type: 'video', 
            src: 'Sequence 01_3_3.mp4', 
            alt: 'Project Video',
            title: 'Design Process',
            description: 'Watch our creative workflow from concept to completion',
            poster: 'images/video-poster3.jpg'
        }
    ];
    
    // Create video elements
    slides.forEach((slide, index) => {
        const videoElement = document.createElement('video');
        videoElement.src = slide.src;
        videoElement.alt = slide.alt;
        videoElement.muted = true;
        videoElement.playsinline = true;
        videoElement.loop = true;
        videoElement.poster = slide.poster;
        videoElement.classList.add('video-slide');
        
        if (index === 0) {
            videoElement.classList.add('active');
            updateCaption(slides[0]);
            // Attempt autoplay for first video
            videoElement.autoplay = true;
            const playPromise = videoElement.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented:', error);
                    // Fallback: Show play button or handle error
                });
            }
        }
        
        slideshow.appendChild(videoElement);
    });
    
    // Auto-rotate videos every 7 seconds
    let currentIndex = 0;
    const videoElements = slideshow.querySelectorAll('.video-slide');
    let slideInterval;
    
    function updateCaption(slide) {
        captionTitle.textContent = slide.title;
        captionDescription.textContent = slide.description;
    }
    
    function rotateSlides() {
        // Pause current video
        videoElements[currentIndex].pause();
        videoElements[currentIndex].classList.remove('active');
        
        // Move to next video
        currentIndex = (currentIndex + 1) % videoElements.length;
        
        // Show new video and update caption
        videoElements[currentIndex].classList.add('active');
        updateCaption(slides[currentIndex]);
        
        // Play new video
        videoElements[currentIndex].currentTime = 0;
        const playPromise = videoElements[currentIndex].play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video play prevented:', error);
            });
        }
    }
    
    function startSlideshow() {
        slideInterval = setInterval(rotateSlides, 7000);
    }
    
    // Start rotation
    startSlideshow();
    
    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        videoElements[currentIndex].pause();
    });
    
    slideshow.addEventListener('mouseleave', () => {
        const playPromise = videoElements[currentIndex].play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video resume prevented:', error);
            });
        }
        startSlideshow();
    });
    
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const playPromise = videoElements[currentIndex].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Tab visibility change prevented play:', error);
                });
            }
        } else {
            videoElements[currentIndex].pause();
        }
    });
});
