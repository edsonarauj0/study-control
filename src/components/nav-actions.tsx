import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Button } from './ui/Button'

export function NavActions() {
  return (
    <Button className="bg-gray-700" onClick={() => signOut(auth)}>
      Sign Out
    </Button>
  )
}
