# Local Setup

## 1. Server environment variables

Create `server/.env` by copying `server/.env.example`, then replace the placeholder values.

Required for login/register:

```env
PORT=5000
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
```

Required only for admin product image uploads:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Required only for PayPal checkout:

```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

## 2. Install dependencies

```sh
cd server
npm install

cd ../vite
npm install
```

## 3. Run locally

Open two terminals.

Terminal 1:

```sh
cd server
npm run dev
```

Terminal 2:

```sh
cd vite
npm run dev
```

Then open the Vite URL: `http://127.0.0.1:5173/shop/home`.

If `npm run dev` says port `5173` is already in use, stop the old Vite terminal first and run it again. The frontend is configured to use one fixed port so the backend CORS and browser links stay in sync.

## Notes

- If you use the same old MongoDB database, your old users/products should still be there.
- If you use a new empty MongoDB database, register a new user first.
- Keep `server/.env` private. Do not commit real API keys.
