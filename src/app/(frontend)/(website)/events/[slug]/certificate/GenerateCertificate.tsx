'use client'

import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import eventCertificate from './eventsCertificate.jpg'

export function GenerateCertificate({ name, title }: { name: string, title: string }) {
  const handleDownload = () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [eventCertificate.width, eventCertificate.height],
    })
    pdf.addImage(eventCertificate.src, 'PNG', 0, 0, eventCertificate.width, eventCertificate.height)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(70)
    pdf.setTextColor(20, 58, 107)

    const user = name
    const userWidth = (pdf.getStringUnitWidth(user) * pdf.getFontSize()) / 1.5
    const xPosition = (eventCertificate.width - userWidth) / 2

    pdf.text(user, xPosition, 600)

    pdf.setFont('helvetica', 'bold', 600)
    pdf.setFontSize(60)
    pdf.setTextColor(0, 0, 255)
    const heading = title
    const headingWidth = pdf.getStringUnitWidth(heading) * pdf.getFontSize() / 1.5
    const xPositio = (eventCertificate.width - headingWidth) / 2
    // const yPositio = eventCertificate.height / 1.4
    pdf.text(heading, xPositio, 760)

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(35)
    const date = format(new Date(), 'MMMM dd, yyyy')
    const dateWidth = pdf.getStringUnitWidth(date) * pdf.getFontSize()
    const dateXPosition = (eventCertificate.width - dateWidth) / 2
    const dateYPosition = eventCertificate.height / 1 + 20
    pdf.text(date, 205, 1095)

    pdf.save(`${name}-Certificate.pdf`)
  }

  return (
    <Button
      type="submit"
      className="bg-primary flex justify-center hover:bg-primary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-2 rounded-xl"
      onClick={handleDownload}
    >
      Download eventCertificate
    </Button>
  )
}

export default GenerateCertificate
