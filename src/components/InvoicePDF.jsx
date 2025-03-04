import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useTranslation } from "react-i18next";

Font.register({
  family: "Cairo",
  src: "fonts/Cairo-Regular.ttf",
});
const createStyles = (isRTL) =>
  StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 12,
      direction: isRTL ? "rtl" : "ltr",
      fontFamily: "Cairo",
      textAlign: isRTL ? "right" : "left",
    },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    headerRight: {
      textAlign: "right",
    },
    headerText: {
      fontSize: 10,
      marginBottom: 4,
    },
    section: {
      marginBottom: 30,
    },
    grid: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 40,
    },
    column: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
      fontFamily: "Cairo", // Ensure Arabic font is used
    },
    text: {
      fontSize: 10,
      marginBottom: 4,
      fontFamily: "Cairo", // Ensure Arabic font is used
    },
    table: {
      marginTop: 20,
    },
    tableHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      backgroundColor: "#f3f4f6",
      padding: 8,
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      padding: 8,
    },
    tableRowEven: {
      backgroundColor: "#f9fafb",
    },
    name: {
      width: "40%",
      paddingRight: isRTL ? 0 : 8,
      paddingLeft: isRTL ? 8 : 0,
      textAlign: isRTL ? "right" : "left",
    },
    description: {
      fontSize: 8,
      color: "#6B7280",
      marginTop: 2,
      fontFamily: "Cairo", // Ensure Arabic font is used
    },
    quantity: {
      width: "20%",
      paddingRight: isRTL ? 0 : 8,
      paddingLeft: isRTL ? 8 : 0,
      textAlign: isRTL ? "right" : "left",
    },
    price: {
      width: "20%",
      paddingRight: isRTL ? 0 : 8,
      paddingLeft: isRTL ? 8 : 0,
      textAlign: isRTL ? "right" : "left",
    },
    total: {
      width: "20%",
      textAlign: isRTL ? "right" : "left",
    },
    headerCell: {
      fontSize: 10,
      fontWeight: "bold",
    },
    cell: {
      fontSize: 10,
    },
    totalRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "flex-start",
      marginTop: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#e5e7eb",
    },
    totalText: {
      fontSize: 14,
      fontWeight: "bold",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: "center",
      fontSize: 8,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#e5e7eb",
    },
    contactInfo: {
      marginBottom: 8,
    },
    summaryContainer: {
      marginTop: 20,
      borderTopWidth: 0.5,
      borderTopColor: "#e5e7eb",
      paddingTop: 8,
      width: 200,
      alignSelf: isRTL ? "flex-start" : "flex-end",
    },
    summaryRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    summaryLabel: {
      fontSize: 8,
      color: "#6B7280",
      textAlign: isRTL ? "right" : "left",
    },
    summaryValue: {
      fontSize: 8,
      textAlign: isRTL ? "left" : "right",
    },
    totalSummaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
      paddingTop: 4,
      borderTopWidth: 0.5,
      borderTopColor: "#e5e7eb",
    },
    totalLabel: {
      fontSize: 9,
      fontWeight: "bold",
    },
    totalValue: {
      fontSize: 9,
      fontWeight: "bold",
    },
    logo: {
      width: 50,
      height: 50,
      objectFit: "contain",
      alignSelf: "center",
      marginHorizontal: 20,
    },
    privacyText: {
      fontSize: 10,
      color: "#666",
      fontFamily: "Cairo",
      textAlign: isRTL ? "right" : "left",
      width: "100%",
      wordBreak: "break-word",
    },
    notesText: {
      fontSize: 10,
      color: "#666",
      fontFamily: "Cairo",
      textAlign: isRTL ? "right" : "left",
      width: "100%",
      wordBreak: "break-word",
    },
    privacyContainer: {
      marginBottom: 10,
      width: "100%",
    },
    notesContainer: {
      marginBottom: 10,
      width: "100%",
    },
    textContent: {
      fontSize: 10,
      color: "#666",
      fontFamily: "Cairo",
      textAlign: isRTL ? "right" : "left",
      width: "100%",
      direction: isRTL ? "rtl" : "ltr",
      lineHeight: 1.6,
      writingMode: "horizontal-tb",
      unicodeBidi: "embed",
      textTransform: "none",
      textRendering: "optimizeLegibility",
    },
  });

const InvoicePDF = ({
  sender,
  customer,
  items,
  invoiceNumber,
  tax,
  discount,
  privacy,
  notes,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const styles = createStyles(isRTL);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t("pdf.invoice")}</Text>
          </View>
          {sender.logo && <Image src={sender.logo} style={styles.logo} />}
          <View style={styles.headerRight}>
            <Text style={styles.headerText}>
              <Text>{t("pdf.date")}: </Text>
              <Text>
                {format(new Date(), "PPP", { locale: isRTL ? ar : undefined })}
              </Text>
            </Text>
            <Text style={styles.headerText}>
              <Text>{t("pdf.invoiceNumber")}: </Text>
              <Text>{invoiceNumber}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("pdf.from")}:</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.text}>{sender?.name || "N/A"}</Text>
                <Text style={styles.text}>{sender?.phone || "N/A"}</Text>
                <Text style={styles.text}>{sender?.email || "N/A"}</Text>
                <Text style={styles.text}>{sender?.address || "N/A"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("pdf.billTo")}:</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.text}>{customer?.name || "N/A"}</Text>
                <Text style={styles.text}>{customer?.phone || "N/A"}</Text>
                <Text style={styles.text}>{customer?.email || "N/A"}</Text>
                <Text style={styles.text}>{customer?.address || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.name]}>
              {t("pdf.productName")}
            </Text>
            <Text style={[styles.headerCell, styles.quantity]}>
              {t("pdf.quantity")}
            </Text>
            <Text style={[styles.headerCell, styles.price]}>
              {t("pdf.price")}
            </Text>
            <Text style={[styles.headerCell, styles.total]}>
              {t("pdf.total")}
            </Text>
          </View>

          {items.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}
            >
              <View style={styles.name}>
                <Text style={styles.cell}>{item.name || "N/A"}</Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </View>
              <Text style={[styles.cell, styles.quantity]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cell, styles.price]}>
                <Text>{t("pdf.currency")}</Text>
                <Text>{item.price.toFixed(2)}</Text>
              </Text>
              <Text style={[styles.cell, styles.total]}>
                <Text>{t("pdf.currency")}</Text>
                <Text>{(item.quantity * item.price).toFixed(2)}</Text>
              </Text>
            </View>
          ))}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("pdf.subtotal")}</Text>
              <Text style={styles.summaryValue}>
                <Text>{t("pdf.currency")}</Text>
                <Text>{subtotal.toFixed(2)}</Text>
              </Text>
            </View>

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {t("pdf.discount")} ({discount}%)
                </Text>
                <Text style={styles.summaryValue}>
                  <Text>{t("pdf.currency")}</Text>
                  <Text>{discountAmount.toFixed(2)}</Text>
                </Text>
              </View>
            )}

            {tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {t("pdf.tax")} ({tax}%)
                </Text>
                <Text style={styles.summaryValue}>
                  <Text>{t("pdf.currency")}</Text>
                  <Text>{taxAmount.toFixed(2)}</Text>
                </Text>
              </View>
            )}

            <View style={styles.totalSummaryRow}>
              <Text style={styles.totalLabel}>{t("pdf.total")}</Text>
              <Text style={styles.totalValue}>
                <Text>{t("pdf.currency")}</Text>
                <Text>{total.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={styles.privacyContainer}>
            <Text style={[styles.sectionTitle, { fontSize: 10 }]}>
              {t("pdf.termsAndPrivacy")}:
            </Text>
            <Text style={styles.textContent}>{privacy || ""}</Text>
          </View>
          <View style={styles.notesContainer}>
            <Text style={[styles.sectionTitle, { fontSize: 10 }]}>
              {t("pdf.notes")}:
            </Text>
            <Text style={styles.textContent}>{notes || ""}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{t("pdf.thankYou")}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
