# Clonestoxx

Clonestoxx is a full-stack application that allows users to copy trade from experienced traders on the Upstox platform. The application consists of a Next.js frontend and a Node.js backend.

## Features

- Create and manage master and child accounts
- Set up cloners to mirror trades from a master account to child accounts
- Modify order quantities for child accounts based on a configurable modifier percentage
- Real-time trade execution and synchronization across accounts
- User-friendly dashboard for monitoring and managing accounts and cloners

## Technologies Used

### Frontend

- Next.js
- React
- TailwindCSS
- Axios
- Zod (for data validation)
- NextAuth.js
- Prisma (ORM)

### Backend

- Node.js
- Express
- Prisma (ORM)
- MongoDB
- Puppeteer (for web scraping)
- Upstox API (for trading)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB database set up

### Installation

1. Clone the repository:
2. Install dependencies for the frontend:
    ```
    cd clonestoxx/frontend
    npm install
    ```
3. Install dependencies for the backend:
    ```
    cd ../backend
    npm install
    ```
4. Set up environment variables for the frontend and backend. You'll need to create `.env` files in the respective directories and add the required variables (e.g., database URL, API keys, etc.). Env examples have been provided

5. Migrate Prisma Schema to Database & Generate Prisma Client

    ```
    cd ../frontend
    npm run dbpush
    npm run prismaclient
    ```

6. Generate client on Backend
    ```
    cd ../backend
    npx prisma generate
    ```

5. Start the frontend development server:
    ```
    cd ../frontend
    npm run dev
    ```

6. Start the backend server:
    ```
    cd ../backend
    node index.js
    ```

The application should now be running at `http://localhost:3000`.

## .env.example Files
### Frontend
```
DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"
NEXT_PUBLIC_RESEND_API_KEY="YOUR_RESEND_API_KEY"
NEXTAUTH_SECRET="YOUR_JWT_SECRET"
UPLOADTHING_SECRET="YOUR_UPLOADTHING_SECRET"
NEXT_PUBLIC_UPLOADTHING_APP_ID="YOUR_UPLOADTHING_APP_ID"
CLONESTOXX_BACKEND="YOUR_BACKEND_URL"
```

### Backend
```
DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"
PORT_NUMBER="YOUR_BACKEND_PORT"
```


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).



