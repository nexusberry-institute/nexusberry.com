/**
 * Script to delete all media records from the database
 * Uses the raw pg pool from PayloadCMS db adapter
 *
 * Usage: npx tsx scripts/delete-all-media.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function deleteAllMedia() {
  console.log('Initializing Payload...')

  const payload = await getPayload({ config })

  // Access the pool from the db adapter's sessions
  const pool = (payload.db as any).pool

  console.log('Connected. Starting cleanup...\n')

  try {
    // Step 1: Delete testimonials that reference media (from global's array)
    console.log('--- Step 1: Deleting impact_section_testimonials ---')
    const testimonialsResult = await pool.query('DELETE FROM impact_section_testimonials')
    console.log(`  ✓ Deleted ${testimonialsResult.rowCount} testimonials\n`)

    // Step 2: Delete instructors that have required profile images
    console.log('--- Step 2: Deleting instructors with profile images ---')
    const instructorsResult = await pool.query('DELETE FROM instructors WHERE profile_image_id IS NOT NULL')
    console.log(`  ✓ Deleted ${instructorsResult.rowCount} instructors\n`)

    // Step 3: Delete media_sizes_og (image sizes table)
    console.log('--- Step 3: Deleting media sizes ---')
    try {
      const sizesResult = await pool.query('DELETE FROM media_sizes_og')
      console.log(`  ✓ Deleted ${sizesResult.rowCount} media size records\n`)
    } catch {
      console.log('  No media_sizes_og table or already empty\n')
    }

    // Step 4: Delete all media records
    console.log('--- Step 4: Deleting media records ---')
    const mediaResult = await pool.query('DELETE FROM media')
    console.log(`  ✓ Deleted ${mediaResult.rowCount} media records\n`)

    console.log('\n✓ Done! All media records have been deleted.')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

deleteAllMedia()
