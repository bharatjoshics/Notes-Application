export const defaultMarkdownNote = {
  title: "Supports Markdown Style",
  content: `
# Welcome to Markdown Notes

This app supports **Markdown formatting** so you can write structured and beautiful notes.

---

## ✍️ Try It Yourself

Type this:

\`\`\`
**Hello**
\`\`\`

You will see:

**Hello**

---

## 🧾 Headings

Type:

\`\`\`
# Heading 1
## Heading 2
### Heading 3
\`\`\`

Result:

# Heading 1
## Heading 2
### Heading 3

---

## 🔤 Bold & Italic

Type:

\`\`\`
**Bold text**

*Italic text*
\`\`\`

Result:

**Bold text**

*Italic text*

---

## 📋 Lists

### Unordered List

Type:

\`\`\`
- Item One
- Item Two
- Item Three
\`\`\`

Result:

- Item One
- Item Two
- Item Three

### Ordered List

Type:

\`\`\`
1. First
2. Second
3. Third
\`\`\`

Result:

1. First
2. Second
3. Third

---

## 💻 Code

Inline code:

Type:

\`\`\`
\`const x = 10;\`
\`\`\`

Result:

\`const x = 10;\`

Code block:

\`\`\`javascript
function greet() {
  console.log("Hello World");
}
\`\`\`

---

## 📝 Paragraphs

Just write normally:

\`\`\`
Markdown makes writing notes simple and clean.
\`\`\`

Result:

Markdown makes writing notes simple and clean.

---

## 🎉 You're Ready!

Start writing your notes using Markdown and make them **clear, structured, and powerful**.
`
};


export const defaultNote = {
  title: "🔐 Encryption Info",
  content: `# 🔐 Your Data is Secure

This app uses **End-to-End Encryption (E2EE)** for note content.

## 🛡️ What does this mean?

- Your note **content is encrypted on your device**
- Even the server **cannot read it**
- Only you can decrypt it

---

## 🔐 About the Badge

You may see a **🔐 E2EE Protected badge** on some notes.

👉 This means:
- The note content is **securely encrypted**
- It is **stored safely in the database**
- Only visible to you after decryption

🟢 If a note has the badge → it is encrypted  
⚪ If no badge → it is not encrypted yet

---

## ⚠️ Important Rule

❌ Do NOT store sensitive data in the title  
✅ Store it inside content

---

## ✅ Example Usage

**Title:** Facebook Password  
**Content:** password123  

---

## 🔍 Searching Notes

Search works on **title only**

So you can simply search:
👉 Facebook Password

---

Stay secure 🔒`
};