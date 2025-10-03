# Vim Quizzer

A Vim quiz application built with Next.js 14, TypeScript, and Tailwind CSS. Test your Vim knowledge with random questions.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with Bootstrap integration
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Vercel Ready**: Optimized for Vercel deployment with serverless functions
- **Performance**: Static generation, optimized builds, and efficient API routes
- **SEO Optimized**: Meta tags, structured data, and accessibility features

## 🛠️ Technologies

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Bootstrap 5**: Component library
- **Font Awesome**: Icon library

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **MySQL2**: Database connection with connection pooling
- **TypeScript**: Type-safe API development

## 📁 Project Structure

```bash
vim-quizzer/
├── components/          # React components
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WelcomeSection.tsx
│   ├── QuizSection.tsx
│   ├── QuestionDisplay.tsx
│   └── ResultsDisplay.tsx
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   └── v1/
│   │       └── questions.ts
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── lib/               # Utility libraries
│   └── database.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── styles/            # Global styles
│   └── globals.css
├── public/            # Static assets
│   ├── fonts/
│   └── images/
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MySQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vim-quizzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

4. **Set up the database**

   Import the existing SQL files from the `config/` directory:

   ```bash
   mysql -u your_username -p vim_quizzer < config/setup_mysql_dev.sql
   mysql -u your_username -p vim_quizzer < config/dev_questions.sql
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- Strict type checking
- Path mapping for clean imports
- Next.js optimizations

### Build Optimization

- **Standalone Output**: Optimized for serverless functions
- **Image Optimization**: Next.js Image component ready
- **Static Generation**: Where possible for better performance

### Environment Variables

| Variable        | Description                           | Required |
| --------------- | ------------------------------------- | -------- |
| `DATABASE_URL`  | MySQL connection string               | Yes      |
| `MYSQL_CA_CERT` | CA certificate for secure connections | No       |

## 📊 API Endpoints

### GET /api/v1/questions

Returns 10 random Vim quiz questions.

**Response:**

```json
{
  "response_code": 200,
  "results": [
    {
      "question": "What is the command to save a file in Vim?",
      "correct_answer": ":w",
      "incorrect_answers": [":s", ":save", ":savefile"]
    }
  ]
}
```

## 🎨 Styling

The application uses a combination of:

- **Tailwind CSS**: Utility-first styling
- **Bootstrap 5**: Component library
- **Custom CSS**: Project-specific styles
- **Font Awesome**: Icons

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- **ESLint**: Code linting with Next.js rules
- **TypeScript**: Strict type checking

## 👨‍💻 Author

**Ajisafe Oluwapelumi** - Software Engineer

- [GitHub](https://github.com/ajipelumi)
- [LinkedIn](https://www.linkedin.com/in/ajisafeoluwapelumi/)
- [Twitter](https://twitter.com/the_pelumi)
- [Dev.to](https://dev.to/ajipelumi)
