# TODOS

## localStorage quota exceeded 에러 핸들링

- **What:** cart store의 `$effect`에서 `localStorage.setItem()` 호출 시 QuotaExceededError를 처리
- **Why:** localStorage 용량 초과 시 카트 데이터가 조용히 저장 실패. 사용자는 다음 방문 시 빈 장바구니를 보게 됨.
- **Pros:** 데이터 손실 방지, 사용자에게 명확한 피드백
- **Cons:** try/catch 추가 + Toast 컴포넌트 의존
- **Context:** adapter-static 정적 사이트에서 localStorage가 유일한 클라이언트 상태 저장소. `$effect` 내에서 `try { localStorage.setItem(...) } catch (e) { showToast('장바구니 저장 실패') }` 패턴. Phase 1 cart store 구현 시 함께 처리.
- **Depends on:** cart store 구현 (Phase 1), Toast 컴포넌트
- **Added:** 2026-03-30 via /plan-eng-review
