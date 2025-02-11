import 'dotenv/config'
import { execSync } from 'node:child_process'

export const credentials = {
  ADMIN: { email: 'user_admin@example.com', password: '0002' },
  EDITOR: { email: 'user_editor@example.com', password: '0001' },
  BASE: { email: 'user_base@example.com', password: '0000' },
  GEO: { email: 'user_geo@example.com', password: '0003' },
}

export function loadFixtures() {
  console.info('Loading fixtures...')
  execSync(
    `docker exec ${process.env.API_CONTAINER_ID} bin/console hautelook:fixtures:load --env=dev --quiet >> /dev/null`,
  )
}

export function resetFixtureMedia() {
  console.info('Resetting fixture media...')
  execSync(
    `docker exec ${process.env.API_CONTAINER_ID} bin/console app:fixtures:reset-media --env=dev --quiet >> /dev/null`,
  )
}
