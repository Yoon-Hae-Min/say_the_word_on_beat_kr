import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-chalkboard-bg p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 md:p-8">
          <h1 className="chalk-text text-chalk-white text-3xl md:text-4xl font-bold mb-2 text-center">
            서비스 이용약관
          </h1>
          <p className="text-chalk-white/60 text-sm text-center mb-8">
            최종 수정일: 2025년 12월 25일
          </p>

          <div className="space-y-8 text-chalk-white">
            {/* 제1조 목적 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제1조 (목적)
              </h2>
              <p className="leading-relaxed text-sm md:text-base">
                본 약관은 단어리듬게임(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 정의 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제2조 (정의)
              </h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>
                  <strong>"서비스"</strong>란 단어리듬게임 웹사이트를 통해 제공되는 리듬 퀴즈 챌린지 생성 및 플레이 서비스를 말합니다.
                </li>
                <li>
                  <strong>"이용자"</strong>란 본 약관에 따라 서비스를 이용하는 모든 사람을 말합니다.
                </li>
                <li>
                  <strong>"콘텐츠"</strong>란 이용자가 서비스에 업로드한 이미지, 텍스트 등 모든 정보를 말합니다.
                </li>
                <li>
                  <strong>"챌린지"</strong>란 이용자가 생성한 리듬 퀴즈 게임을 말합니다.
                </li>
              </ul>
            </section>

            {/* 제3조 약관의 효력 및 변경 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제3조 (약관의 효력 및 변경)
              </h2>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
                <li>서비스 제공자는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 공지함으로써 효력을 발생합니다.</li>
                <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</li>
              </ul>
            </section>

            {/* 제4조 서비스의 제공 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제4조 (서비스의 제공)
              </h2>
              <p className="leading-relaxed text-sm md:text-base mb-2">
                서비스는 다음과 같은 기능을 제공합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm md:text-base ml-4">
                <li>리듬 퀴즈 챌린지 생성 및 편집</li>
                <li>생성된 챌린지의 공유 및 플레이</li>
                <li>공개 챌린지 목록 조회</li>
                <li>챌린지 플레이 기록</li>
              </ul>
            </section>

            {/* 제5조 서비스의 중단 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제5조 (서비스의 중단)
              </h2>
              <p className="leading-relaxed text-sm md:text-base mb-2">
                서비스 제공자는 다음 각 호의 경우 서비스 제공을 일시적으로 중단할 수 있습니다:
              </p>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base ml-4">
                <li>서비스용 설비의 보수, 점검, 교체 또는 고장, 통신두절 등의 사유가 발생한 경우</li>
                <li>전기통신사업법에 규정된 기간통신사업자가 서비스를 중지한 경우</li>
                <li>국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 불가능한 경우</li>
                <li>기타 불가항력적 사유가 있는 경우</li>
              </ul>
            </section>

            {/* 제6조 이용자의 의무 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제6조 (이용자의 의무)
              </h2>
              <p className="leading-relaxed text-sm md:text-base mb-2">
                이용자는 다음 각 호의 행위를 하여서는 안 됩니다:
              </p>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base ml-4">
                <li>타인의 정보를 도용하는 행위</li>
                <li>서비스의 운영을 고의로 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 이미지 등을 업로드하는 행위</li>
                <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
                <li>저작권, 상표권 등 타인의 지적재산권을 침해하는 행위</li>
                <li>해킹, 바이러스 유포 등 서비스의 안전성을 해치는 행위</li>
                <li>서비스의 정보를 상업적 목적으로 무단 수집, 저장, 게시, 유포하는 행위</li>
                <li>기타 현행 법령에 위반되는 불법적인 행위</li>
              </ul>
            </section>

            {/* 제7조 콘텐츠의 관리 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제7조 (콘텐츠의 관리)
              </h2>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>이용자가 업로드한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다.</li>
                <li>이용자는 서비스에 콘텐츠를 업로드함으로써 서비스 제공자에게 해당 콘텐츠를 서비스 제공 목적으로 사용할 수 있는 권한을 부여합니다.</li>
                <li>이용자가 '공개' 설정으로 생성한 챌린지는 서비스를 이용하는 다른 모든 이용자에게 공개되며, 누구나 해당 챌린지를 조회하고 플레이할 수 있습니다.</li>
                <li>공개 챌린지에 포함된 이미지, 텍스트 등의 콘텐츠는 제3자에게 노출될 수 있으므로, 이용자는 개인정보, 저작권 침해 콘텐츠, 부적절한 콘텐츠 등을 업로드하지 않도록 주의해야 합니다.</li>
                <li>서비스 제공자는 본 약관 제6조를 위반하는 콘텐츠에 대해 사전 통보 없이 삭제할 수 있습니다.</li>
                <li>이용자가 업로드한 콘텐츠로 인해 발생하는 모든 법적 책임은 해당 이용자에게 있습니다.</li>
              </ul>
            </section>

            {/* 제8조 개인정보 보호 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제8조 (개인정보 보호)
              </h2>
              <p className="leading-relaxed text-sm md:text-base">
                서비스 제공자는 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 수집, 이용, 보관, 파기 등에 관한 사항은{" "}
                <Link
                  href="/privacy"
                  className="text-chalk-yellow hover:underline font-bold"
                >
                  개인정보 처리방침
                </Link>
                에 따릅니다.
              </p>
            </section>

            {/* 제9조 저작권의 귀속 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제9조 (저작권의 귀속)
              </h2>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>서비스 및 서비스의 저작권 및 지적재산권은 서비스 제공자에게 귀속됩니다.</li>
                <li>이용자는 서비스를 이용함으로써 얻은 정보를 서비스 제공자의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등 기타 방법으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
              </ul>
            </section>

            {/* 제10조 면책조항 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제10조 (면책조항)
              </h2>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>서비스 제공자는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
                <li>서비스 제공자는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
                <li>서비스 제공자는 이용자가 서비스를 통해 얻은 정보 또는 자료의 신뢰도, 정확성 등에 대해서는 책임을 지지 않습니다.</li>
                <li>서비스 제공자는 이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며 이로 인한 손해를 배상할 책임도 없습니다.</li>
              </ul>
            </section>

            {/* 제11조 분쟁해결 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제11조 (분쟁해결)
              </h2>
              <ul className="list-decimal list-inside space-y-2 leading-relaxed text-sm md:text-base">
                <li>서비스 제공자와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</li>
                <li>제1항의 노력에도 불구하고 분쟁이 해결되지 않을 경우, 양 당사자는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.</li>
              </ul>
            </section>

            {/* 제12조 준거법 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제12조 (준거법)
              </h2>
              <p className="leading-relaxed text-sm md:text-base">
                본 약관과 서비스 이용에 관한 제반 사항은 대한민국 법령에 따릅니다.
              </p>
            </section>

            {/* 제13조 연락처 */}
            <section>
              <h2 className="chalk-text text-chalk-yellow text-xl md:text-2xl font-bold mb-4">
                제13조 (연락처)
              </h2>
              <div className="leading-relaxed text-sm md:text-base">
                <p className="mb-2">
                  서비스 이용과 관련한 문의사항이 있으시면 아래 연락처로 문의하시기 바랍니다:
                </p>
                <div className="bg-chalkboard-bg/30 border-2 border-chalk-white/30 rounded-md p-4 mt-4">
                  <p>
                    <strong>담당자:</strong> 윤해민
                  </p>
                  <p>
                    <strong>이메일:</strong>{" "}
                    <a
                      href="mailto:yunhatmi@naver.com"
                      className="text-chalk-yellow hover:underline"
                    >
                      yunhatmi@naver.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* 홈으로 돌아가기 */}
          <div className="mt-8 pt-6 border-t-2 border-chalk-white/20 text-center">
            <Link
              href="/"
              className="inline-block chalk-text text-chalk-yellow hover:text-chalk-white transition-colors text-sm md:text-base"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
