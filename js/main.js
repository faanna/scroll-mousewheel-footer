// 한번씩 스크롤을 내릴때마다 조금씩 내려가는게 아닌 한 섹션단위로 스크롤이 되게하는방법

const sections = document.querySelectorAll('main section');
// 유사배열로 section을 배열의 형태로 변수에 담는것. 배열의 형태로 변경
const section_arr = Array.from(sections);

const lis = document.querySelectorAll('ul li');
// 유사배열 : 사용하는 매서드가 한정적임
const lis_arr = Array.from(lis);
// 진짜배열 : array.from 으로 완전한 배열로 변경가능

let ul = document.querySelector('ul');

let lastsection = sections[sections.length - 1];
let lastHeight = lastsection.offsetTop + lastsection.offsetHeight;
// console.log(lastHeight);  4600이라는 값이 나온다.

let posArr = null;

// 위든 아래든 호출을 한번 해야 console.log(posArr); 에서도 확인을 할 수 있다.
setPos();

//postionArray에 각 섹션의 offsetTop의 값을 넣을것입니다
function setPos() {
	posArr = [];
	// 브라우저의 크기들이 달라도 원래 배열값으로 동일하게
	// 스크롤 반응이 될수있게 함수가 호출될때마다 원래배열값을
	// 가지려고 추가된 배열값을 삭제하기 위해 초기화 작업을 해야함
	for (let el of sections) {
		posArr.push(el.offsetTop);
	}
	posArr.push(lastHeight);
}
// console.log(posArr); 로 확인해보면 [0, 1000, 2000, 2900]
// 이라는 값을 확인 할 수 있다.
//상단의 posArr.push(lastHeight); 가 추가되어서 [0, 1000, 2000, 2900]값에
// [0, 1000, 2000, 2900, 4600] 으로 4600이 추가되었다.

window.addEventListener('scroll', () => {
	let scroll =
		window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
	// pageYoffset은 올해나 내년쯤 사라질 코드, document.documentElement.scrollTop를
	// 사용하는 것을 많이 사용한다. 권장하는 방법은 window.scrollY

	sections.forEach((el, index) => {
		if (scroll >= posArr[index]) {
			for (let el of lis) {
				el.classList.remove('on');
			}
			lis[index].classList.add('on');

			for (let el of sections) {
				el.classList.remove('on');
			}
			sections[index].classList.add('on');
		}
	});
});

window.addEventListener('mousewheel', (e) => {
	let delta = e.deltaY;
	// +100 이나 -100 등의 값이 담겨 있을 것이다.
	let parent_item = lis_arr[0].parentNode;
	let active_lis = parent_item.querySelector('.on');
	// parent = 정확하게 부모에게서 찾겠다는 의미.
	let active_lis_index = lis_arr.indexOf(active_lis);
	// 활성화 되어 있는 인덱스를 찾기 위한
	let target; // 타겟이라는 변수를 만들어만 둠. 배열로. 값을 추적하기 위해서 posArr. 내가 이동 하고자 하는 pos 값을 찾는것이다.

	if (delta < 0) target = posArr[active_lis_index - 1];
	if (delta > 0) target = posArr[active_lis_index + 1];
	// 내가 이동하고자 하는 타겟의 pos 값을 찾고자 하는것이다.

	scrollAni(target, 500);
});

function scrollAni(target, duration) {
	let scroll =
		window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
	let startTime = performance.now();
	// 초기 페이지 로딩부터 함수가 실행되는 시간을 의미한다.

	/* 페이지가 로딩되고 함수가 실행되는 시간 사이의 필요없는 시간이 존재한다. 그 시간을 알기 위해서 조사를 한다.
  초기 로딩 , 함수 실행, 함수 종료 - 3단계  */
	function scrollStep(timestamp) {
		let currentTime = timestamp - startTime;
		let progress = Math.min(currentTime / duration, 1);
		// progress는 어떠한 단위가 되는것이다.
		// 얼만큼 이동할지. Math.min이라고 하는것은 미니멈을 계산해준다.
		//  두가지 인수를 받고 두가지 인수 중에 작은 값을 받는 것.
		let scrollPos = scroll + (target - scroll) * progress;
		//  2900에서 4600으로 이동을 하려고 한다.
		// 각각의 애니메이션을 보려면 서서히 움직여야 하는데

		window.scrollTo(0, scrollPos);
		if (currentTime < duration) {
			requestAnimationFrame(scrollStep);
			// 상단의 구문들이 반복 실행
		}
	}
	requestAnimationFrame(scrollStep);
	// 첫 실행
}
/*
function scrollStep(timestamp) {
  scrollStep 이라는 함수를 정의한다. 이 함수는 timestamp라는 매개변수를 받는다. scrollStep은 requestAnimationFrame 메서드의 콜백 함수로 사용되기를 의도한 것.
  
    let currentTime = timestamp - startTime;
    scrollStep 함수 내부에서 currentTime 변수를 계산. 
    startTime (아마도 시작 타임스탬프를 저장한 변수)에서 현재 timestamp를 뺌으로써 경과 시간을 계산. 
    이는 스크롤 애니메이션이 시작한 후 경과한 시간을 의미.

    let progress = Math.min(currentTime / duration, 1);
    progress 변수는 currentTime를 duration으로 나눈 값과 1 사이의 작은 값으로 계산. 
    이는 스크롤 애니메이션의 진행 상황을 0에서 1 사이의 비율로 표현하며, 애니메이션의 진행 정도를 나타낸다.

    let scrollPos = scroll + (target - scroll) * progress;
    scrollPos 변수는 progress 값에 따라 scroll과 target 값을 보간하여 계산된다. 
    이는 애니메이션의 진행 상황에 따라 현재의 스크롤 위치를 나타내는 것.
    애니메이션 진행률을 기반으로 보간된 스크롤 위치를 계산하는 것.
    ** 보간 : 보간법은 주어진 수열 또는 비율에 따라 알려진 두 값 사이의 값을 추정하는 데 사용되는 수학적 기술이다.
    초기 scroll 값을 사용하고 target 값과 scroll 값 사이의 차이를 진행 비율로 조정하여 추가

    기본적으로 이 계산은 애니메이션의 진행률('progress')을 기준으로 초기 스크롤 위치('scroll')와 대상 스크롤 위치('target') 사이를 보간한다. 
    애니메이션이 0에서 1로 진행됨에 따라 스크롤 위치가 초기 위치에서 대상 위치로 부드럽게 전환


    window.scrollTo(0, scrollPos);
    계산된 scrollPos 값을 사용하여 창의 수직 스크롤 위치를 변경한다.

    if (currentTime < duration) {
      requestAnimationFrame(scrollStep);
    }
    currentTime이 지정된 duration보다 작은지 확인. 그렇다면 스크롤 애니메이션이 아직 완료되지 않은 상태입니다. 
    그 경우에는 requestAnimationFrame(scrollStep)을 호출하여 다음 프레임의 애니메이션을 예약합니다. 
    이렇게 함으로써 지정된 기간에 도달할 때까지 반복되는 루프가 생성된다.
  }
  requestAnimationFrame(scrollStep);
  마지막으로, scrollStep 함수 바깥에서 초기에 requestAnimationFrame(scrollStep)을 호출하여 스크롤 애니메이션을 시작한다.

}
전체적으로 이 코드는 지정된 기간 동안 스무스한 스크롤 애니메이션을 구현하는 것. 
시작 scroll 값을 목표 target 값으로부터 진행 정도에 따라 서서히 변경하여 창의 수직 스크롤 위치를 조정한다.






스크롤이 스무스하게 내려가는 각 단계를 progress라는 걸로 담아서 사용을 한다. 1단계는 얼만큼 내려오고, 2단계 얼만큼 내려오고를 계산해 준다.
현재 자기의 위치를 알아야 더 내려가거나 올라갈 곳이 있는지를 계산해야 하기 때문이다. 
계속 내려가면 안된다. 주어진 시간 만큼  */

// window.addEventListener(
//   "mousewheel",
//   (e) => {
//     /* 우리는 마우스 휠을 한번 내리면 그 내린만큼의 스크롤을 이동하려는 목적이 아닌, 휠 한번에 section의 한 index를 이동 시킬 이벤트를 만들것이다.
//   따라서 마우스 휠이라는 이벤트가 가지고 있는 프리이벤트를 정지후 사용 해야한다. */
//     e.preventDefault();

//     // 1. 현재 버튼으로 활성화 되어 있는 index를 구별하는 코드
//     let acticeLi = ul.querySelector("li.on");
//     // 중간에 ul이 다른게 있다면 변수로 담아 준 뒤 사용할 것 우리는 ul li를 한번밖에 사용하지 않아서 변수로 담지 않고 사용할 수 있다.
//     let acticeLi_index = lis_arr.indexOf(acticeLi);
//     //몇번째 인덱스에 있는지 찾으려면 배열로 만들어주어야 한다.

//     // 2. 버튼이 아닌 section의 on class로 index를 구별하는 코드
//     let activeS = document.querySelector("section.on");
//     let activeS_index = sections_arr.indexOf(activeS);

//     /* 위에서 추적한 index를 사용해서 마우스 휠을 올렸다면 인덱스에 -1을 해서 하단의 moveScroll 함수를 호출하면 이동할 수 있다. 그렇다면 마우스 휠을 올렸는지 내렸는지를 추적해야한다.
//     mousewheel 이벤트 객체 - deltaY라는 것만 알면 된다. deltaX, Z */

//     if (e.deltaY < 0) {
//       //-100
//       console.log("마우스 휠을 올렸습니다.");
//       if (acticeLi_index == 0) return;
//       moveScroll(acticeLi_index - 1);
//     } else {
//       //100
//       console.log("마우스 휠을 내렸습니다.");
//       if (acticeLi_index == 3) return;
//       moveScroll(acticeLi_index + 1);
//     }
//   },
//   { passive: false }
// );

/* 이벤트 리스너의 옵션 객체에는 몇가지 속성이 있다. 
capture : 이벤트 캡쳐의 여부를 나타내는 boolean 속성이다. 기본값은 false
once : 이벤트 핸들러를 한번만 실핸할지의 여부를 나타내는 boolean 속성이다. 기본값은 false이다.
passive : false 이벤트 핸들러가 기본동작을 방지하는지의 여부를 나타내는 boolean값의 속성이다. 만약 true면 e.preventDefault();를 호출해도 기본동작이 방지되지 않는다.
 */
// el.addEventListener("click", () => {}, {});

lis.forEach((el, index) => {
	el.addEventListener('click', () => {
		/* 해당 인덱스로 이동을 시키는 코드 
    위에서 확인했던 console.log(posArr); 의 값인 [0, 1000, 2000, 2900]은 각 섹션의 스크롤 값이기 때문에 lis를 클릭 할 경우 각각의 값으로 이동이 가능하다.*/
		moveScroll(index);
	});
});

//함수로 해당 인덱스를 이동시키는 함수
function moveScroll(index) {
	window.scrollTo({ top: posArr[index], behavior: 'smooth' });
	/* scrollTo = 해당 방향으로 보내주겟다는 뜻, 스크롤 이라는 것은 브라우저 top : 0 에서 얼마만큼 내려온다는 뜻이므로 bottom은 사용하지 않는다. 
  behavior: "smooth" = 어떻게 보낼것인가? 스무스하게 보내줘라아 */
}
