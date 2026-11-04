import { useId, useState, type ReactNode } from 'react'
import badgeCheck from '../../assets/icons/badge-check.svg'
import image from '../../assets/icons/image.svg'
import lock from '../../assets/icons/lock.svg'
import { Button, ButtonLink } from '../../components/ui/Button/Button'
import { TextLink } from '../../components/ui/TextLink/TextLink'
import { MEETING_PURPOSE_OPTIONS } from '../../config/copy'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { site } from '../../config/site'
import { getCompanionType } from '../../data/companionTypes'
import { AVAILABILITY_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { formatBands, formatDate, formatDays, formatMonth, useMyInfo } from './myInfoView'
import styles from './Matching.module.css'
import own from './MyInfo.module.css'

const c = MATCHING_COPY.myInfo

/**
 * 내 정보 탭 (Figma 없음, 기존 부품과 토큰으로). 위에서 아래로 프로필 → 독신 확인 → 만날 수 있는 때 → 소개받는 조건
 * → 이용권 → 휴회·알림 → 로그아웃·탈퇴. 이 화면에서 고칠 수 있는 것은 '만날 수 있는 때'뿐이고(따로 한 화면),
 * 나머지 버튼은 누르면 '준비 중이에요'를 알립니다.
 */
export function MyInfoScreen({ onSignOut }: { onSignOut: () => void }) {
  const info = useMyInfo()
  const plan = c.plan.plans[info.plan.id]
  const purpose = MEETING_PURPOSE_OPTIONS.find((option) => option.id === info.purpose)?.label
  const loveType = getCompanionType(info.loveType)

  return (
    <AppScreen title={c.title} tab="me" nav="me">
      <div className="flex flex-col gap-6 xl:mx-auto xl:max-w-(--size-app-card-width)">
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>

        <Card title={c.profile.title} action={<PreparingButton label={c.edit} />}>
          <Field label={c.profile.photos}>
            <ul role="list" className="grid grid-cols-3 gap-3">
              {info.photos.map((photo, index) => (
                <li key={photo.id} className={`${own.photo} relative flex aspect-square items-center justify-center`}>
                  {/* 더미라 실제 사진 대신 자리 표시. 상태는 글로 함께 알립니다 */}
                  <img className={own.photoIcon} src={image} alt="" />
                  <span className="sr-only">{c.profile.photoAlt(index + 1)}</span>
                  <span className={`${own.photoStatus} ${photo.status === 'reviewing' ? own.reviewing : ''} absolute bottom-2 left-2 px-2`}>
                    {c.profile.photoStatus[photo.status]}
                  </span>
                </li>
              ))}
            </ul>
            <p className={own.note}>{c.profile.photoNote}</p>
          </Field>
          <Field label={c.profile.intro}>
            <p className={own.value}>{info.intro}</p>
          </Field>
          <Field label={c.profile.hobbies}>
            <ul role="list" className="flex flex-wrap gap-2">
              {info.hobbies.map((hobby) => (
                <li key={hobby} className={`${own.chip} px-3 py-1`}>
                  {hobby}
                </li>
              ))}
            </ul>
          </Field>
          <Field label={c.profile.values}>
            <dl className="flex flex-col gap-4">
              {c.profile.valueQuestions.map((question, index) => (
                <div key={question} className="flex flex-col gap-1">
                  <dt className={own.question}>{question}</dt>
                  <dd className={own.value}>{info.values[index]}</dd>
                </div>
              ))}
            </dl>
          </Field>
          <Field label={c.profile.purpose}>
            <p className={own.value}>{purpose}</p>
          </Field>
          <Field label={c.profile.loveType}>
            <div className="flex items-center gap-3">
              <img className={own.loveTypeImage} src={loveType.image} alt="" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className={own.strong}>{loveType.name}</p>
                <p className={`${own.note} flex items-center gap-1`}>
                  <img className={own.inlineIcon} src={lock} alt="" />
                  {c.profile.loveTypeNote}
                </p>
              </div>
            </div>
          </Field>
        </Card>

        <Card title={c.single.title}>
          {info.singleVerifiedMonth ? (
            <>
              <p className={`${own.badge} flex items-center gap-2 self-start px-3 py-1`}>
                <img className={own.inlineIcon} src={badgeCheck} alt="" />
                {c.single.verified(formatMonth(info.singleVerifiedMonth))}
              </p>
              <p className={own.note}>{c.single.verifiedNote}</p>
            </>
          ) : (
            <>
              <p className={`${own.badge} ${own.badgeMuted} self-start px-3 py-1`}>{c.single.none}</p>
              <p className={own.value}>{c.single.noneBody}</p>
              <ul role="list" className={`${own.note} flex flex-col gap-1`}>
                {c.single.noneRules.map((rule) => (
                  <li key={rule}>· {rule}</li>
                ))}
              </ul>
              <PreparingButton label={c.single.submit} />
            </>
          )}
        </Card>

        <Card
          title={c.availability.title}
          action={
            <ButtonLink href={AVAILABILITY_HASH} variant="outline" size="compact">
              {c.edit}
            </ButtonLink>
          }
        >
          <dl className="flex flex-col gap-3">
            <Row label={c.availability.daysLegend} value={formatDays(info.availability)} />
            <Row label={c.availability.bandsLegend} value={formatBands(info.availability)} />
          </dl>
          <p className={own.note}>{c.availability.note}</p>
        </Card>

        <Card title={c.preferences.title} action={<PreparingButton label={c.edit} />}>
          <p className={own.note}>{c.preferences.intro}</p>
          <dl className="flex flex-col gap-3">
            <Row label={c.preferences.age} value={c.preferences.ageRange(info.preferences.ageMin, info.preferences.ageMax)} />
            <Row label={c.preferences.smoking} value={c.preferences.smokingOptions[info.preferences.smoking]} />
            <Row label={c.preferences.verifiedOnly} value={info.preferences.verifiedOnly ? c.on : c.off} />
          </dl>
        </Card>

        <Card title={c.plan.title}>
          <p className={own.planName}>
            {plan.name} · {plan.price}
          </p>
          <dl className="flex flex-col gap-3">
            <Row
              label={c.plan.left}
              value={
                <>
                  {c.plan.recommendLeft(info.plan.recommendLeft, plan.recommend)}
                  <br />
                  {c.plan.meetingLeft(info.plan.meetingLeft, plan.meetings)}
                </>
              }
            />
            <Row label={c.plan.nextBilling} value={formatDate(info.plan.nextBillingDate)} />
          </dl>
          <div className="flex flex-col gap-2">
            <PreparingButton label={c.plan.sendLink} />
            <p className={own.note}>{c.plan.sendLinkNote}</p>
          </div>
          <div className="flex flex-col gap-1">
            {site.refundPolicyUrl ? (
              <TextLink href={site.refundPolicyUrl} className={`${styles.textLink} flex items-center self-start`}>
                {c.plan.refund}
              </TextLink>
            ) : (
              <PreparingButton label={c.plan.refund} variant="text" />
            )}
            <p className={own.note}>{c.plan.refundNote}</p>
          </div>
          <PreparingButton label={c.plan.cancel} variant="text" />
        </Card>

        <Card title={c.pause.title}>
          <p className={own.value}>{c.pause.body}</p>
          <p className={own.note}>{c.pause.price}</p>
          <PreparingButton label={c.pause.action} />
        </Card>

        <Card title={c.notify.title} action={<PreparingButton label={c.edit} />}>
          <dl>
            <Row label={c.notify.dayOnly} value={info.notifyDayOnly ? c.on : c.off} />
          </dl>
          <p className={own.note}>{c.notify.dayOnlyNote}</p>
        </Card>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
          <div className="xl:w-60">
            <Button variant="outline" onClick={onSignOut}>
              {MATCHING_COPY.logout}
            </Button>
          </div>
          <PreparingButton label={c.leave} variant="text" />
        </div>
      </div>
    </AppScreen>
  )
}

/** 제목 줄(제목 + 오른쪽 버튼)이 있는 흰 상자 */
function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  const id = useId()
  return (
    <section className={`${own.card} flex flex-col gap-5 p-5 xl:p-8`} aria-labelledby={id}>
      <div className="flex items-start justify-between gap-3">
        <h2 id={id} className={`${own.cardTitle} pt-3`}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={own.label}>{label}</h3>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={own.label}>{label}</dt>
      <dd className={own.value}>{value}</dd>
    </div>
  )
}

/**
 * 아직 못 하는 일의 버튼. 누르면 바로 아래에 '준비 중이에요'를 보여 주고 화면 읽기 프로그램에도 알립니다.
 * button: 초록 테두리 버튼(56px) / text: 덜 눈에 띄는 글자 버튼 (해지·탈퇴처럼 자주 누르지 않는 일)
 */
function PreparingButton({ label, variant = 'button' }: { label: string; variant?: 'button' | 'text' }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="flex flex-col items-start gap-1">
      {variant === 'button' ? (
        <Button variant="outline" size="compact" onClick={() => setShown(true)}>
          {label}
        </Button>
      ) : (
        <button type="button" className={`${own.textButton} flex items-center`} onClick={() => setShown(true)}>
          {label}
        </button>
      )}
      <p role="status" className={own.note}>
        {shown ? c.preparing : ''}
      </p>
    </div>
  )
}
