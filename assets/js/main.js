/**
* Template Name: DevFolio - v4.7.1
* Template URL: https://bootstrapmade.com/devfolio-bootstrap-portfolio-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Intro type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

})()

const nbObjects = 1000;
var conf, scene, camera, cameraCtrl, light, renderer;
var whw, whh;

var objects;
var cubeGeometry, cubeMaterial;
var destination = new THREE.Vector3();

var mouse = new THREE.Vector2();
var mouseOver = false;
var mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var mousePosition = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

function init() {
  conf = {
    move: true,
    followMouse: true,
    attraction: 0.03,
    velocityLimit: 1.2,
    lightColor: 0x1b6cff,
    lightIntensity: 1,
    shuffle: shuffle
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraCtrl = new THREE.OrbitControls(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  initScene();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  const gui = new dat.GUI();
  gui.add(conf, 'move');
  gui.add(conf, 'followMouse');
  gui.add(conf, 'attraction', 0.01, 0.1);
  gui.add(conf, 'velocityLimit', 0.1, 2);
  gui.addColor(conf, 'lightColor');
  gui.add(conf, 'lightIntensity', 0.1, 2);
  gui.add(conf, 'shuffle');
  gui.close();

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('mousemove', onMouseMove, false);
  // document.addEventListener('mouseover', function () { mouseOver = true; }, false);
  document.addEventListener('mouseout', onMouseOut, false);

  animate();
};

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.add(new THREE.AmbientLight(0x808080));

  var plight = new THREE.PointLight(0xffffff, 0.5, 1000);
  plight.position.set(0, 0, 0);
  scene.add(plight);

  light = new THREE.PointLight(conf.lightColor, conf.lightIntensity, 500);
  light.position.set(0, 0, 0);
  scene.add(light);

  camera.position.z = 150;

  cubeGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
  cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.9 });

  objects = [];
  for (var i = 0; i < nbObjects; i++) {
    var b = new Truc();
    objects.push(b);
    scene.add(b.o3d);
  }

  shuffle();
}

function animate() {
  requestAnimationFrame(animate);

  cameraCtrl.update();

  light.color.set(conf.lightColor);
  light.intensity = conf.lightIntensity;

  if (conf.move) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].move();
    }
  }

  renderer.render(scene, camera);

  stats.update();
};

function shuffle() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].shuffle();
  }
}

function Truc() {
  this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
  this.destination = destination;

  this.init();
}

Truc.prototype.init = function (bconf) {
  this.o3d = new THREE.Object3D();
  this.o3d.add(new THREE.Mesh(cubeGeometry, cubeMaterial));
};

Truc.prototype.move = function () {
  var destination;
  if (mouseOver && conf.followMouse) {
    destination = mousePosition;
  } else {
    destination = this.destination;
  }

  var dv = destination.clone().sub(this.o3d.position).normalize();
  this.velocity.x += conf.attraction * dv.x;
  this.velocity.y += conf.attraction * dv.y;
  this.velocity.z += conf.attraction * dv.z;
  this.limitVelocity();

  this.o3d.lookAt(this.o3d.position.clone().add(this.velocity));
  this.o3d.position.add(this.velocity);
};

Truc.prototype.limitVelocity = function (y) {
  this.velocity.x = limit(this.velocity.x, -conf.velocityLimit, conf.velocityLimit);
  this.velocity.y = limit(this.velocity.y, -conf.velocityLimit, conf.velocityLimit);
  this.velocity.z = limit(this.velocity.z, -conf.velocityLimit, conf.velocityLimit);
};

Truc.prototype.shuffle = function () {
  this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
  var p = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true)).normalize().multiplyScalar(100);
  this.o3d.position.set(p.x, p.y, p.z);
  var scale = rnd(0.4) + 0.1;
  this.o3d.scale.set(scale, scale, scale);
};

function limit(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function rnd(max, negative) {
  return negative ? Math.random() * 2 * max - max : Math.random() * max;
}

function onWindowResize() {
  whw = window.innerWidth / 2;
  whh = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  var v = new THREE.Vector3();
  camera.getWorldDirection(v);
  v.normalize();
  mousePlane.normal = v;

  mouseOver = true;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(mousePlane, mousePosition);

  light.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
}

function onMouseOut(event) {
  mouseOver = false;
  light.position.set(destination.x, destination.y, destination.z);
}

init();
