// Enter Website Logic
function enterWebsite() {
    const overlay = document.getElementById('enter-overlay');
    const audio = document.getElementById('bg-music');
    
    // Play audio
    audio.play().catch(e => console.log("Audio play blocked by browser"));
    
    // Hide overlay with animation
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.visibility = 'hidden';
    }, 1000);
}

// Particles.js Config
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.1, random: false },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.05, width: 1 },
        move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
    },
    retina_detect: true
});

// Reviews Logic
let currentRating = 0;
const stars = document.querySelectorAll('#rating-stars i');
const API_URL = window.location.origin.replace('5000', '5001') + '/api/reviews';

async function fetchReviews() {
    try {
        const response = await fetch(API_URL);
        const reviews = await response.json();
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => renderReview(review));
    } catch (err) {
        console.error('Error fetching reviews:', err);
    }
}

function renderReview(review) {
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card reveal-bottom active';
    
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="fas fa-star" style="color: ${i <= review.rating ? '#ffd700' : '#444'}"></i>`;
    }

    let imageHtml = review.image ? `<img src="${review.image}" class="review-image">` : '';

    reviewCard.innerHTML = `
        <div class="review-header">
            <span class="review-name">${review.name}</span>
            <div class="review-rating">${starsHtml}</div>
        </div>
        <p class="review-text">${review.text}</p>
        ${imageHtml}
    `;

    reviewsContainer.appendChild(reviewCard);
}

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = star.getAttribute('data-rating');
        stars.forEach(s => {
            if (s.getAttribute('data-rating') <= currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

async function submitReview() {
    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;
    const imageInput = document.getElementById('review-image');
    
    if (!name || !text || currentRating === 0) {
        alert("Harap isi nama, ulasan, dan rating!");
        return;
    }

    let imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageInput.files[0]);
        });
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rating: currentRating, text, image: imageData })
        });
        
        if (response.ok) {
            fetchReviews();
            // Reset form
            document.getElementById('review-name').value = '';
            document.getElementById('review-text').value = '';
            document.getElementById('review-image').value = '';
            currentRating = 0;
            stars.forEach(s => s.classList.remove('active'));
        }
    } catch (err) {
        console.error('Error submitting review:', err);
    }
}

window.addEventListener('load', fetchReviews);

// Obfuscator Music Integration
window.addEventListener('load', () => {
    if (window.location.pathname.includes('obfuscator.html')) {
        const audio = new Audio('lagu2.mp3');
        audio.loop = true;
        const playMusic = () => {
            audio.play().catch(e => console.log("Audio play blocked"));
            window.removeEventListener('click', playMusic);
        };
        window.addEventListener('click', playMusic);
    }
});

// Scroll Reveal
function reveal() {
    var reveals = document.querySelectorAll(".reveal-bottom, .reveal-left");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// Birthday Countdown
function updateCountdown() {
    const today = new Date();
    const birthMonth = 9; // Oct
    const birthDay = 8;
    
    let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diff = nextBirthday - today;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const countdownEl = document.getElementById('birthday-countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `${days}D ${hours}H`;
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();