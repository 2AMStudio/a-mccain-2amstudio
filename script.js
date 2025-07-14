document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.querySelector('.slideshow');
    const captionTitle = document.querySelector('.caption-title');
    const captionDescription = document.querySelector('.caption-description');
    
    // Array of slides with captions
    const slides = [
        { 
            type: 'video', 
            src: 'Group_8_Video.mp4', 
            alt: 'Project 1',
            title: 'Eco Urban Complex',
            description: 'Sustainable mixed-use development in downtown'
        },
        { 
            type: 'video', 
            src: 'Group_8_Video_1.mp4', 
            alt: 'Project 2',
            title: 'Modern Art Pavilion',
            description: 'Glass and steel structure with passive cooling'
        },
        { 
            type: 'video', 
            src: 'Sequence 01_3_3.mp4', 
            alt: 'Project Video',
            title: 'Design Process',
            description: 'Watch our creative workflow from concept to completion',
            poster: 'images/video-poster.jpg'
        },
        { 
            type: 'image', 
            src: 'images/slideshow/image3.jpg', 
            alt: 'Project 3',
            title: 'Riverside Residence',
            description: 'Flood-resistant home with panoramic views'
        }
    ];
    
    // Create slide elements
    slides.forEach((slide, index) => {
        let mediaElement;
        
        if (slide.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = slide.src;
            mediaElement.alt = slide.alt;
            mediaElement.muted = true;
            mediaElement.playsinline = true;
            mediaElement.loop = true;
            if (slide.poster) {
                mediaElement.poster = slide.poster;
            }
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = slide.src;
            mediaElement.alt = slide.alt;
        }
        
        if (index === 0) {
            mediaElement.classList.add('active');
            updateCaption(slides[0]);
            if (slide.type === 'video') {
                mediaElement.autoplay = true;
                mediaElement.play().catch(e => console.log('Autoplay prevented:', e));
            }
        }
        
        slideshow.appendChild(mediaElement);
    });
    
    // Auto-rotate slides every 7 seconds
    let currentIndex = 0;
    const mediaElements = slideshow.querySelectorAll('img, video');
    let slideInterval;
    
    function updateCaption(slide) {
        captionTitle.textContent = slide.title;
        captionDescription.textContent = slide.description;
    }
    
    function rotateSlides() {
        // Pause current video if it exists
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].pause();
        }
        
        // Hide current slide
        mediaElements[currentIndex].classList.remove('active');
        
        // Move to next slide
        currentIndex = (currentIndex + 1) % mediaElements.length;
        
        // Show new slide and update caption
        mediaElements[currentIndex].classList.add('active');
        updateCaption(slides[currentIndex]);
        
        // Handle video autoplay
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            const video = mediaElements[currentIndex];
            video.currentTime = 0;
            video.play().catch(e => console.log('Video play prevented:', e));
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
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].pause();
        }
    });
    
    slideshow.addEventListener('mouseleave', () => {
        if (mediaElements[currentIndex].tagName === 'VIDEO') {
            mediaElements[currentIndex].play().catch(e => console.log('Video resume prevented:', e));
        }
        startSlideshow();
    });
});
