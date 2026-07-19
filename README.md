# 💖 BeautyVault

![BeautyVault Banner](https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200&h=400)

BeautyVault is a modern, premium e-commerce web application tailored for beauty and cosmetic products. Built with cutting-edge technologies, it features an elegant UI, seamless animations, user authentication, and AI-powered recommendations.

## ✨ Features

- **Modern Tech Stack**: Built with Next.js 16 (App Router) and React 19.
- **Premium Design**: Beautiful, responsive, and glassmorphic user interface using Tailwind CSS v4, HeroUI, and Framer Motion.
- **AI-Powered**: Integrates OpenAI for intelligent product recommendations and a beauty assistant chat feature.
- **E-commerce Capabilities**: Complete shopping cart, wishlists, and secure checkout powered by Stripe.
- **User Authentication**: Secure login and registration using Better Auth with MongoDB adapter.
- **Seller Dashboard**: Users can add, edit, and manage their own products via a comprehensive dashboard.
- **Dynamic Content**: Browse products by categories or featured brands with dynamic routing.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI/Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [HeroUI](https://heroui.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **AI Integration:** [OpenAI API](https://openai.com/)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed on your machine. You will also need a MongoDB database URL, Stripe API keys, and an OpenAI API key.

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd beautyvault-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000

   # Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # AI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Build for Production

To generate an optimized production build, run:
```bash
npm run build
```

Then start the production server:
```bash
npm run start
```

## 🧹 Linting

To check for any structural or syntax issues across the codebase, run:
```bash
npm run lint
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
