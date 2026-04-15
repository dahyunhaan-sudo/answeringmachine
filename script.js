const textEl = document.getElementById("text");
const leftPanel = document.querySelector(".left");
const beep = document.getElementById("beepSound"); // 🔥 소리 추가

const introText = `안녕하세요, 한다현의 FAQ 자동응답기입니다...

1번은 발레, 2번은 채식, 전공 관련 문의는 3번
다시 들으시려면 0번을 눌러주세요...`;

let isTyping = false;
let currentKey = null;
let index = 0;

// 🔥 원래 네가 썼던 내용 FULL 복원
const sequences = {
  "1": [
    "발레에 관하여 . . .\n\n한다현의 발레에 대한 광기는 2017년 2월, 동네의 구민종합체육센터에서 시작되었다.",
    "대학교 2학년 무료했던 한다현은 “발레스트레칭”이라는 이름을 보고 무작정 등록하게 된다.\n마룻바닥, 가운데에 기둥이 있는 작은 공간에서 발레에 대해 배우게 된 한다현은 감탄한다.",
    "클래식 음악이 흘러나오고 굳어있는 몸을 풀어주는 발레에 흥미가 생긴 그는 2023년까지 체육센터에서 발레를 배운다.",
    "2022년 10월 즈음부터 성수에 있는 발레 학원에 다니다가 2025년 현재의 학원을 찾아 정착하였다.\n그의 경력은 햇수로만 따지면 10년이 다 되어가지만… 그는 배우면 배울수록 부족하다고 생각한다.",
    "처음으로 돌아가시려면 *(별표)를 눌러주세요."
  ],

  "2": [
    "채식에 관하여 . . . \n학교의 봉사 활동을 통해 미국의 한 한인입양아 가정에서 홈스테이를 하게 된 한다현은 우연히 페스코 채식을 하는 가정에서 머물게 된다.",
    "그들이 채식을 하게 된 이유 등을 들으면서 당시 한국에서는 다소 익숙하지 않던 개념을 배우게 된다.",
    "그리고 집으로 돌아온 그는 채식에 관한 내용을 검색해보기도 하고, 당시 키우던 햄스터를 돌보며 느낀 동물에 대한 애정으로 페스코 채식을 결심하게 된다.",
    "현재는 그 때의 사명감(?)은 많이 퇴색되었으나, 습관이 되어 고기를 먹지 않고 있다. (그리고 사실 한다현이 하는 채식은 엄밀히 이야기하면 페스코 채식이라기보다 비덩주의에 가깝다.)",
    "*(별표)를 누르면 처음으로 돌아갑니다."
  ],

  "3": [
    "복수 전공에 대하여 . . .  \n한다현이 왜 복수 전공을 결심하게 되었는지에 대해서는 그렇게 흥미진진한 이야기가 있지는 않다.",
    "학창 시절 새 학기 교과서를 받아오면 국어책의 작품들부터 미리 싹 못 참고 읽었던 그는 국어라는 과목을 정말 좋아했다. (그러나 직업적인 목표는 없었다.)",
    "그렇게 모든 수시를 국어국문학과로 썼던 한다현은 국문학도가 되었다. 대학교 2학년이 되자 심화전공을 할 지 복수 전공을 할 지 택해야했다.",
    "그는 재밌게 들은 교양 수업과 전공 수업에 대해서 떠올려보았다. 세 가지의 후보를 추릴 수 있었다.",
    "첫 번째 후보는 법학과. [영화와 법] 그리고 [여성과 법] 이라는 수업에서 우수한 성적을 받았던 그는",
    "‘어쩌면 . . . 법학과가 나에게 맞지 않을까?’ 라고 가볍게 생각했다. 그러나, 전공이 되면 괴로울 것을 알았기 때문에 후보에서 제외하게 된다.",
    "두 번째는 국어국문학과 연계전공인 스토리텔링 학과였다. 합평 시간이 매번 너무나 긴장되었던 나머지 그에게는 맞지 않는 듯 하였다.",
    "(또한, 교수님은 ‘어떤 누군가는 이 글을 보고 잘 쓴다고 할 수도 있겠지만, 글에 포장이 잘 되어있을 뿐 알맹이가 없다.’와 같은 평을 하여 그의 사기를 꺾었다. - 하지만 맞는 말이라고 그는 생각했다.)",
    "마지막은 시각디자인학과의 여성과 미술사에 관한 수업이었다.",
    "수업 자체는 그다지 흥미가 없었으나, 그는 나혜석의 삶과 미술, 그가 남긴 작품들에 대한 이야기에 대해 흥미롭게 들었다고 전해진다.",
    "사실 그가 시각디자인학과를 선택하게 된 계기는 수업이 아니다. 그는 사진을 찍는 것을 좋아하며, 아름다운 것을 좋아한 것으로 전해진다.",
    "그런 그를 알던 주변 친구들은 그에게 도전해보라고 응원하였으니,\n그것이 그가 아무것도 모르는 채로 시각디자인학과를 복수전공하게 된 진짜 계기라고 할 수 있겠다.",
    "*(별표)를 누르면 처음으로 돌아갑니다."
  ]
};

// 🔊 소리
function playBeep() {
  beep.currentTime = 0;
  beep.play();
}

// ⌨️ 타이핑
function typeText(text) {
  textEl.textContent = "";
  let i = 0;
  isTyping = true;

  function typing() {
    if (i < text.length) {
      textEl.textContent += text[i];
      i++;
      setTimeout(typing, 35);
    } else {
      isTyping = false;
    }
  }

  typing();
}

// 시작
function startSequence(key) {
  currentKey = key;
  index = 0;
  typeText(sequences[key][index]);
}

// 다음
function nextSequence() {
  if (isTyping || !currentKey) return;
  index++;
  if (index < sequences[currentKey].length) {
    typeText(sequences[currentKey][index]);
  }
}

// 리셋
function reset() {
  currentKey = null;
  index = 0;
  leftPanel.classList.remove("ballet", "vegan", "major");
  typeText(introText);
}

// 버튼 이벤트
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {

    playBeep(); // 🔥 소리

    if (isTyping) return;

    const num = btn.dataset.num;

    if (num === "1") {
      leftPanel.className = "left ballet";
      startSequence(num);

    } else if (num === "2") {
      leftPanel.className = "left vegan";
      startSequence(num);

    } else if (num === "3") {
      leftPanel.className = "left major";
      startSequence(num);

    } else if (num === "->") {
      nextSequence();

    } else if (num === "*" || num === "0") {
      reset();
    }
  });
});

// 처음 실행
window.onload = () => {
  typeText(introText);
};