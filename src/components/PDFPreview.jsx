import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useTranslation } from "react-i18next";

function PDFPreview({
  sender,
  customer,
  items,
  invoiceNumber,
  tax,
  discount,
  privacy,
  notes,
}) {
  const { i18n } = useTranslation();

  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <InvoicePDF
        sender={sender}
        customer={customer}
        items={items}
        invoiceNumber={invoiceNumber}
        tax={tax}
        discount={discount}
        businessInfo={{ businessName: "INVOICE" }}
        privacy={privacy}
        notes={notes}
        lang={i18n.language}
      />
    </PDFViewer>
  );
}

export default PDFPreview;
