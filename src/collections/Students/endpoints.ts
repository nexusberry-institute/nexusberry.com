import type { Endpoint } from 'payload'

export const exportCsvEndpoint: Endpoint = {
  path: '/export-csv',
  method: 'get',
  handler: async (req) => {
    try {
      const payloadInstance = req.payload
      if (!payloadInstance) {
        return new Response(JSON.stringify({ error: 'Payload instance not available' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const result = await payloadInstance.find({
        collection: 'students',
        limit: 0,
        depth: 0,
      })

      let csvContent: string
      if (!result.docs?.length) {
        csvContent = '"Full Name"\n'
      } else {
        const csvRows = ['"Full Name"']
        for (const student of result.docs) {
          if (student.fullName) {
            csvRows.push(`"${student.fullName.replace(/"/g, '""')}"`)
          }
        }
        csvContent = csvRows.join('\n')
      }

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="students_names.csv"',
        }
      })
    } catch (error: any) {
      console.error('CSV export error:', error)
      return new Response(JSON.stringify({ error: 'Export failed', message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

export const exportEmailsEndpoint: Endpoint = {
  path: '/export-emails',
  method: 'get',
  handler: async (req) => {
    try {
      const result = await req.payload.find({
        collection: 'students',
        where: {
          user: { exists: true },
        },
        depth: 1,
        limit: 0,
      })

      const csvRows = ['"Email"']
      for (const student of result.docs) {
        if (student.user && typeof student.user === 'object' && 'email' in student.user && student.user.email) {
          csvRows.push(`"${(student.user.email as string).replace(/"/g, '""')}"`)
        }
      }

      return new Response(csvRows.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="students_emails.csv"',
        }
      })
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
