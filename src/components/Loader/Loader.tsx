import s from './Loader.module.css'

type Props = {
  inline?: boolean   
  label?: string    
}

export default function Loader({ inline = false, label = 'Loading' }: Props) {
  return (
    <div className={inline ? s.inline : s.wrap} role="status" aria-live="polite" aria-label={label}>
      <span className={s.dot} />
      <span className={s.dot} />
      <span className={s.dot} />
    </div>
  )
}
