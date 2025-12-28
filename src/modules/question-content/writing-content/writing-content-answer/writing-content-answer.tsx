import { useState } from "react";
import styles from "./writing-content-answer.module.css";
import {
  BtnBold,
  BtnUnderline,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { Export } from "../../../../svg/export";
import { Send } from "../../../../svg/send";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { SuccessModal } from "../success-modal/success-modal";

const successTexts = {
  export: "הקובץ ירד בהצלחה!",
  email: "הקובץ נשלח בהצלחה!",
};

export const WritingContentAnswer = () => {
  const [value, setValue] = useState("");
  const [successText, setSuccessText] = useState(successTexts.export);
  const [modalOpen, setModalOpen] = useState(false);

  const parseHTMLToTextRuns = (html: string): TextRun[] => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const textRuns: TextRun[] = [];

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text) {
          const parent = node.parentElement;
          const isBold =
            parent?.tagName === "B" || parent?.tagName === "STRONG";
          const isUnderline = parent?.tagName === "U";

          textRuns.push(
            new TextRun({
              text: text,
              bold: isBold,
              underline: isUnderline ? {} : undefined,
            })
          );
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === "BR") {
          textRuns.push(new TextRun({ text: "", break: 1 }));
        } else if (element.tagName === "DIV" || element.tagName === "P") {
          Array.from(node.childNodes).forEach(processNode);
          if (node.nextSibling) {
            textRuns.push(new TextRun({ text: "", break: 1 }));
          }
        } else {
          Array.from(node.childNodes).forEach(processNode);
        }
      }
    };

    Array.from(tempDiv.childNodes).forEach(processNode);

    return textRuns.length > 0 ? textRuns : [new TextRun("")];
  };

  const handleDownload = async () => {
    const textRuns = parseHTMLToTextRuns(value);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: textRuns,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `answer-${new Date().toISOString().slice(0, 10)}.docx`);
    setSuccessText(successTexts.export);
    setModalOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/<[^>]*>/g, ""));
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(value + text);
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  const sendEmail = () => {
    setSuccessText(successTexts.email);
    setModalOpen(true);
  };

  return (
    <EditorProvider>
      <div className={styles.modal}>
        <SuccessModal
          text={successText}
          open={modalOpen}
          close={() => setModalOpen(false)}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.title}>כתוב את תשובתך כאן</div>
        <Editor value={value} onChange={(e) => setValue(e.target.value)}>
          <Toolbar>
            <div className={styles.actions}>
              <div className={styles.action}>
                <BtnBold />
              </div>
              <div className={styles.action}>
                <BtnUnderline />
              </div>
              <button className={styles.action} onClick={handleCopy}>
                Copy
              </button>
              <button className={styles.action} onClick={handlePaste}>
                Paste
              </button>
            </div>
          </Toolbar>
        </Editor>
        <div className={styles.footer}>
          <button
            className={`${styles.saveButton} ${styles.button}`}
            onClick={handleDownload}
          >
            <span>לשמור במחשב</span>
            <Export />
          </button>
          <button
            onClick={sendEmail}
            className={`${styles.sendButton} ${styles.button}`}
          >
            <span>לשלוח לבדיקה במייל</span>
            <Send />
          </button>
        </div>
        <div className={styles.autoSaveNotice}>
          המערכת תשמור אוטומתית בסוף הזמן
        </div>
      </div>
    </EditorProvider>
  );
};
