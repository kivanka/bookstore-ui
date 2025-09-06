type Props = { message?: string }
export default function ErrorState({ message = 'Something went wrong' }: Props) {
  return <div className="error">{message}</div>
}
