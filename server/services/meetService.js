/**
 * Google Meet Meeting Service
 * Generates and manages Google Meet links for online consultations
 */

/**
 * Generate a unique Google Meet link
 * Format: https://meet.google.com/RANDOM-CODE
 * @returns {string} Google Meet link
 */
export function generateGoogleMeetLink() {
  // Generate a unique code for the meeting
  // Format: consonant-consonant-consonant (e.g., "bhr-ozy-gla")
  const consonants = 'bcdfghjklmnprstvwxyz'
  const vowels = 'aeiou'

  function getRandomChar(chars) {
    return chars.charAt(Math.floor(Math.random() * chars.length))
  }

  function generateCode() {
    let code = ''
    for (let i = 0; i < 3; i++) {
      code += getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants)
      if (i < 2) code += '-'
    }
    return code
  }

  const code = generateCode()
  return `https://meet.google.com/${code}`
}

/**
 * Extract meeting code from Google Meet link
 * @param {string} meetingLink - Full Google Meet URL
 * @returns {string|null} Meeting code or null if invalid
 */
export function extractMeetingCode(meetingLink) {
  const match = meetingLink?.match(/meet\.google\.com\/([a-z\-]+)/)
  return match ? match[1] : null
}

/**
 * Validate Google Meet link format
 * @param {string} meetingLink - Link to validate
 * @returns {boolean} True if valid Google Meet link
 */
export function isValidGoogleMeetLink(meetingLink) {
  if (!meetingLink) return false
  return /^https:\/\/meet\.google\.com\/[a-z\-]+$/.test(meetingLink)
}
