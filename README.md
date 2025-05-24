
# Dark Empire Market - E-commerce Demo

This is a Star Wars themed e-commerce project, built with Next.js, React, TypeScript, and Firebase. It serves as a demonstration of a full-stack application (with a focus on frontend and Backend-as-a-Service - BaaS) including features for customers and an administrative panel.

## Live Demo

[Dark Empire Market](https://dark-empire-market.vercel.app/) - Experience the power of the Dark Side's e-commerce platform!

## Core Features

### Store (Customer Frontend)
*   Navigation through product pages and product details.
*   Product categorization with filters.
*   Functional shopping cart.
*   Checkout process with payment simulation via **Stripe** (using PaymentIntents and Stripe Elements).
*   User authentication:
    *   Registration of new accounts.
    *   Login with email/password.
    *   Social login with Google.
    *   Password recovery.
*   User profile page for viewing data and (simulated) order history.
*   Responsive and themed design with subtle animations.

### Administrative Panel (`/admin`)
*   Protected routes, accessible only by designated administrator users.
*   **Product Management:**
    *   Listing of existing products.
    *   Adding new products with name, description, price, stock, category, and image upload to **Firebase Storage**.
    *   Editing existing product information (including image changes).
    *   Deleting products (with confirmation dialog).
    *(Product CRUD operations in the admin panel currently manipulate mock data in the client's state, ready for integration with a database like Firestore).*
*   **Order Management (View):**
    *   Listing of orders (mock data).
    *   Viewing order details in a modal.
    *   Simulated order status changes.
*   **Customer Management (View):**
    *   Listing of registered customers (mock data).
    *   Viewing customer "dossiers" with details and order history in a modal.

## Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **UI (Frontend):** React 18
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN UI
*   **Animations:** Framer Motion
*   **Authentication:** Firebase Authentication (Email/Password, Google Sign-In)
*   **File Storage:** Firebase Storage (for user profile avatars and product images)
*   **Payments:** Stripe (PaymentIntents, Stripe Elements - test mode)
*   **Form Validation:** React Hook Form & Zod
*   **Icons:** Lucide React
*   **AI (Configured, not extensively implemented):** Genkit

## Local Setup and Execution

### Prerequisites
*   Node.js (version 18.x or higher recommended)
*   npm / yarn / pnpm

### Setup Steps

1.  **Clone the repository (if applicable) or download the project files.**
    ```bash
    # Example with git clone
    # git clone <repository-url>
    # cd <project-folder-name>
    ```

2.  **Create a project in Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project or use an existing one.
    *   Add a Web application to your project and copy the configuration credentials (`firebaseConfig`).
    *   In the "Authentication" section, enable the "Email/password" and "Google" providers.
    *   In the "Storage" section, configure security rules (see examples in project discussions for avatars and product images).

3.  **Create a Stripe account (for test mode):**
    *   Go to the [Stripe Dashboard](https://dashboard.stripe.com/).
    *   Obtain your test API keys: Publishable Key (`pk_test_...`) and Secret Key (`sk_test_...`).

4.  **Configure Environment Variables:**
    *   In the root of the project, create a file named `.env.local`.
    *   Add your Firebase and Stripe credentials (replace with your values):
        ```env
        # Firebase Configuration
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID

        # Stripe Configuration (use your TEST keys)
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
        STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
        ```

5.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

6.  **Create the Administrator User (if you haven't already):**
    *   In your running application, go to the registration page and create a user with the email: `admin@empire.com` password: `Change123!`

7.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9003` (or the port configured in `package.json`).

## Deployment

The application is deployed on [Vercel](https://vercel.com) and available at [https://dark-empire-market.vercel.app/](https://dark-empire-market.vercel.app/).

## Potential Next Steps (Future Enhancements)
*   Full integration of the administrative panel with Firebase Firestore for data persistence of products, orders, and customers.
*   Implementation of product search and advanced filters.
*   Category and tag management system in the administrative panel.
*   Complete order and customer management functionalities.
*   Unit and integration tests.
*   Performance optimizations and analytics integration.