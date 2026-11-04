import badgeCheck from '../../assets/icons/badge-check.svg'
import check from '../../assets/icons/check.svg'
import image from '../../assets/icons/image.svg'
import { MEETING_PURPOSE_OPTIONS } from '../../config/copy'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { partnerName } from './matchView'
import type { MyInfo } from './myInfoTypes'
import { formatMonth } from './myInfoView'
import { PreparingButton } from './PreparingButton'
import { isSameAnswer } from './recommendRules'
import type { Recommendation } from './recommendTypes'
import own from './MyInfo.module.css'
import rec from './Recommend.module.css'

const c = MATCHING_COPY.today.card

/**
 * 추천 카드. 만나기 전이라 성·나이대·구까지만 (기획서 8장). 사진은 작게 한 줄로 두고 자기소개를 바로 아래에 둬
 * 글이 첫 화면에 넉넉히 보이게 합니다. 나와 같은 취미·가치관 답은 색과 '나와 같아요' 글로 함께 알립니다.
 */
export function RecommendationCard({ recommendation: r, mine }: { recommendation: Recommendation; mine: MyInfo }) {
  const purpose = MEETING_PURPOSE_OPTIONS.find((option) => option.id === r.purpose)?.label

  return (
    <section className={`${own.card} flex flex-col gap-5 p-5 xl:p-8`} aria-labelledby={`rec-${r.id}`}>
      <div className="flex flex-col gap-1">
        <h2 id={`rec-${r.id}`} className={rec.name}>
          {partnerName(r)}
        </h2>
        <p className={own.label}>
          {r.partner.ageBand} · {r.partner.district}
        </p>
        {r.singleVerifiedMonth && (
          <p className={`${own.badge} mt-2 flex items-center gap-2 self-start px-3 py-1`}>
            <img className={own.inlineIcon} src={badgeCheck} alt="" />
            {c.single(formatMonth(r.singleVerifiedMonth))}
          </p>
        )}
      </div>

      <ul role="list" className="grid grid-cols-3 gap-3" aria-label={c.photos}>
        {Array.from({ length: r.photoCount }, (_, index) => (
          <li key={index} className={`${own.photo} flex aspect-square items-center justify-center`}>
            {/* 더미라 실제 사진 대신 자리 표시 */}
            <img className={own.photoIcon} src={image} alt="" />
            <span className="sr-only">{c.photoAlt(index + 1)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <h3 className={own.label}>{c.intro}</h3>
        <p className={rec.intro}>{r.intro}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={own.label}>{c.hobbies}</h3>
        <ul role="list" className="flex flex-wrap gap-2">
          {r.hobbies.map((hobby) => {
            const same = mine.hobbies.some((my) => isSameAnswer(my, hobby))
            return (
              <li key={hobby} className={`${own.chip} ${same ? rec.sameChip : ''} flex items-center gap-1.5 px-3 py-1`}>
                {hobby}
                {same && <SameMark />}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={own.label}>{c.values}</h3>
        <dl className="flex flex-col gap-3">
          {MATCHING_COPY.myInfo.profile.valueQuestions.map((question, index) => {
            const same = isSameAnswer(mine.values[index], r.values[index])
            return (
              <div key={question} className={`${same ? rec.sameRow : ''} flex flex-col gap-1`}>
                <dt className={`${own.question} flex flex-wrap items-center gap-x-2`}>
                  {question}
                  {same && <SameMark />}
                </dt>
                <dd className={own.value}>{r.values[index]}</dd>
              </div>
            )
          })}
        </dl>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={own.label}>{c.purpose}</h3>
        <p className={own.value}>{purpose}</p>
      </div>

      {r.hasVoiceIntro && (
        <div className="flex flex-col gap-2">
          <h3 className={own.label}>{c.voice}</h3>
          <PreparingButton label={c.voicePlay} />
        </div>
      )}
    </section>
  )
}

/** 색만으로 구분하지 않도록 글로도 '나와 같아요' */
function SameMark() {
  return (
    <span className={`${rec.sameMark} inline-flex items-center gap-1`}>
      <img className={rec.sameIcon} src={check} alt="" />
      {c.same}
    </span>
  )
}
