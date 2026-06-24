<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import MyButton from "../../components/button/MyButton.vue";

const intro = reactive({
  eyebrow: "일반 사용자부터 공인중개사까지, 누구나 쉽고 안전하게.",
  body: "원하는 집을 한눈에 살펴보고\n마음에 드는 매물을 한 곳에서 관리하세요.\n복잡한 부동산 탐색을 더 쉽고 투명하게,\nJIPDA가 당신의 다음 주거공간을 찾는 방식을 바꿔드립니다.",
});

// 찜 많은 매물 탑3 데이터 받아오면 될듯
const mostLikeProperties = ref([
  {
    title: "강남역 신축 오피스텔",
    subtitle: "월세 1000/70 | 서울시 강남구",
    badge: "1등",
    layout: "property-card--wide",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "채광 좋은 남향 투룸",
    subtitle: "전세 2억 | 서울시 송파구",
    badge: "2등",
    layout: "property-card--small",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "풀옵션 리모델링 원룸",
    subtitle: "월세 500/50 | 서울시 관악구",
    badge: "3등",
    layout: "property-card--small",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
  },
]);

const redirectProperties = () => {
  r;
};

const benefitCards = ref([
  {
    number: "01",
    title: "조건별 매물 탐색",
    description:
      "지역, 거래 유형, 가격, 옵션을 기준으로 원하는 매물을 빠르게 찾아보세요.",
  },
  {
    number: "02",
    title: "관심 매물 관리",
    description:
      "마음에 드는 매물을 모아두고 가격, 위치, 조건을 차분히 비교하세요.",
  },
  {
    number: "03",
    title: "직접 매물 등록",
    description:
      "회원이라면 누구나 사진과 옵션을 담아 직접 매물을 등록할 수 있어요.",
  },
  {
    number: "04",
    title: "신고와 검토",
    description:
      "의심되는 매물은 신고하고, 관리자는 접수된 신고를 확인해 처리할 수 있어요.",
  },
]);

const stats = ref([
  {
    value: "한눈에",
    label: "원하는 조건의 매물을 비교하고",
  },
  {
    value: "한곳에",
    label: "관심 매물과 검색 조건을 관리하고",
  },
  {
    value: "안심하게",
    label: "인증 정보와 신고 기능으로 확인하세요",
  },
]);

const ctaCards = ref([
  {
    title: "간편 등록",
    description: "주소, 가격, 사진을 빠르게 입력하세요.",
  },
  {
    title: "상세 옵션 관리",
    description: "면적, 관리비, 입주일, 옵션을 한 번에 관리하세요.",
  },
  {
    title: "안전한 매물 운영",
    description: "신고와 검수를 통해 신뢰도를 높입니다.",
  },
]);

// 아직 구현 못한 기능 alert
const notYet = () => alert("2차 구현 예정입니다.");

// 스크롤 액션 기능
const revealDoms = ref([]);
let observer = null;

// Vue가 해당 DOM을 만들면 호출되는 함수 -> onMounted보다 먼저 실행됨
const setRevealRef = (element) => {
  if (element && !revealDoms.value.includes(element)) {
    revealDoms.value.push(element);
  }
};

onMounted(() => {
  // 스크롤 감시 객체를 만듦
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 감시 중인 DOM이 화면에 들어오면 true
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // 감시 해재
          observer.unobserve(entry.target);
        }
      });
    }, // DOM의 25프로 이상이 화면에 들어왔을때 콜백을 실행하라
    {
      threshold: 0.25,
    },
  );
  // setRevealRef로 모아둔 DOM을 observer에 등록 -> DOM이 viewport안에 들어오는지 계속 감시
  revealDoms.value.forEach((element) => {
    observer.observe(element);
  });
});

onBeforeUnmount(() => {
  // 컴포넌트가 사라질때 DOM 감시를 끊음
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <main class="main-page">
    <section class="hero-section" aria-label="JIPDA 소개">
      <div class="hero-copy reveal" :ref="setRevealRef">
        <h1>ZIPDA</h1>
        <p>당신의 완벽한 주거공간을 찾아서</p>
      </div>
    </section>

    <section
      class="intro-section reveal"
      :ref="setRevealRef"
      aria-label="서비스 소개"
    >
      <p class="intro-eyebrow">{{ intro.eyebrow }}</p>
      <h2>{{ intro.body }}</h2>
    </section>

    <section
      class="stats-section reveal"
      :ref="setRevealRef"
      aria-label="서비스 통계"
    >
      <article v-for="stat in stats" :key="stat.label" class="stat-item">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </article>
    </section>

    <section
      class="benefit-section reveal"
      :ref="setRevealRef"
      aria-label="주요 기능"
    >
      <article
        v-for="card in benefitCards"
        :key="card.number"
        class="benefit-card"
      >
        <span>{{ card.number }}</span>
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </article>
    </section>

    <section class="map-section" aria-label="지도 기반 탐색">
      <div class="map-copy reveal" :ref="setRevealRef">
        <span>Map search</span>
        <h2>지도에서 한눈에 원하는 집을 찾아보세요</h2>
        <p>
          직관적인 지도와 주변 생활 인프라 정보를 함께 확인하며 나에게 맞는
          주거공간을 더 빠르게 찾아보세요.
        </p>
        <MyButton
          :content="'지도에서 검색하기'"
          :color="'blue'"
          :size="'small-middle'"
          :class="'blue-pill'"
          @click="notYet"
        ></MyButton>
      </div>

      <div class="map-preview reveal" :ref="setRevealRef" aria-hidden="true">
        <div class="map-tabs">
          <span>전체</span>
          <span>월세</span>
          <span>아파트</span>
          <span>오피스텔</span>
        </div>

        <div class="map-card">
          <div class="map-thumb"></div>
          <div>
            <strong>래미안 리버파크</strong>
            <b>전세 5.2억</b>
            <small>84㎡ · 3/25층</small>
          </div>
        </div>
      </div>
    </section>

    <section class="owner-section" aria-label="매물 등록 안내">
      <div class="owner-copy reveal" :ref="setRevealRef">
        <span>For owners</span>
        <h2>직접 매물을 올려보세요</h2>
        <p>
          수수료 없이 쉽고 빠르게 매물을 등록하고 새로운 세입자를 찾아보세요.
        </p>
        <MyButton
          :content="'매물 등록하기'"
          :color="'blue'"
          :size="'small-middle'"
          :class="'blue-pill'"
        ></MyButton>
      </div>

      <div class="owner-visual reveal" :ref="setRevealRef">
        <img
          src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=85"
          alt="고급 주거 건축물"
        />

        <div class="floating-cards reveal" :ref="setRevealRef">
          <article
            v-for="card in ctaCards"
            :key="card.title"
            class="floating-card"
          >
            <span></span>
            <div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      class="property-section reveal"
      :ref="setRevealRef"
      aria-label="추천 매물"
    >
      <div class="section-heading">
        <span>Recommended homes</span>
        <h2>지금 눈여겨볼 매물</h2>
      </div>

      <div class="property-grid">
        <article
          v-for="property in mostLikeProperties"
          :key="property.title"
          class="property-card"
          :class="property.layout"
        >
          <img :src="property.image" :alt="property.title" />
          <div class="property-info">
            <span>{{ property.badge }}</span>
            <h3>{{ property.title }}</h3>
            <p>{{ property.subtitle }}</p>
          </div>
        </article>
      </div>
      <div class="button">
        <MyButton
          :content="'모든 매물 보기'"
          :color="'blue'"
          :size="'small-middle'"
          :class="'blue-pill'"
        ></MyButton>
      </div>
    </section>
  </main>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.main-page {
  width: 100%;
  min-height: 100vh;
  padding: 34px 60px;
  color: var(--personal-color-black);
  background:
    radial-gradient(
      circle at 15% 0%,
      rgba(230, 231, 244, 0.78),
      transparent 30%
    ),
    linear-gradient(180deg, #ffffff 0%, #f8f9fc 48%, #ffffff 100%);
}

.hero-section {
  display: flex;
  min-height: 500px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 42px 64px 76px;
  border-radius: 42px;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.72) 0%,
      rgba(0, 0, 0, 0.2) 46%,
      rgba(0, 0, 0, 0.02) 100%
    ),
    url("https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=90")
      center / cover;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.13);
  max-width: 1420px;
  margin: auto;
}

.hero-copy {
  padding: 20px 90px;
  max-width: 800px;
  color: var(--personal-color-white);
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(96px, 17vw, 250px);
  font-weight: 950;
  line-height: 0.82;
  letter-spacing: 0;
}

.hero-copy p {
  margin: 28px 0 0;
  font-size: clamp(24px, 3vw, 42px);
  font-weight: 800;
  line-height: 1.2;
}

.intro-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 80px;
  max-width: 1320px;
  margin: 110px auto 96px;
  padding: 50px 34px;
  text-align: center;
}

.intro-eyebrow {
  width: 100%;
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 23px;
  font-weight: 700;
  line-height: 1.55;
}

.intro-section h2 {
  width: 100%;
  margin: 0;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: 0;
  font-size: 40px;
  white-space: pre-line;
}

.property-section {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px 34px 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.section-heading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
  text-align: left;
}

.section-heading span {
  color: var(--personal-color-blue);
  font-size: 15px;
  font-weight: 850;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(36px, 5vw, 68px);
  font-weight: 900;
  line-height: 1.08;
}

.property-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.95fr 0.95fr;
  grid-auto-rows: 290px;
  gap: 28px;
  text-align: left;
}

.property-card {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 30px;
  background: var(--personal-color-white);
  box-shadow: 0 18px 48px rgba(21, 32, 48, 0.08);
  transition:
    transform 220ms ease,
    box-shadow 220ms ease;
}

.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 68px rgba(21, 32, 48, 0.16);
}

.property-card img {
  width: 100%;
  min-height: 0;
  flex: 1;
  object-fit: cover;
}

.property-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 26px 28px;
  background: var(--personal-color-white);
}

.property-info span {
  color: var(--personal-color-blue);
  font-size: 13px;
  font-weight: 900;
}

.property-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 850;
}

.property-info p {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 16px;
  font-weight: 650;
}

.property-card--wide {
  grid-column: span 2;
  grid-row: span 2;
}

.property-card--tall {
  grid-row: span 2;
}

.property-card--medium {
  grid-column: span 2;
}

.blue-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 0 38px;
  border: 0;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 850;
  cursor: pointer;
}

.blue-pill:hover {
  transition: 0.3s;
  transform: scale(1.04);
}

.benefit-section {
  display: flex;
  gap: 28px;
  max-width: 1320px;
  margin: 0 auto 110px;
  padding: 50px;
}

.benefit-card {
  display: flex;
  flex: 1;
  min-height: 270px;
  flex-direction: column;
  justify-content: space-between;
  padding: 34px;
  border-radius: 32px;
  background: linear-gradient(
    145deg,
    #f6f9ff 0%,
    var(--personal-color-periwinkle) 100%
  );
}

.benefit-card span {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--personal-color-white);
  background: var(--personal-color-blue);
  font-size: 18px;
  font-weight: 900;
}

.benefit-card h3 {
  margin: 42px 0 14px;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.24;
}

.benefit-card p {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
}

.stats-section {
  display: flex;
  max-width: 1320px;
  margin: 0 auto 200px;
  padding: 0px 34px;
  border-top: 1px solid rgba(84, 95, 110, 0.18);
  border-bottom: 1px solid rgba(84, 95, 110, 0.18);
}

.stat-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 10px;
}

.stat-item + .stat-item {
  border-left: 1px solid rgba(84, 95, 110, 0.18);
}

.stat-item strong {
  font-size: clamp(42px, 5vw, 68px);
  font-weight: 900;
}

.stat-item span {
  color: var(--personal-color-gray);
  font-size: 18px;
  font-weight: 750;
}

.map-section {
  display: flex;
  align-items: stretch;
  gap: 54px;
  max-width: 1320px;
  margin: 0 auto 120px;
  padding: 70px;
  border-radius: 42px;
  background: linear-gradient(
    135deg,
    #f3f8ff 0%,
    var(--personal-color-periwinkle) 100%
  );
  margin-top: 60px;
}

.map-copy {
  display: flex;
  width: 40%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.map-copy span,
.owner-copy span {
  color: var(--personal-color-blue);
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
}

.map-copy h2,
.owner-copy h2 {
  margin: 18px 0;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.14;
  font-size: 35px;
}

.map-copy p,
.owner-copy p {
  margin: 0 0 34px;
  color: var(--personal-color-gray);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.7;
}

.map-copy button {
  color: var(--personal-color-white);
  background: var(--personal-color-blue);
}

.map-preview {
  display: flex;
  flex: 1;
  gap: 10px;
  min-height: 430px;
  flex-direction: column;
  justify-content: space-between;
  padding: 38px;
  border-radius: 34px;
  background:
    linear-gradient(45deg, rgba(0, 100, 255, 0.12) 0 8%, transparent 8% 100%),
    linear-gradient(
      135deg,
      transparent 0 44%,
      rgba(0, 100, 255, 0.14) 44% 48%,
      transparent 48% 100%
    ),
    #edf4fc;
}

.map-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.map-tabs span {
  padding: 13px 20px;
  border-radius: 999px;
  background: var(--personal-color-white);
  color: var(--personal-color-gray);
  font-size: 15px;
  font-weight: 800;
}

.map-card {
  display: flex;
  width: min(100%, 520px);
  align-items: center;
  gap: 22px;
  align-self: flex-end;
  padding: 24px;
  border-radius: 28px;
  background: var(--personal-color-white);
  box-shadow: 0 22px 52px rgba(21, 32, 48, 0.12);
}

.map-thumb {
  width: 104px;
  height: 104px;
  flex: 0 0 auto;
  border-radius: 20px;
  background-image: url("https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=85");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.map-card div:last-child {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.map-card strong {
  font-size: 22px;
  font-weight: 900;
}

.map-card b {
  color: var(--personal-color-blue);
  font-size: 25px;
}

.map-card small {
  color: var(--personal-color-gray);
  font-size: 16px;
  font-weight: 650;
}

.owner-section {
  display: flex;
  align-items: center;
  gap: 62px;
  max-width: 1320px;
  margin: 0 auto 80px;
  padding: 70px;
  border-radius: 42px;
  background: linear-gradient(135deg, #ffffff 0%, #eef4ff 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 100, 255, 0.08);
}

.owner-copy {
  display: flex;
  width: 36%;
  flex-direction: column;
  align-items: flex-start;
}

.owner-copy button {
  color: var(--personal-color-white);
  background: var(--personal-color-blue);
}

.owner-visual {
  display: flex;
  flex: 1;
  align-items: center;
}

.owner-visual img {
  width: 66%;
  min-height: 460px;
  border-radius: 32px;
  object-fit: cover;
  box-shadow: 0 28px 72px rgba(21, 32, 48, 0.16);
}

.floating-cards {
  display: flex;
  width: 44%;
  flex-direction: column;
  gap: 18px;
  margin-left: -110px;
}

.floating-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 44px rgba(21, 32, 48, 0.12);
  backdrop-filter: blur(14px);
}

.floating-card span {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at center,
      var(--personal-color-white) 0 28%,
      transparent 29%
    ),
    var(--personal-color-blue);
}

.floating-card h3 {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 900;
}

.floating-card p {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.45;
}

@media (max-width: 1180px) {
  .hero-section {
    min-height: 620px;
    padding: 34px 42px 64px;
  }

  .nav-menu {
    gap: 30px;
  }

  .intro-section,
  .map-section,
  .owner-section {
    gap: 42px;
  }

  .property-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .property-card--wide,
  .property-card--medium {
    grid-column: span 2;
  }

  .property-card--tall {
    grid-row: span 1;
  }

  .owner-section {
    align-items: flex-start;
  }

  .owner-visual {
    flex-direction: column;
    align-items: stretch;
  }

  .owner-visual img {
    width: 100%;
  }

  .floating-cards {
    width: auto;
    margin: -84px 28px 0;
  }
}

@media (max-width: 900px) {
  .main-page {
    padding: 14px;
  }

  .intro-section h2 {
    font-size: 22px;
  }

  .hero-section {
    min-height: 540px;
    border-radius: 30px;
  }

  .hero-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-menu {
    width: 100%;
    flex-wrap: wrap;
    gap: 18px 28px;
  }

  .intro-section,
  .map-section,
  .owner-section {
    flex-direction: column;
  }

  .intro-eyebrow,
  .intro-section h2,
  .map-copy,
  .owner-copy {
    width: 100%;
  }

  .benefit-section,
  .stats-section {
    flex-direction: column;
  }

  .stat-item + .stat-item {
    padding-top: 34px;
    border-top: 1px solid rgba(84, 95, 110, 0.18);
    border-left: 0;
  }

  .map-section,
  .owner-section {
    padding: 42px;
    border-radius: 32px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 480px;
    padding: 28px 24px 44px;
    border-radius: 26px;
  }

  .brand {
    font-size: 28px;
  }

  .nav-menu a {
    font-size: 14px;
  }

  .intro-section,
  .property-section,
  .benefit-section,
  .stats-section {
    padding-right: 8px;
    padding-left: 8px;
  }

  .intro-section {
    margin: 72px auto 56px;
  }

  .property-grid {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .property-card {
    min-height: 360px;
    border-radius: 24px;
  }

  .benefit-card,
  .map-section,
  .owner-section {
    border-radius: 26px;
  }

  .map-section,
  .owner-section {
    padding: 28px;
  }

  .map-preview {
    min-height: 360px;
    padding: 22px;
    border-radius: 24px;
  }

  .map-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .owner-visual img {
    min-height: 340px;
    border-radius: 24px;
  }

  .floating-cards {
    margin: -58px 12px 0;
  }

  .floating-card {
    padding: 18px;
  }
}
</style>
