# PDF Signature Tool

This application allows users to sign PDF documents easily and manage signatures with enhanced control and audit capabilities. Below are the implemented features and how to use them.

## 🚀 Features

### Core Signature Features

1. **Live Signature Preview**: Type your name and see a live preview with selectable fonts.

2. **Signature Fonts**: Choose from 8+ signature-style fonts (Google Fonts).

3. **Drag and Drop**: Drag your signature to the desired position on the PDF and lock it in place.

4. **Lock Signature**: Lock the signature position to prevent accidental moves.

5. **Zoom PDF In/Out**: Adjust PDF view for better placement precision.

6. **Export Options**: Save the signed PDF as an image or PDF document.

7. **Store Coordinates**: Save the signature's page number, x/y coordinates to the database.

### Draw Your Signature

1. **Drawing Canvas**: Draw your signature using the mouse or touch input.

2. **Clear & Save**: Easy tools for clearing and saving your drawing.

### Audit and Authorization

1. **Audit Trail**: See a history of all actions taken within the tool.

2. **Authorized Signers**: Grant signing authority to other users with specified roles.

## 🛠️ Instructions

### Setup

1. **Install Dependencies**:
```bash
npm install
```

2. **Start the Development Server**:
```bash
npm start
```

3. **Access the Application**:
Open your browser to `http://localhost:3000` to see the application in action.

### Usage

1. **Upload PDF**: Click the upload button to choose a PDF document.

2. **Type Signature**: In the "Signature Options" section, type your name.

3. **Select Font and Size**: Choose your desired font and adjust the size using the slider.

4. **Drag Signature**: Click and drag the signature on the PDF to place it.

5. **Lock in Place**: Use the lock button to freeze the signature's position.

6. **Draw Signature**: Switch to the drawing canvas to create a hand-drawn signature.

7. **Manage Signers**: Use the authorization panel to add other users who can sign.

8. **Audit History**: View all past actions under the audit trail panel.

9. **Save and Export**: Use the save options to export your document or signature data.

## 🔒 Security and Compliance

- **Data Encryption**: All data related to signatures is securely stored.
- **User Authentication**: Manage users with role-based authentication for signers and approvers.

---

Enjoy seamless document signing with this comprehensive PDF Signature Tool.
