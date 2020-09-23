const stdBezier = 'cubicBezier(.63,0,.43,1)';

let tl;

loopText = (target) => {
	// width = () => {
	// 	anime({
	// 		targets: target2,
	// 		easing: stdBezier,
	// 		loop: false,
	// 		direction: 'alternate',
	// 		duration: 1800,
	// 		//delay: 1000,
	// 		letterSpacing: ['1vw', '1.5vw']
	// 	});
	// };
	anime({
		targets: target,
		duration: 2500,
		opacity: [0,1],
		easing: stdBezier
		//begin: width
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
		complete: loopText('#loadText')
	})
	.add({
		targets: '.load',
		duration: duration,
		delay: 2000,
		translateX: ['0','-100vw'],
		complete: overflowEnable
	})
	.add({
		targets: '#scrollWrap, .eyeContainer, .counter, .infoButtonContainer',
		duration: duration,
		translateX: ['100vw','0'],
		complete: () => {
			// killing unneeded animations
			anime.remove('.loadImgContainer, .load, #loadText, #scrollWrap, .eyeContainer, .counter, .infoButtonContainer');
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

for (i = 0; i < sections.length; i++) {
	sections[i].id = i + 1;
	const waypoint = new Waypoint({
		element: sections[i],
		handler: function(direction) {

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
		document.querySelector("link[rel='shortcut icon']").href = "/icons/favicon-timeout.png";
		timeoutAnimation();
	}, 15000);
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
	// blink upon cursor re-entry to mask pupil movement with cursor
	eyeBlinkAnimation(0, false, '2px', '26px', '100%');
	document.title = 'Peekaboo I See You';
	document.querySelector("link[rel='shortcut icon']").href = "/icons/favicon.png";
	// killing unneeded animations
	anime.remove('.timeoutImgContainer');
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
	const svgDoc = loaderSVG.contentDocument;
	// get the inner element by id
	const layerSelect = svgDoc.getElementById('t0');
	const strokeColor = ['3051FF', '8830FF', 'FF3030', 'FF9E30', '00D0B8'];
	// chooses color from array
	const randomizer = strokeColor[Math.floor(Math.random() * strokeColor.length)];

	layerSelect.style.stroke = '#' + randomizer;
});

const svgOne = document.getElementById('svgOne');

svgOne.addEventListener('load', () => {
	const slider = document.getElementById('rangeOne');
	// get the inner DOM of alpha.svg
	const svgDoc = svgOne.contentDocument;
	// get the inner element by id
	const squares = svgDoc.getElementById('t2');
	const lines = svgDoc.getElementById('t3');

	// update the current slider value
	slider.oninput = function() {
		squares.style.strokeWidth = this.value;
		lines.style.strokeWidth = this.value;
		console.log(this.value);
	}
});

// copy of first SVG to mask transition
const svgFinal = document.getElementById('svgFinal');

svgFinal.addEventListener('load', () => {
	const slider = document.getElementById('rangeFinal');
	// get the inner DOM of alpha.svg
	const svgDoc = svgFinal.contentDocument;
	// get the inner element by id
	const squares = svgDoc.getElementById('t2');
	const lines = svgDoc.getElementById('t3');

	// update the current slider value
	slider.oninput = function() {
		squares.style.strokeWidth = this.value;
		lines.style.strokeWidth = this.value;
		console.log(this.value);
	}
});

const svgTwo = document.getElementById('svgTwo');

svgTwo.addEventListener('load', () => {
	const slider = document.getElementById('rangeTwo');
	// get the inner DOM of alpha.svg
	const svgDoc = svgTwo.contentDocument;
	// get the inner elements by id
	const walkBack = svgDoc.getElementById('t0');
	const walkFront = svgDoc.getElementById('t1');
	const runBack = svgDoc.getElementById('t2');
	const runFront = svgDoc.getElementById('t3');

	// update the current slider value
	slider.oninput = function() {
		walkBack.style.strokeOpacity = 1 - this.value;
		walkFront.style.strokeOpacity = 1 - this.value;
		runBack.style.strokeOpacity = this.value;
		runFront.style.strokeOpacity = this.value;
	}
});

const svgThree = document.getElementById('svgThree');

svgThree.addEventListener('load', () => {
	const slider = document.getElementById('rangeThree');
	// get the inner DOM of alpha.svg
	const svgDoc = svgThree.contentDocument;
	// get the inner elements by id
	const shadow = svgDoc.getElementById('t0');
	const main = svgDoc.getElementById('t1');
	const flash = svgDoc.getElementById('t2');
	const background = svgDoc.querySelector('svg');

	// update the current slider value
	slider.oninput = function() {
		let colorNbr = [];
		for (i = 0; i < 255; i++) {
			colorNbr.push(i);
		};
		let colorSelect = [];
		for (i = 0; i < 3; i++) {
			randomizer = colorNbr[Math.floor(Math.random() * colorNbr.length)];
			colorSelect.push(randomizer);
		};

		main.style.fill = 'rgb(' + colorSelect[0] + ',' + colorSelect[1] + ',' + colorSelect[2] + ')';
		shadow.style.fill = 'rgb(' + colorSelect[1] + ',50, 250)';
		flash.style.stroke = 'rgb(' + colorSelect[2] + ',' + colorSelect[0] + ',' + this.value + ')';
		background.style.backgroundColor = 'rgb(75,' + this.value + ',255)';
	}
});

const svgFour = document.getElementById('svgFour');

svgFour.addEventListener('load', () => {
	const slider = document.getElementById('rangeFour');
	// get the inner DOM of alpha.svg
	const svgDoc = svgFour.contentDocument;
	// get the inner elements by id
	const blueJellies = svgDoc.getElementById('t2');
	const yellowSnakes = svgDoc.getElementById('t3');
	const neonRectangles = svgDoc.getElementById('t4');

	// update the current slider value
	slider.oninput = function() {
		blueJellies.style.strokeOpacity = this.value;
		yellowSnakes.style.strokeOpacity = this.value;
		neonRectangles.style.fillOpacity = this.value;
	}
});