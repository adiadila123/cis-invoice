# CIS Invoice Calculator 🧾

A modern, bilingual (English/Romanian) invoice calculator specifically designed for CIS (Construction Industry Scheme) registered contractors in the UK.

## ✨ Features

- **Dual Calculation Modes**: Calculate invoices by days worked or hours worked
- **Bilingual Support**: Switch between English (en-GB) and Romanian (ro)
- **Automatic CIS Deduction**: Automatically calculates 20% CIS tax deduction
- **Drag & Drop**: Reorder work days with intuitive drag-and-drop
- **Live Preview**: See your invoice update in real-time
- **PDF Generation**: Generate professional PDF invoices
- **Bulk Entry**: Add multiple work days at once
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cis-invoice

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📋 Usage

1. **Select Calculation Type**: Choose between "Days" or "Hours" mode
2. **Enter Company Details**: Fill in your company name, UTR number, and client information
3. **Set Rate**: Enter your daily or hourly rate in GBP (£)
4. **Add Work Days**: Add individual days or bulk add multiple days
5. **Review Invoice**: Check the live preview on the right
6. **Download PDF**: Generate and download your professional invoice

## 💡 Features Explained

### CIS Calculation
The calculator automatically applies the 20% CIS deduction:
- **Gross Amount**: Total before deductions
- **CIS (20%)**: Tax deducted at source
- **Net Amount**: What you'll receive

### Bilingual Support
Switch between English and Romanian languages with a single click. All labels, buttons, and generated invoices adapt to the selected language.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for CIS contractors
