import { WoodFrame } from "@/shared/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <WoodFrame>
      <div className="min-h-screen bg-chalkboard-bg px-4 py-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header with back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-chalk-white hover:text-chalk-yellow transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="chalk-text text-lg md:text-xl">홈으로</span>
            </Link>
          </div>

          {/* Page title */}
          <h1 className="chalk-text mb-8 text-center text-3xl md:text-5xl font-bold text-chalk-white">
            개인정보 처리방침
          </h1>

          {/* Intro */}
          <div className="mb-8 text-center">
            <p className="text-chalk-white/90 leading-relaxed">
              단어리듬게임은 정보주체의 자유와 권리 보호를 위해 「개인정보
              보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를
              처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」
              제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을
              안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
              하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </div>

          {/* Content */}
          <div className="chalk-border chalk-dust border-chalk-blue bg-chalkboard-bg/80 p-6 md:p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                1. 개인정보의 처리 목적
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 서비스 제공을 위하여 필요한 최소한의 개인정보를
                수집하고 있습니다. 처리하고 있는 개인정보는 다음의 목적 이외의
                용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한
                조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                <li>
                  서비스 제공: 챌린지 생성 및 공유 서비스 제공, 게임 플레이 기능
                  제공
                </li>
                <li>
                  서비스 개선: 신규 서비스 개발, 맞춤 서비스 제공, 통계 분석
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                2. 처리하는 개인정보 항목
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 다음과 같은 개인정보 항목을 처리하고 있습니다.
              </p>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-4">
                <p className="text-chalk-yellow font-bold mb-2">[필수 항목]</p>
                <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                  <li>사용자가 업로드한 이미지 파일</li>
                  <li>챌린지 제목 및 설정 정보</li>
                  <li>조회수 등 서비스 이용 기록</li>
                </ul>
              </div>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-4">
                <p className="text-chalk-yellow font-bold mb-2">
                  [자동 수집 항목]
                </p>
                <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                  <li>서비스 이용 기록, 접속 로그, 쿠키</li>
                  <li>IP 주소, 기기 정보(OS, 브라우저 종류 등)</li>
                  <li>방문 일시, 페이지 조회 기록</li>
                </ul>
              </div>

              <p className="text-chalk-white/90 leading-relaxed">
                단어리듬게임은 별도의 회원가입 없이 사용 가능하며, 개인을 식별할
                수 있는 정보(이름, 이메일, 전화번호 등)를 수집하지 않습니다.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                3. 개인정보의 처리 및 보유 기간
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 법령에 따른 개인정보 보유·이용기간 또는
                정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                <li>사용자가 업로드한 챌린지 데이터: 삭제 요청 시까지 보관</li>
              </ul>
              <p className="text-chalk-white/90 mt-4 leading-relaxed">
                삭제를 원하실 경우 개인정보 보호책임자에게 요청하실 수 있습니다.
              </p>
            </section>

            {/* Section 4 - NEW */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                4. 개인정보의 위탁 처리
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 원활한 업무 처리를 위해서 개인정보 처리업무를
                다음과 같이 위탁하여 처리하고 있습니다.
              </p>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold">
                  수탁자: Supabase Inc.
                </p>
                <p className="text-chalk-white/90 mt-1">
                  위탁 업무: 데이터 보관 및 데이터베이스 관리
                </p>
              </div>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-4">
                <p className="text-chalk-yellow font-bold">
                  수탁자: Google LLC
                </p>
                <p className="text-chalk-white/90 mt-1">
                  위탁 업무: 웹사이트 방문 분석 및 통계 (Google Analytics)
                </p>
              </div>

              <p className="text-chalk-white/90 leading-relaxed">
                단어리듬게임은 위탁계약 체결 시 개인정보가 안전하게 관리될 수
                있도록 필요한 사항을 규정하고 있습니다. 위탁업무의 내용이나
                수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여
                공개하도록 하겠습니다.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                5. 개인정보의 제3자 제공
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                <li>
                  사용자가 공개 챌린지로 설정하여 다른 사용자에게 공유하는 경우
                </li>
                <li>
                  법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                  방법에 따라 수사기관의 요구가 있는 경우
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                6. 개인정보의 파기 절차 및 방법
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 개인정보 보유기간의 경과, 처리목적 달성 등
                개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를
                파기합니다.
              </p>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold mb-2">파기 절차</p>
                <p className="text-chalk-white/90">
                  사용자가 챌린지 삭제를 요청하는 경우, 관련된 모든
                  데이터(이미지 파일 포함)는 내부 방침 절차에 의해 지체 없이
                  파기합니다.
                </p>
              </div>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md">
                <p className="text-chalk-yellow font-bold mb-2">파기 방법</p>
                <p className="text-chalk-white/90">
                  전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수
                  없도록 파기합니다.
                </p>
              </div>
            </section>

            {/* Section 7 - NEW */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                7. 정보주체의 권리·의무 및 행사방법
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                정보주체는 개인정보주체로서 다음과 같은 권리를 행사할 수
                있습니다.
              </p>
              <ul className="list-disc list-inside text-chalk-white/90 space-y-2 ml-4">
                <li>
                  정보주체는 단어리듬게임에 대해 언제든지 개인정보
                  열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
                </li>
                <li>
                  권리 행사는 단어리듬게임에 대해 「개인정보 보호법」 시행령
                  제41조제1항에 따라 개인정보 보호책임자에게 서면, 전자우편 등을
                  통하여 하실 수 있으며, 단어리듬게임은 이에 대해 지체없이
                  조치하겠습니다.
                </li>
                <li>
                  개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조
                  제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수
                  있습니다.
                </li>
                <li>
                  개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가
                  수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수
                  없습니다.
                </li>
              </ul>
            </section>

            {/* Section 8 - NEW */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                8. 개인정보의 안전성 확보 조치
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 개인정보의 안전성 확보를 위해 다음과 같은 조치를
                취하고 있습니다.
              </p>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold mb-2">관리적 조치</p>
                <p className="text-chalk-white/90">
                  개인정보 취급 담당자 지정 및 최소화
                </p>
              </div>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md">
                <p className="text-chalk-yellow font-bold mb-2">기술적 조치</p>
                <p className="text-chalk-white/90">
                  개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치,
                  개인정보의 암호화, 보안프로그램 설치
                </p>
              </div>
            </section>

            {/* Section 9 - NEW */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                9. 개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 이용자에게 개별적인 맞춤서비스를 제공하기 위해
                이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를
                사용합니다.
              </p>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold mb-2">쿠키란?</p>
                <p className="text-chalk-white/90">
                  웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터
                  브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의
                  하드디스크에 저장되기도 합니다.
                </p>
              </div>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold mb-2">
                  쿠키의 사용 목적
                </p>
                <ul className="list-disc list-inside text-chalk-white/90 space-y-1 ml-4">
                  <li>서비스 이용 통계 분석 및 서비스 개선</li>
                  <li>이용자에게 편리한 서비스 제공</li>
                </ul>
              </div>

              <div className="bg-chalkboard-bg/50 p-4 rounded-md mb-3">
                <p className="text-chalk-yellow font-bold mb-2">
                  쿠키의 설치·운영 및 거부
                </p>
                <p className="text-chalk-white/90 mb-2">
                  웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의
                  옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                </p>
                <p className="text-chalk-white/70 text-sm">
                  ※ 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 발생할
                  수 있습니다.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                10. 개인정보 보호책임자
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                단어리듬게임은 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
                위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md">
                <p className="text-chalk-yellow font-bold mb-2">
                  개인정보 보호책임자
                </p>
                <p className="text-chalk-white/90">성명: 윤해민</p>
                <p className="text-chalk-white/90 mt-1">
                  연락처:{" "}
                  <a
                    href="mailto:yunhatmi@naver.com"
                    className="text-chalk-blue hover:text-chalk-yellow transition-colors underline"
                  >
                    yunhatmi@naver.com
                  </a>
                </p>
              </div>
              <p className="text-chalk-white/90 mt-4 leading-relaxed">
                정보주체는 단어리듬게임의 서비스를 이용하시면서 발생한 모든
                개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을
                개인정보 보호책임자로 문의할 수 있습니다. 단어리듬게임은
                정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
              </p>
            </section>

            {/* Section 11 - NEW */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                11. 권익침해 구제방법
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                정보주체는 개인정보침해로 인한 구제를 받기 위하여
                개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
                등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
                개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
                바랍니다.
              </p>
              <ul className="list-disc list-inside text-chalk-white/90 space-y-2 ml-4">
                <li>
                  개인정보분쟁조정위원회: (국번없이) 1833-6972 (
                  <a
                    href="https://www.kopico.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chalk-blue hover:text-chalk-yellow transition-colors underline"
                  >
                    https://www.kopico.go.kr
                  </a>
                  )
                </li>
                <li>
                  개인정보침해신고센터: (국번없이) 118 (
                  <a
                    href="https://privacy.kisa.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chalk-blue hover:text-chalk-yellow transition-colors underline"
                  >
                    https://privacy.kisa.or.kr
                  </a>
                  )
                </li>
                <li>
                  대검찰청: (국번없이) 1301 (
                  <a
                    href="https://www.spo.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chalk-blue hover:text-chalk-yellow transition-colors underline"
                  >
                    https://www.spo.go.kr
                  </a>
                  )
                </li>
                <li>
                  경찰청: (국번없이) 182 (
                  <a
                    href="https://ecrm.cyber.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chalk-blue hover:text-chalk-yellow transition-colors underline"
                  >
                    https://ecrm.cyber.go.kr
                  </a>
                  )
                </li>
              </ul>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="chalk-text text-xl md:text-2xl font-bold text-chalk-yellow mb-4">
                12. 개인정보 처리방침의 변경
              </h2>
              <p className="text-chalk-white/90 leading-relaxed mb-4">
                이 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다. 법령, 정책
                또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을
                시에는 변경사항 시행 전에 웹사이트를 통해 공지하도록 하겠습니다.
              </p>
              <div className="bg-chalkboard-bg/50 p-4 rounded-md">
                <p className="text-chalk-white/70 text-sm">
                  공고일자: 2025년 1월 1일
                  <br />
                  시행일자: 2025년 1월 1일
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </WoodFrame>
  );
}
