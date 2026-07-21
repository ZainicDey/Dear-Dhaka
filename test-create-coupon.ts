import { prisma } from './src/lib/prisma';

async function run() {
  try {
    const code = "TESTCOUPON2";
    const discountPercent = 10;
    const discountAmount = null;
    const minOrderAmount = null;
    const maxDiscountCap = null;
    
    // Simulate empty string from input
    const startDateStr = "";
    const startDate = startDateStr ? new Date(String(startDateStr)) : undefined;
    
    const expiryDateStr = "";
    const expiryDate = expiryDateStr ? new Date(String(expiryDateStr)) : null;

    console.log("Creating with:", { code, discountPercent, discountAmount, minOrderAmount, maxDiscountCap, startDate, expiryDate });

    await prisma.coupon.create({
      data: {
        code,
        discountPercent,
        discountAmount,
        minOrderAmount,
        maxDiscountCap,
        startDate,
        expiryDate,
      }
    });

    console.log("Success");
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();
