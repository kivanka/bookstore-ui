import s from './ErrorState.module.css'

type Props = {
  message?: string
  onRetry?: () => void
  compact?: boolean 
}

export default function ErrorState({ message = 'Something went wrong', onRetry, compact = false }: Props) {
  return (
    <div className={compact ? s.compact : s.wrap} role="alert" aria-live="assertive">
      <div className={s.icon} aria-hidden>!</div>
      <div className={s.msg}>{message}</div>
      {onRetry && (
        <button className={s.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
