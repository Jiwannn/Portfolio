// WebGL Background Animation
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 1000;

const posArray = new Float32Array(particleCount * 3);
for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x3498db,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create moving geometric objects
const movingObjects = [];
const objectCount = 8;

for (let i = 0; i < objectCount; i++) {
    createMovingObject();
}

function createMovingObject() {
    const geometryTypes = ['cube', 'sphere', 'octahedron', 'tetrahedron'];
    const type = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
    
    let geometry;
    switch(type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(0.15, 8, 6);
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(0.2);
            break;
        case 'tetrahedron':
            geometry = new THREE.TetrahedronGeometry(0.2);
            break;
    }
    
    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random starting position
    mesh.position.x = (Math.random() - 0.5) * 15;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 8;
    
    // Random movement speed and direction
    mesh.velocity = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03
    };
    
    // Random rotation speed
    mesh.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    };
    
    scene.add(mesh);
    movingObjects.push(mesh);
}

// Create shooting stars
const shootingStars = [];
const shootingStarCount = 12; // Increased from 5 to 12

for (let i = 0; i < shootingStarCount; i++) {
    createShootingStar();
}

function createShootingStar() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 40; // Increased trail length
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.1, // Slightly larger
        color: 0xffff00,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending
    });
    
    const star = new THREE.Points(starGeometry, starMaterial);
    
    // Random starting position
    star.position.x = (Math.random() - 0.5) * 20;
    star.position.y = (Math.random() - 0.5) * 20;
    star.position.z = 0;
    
    // Random velocity (faster)
    star.velocity = {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3
    };
    
    // Random trail length
    star.trailLength = Math.random() * 0.5 + 0.5;
    
    scene.add(star);
    shootingStars.push(star);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;
    
    // Update moving objects
    movingObjects.forEach((object) => {
        // Move object
        object.position.x += object.velocity.x;
        object.position.y += object.velocity.y;
        object.position.z += object.velocity.z;
        
        // Rotate object
        object.rotation.x += object.rotationSpeed.x;
        object.rotation.y += object.rotationSpeed.y;
        object.rotation.z += object.rotationSpeed.z;
        
        // Bounce off boundaries
        if (Math.abs(object.position.x) > 8) object.velocity.x *= -1;
        if (Math.abs(object.position.y) > 6) object.velocity.y *= -1;
        if (Math.abs(object.position.z) > 4) object.velocity.z *= -1;
    });
    
    // Update shooting stars
    shootingStars.forEach((star, index) => {
        // Move star
        star.position.x += star.velocity.x;
        star.position.y += star.velocity.y;
        
        // Create trail effect
        const positions = star.geometry.attributes.position.array;
        for (let i = positions.length - 3; i >= 3; i -= 3) {
            positions[i] = positions[i - 3];
            positions[i + 1] = positions[i - 2];
            positions[i + 2] = positions[i - 1];
        }
        
        // Reset star if it goes off screen
        if (Math.abs(star.position.x) > 15 || Math.abs(star.position.y) > 15) {
            star.position.x = (Math.random() - 0.5) * 20;
            star.position.y = (Math.random() - 0.5) * 20;
            star.velocity.x = (Math.random() - 0.5) * 0.3;
            star.velocity.y = (Math.random() - 0.5) * 0.3;
            
            // Clear trail
            for (let i = 0; i < positions.length; i++) {
                positions[i] = 0;
            }
        }
        
        star.geometry.attributes.position.needsUpdate = true;
    });
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scrolling for anchor links
// Only prevent default if the target exists
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // If no target, let default behavior happen
    });
});

// Typewriter effect for introduction
window.addEventListener('DOMContentLoaded', () => {
    const text = 'Welcome to my portfolio!';
    const el = document.getElementById('typewriter-text');
    let i = 0;
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(type, 55);
        }
    }
    type();
    
    // Typewriter effect for subtitle - same as main typewriter
    const subtitleText = 'Creating innovative digital experiences with modern technologies';
    const subtitleEl = document.getElementById('subtitle-typewriter');
    console.log('Subtitle element found:', subtitleEl); // Debug log
    
    if (subtitleEl) {
        let j = 0;
        function typeSubtitle() {
            if (j <= subtitleText.length) {
                subtitleEl.textContent = subtitleText.slice(0, j);
                console.log('Typing subtitle:', subtitleText.slice(0, j)); // Debug log
                j++;
                setTimeout(typeSubtitle, 55); // Same speed as main typewriter
            }
        }
        // Start subtitle typewriter immediately
        typeSubtitle();
    } else {
        console.log('Subtitle element not found!'); // Debug log
    }
    
    // Typewriter effect for about page
    const aboutText = 'About Me';
    const aboutEl = document.getElementById('about-typewriter-text');
    if (aboutEl) {
        let k = 0;
        function typeAbout() {
            if (k <= aboutText.length) {
                aboutEl.textContent = aboutText.slice(0, k);
                k++;
                setTimeout(typeAbout, 55);
            }
        }
        typeAbout();
    }
    
    // Typewriter effect for intro-sub (about page)
    const introSubText = 'Explore my work, skills, and commissions below.';
    const introSubEl = document.getElementById('intro-sub-typewriter');
    if (introSubEl) {
        // Calculate when main typewriter finishes (22 characters * 55ms = ~1210ms)
        const mainTypewriterDuration = 22 * 55; // "Welcome to my Portfolio" length * delay
        
        let l = 0;
        function typeIntroSub() {
            if (l <= introSubText.length) {
                introSubEl.textContent = introSubText.slice(0, l);
                l++;
                setTimeout(typeIntroSub, 55);
            }
        }
        // Start intro-sub typewriter after main typewriter finishes
        setTimeout(typeIntroSub, mainTypewriterDuration + 200); // +200ms pause
    }
});

// Changing text effect for landing page - run after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const changingTextEl = document.getElementById('changing-text');
    console.log('Changing text element:', changingTextEl); // Debug log
    
    if (changingTextEl && !changingTextEl.dataset.initialized) {
        changingTextEl.dataset.initialized = 'true';
        
        const texts = ['Web Developer', 'Software Developer'];
        let currentIndex = 0;
        
        // Set initial text to the first item
        changingTextEl.textContent = texts[0];
        
        function fadeText() {
            console.log('Fading text, current index:', currentIndex); // Debug log
            
            // Fade out
            changingTextEl.style.opacity = '0';
            changingTextEl.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Change text
                changingTextEl.textContent = texts[currentIndex];
                console.log('Changed text to:', texts[currentIndex]); // Debug log
                
                // Fade in
                changingTextEl.style.opacity = '1';
                changingTextEl.style.transform = 'translateY(0)';
                
                // Move to next text
                currentIndex = (currentIndex + 1) % texts.length;
                
                // Schedule next fade after 2 seconds (1 second visible + 1 second pause)
                setTimeout(fadeText, 2000);
            }, 300); // Wait 300ms for fade out to complete
        }
        
        // Start the fade cycle after 3 seconds to ensure page is fully loaded
        setTimeout(fadeText, 3000);
    } else {
        console.log('Changing text element not found or already initialized!'); // Debug log
    }
});

// Fade-in section on scroll
const fadeSections = document.querySelectorAll('.fade-in-section');
const fadeInOnScroll = () => {
    fadeSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            sec.classList.add('visible');
        }
    });
};
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('DOMContentLoaded', fadeInOnScroll);

// Back to Top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        formMessage.textContent = '';
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formMessage.style.color = '#00ff99';
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Sorry, there was an error. Please try again or email me directly at jarnelalngog9@gmail.com';
            formMessage.style.color = '#ff003c';
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Dropdown functionality
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const button = dropdown.previousElementSibling;
    const hobbyCategory = dropdown.closest('.hobby-category');
    
    // Close all other dropdowns
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    const allButtons = document.querySelectorAll('.dropdown-btn');
    const allHobbyCategories = document.querySelectorAll('.hobby-category');
    
    allDropdowns.forEach(d => {
        if (d.id !== dropdownId) {
            d.classList.remove('show');
        }
    });
    
    allButtons.forEach(b => {
        if (b !== button) {
            b.classList.remove('active');
        }
    });
    
    allHobbyCategories.forEach(category => {
        category.classList.remove('has-active-dropdown');
    });
    
    // Toggle current dropdown
    const isOpen = dropdown.classList.contains('show');
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
    
    // Add/remove active class to parent category
    if (!isOpen) {
        hobbyCategory.classList.add('has-active-dropdown');
    } else {
        hobbyCategory.classList.remove('has-active-dropdown');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const buttons = document.querySelectorAll('.dropdown-btn');
    const hobbyCategories = document.querySelectorAll('.hobby-category');
    
    let clickedInside = false;
    
    dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
            clickedInside = true;
        }
    });
    
    buttons.forEach(button => {
        if (button.contains(event.target)) {
            clickedInside = true;
        }
    });
    
    if (!clickedInside) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        
        hobbyCategories.forEach(category => {
            category.classList.remove('has-active-dropdown');
        });
    }
});

// Video player functionality
function playVideo(videoId, videoTitle) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('videoModalTitle');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Set modal title
    modalTitle.textContent = videoTitle;
    
    // Set video source (you can customize these paths)
    const videoSources = {
        'video1': 'path/to/video1.mp4',
        'video2': 'path/to/video2.mp4',
        'video3': 'path/to/video3.mp4',
        'lyrics1': 'path/to/lyrics1.mp4',
        'lyrics2': 'path/to/lyrics2.mp4',
        'lyrics3': 'path/to/lyrics3.mp4',
        'lyrics4': 'path/to/lyrics4.mp4',
        'lyrics5': 'path/to/lyrics5.mp4'
    };
    
    const videoSource = videoSources[videoId] || 'path/to/default.mp4';
    videoPlayer.src = videoSource;
    
    // Show modal
    modal.classList.add('show');
    
    // Close dropdown
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const buttons = document.querySelectorAll('.dropdown-btn');
    const hobbyCategories = document.querySelectorAll('.hobby-category');
    
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    hobbyCategories.forEach(category => {
        category.classList.remove('has-active-dropdown');
    });
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Pause video
    videoPlayer.pause();
    videoPlayer.src = '';
    
    // Hide modal
    modal.classList.remove('show');
}

// Lyrics display functionality
function showLyrics(songId, songTitle) {
    const modal = document.getElementById('lyricsModal');
    const modalTitle = document.getElementById('lyricsModalTitle');
    const lyricsContent = document.getElementById('lyricsTextContent');
    
    // Set modal title
    modalTitle.textContent = songTitle;
    
    // Set lyrics content (you can customize these)
    const lyricsData = {
        'song1': `[Verse 1]
I'm the shadow in the night, the one you can't see,
Your silent guard, your armor, endlessly.

[Hook]
Call me your armor, your light in the dark,
I'll fight your battles, I'll leave my mark.

[Verse 2]
I'm the stranger in the crowd, the hand you can't place,
The one who's always there, but leaves no trace.
When the world gets heavy, and you feel alone,
I'm the force that lifts you, though I'm unknown.

[Chorus]
Call me your armor, your light in the night,
I'll fight your battles, I'll make it right.
I'm the shadow, the force, the unseen flame,
The one who's always there, though I've got no name.

[Bridge]
I'm the ghost in the haze, the spark in the dark,
The one who's always there to leave my mark.
You'll never know me, but I'll always stay,
Your silent guardian, come what may.

[Break]
I'm the shadow, the shield, the unseen might,
The one who fights for you in the night.
No need to know, no need to see,
I'll always be your armor, endlessly.

[Outro]
I'm your shadow, your armor, your silent fight,
Always watching, always there, every night.
Call me your armor, your light in the dark,
I'll fight your battles, I'll leave my mark.`,
        
        'song2': `[Intro]
Opening lyrics...
Setting the mood

[Verse 1]
First verse content...
Telling the story

[Pre-Chorus]
Building up...
Getting ready for chorus

[Chorus]
Main chorus...
The hook of the song

[Verse 2]
Second verse...
More story development

[Outro]
Ending lyrics...
Closing thoughts`,
        
        'song3': `[Verse 1]
Your third song lyrics...
Creative content here

[Chorus]
Memorable chorus...
Catchy hook

[Verse 2]
More verses...
Continuing the narrative

[Final Chorus]
Ending strong...
Powerful finish`
    };
    
    const lyrics = lyricsData[songId] || 'Lyrics coming soon...';
    lyricsContent.textContent = lyrics;
    
    // Show modal
    modal.classList.add('show');
    
    // Close dropdown
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const buttons = document.querySelectorAll('.dropdown-btn');
    const hobbyCategories = document.querySelectorAll('.hobby-category');
    
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    hobbyCategories.forEach(category => {
        category.classList.remove('has-active-dropdown');
    });
}

function closeLyricsModal() {
    const modal = document.getElementById('lyricsModal');
    modal.classList.remove('show');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const videoModal = document.getElementById('videoModal');
    const lyricsModal = document.getElementById('lyricsModal');
    
    if (event.target === videoModal) {
        closeVideoModal();
    }
    
    if (event.target === lyricsModal) {
        closeLyricsModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVideoModal();
        closeLyricsModal();
    }
});

// Image Modal functionality
function openImageModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalTitle');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = imageTitle;
    
    modal.classList.add('show');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close image modal when clicking outside
document.addEventListener('click', function(event) {
    const imageModal = document.getElementById('imageModal');
    if (event.target === imageModal) {
        closeImageModal();
    }
});

// Close image modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});

// Page transition fade effect
window.addEventListener('DOMContentLoaded', function() {
    const fade = document.querySelector('.page-fade');
    if (fade) {
        fade.classList.remove('fade-out');
        fade.classList.add('fade-in');
        setTimeout(() => {
            fade.style.display = 'none';
        }, 700);
    }

    // Intercept all internal links for fade-out
    document.body.addEventListener('click', function(e) {
        const fade = document.querySelector('.page-fade');
        if (!fade) return;
        let link = e.target;
        // Traverse up to find <a>
        while (link && link.tagName !== 'A') link = link.parentElement;
        if (link && link.tagName === 'A' && link.href && link.target !== '_blank' && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
            const isInternal = link.hostname === window.location.hostname;
            if (isInternal) {
                e.preventDefault();
                fade.style.display = '';
                fade.classList.remove('fade-in');
                fade.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            }
        }
    }, true);
});
