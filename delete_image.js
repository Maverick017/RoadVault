// delete_image.js
// Deletes one or multiple images from Cloudinary and Neon PostgreSQL
//
// Usage:
//   Single:   node delete_image.js <uuid>
//   Multiple: node delete_image.js <uuid1> <uuid2> <uuid3>
//
// Example:
//   node delete_image.js a3f8b2c1-xxxx a1b2c3d4-xxxx f9e8d7c6-xxxx

require('dotenv').config({ path: './backend/.env' })

const { Client } = require('pg')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const DATABASE_URL = process.env.DATABASE_URL

// ── Delete a single image by ID ────────────────────────────────
async function deleteSingleImage(client, imageId) {
  console.log(`\n── Processing: ${imageId}`)

  // Find the image in the database
  const findResult = await client.query(
    'SELECT * FROM images WHERE id = $1',
    [imageId]
  )

  if (findResult.rows.length === 0) {
    console.log('   ⚠️  Not found in database — skipping')
    return { success: false, reason: 'not found' }
  }

  const image = findResult.rows[0]
  console.log('   Address: ', image.address || 'none')
  console.log('   Uploaded:', new Date(image.created_at).toLocaleString())

  // Delete from Cloudinary
  const cloudResult = await cloudinary.uploader.destroy(
    image.stored_filename,
    { resource_type: 'image' }
  )

  if (cloudResult.result === 'ok') {
    console.log('   ✅ Deleted from Cloudinary')
  } else if (cloudResult.result === 'not found') {
    console.log('   ⚠️  Not found on Cloudinary (already deleted?) — continuing')
  } else {
    console.log('   ❌ Cloudinary error:', cloudResult.result)
    return { success: false, reason: 'cloudinary error' }
  }

  // Delete from Neon
  await client.query('DELETE FROM images WHERE id = $1', [imageId])
  console.log('   ✅ Deleted from database')

  return { success: true }
}

// ── Main function ──────────────────────────────────────────────
async function deleteImages() {

  // Read all UUIDs passed as command line arguments
  // process.argv = ['node', 'delete_image.js', 'uuid1', 'uuid2', ...]
  // slice(2) removes the first two items to get just the UUIDs
  const imageIds = process.argv.slice(2)

  if (imageIds.length === 0) {
    console.error('❌ No image IDs provided.')
    console.error('   Single:   node delete_image.js <uuid>')
    console.error('   Multiple: node delete_image.js <uuid1> <uuid2> <uuid3>')
    process.exit(1)
  }

  console.log(`\n🗑️  Preparing to delete ${imageIds.length} image(s)...`)
  console.log('   IDs:', imageIds.join(', '))

  // Connect once — reuse the same connection for all deletions
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()
  console.log('✅ Connected to Neon PostgreSQL')

  // Track results
  const results = { success: 0, failed: 0, skipped: 0 }

  // Process each ID one by one
  for (const id of imageIds) {
    const result = await deleteSingleImage(client, id.trim())
    if (result.success) {
      results.success++
    } else if (result.reason === 'not found') {
      results.skipped++
    } else {
      results.failed++
    }
  }

  await client.end()

  // Summary
  console.log('\n────────────────────────────────')
  console.log('📊 Summary:')
  console.log(`   ✅ Deleted:  ${results.success}`)
  console.log(`   ⚠️  Skipped:  ${results.skipped} (not found)`)
  console.log(`   ❌ Failed:   ${results.failed}`)
  console.log('────────────────────────────────')

  if (results.success > 0) {
    console.log('\n🎉 Done. Deleted images will no longer appear in the gallery.')
  }
}

deleteImages().catch((err) => {
  console.error('❌ Unexpected error:', err.message)
  process.exit(1)
})