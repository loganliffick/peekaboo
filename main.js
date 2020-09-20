const stdBezier = 'cubicBezier(.63,0,.43,1)';

let tl;

loopText = (target, target2) => {
	width = () => {
		anime({
			targets: target2,
			easing: stdBezier,
			loop: true,
			direction: 'alternate',
			duration: 1500,
			fontWeight: [200,700],
			letterSpacing: ['1.5vw', '2vw']
		});
	};
	anime({
		targets: target,
		duration: 800,
		opacity: [0,1],
		easing: stdBezier,
		endDelay: 250,
		complete: width
	});
}

window.onload = () => {
	// initial sizing
	size();

	let duration = 3000;

	tl = anime.timeline ({
		easing: stdBezier,
	});

	tl
	.add({
		targets: '.loadImgContainer',
		duration: 1500,
		opacity: [0,1],
		complete: loopText('#loadText', '#loadTextWidth')
	})
	.add({
		targets: '.load',
		duration: duration,
		delay: 4000,
		translateX: ['0','-100vw'],
		complete: overflowEnable
	})
	.add({
		targets: '#scrollWrap, .eyeContainer, .counter, .infoButtonContainer',
		duration: duration,
		translateX: ['100vw','0'],
		complete: () => {
			// killing unneeded animations
			anime.remove('.loadImgContainer, .load, #scrollWrap, .eyeContainer, .counter, .infoButtonContainer, #loadText, #loadTextWidth');
		}
	}, '-='+duration);
	console.log('loaded');

}

overflowEnable = () => {
	document.querySelector('body').classList.remove('overflow'),
	document.querySelector('.load').style.display = 'none';
	console.log('overflow enabled');
}

const page = document.getElementById('scrollWrap');
let lastPane = page.getElementsByClassName('main');
lastPane = lastPane[lastPane.length - 1];
let dummyX = null;

window.onscroll = () => {
	// horizontal scroll
	let y = document.body.getBoundingClientRect().top;
	page.scrollLeft = -y;

	// console.log(this.oldScroll > this.scrollY);
	// this.oldScroll = this.scrollY;

	// looping scroll
	let diff = window.scrollY - dummyX;
	if (diff > 0) {
		window.scrollTo(0, diff);
		//console.log('reset, right');
	} else if (window.scrollY == 0) {
		window.scrollTo(0, dummyX);
		//console.log('reset, left');
	}
}

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// reset window-based variables
size = () => {
	let w = page.scrollWidth - window.innerWidth + window.innerHeight;
	document.body.style.height = w + 'px';
	dummyX = lastPane.getBoundingClientRect().left + window.scrollY;
	// keeps infinite scroll after resize
	window.scrollTo(0, 1);
	// refreshes waypoint trigger locations for new browser width
	Waypoint.refreshAll();
	windowWidth = window.innerWidth;
	WindowHeight = window.innerHeight;
}

// adjust the body height if the window resizes
window.onresize = size;
// redundancy. prevents looping from breaking if page is reloaded
size();

// init popup animation direction
let direction = 'normal';

document.querySelector('.infoButton').onclick = () => {
	const popup = document.querySelector('.popup');

	popupContainer = anime.timeline({
		easing: stdBezier,
		duration: 350,
		direction: direction
	});
	popupContainer.add({
		targets: '#info',
		translateY: [0, -15],
		opacity: [1, 0],
		// decides container visibility and icon animation play-state
		complete: () => {
			if (direction === 'normal') {
				popup.style.display = 'block';
				direction = 'reverse';
				sliderAnimation.play();
				mouseAnimation.play();
				pencilAnimation.play();
			} else {
				popup.style.display = 'none';
				direction = 'normal';
				sliderAnimation.pause();
				mouseAnimation.pause();
				pencilAnimation.pause();
			}
		},
	}).add({
		targets: '#close',
		translateY: [15, 0],
		opacity: [0, 1],
	}).add({
		targets: '.popup',
		translateY: [0, -20],
		opacity: [0, 1],
	}, '-=400');
}

const mouseAnimation = anime({
	targets: '#iconOneClickWheel',
	opacity: [
		{ value: [0,1], duration: 800, endDelay: 200 },
		{ value: [1,0], duration: 800 }
	],
	translateY: [
		{ value: '350%', duration: 800 }
	],
	easing: stdBezier,
	loop: true,
	autoplay: false
});

sliderAnimation = anime.timeline({
	easing: stdBezier,
	loop: true,
	autoplay: false
});
sliderAnimation.add({
	targets: '#handle',
	translateX: [
		{ value: '-100%', duration: 400, endDelay: 300 },
		{ value: '120%', duration: 600, endDelay: 400 },
		{ value: '0', duration: 400, endDelay: 300 }
	],
}).add({
	targets: '#handleTwo',
	translateX: [
		{ value: '120%', duration: 400, endDelay: 300 },
		{ value: '-60', duration: 600, endDelay: 300 },
		{ value: '0', duration: 500, endDelay: 300 }
	]
}, '-=2000');

const pencilAnimation = anime({
	targets: '#iconThreePencil',
	opacity: [
		{ value: [0,1], duration: 500, endDelay: 800 },
		{ value: [1,0], duration: 500 }
	],
	translateX: [
		{ value: '-200%', duration: 1, endDelay: 400 },
		{ value: '75%', duration: 500 },
	],
	translateY: [
		{ value: '15%', duration: 1, endDelay: 400 },
		{ value: '-50%', duration: 500 },
	],
	rotate: {
		value: -45, duration: 1
	},
	delay: 400,
	easing: stdBezier,
	loop: true,
	autoplay: false
});

// total number of sections
const sectionCount = document.querySelector('.sectionCount');
// which section is currently in view
const trueCount = document.querySelector('.trueCount');
trueCount.innerHTML = 1;
const sections = document.querySelectorAll('.container');
let i;

// updateCountAnimation = () => {
// 	testpenis = anime({
// 		targets: '.trueCount',
// 		opacity: [0,1],
// 		duration: 500,
// 		easing: stdBezier
// 	});
// }

for (i = 0; i < sections.length; i++) {
	sections[i].id = i + 1;
	const waypoint = new Waypoint({
		element: sections[i],
		handler: function(direction) {
			//updateCountAnimation();

			if (direction == 'right') {
				//console.log('right');
				// conditional to mask the scrollTo transition
				if (waypoint.element.id == sections.length - 1) {
					trueCount.innerHTML = 1;
				} else {
					trueCount.innerHTML = parseFloat(waypoint.element.id) + 1;
				}
			} else {
				//console.log('left');
				trueCount.innerHTML = (waypoint.element.id);
			}
			//console.log(waypoint.element.id);
		},
		context: document.getElementById('scrollWrap'),
		horizontal: true
	})
}
sectionCount.innerHTML = '/' + (i - 1);

const pupil = document.getElementById('pupil');

// eye cursor follow
document.addEventListener('mousemove', event => {
	posX = event.clientX;
	posY = event.clientY;
	pupil.style.transform = 'translate('+posX*0.06+'%, '+posY*0.06+'%)';
});

eyeBlinkAnimation = (delay, loop, key1, key2, br) => {
	blink = anime({
		targets: '#eye',
		keyframes: [
			{height: key1},
			{height: key2}
		],
		borderRadius: br,
		duration: 250,
		delay: delay,
		easing: stdBezier,
		loop: loop
	});
};

eyeBlinkAnimation(4000, true, '2px', '26px', '100%');

const cursorStalker = document.querySelector('body');
let timer;

cursorStalker.addEventListener('mouseleave', () => {
	timer = setTimeout(() => {
		document.querySelector('.timeout').style.display = 'grid';
		document.title = 'We miss you...';
		timeoutAnimation();
		loopText('#timeoutText', '#timeoutTextWidth');
	}, 4000);
	// ease pupil back to center
	pupil.style.transition = 'all 0.3s ease';
	pupil.style.transform = 'translate(0,0)';
});

const timeoutText = document.querySelector('#timeoutTextWidth');

cursorStalker.addEventListener('mouseenter', () => {
	clearTimeout(timer);
	document.querySelector('.timeout').style.display = 'none';
	// pupil does not follow cursor well with transition value applied
	pupil.style.transition = 'none';
	// resetting text style in case of multiple timeouts
	timeoutText.style.fontWeight = 200;
	timeoutText.style.letterSpacing = '1.5vw';
	// blink upon cursor re-entry to mask pupil movement with cursor
	eyeBlinkAnimation(0, false, '2px', '26px', '100%');
	document.title = 'Peekaboo I See You';
	// killing unneeded animations
	anime.remove('#timeoutText, #timeoutTextWidth, .timeoutImgContainer');
});

timeoutAnimation = () => {
	anime({
		targets: '.timeoutImgContainer',
		translateX: function() {
		return anime.random( - ((windowWidth/2) - (windowWidth/8)), ((windowWidth/2) - (windowWidth/8)) );
		},
		translateY: function() {
		return anime.random( - ((windowHeight/2) - (windowHeight/8)), ((windowHeight/2) - (windowHeight/8)) );
		},
		easing: stdBezier,
		duration: 2000,
		complete: timeoutAnimation
	});
}

const eyeContainer = document.querySelector('.eyeContainer');
const eye = document.getElementById('eye');

// stops and starts the initial animation
eyeContainer.onmouseenter = blink.pause;
eyeContainer.onmouseleave = blink.play;

eyeContainer.addEventListener('mouseenter', () => {
	eyeBlinkAnimation(0, false, '2px', '2px', '100%');
});

eyeContainer.addEventListener('mouseleave', () => {
	eye.style.height = '26px';
	eye.style.transition = 'all 0.1s ease';

	// restore eye transition value after transition is complete
	setTimeout(() => {
		eye.style.transition = 'none';
	}, 1000);
});

const loaderSVG = document.getElementById('loader');

loaderSVG.addEventListener('load', () => {
	// get the inner DOM of alpha.svg
	let svgDoc = loaderSVG.contentDocument;
	// get the inner element by id
	let layerSelect = svgDoc.getElementById('t0');
	const strokeColor = ['3051FF', '8830FF', 'FF3030', 'FF9E30', '00D0B8'];
	// chooses color from array
	const randomizer = strokeColor[Math.floor(Math.random() * strokeColor.length)];

	layerSelect.style.stroke = '#' + randomizer;
});

const a = document.getElementById('looomsvg');
const slider = document.getElementById('myRange');

a.addEventListener('load', () => {
	// get the inner DOM of alpha.svg
	let svgDoc = a.contentDocument;
	// get the inner element by id
	let layerSelect = svgDoc.getElementById('t3');
	let layerSelectTwo = svgDoc.getElementById('t2');
	// update the current slider value
	slider.oninput = function() {
		layerSelect.style.strokeWidth = this.value;
		layerSelectTwo.style.strokeWidth = this.value;
		console.log(this.value);
	}
});