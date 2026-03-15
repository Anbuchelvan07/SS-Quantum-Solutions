import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'
import * as api from '../services/api'

const initialForm = {
  name: '',
  email: '',
  organization: '',
  topic: '',
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.organization.trim()) nextErrors.organization = 'Organization is required.'
    if (!form.topic.trim()) nextErrors.topic = 'Please select a topic.'
    if (!form.message.trim()) nextErrors.message = 'Please provide a brief context.'
    return nextErrors
  }

  const { profile } = useProfile()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(false)
      return
    }

    try {
      await api.submitContactForm(form)
      setSubmitted(true)
      setForm(initialForm)
    } catch (error) {
      console.error('Failed to submit form:', error)
      setErrors({ submit: 'Failed to submit. Please try again.' })
    }
  }

  if (!profile) return null

  const contactSection = profile.sections?.contact

  if (!contactSection) return null

  return (
    <InfoCard
      id="contact"
      eyebrow={contactSection.eyebrow}
      title={contactSection.title}
      description={contactSection.description}
    >

      <form onSubmit={handleSubmit} className="space-y-6 text-sm" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="organization"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Organization
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={form.organization}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              />
              {errors.organization && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.organization}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="topic"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Primary topic
              </label>
              <select
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              >
                <option value="">Select</option>
                <option value="feedback-consultation">Feedback about consultancing session</option>
                <option value="enquiry-blockchain">Enquiry about blockchain</option>
                <option value="other">Others</option>
              </select>
              {errors.topic && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.topic}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              Brief context
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:ring-offset-slate-950"
            >
              Submit enquiry
            </button>
            {submitted && Object.keys(errors).length === 0 && (
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Your enquiry has been recorded for this demo. In production, this would submit
                to your preferred channel.
              </p>
            )}
          </div>
        </form>
    </InfoCard>
  )
}

