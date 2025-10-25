'use server';

import { getPayload } from "payload";
import config from "@payload-config";

export const updateFeeReceipt = async (data: {
  receiptId: number;
  paidMethod: "BANK" | "JAZZCASH" | "EASYPAISA" | "CASH";
  proofImage?: File | null;
  proofText?: string;
}) => {
  try {
    const payload = await getPayload({ config })

    let proofImage = null;

    if (data.proofImage) {
      const buffer = Buffer.from(await data.proofImage.arrayBuffer());
      proofImage = await payload.create({
        collection: 'media',
        data: {
          alt: `Proof For Receipt Id ${data.receiptId}`,
        },
        file: {
          data: buffer,
          mimetype: data.proofImage.type,
          name: data.proofImage.name,
          size: data.proofImage.size,
        }
      })
    }

    await payload.update({
      collection: 'fee-receipts',
      id: data.receiptId,
      data: {
        paidMethod: data.paidMethod,
        proofText: data.proofText,
        status: 'RECEIVED',
        payDate: new Date().toISOString(),
        proofImage,
      },
    })

    return {
      success: true,
      message: `Payment successfully recorded via ${data.paidMethod}. Your receipt #${data.receiptId} has been updated and marked as received.`
    };

  } catch (error) {
    console.error(error);
    return {
      success: false, message: `We couldn't process your payment information at this time. Please verify your details and try again, or contact support if the issue persists.`
    };
  }
}