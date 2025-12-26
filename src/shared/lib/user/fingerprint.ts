/**
 * 사용자 고유 ID 생성 및 관리
 * - localStorage에 저장하여 브라우저별 식별
 * - 서버 비용 없이 클라이언트에서만 처리
 */

const USER_ID_KEY = "user_fingerprint_id";

/**
 * 간단한 브라우저 핑거프린트 생성
 * - User Agent, Screen Resolution, Timezone 등 조합
 */
function generateFingerprint(): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let canvasFingerprint = "";

  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("fingerprint", 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint.slice(0, 50), // Canvas fingerprint (일부만 사용)
  };

  // 간단한 해시 생성
  const str = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `fp_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
}

/**
 * 사용자 고유 ID 가져오기
 * - localStorage에 이미 있으면 기존 ID 반환
 * - 없으면 새로 생성하여 저장
 */
export function getUserId(): string {
  if (typeof window === "undefined") {
    // SSR 환경에서는 빈 문자열 반환
    return "";
  }

  try {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
      userId = generateFingerprint();
      localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
  } catch (error) {
    // localStorage 접근 불가 시 (프라이빗 모드 등)
    console.warn("Failed to access localStorage:", error);
    return generateFingerprint(); // 임시 ID 생성
  }
}

/**
 * 사용자 ID 초기화 (테스트용)
 */
export function resetUserId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_ID_KEY);
  }
}

/**
 * 사용자가 첫 방문인지 확인
 */
export function isFirstVisit(): boolean {
  if (typeof window === "undefined") return false;

  return !localStorage.getItem(USER_ID_KEY);
}
