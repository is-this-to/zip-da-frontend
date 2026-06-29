<script setup></script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <section class="footer-brand">
        <div class="title">ZIPDA</div>

        <p class="footer-description">
          좋은 집을 더 쉽고 빠르게 찾는 주거 생활 플랫폼
        </p>
      </section>

      <nav class="footer-nav" aria-label="푸터 메뉴">
        <RouterLink to="/properties">매물 찾기</RouterLink>
        <RouterLink to="/agents/apply">중개사 인증</RouterLink>
      </nav>
    </div>

    <div class="footer-bottom">
      <p>© 2026 ZIPDA. All rights reserved.</p>
      <p class="footer-notice">
        ZIPDA는 매물 정보 확인을 돕는 플랫폼이며, 거래 당사자가 아닙니다.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  border-top: 1px solid var(--personal-color-periwinkle);
  background-color: var(--personal-color-white);
  color: var(--personal-color-gray);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 24px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}

.footer-brand {
  min-width: 220px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  color: var(--personal-color-blue);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
}

.footer-description {
  margin: 10px 0 0;
  color: var(--personal-color-gray);
  font-size: 14px;
  line-height: 1.6;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px 20px;
}

.footer-nav a {
  color: var(--personal-color-black);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  opacity: 0.78;
}

.footer-nav a:hover {
  color: var(--personal-color-blue);
  opacity: 1;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px 28px;
  border-top: 1px solid var(--personal-color-periwinkle);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: var(--personal-color-gray);
  font-size: 13px;
}

.footer-bottom p {
  margin: 0;
}

.footer-notice {
  text-align: right;
}

@media (max-width: 768px) {
  .app-footer {
    margin-top: 56px;
  }

  .footer-inner {
    flex-direction: column;
    padding: 32px 20px 20px;
  }

  .footer-nav {
    justify-content: flex-start;
  }

  .footer-bottom {
    flex-direction: column;
    padding: 16px 20px 24px;
  }

  .footer-notice {
    text-align: left;
  }
}
</style>
