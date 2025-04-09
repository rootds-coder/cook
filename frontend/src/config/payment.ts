interface PaymentConfig {
  upiId: string;
  merchantName: string;
  timeoutSeconds: number;
}

const paymentConfig: PaymentConfig = {
  upiId: "dhruv95@fam", // Change this to your UPI ID
  merchantName: "Fund Source",
  timeoutSeconds: 240 // 4 minutes
};

export default paymentConfig; 