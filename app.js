// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initMarquee();
  initMouseGlow();
  initGSAPAnimations();
  initMobileMenu();
  initCleanUrls();
  initIpBasedColorTheme();
});

/* ==========================================
   PARTICLES BACKGROUND SYSTEM (HTML5 CANVAS)
   ========================================== */
function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  let numberOfParticles = window.innerWidth < 768 ? 25 : 70;

  // Set Canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  window.addEventListener("resize", () => {
    setCanvasSize();
    numberOfParticles = window.innerWidth < 768 ? 25 : 70;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      // Nothing Tech monochrome + red accent particle palette
      const colors = [
        "rgba(255, 255, 255, 0.25)",
        "rgba(255, 255, 255, 0.15)",
        "rgba(255, 255, 255, 0.2)",
        "rgba(255, 0, 60, 0.45)" // Iconic red dot particle!
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce on boundary
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Create particles
  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  createParticles();

  // Draw lines connecting nearby particles
  function connectParticles() {
    let maxDistance = 110;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Opacity fades out the further apart they are
          let opacity = 1 - (distance / maxDistance);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.06})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================
   SCROLLING TEXT TICKER (MARQUEE)
   ========================================== */
function initMarquee() {
  const marqueeContents = document.querySelectorAll(".marquee-content");
  if (!marqueeContents.length) return;

  // Linear auto-scrolling tween
  let marqueeTween = gsap.to(".marquee-content", {
    xPercent: -100,
    repeat: -1,
    duration: 25,
    ease: "none"
  });

  // Dynamic acceleration based on scrolling velocity
  ScrollTrigger.create({
    trigger: ".marquee-container",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      let scrollVelocity = self.getVelocity(); // gets current velocity in px/sec
      let speedMultiplier = 1 + Math.abs(scrollVelocity) * 0.003;
      
      // Accelerate ticker dynamically
      gsap.to(marqueeTween, {
        timeScale: speedMultiplier,
        duration: 0.4,
        overwrite: "auto"
      });
      
      // Gradually ease back down to base speed (timeScale = 1)
      gsap.to(marqueeTween, {
        timeScale: 1,
        duration: 1.2,
        delay: 0.4,
        overwrite: "auto"
      });
    }
  });
}

/* ==========================================
   AMBIENT GLOW SYSTEM
   ========================================== */
function initMouseGlow() {
  const glow = document.getElementById("mouse-glow");
  if (!glow) return;

  window.addEventListener("mousemove", (e) => {
    glow.style.opacity = "1";
    glow.style.left = e.clientX + window.scrollX + "px";
    glow.style.top = e.clientY + window.scrollY + "px";
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}


/* ==========================================
   GSAP & SCROLLTRIGGER EFFECTS
   ========================================== */
function initGSAPAnimations() {
  // --- HERO ENTRANCE STAGGER ---
  const heroTL = gsap.timeline();
  
  heroTL.from(".title-line", {
    yPercent: 100,
    duration: 1,
    stagger: 0.15,
    ease: "power4.out"
  })
  .from(".hero-desc", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .from(".hero-btns .btn", {
    scale: 0.9,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
    ease: "back.out(1.5)"
  }, "-=0.5")
  .from("header", {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.8")
  .from(".de-1, .de-2, .de-3", {
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: "elastic.out(1, 0.6)"
  }, "-=0.6");

  // --- FLOATING HERO MESH PARALLAX ---
  window.addEventListener("mousemove", (e) => {
    const speedElements = document.querySelectorAll(".de-wrapper");
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    speedElements.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed")) || 1;
      const xPos = mouseX * 45 * speed;
      const yPos = mouseY * 45 * speed;
      gsap.to(el, {
        x: xPos,
        y: yPos,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  });

  // --- ABOUT REVEAL ---
  gsap.from(".about-info > *", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 75%",
      toggleActions: "play none none none"
    },
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out"
  });

  gsap.from(".about-visual-card", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 75%",
      toggleActions: "play none none none"
    },
    scale: 0.85,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.2)"
  });

  // --- SKILLS GRID SCRUB SLIDE IN FROM LEFT & RIGHT DISABLED (Static & Visible) ---

  // --- SERVICES GRID STAGGER ---
  gsap.from(".service-card", {
    scrollTrigger: {
      trigger: "#services",
      start: "top 75%",
      toggleActions: "play none none none"
    },
    y: 40,
    opacity: 0,
    stagger: 0.08,
    duration: 0.7,
    ease: "power2.out"
  });

  // --- STATISTICS COUNTER INCREMENT ---
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"), 10) || 0;
    
    gsap.to(stat, {
      textContent: target,
      duration: 2.2,
      ease: "power3.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      onUpdate: function () {
        // Append '+' if it represents Projects, Hours or Clients
        if (target > 8) {
          stat.textContent = Math.ceil(this.targets()[0].textContent) + "+";
        }
      }
    });
  });

  // --- HEADER LINK INTERACTIVE ACTIVE STATES ---
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let currentSection = "";
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 250)) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}



/* ==========================================
   MOBILE TOGGLE MENU
   ========================================== */
function initMobileMenu() {
  const toggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!toggle || !navMenu) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    
    // Toggle mobile overlay menu drawer
    if (toggle.classList.contains("active")) {
      navMenu.style.display = "block";
      gsap.fromTo(navMenu, {
        opacity: 0,
        y: -15
      }, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out"
      });
    } else {
      gsap.to(navMenu, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          navMenu.style.display = "";
        }
      });
    }
  });

  // Close when nav links clicked
  const links = navMenu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        toggle.classList.remove("active");
        navMenu.style.display = "";
      }
    });
  });

  // Handle resizing viewport when mobile nav toggle is open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.style.display = "";
      toggle.classList.remove("active");
    }
  });
}

/* ==========================================
   CLEAN URLs (Prevent Hash Append)
   ========================================== */
function initCleanUrls() {
  const anchorLinks = document.querySelectorAll("a[href^='#']");
  anchorLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: "smooth"
          });
        }
      }
      // Replace the state to clean the URL without refreshing
      history.replaceState(null, null, window.location.pathname);
    });
  });
}

/* ==========================================
   IP BASED COLOR THEME (WITH FALLBACK)
   ========================================== */
async function initIpBasedColorTheme() {
  let ip = "";
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data.ip;
  } catch (err) {
    console.warn("IP fetch blocked, using local fallback fingerpint.");
    // Fallback to local storage persistent ID if fetch is blocked
    ip = localStorage.getItem("theme_fingerprint");
    if (!ip) {
      ip = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("theme_fingerprint", ip);
    }
  }

  // Simple hash function for IP
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ip.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate colors based on hash
  const rootStyle = document.documentElement.style;
  
  // Use bitwise AND to get valid RGB values from the hash
  const r1 = Math.abs((hash & 0xFF0000) >> 16);
  const g1 = Math.abs((hash & 0x00FF00) >> 8);
  const b1 = Math.abs(hash & 0x0000FF);
  
  // Generate related colors for gradients
  const r2 = (r1 + 100) % 255;
  const g2 = (g1 + 50) % 255;
  const b2 = (b1 + 150) % 255;

  const r3 = (r1 + 200) % 255;
  const g3 = (g1 + 150) % 255;
  const b3 = (b1 + 50) % 255;

  const rgb1 = `rgb(${r1}, ${g1}, ${b1})`;
  const rgb2 = `rgb(${r2}, ${g2}, ${b2})`;
  const rgb3 = `rgb(${r3}, ${g3}, ${b3})`;

  // Apply colors to CSS variables
  rootStyle.setProperty("--accent-red", rgb1);
  rootStyle.setProperty("--accent-white", rgb2);
  rootStyle.setProperty("--glass-border", `rgba(${r1}, ${g1}, ${b1}, 0.3)`);
  rootStyle.setProperty("--glass-border-glow", `rgba(${r1}, ${g1}, ${b1}, 0.5)`);
  
  rootStyle.setProperty("--grad-cyan-blue", `linear-gradient(135deg, ${rgb1} 0%, ${rgb2} 100%)`);
  rootStyle.setProperty("--grad-purple-cyan", `linear-gradient(135deg, ${rgb2} 0%, ${rgb3} 100%)`);
  rootStyle.setProperty("--grad-full", `linear-gradient(135deg, ${rgb1} 0%, ${rgb2} 50%, ${rgb3} 100%)`);
  
  console.log("Personalized theme applied based on identifier: " + ip);
}
