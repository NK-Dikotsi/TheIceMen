// index.js
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic text changing for events
    const eventTypes = [
        "EVENTS",
        "MONATE",
        "GROOVE",
        "BRAAI",
        "WEDDINGS",
        "FUNCTIONS",
        "FESTIVALS",
        "NOMA-YINI",
        "ICE MEN GOT YOU"
    ];
    
    let currentIndex = 0;
    const changingText = document.getElementById('changingText');
    const questionMark = document.querySelector('.question-mark');
    
    function changeText() {
        changingText.style.opacity = 0;
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % eventTypes.length;
            changingText.textContent = eventTypes[currentIndex];
            
            if (eventTypes[currentIndex] === "ICE MEN GOT YOU") {
                questionMark.style.display = 'none';
            } else {
                questionMark.style.display = 'inline-block';
            }
            
            changingText.style.opacity = 1;
            
            if (eventTypes[currentIndex] === "ICE MEN GOT YOU") {
                setTimeout(() => {
                    currentIndex = -1;
                }, 2000);
            }
        }, 500);
    }
    
    setInterval(changeText, 2000);
    changingText.textContent = eventTypes[0];

    // Step hover effects
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.querySelector('.step-content').style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            this.querySelector('.step-content').style.borderTopWidth = '6px';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.querySelector('.step-content').style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            this.querySelector('.step-content').style.borderTopWidth = '4px';
        });
        
        step.addEventListener('touchstart', function() {
            this.classList.add('hover-effect');
        });
        
        step.addEventListener('touchend', function() {
            this.classList.remove('hover-effect');
        });
    });

    // Interactive How To Order Section
    const orderSection = document.querySelector('.how-to-order');
    const orderSteps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Initial positions
    const stepPositions = [
        { x: 0, y: 0, opacity: 1 },    // Step 1
        { x: 100, y: 50, opacity: 0 }, // Step 2
        { x: -100, y: 50, opacity: 0 }, // Step 3
        { x: 0, y: 100, opacity: 0 }   // Step 4
    ];
    
    // Apply initial positions
    orderSteps.forEach((step, index) => {
        step.style.transform = `translate(${stepPositions[index].x}px, ${stepPositions[index].y}px)`;
        stepContents[index].style.opacity = stepPositions[index].opacity;
    });
    
    // Scroll animation setup
    let currentStep = 0;
    const totalSteps = orderSteps.length;
    const stepHeight = window.innerHeight * 0.8;
    let isAnimating = false;
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        const sectionTop = orderSection.getBoundingClientRect().top;
        const sectionBottom = orderSection.getBoundingClientRect().bottom;
        
        // Only animate when section is in view
        if (sectionTop < window.innerHeight && sectionBottom > 0) {
            const scrollProgress = Math.min(1, Math.max(0, (window.innerHeight - sectionTop) / stepHeight));
            animateSteps(scrollProgress);
        }
    });
    
    // Animation function
    function animateSteps(progress) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Determine current step based on scroll progress
        const newStep = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
        
        if (newStep !== currentStep) {
            currentStep = newStep;
            updateStepPositions();
        }
        
        isAnimating = false;
    }
    
    // Update step positions based on current step
    function updateStepPositions() {
        // Define positions for each state
        const positions = [
            // Step 1 focused
            [
                { x: 0, y: 0, opacity: 1 },    // Step 1
                { x: 100, y: 50, opacity: 0 }, // Step 2
                { x: -100, y: 50, opacity: 0 }, // Step 3
                { x: 0, y: 100, opacity: 0 }   // Step 4
            ],
            // Step 2 focused
            [
                { x: -100, y: 0, opacity: 0 }, // Step 1
                { x: 0, y: 0, opacity: 1 },    // Step 2
                { x: 100, y: 50, opacity: 0 }, // Step 3
                { x: 0, y: 100, opacity: 0 }   // Step 4
            ],
            // Step 3 focused
            [
                { x: 0, y: -50, opacity: 0 },  // Step 1
                { x: -100, y: 0, opacity: 0 }, // Step 2
                { x: 0, y: 0, opacity: 1 },    // Step 3
                { x: 100, y: 50, opacity: 0 }  // Step 4
            ],
            // Step 4 focused
            [
                { x: 0, y: -100, opacity: 0 }, // Step 1
                { x: 0, y: -50, opacity: 0 },  // Step 2
                { x: -100, y: 0, opacity: 0 }, // Step 3
                { x: 0, y: 0, opacity: 1 }     // Step 4
            ]
        ];
        
        // Animate to new positions
        orderSteps.forEach((step, index) => {
            const newPos = positions[currentStep][index];
            step.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            step.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
            stepContents[index].style.transition = 'opacity 0.5s ease';
            stepContents[index].style.opacity = newPos.opacity;
        });
    }

    // Testimonials Carousel
    const track = document.getElementById('testimonialsTrack');
    if (track) {
        let isDragging = false;
        let startX;
        let scrollLeft;
        let animationId;
        let isScrolling = false;
        let autoScrollSpeed = 1;
        let direction = -1;
        
        function duplicateTestimonials() {
            const testimonials = track.querySelectorAll('.testimonial-card');
            testimonials.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
        }
        
        function startAutoScroll() {
            if (isScrolling) return;
            isScrolling = true;
            
            function animate() {
                if (!isDragging && isScrolling) {
                    track.scrollLeft += autoScrollSpeed * direction;
                    
                    if (track.scrollLeft >= (track.scrollWidth - track.clientWidth)) {
                        track.scrollLeft = 0;
                    }
                    else if (track.scrollLeft <= 0 && direction === 1) {
                        track.scrollLeft = track.scrollWidth - track.clientWidth;
                    }
                    
                    animationId = requestAnimationFrame(animate);
                }
            }
            
            animate();
        }
        
        function stopAutoScroll() {
            isScrolling = false;
            cancelAnimationFrame(animationId);
        }
        
        function resumeAutoScroll() {
            if (!isDragging) {
                setTimeout(startAutoScroll, 2000);
            }
        }
        
        // Mouse events
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            stopAutoScroll();
            track.style.cursor = 'grabbing';
        });
        
        track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                track.style.cursor = 'grab';
                resumeAutoScroll();
            }
        });
        
        track.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                track.style.cursor = 'grab';
                resumeAutoScroll();
            }
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            stopAutoScroll();
            track.style.cursor = 'grabbing';
        });
        
        track.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                track.style.cursor = 'grab';
                resumeAutoScroll();
            }
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
        
        track.addEventListener('mouseenter', stopAutoScroll);
        track.addEventListener('mouseleave', () => {
            if (!isDragging) {
                resumeAutoScroll();
            }
        });
        
        duplicateTestimonials();
        startAutoScroll();
        
        function adjustSpeed() {
            autoScrollSpeed = track.clientWidth / 500;
        }
        
        window.addEventListener('resize', adjustSpeed);
        adjustSpeed();
    }

    // Video autoplay for mobile
    const video = document.querySelector('.video-background video');
    if (video) {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', 'muted');
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video autoplay prevented:', error);
                video.muted = true;
                video.play().catch(e => console.log('Fallback play failed:', e));
            });
        }
    }
});