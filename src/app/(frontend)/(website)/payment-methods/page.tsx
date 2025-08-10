"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, CreditCard, Building2 } from "lucide-react"

interface BankDetails {
  bankName: string
  accountTitle: string
  accountNumber: string
  iban: string
}

const bankAccounts: BankDetails[] = [
  {
    bankName: "Meezan Bank Limited (MBL)",
    accountTitle: "NEXUSBERRY SOLUTIONS (SMC-PVT) LTD",
    accountNumber: "02060108915536",
    iban: "PK25MEZN0002060108915536",
  },
  {
    bankName: "NRSP MICROFINANCE BANK",
    accountTitle: "NEXUSBERRY SOLUTIONS (SMC-PVT) LTD",
    accountNumber: "0650010008949",
    iban: "PK62NRSP0000650010008949",
  },
]

export default function PaymentMethodsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const CopyButton = ({ text, fieldId }: { text: string; fieldId: string }) => (
    <Button variant="outline" size="sm" onClick={() => copyToClipboard(text, fieldId)} className="ml-2 h-8 w-8 p-0">
      {copiedField === fieldId ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Methods</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our available payment options below. You can transfer funds to any of these bank accounts.
          </p>
        </div>

        {/* Payment Instructions */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Payment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2">
              <li>• Transfer the exact amount to any of the bank accounts listed below</li>
              <li>• Use the provided IBAN for online transfers</li>
              <li>• Keep your transaction receipt for verification</li>
              <li>• Contact us with your payment proof for confirmation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <div className="grid gap-6 md:grid-cols-2">
          {bankAccounts.map((bank, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  {bank.bankName}
                </CardTitle>
                <CardDescription>Bank Account Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Account Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Account Title</label>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-mono text-sm text-gray-800 break-all">{bank.accountTitle}</span>
                    <CopyButton text={bank.accountTitle} fieldId={`title-${index}`} />
                  </div>
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Account Number</label>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-mono text-lg font-semibold text-gray-800">{bank.accountNumber}</span>
                    <CopyButton text={bank.accountNumber} fieldId={`account-${index}`} />
                  </div>
                </div>

                {/* IBAN */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">IBAN</label>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-mono text-sm text-gray-800 break-all">{bank.iban}</span>
                    <CopyButton text={bank.iban} fieldId={`iban-${index}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <p className="mb-2">If you have any questions about payments or need assistance, please contact us:</p>
            <div className="space-y-1">
              <p>📧 Email: info@nexusberry.com</p>
              <p>📞 Phone: +92 325 0362286</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            🔒 All transactions are secure and encrypted. Never share your banking details with unauthorized parties.
          </p>
        </div>
      </div>
    </div>
  )
}
