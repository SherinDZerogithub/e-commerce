# MongoDB Atlas Setup

This project uses MongoDB through Mongoose. You do not need to manually create every collection first; when the app writes data, Mongoose creates the collections automatically.

For a new database, the important work is:

1. Put the correct MongoDB connection string in `server/.env`.
2. Register your first user from the app.
3. Change that user's `role` to `admin` in MongoDB Atlas.
4. Add products from the admin page.

## 1. Create The Database

In MongoDB Atlas:

1. Open your project.
2. Go to **Database > Clusters**.
3. Click **Connect** on your cluster.
4. Choose **Drivers**.
5. Copy the connection string.

It will look like this:

```txt
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Change it so it includes the database name, for example `ecommerce`:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
```

Paste that into:

```txt
server/.env
```

Full minimum `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=use-any-long-random-secret-here
```

## 2. Network Access

If the server cannot connect to MongoDB:

1. In Atlas, go to **Security > Network Access**.
2. Click **Add IP Address**.
3. For local testing, use **Add Current IP Address**.
4. If your IP changes often, you can temporarily use `0.0.0.0/0`, but do not leave that for a real production app.

## 3. Database User

In Atlas:

1. Go to **Security > Database Access**.
2. Create a database user.
3. Give it read/write access.
4. Use that username and password inside `MONGO_URI`.

If the password has special characters like `@`, `#`, `/`, or `:`, URL-encode them or create a simpler password for local testing.

## 4. Collections Used By The App

Mongoose will create these collections automatically:

| Collection | Model | Created when |
| --- | --- | --- |
| `users` | `User` | Someone registers |
| `products` | `Product` | Admin adds a product |
| `carts` | `Cart` | User adds products to cart |
| `addresses` | `Address` | User adds checkout address |
| `orders` | `Order` | User starts PayPal checkout |
| `productreviews` | `ProductReview` | User adds a product review |

## 5. Users And Admins

First, register normally in the app:

```txt
http://localhost:5173/e-commerce/auth/register
```

That creates a document in the `users` collection.

Normal user:

```json
{
  "role": "user"
}
```

Admin user:

```json
{
  "role": "admin"
}
```

To make yourself admin:

1. In Atlas, go to **Database > Data Explorer**.
2. Open your database, for example `ecommerce`.
3. Open the `users` collection.
4. Find your user by email.
5. Click **Edit**.
6. Change `role` from `"user"` to `"admin"`.
7. Save.
8. Log out of the app and log in again.

Use lowercase exactly: `admin` or `user`.

Do not manually create passwords in Atlas unless you hash them first. The app hashes passwords during registration.

## 6. Products

Products should usually be added from the admin UI:

```txt
http://localhost:5173/e-commerce/admin/products
```

Allowed category values:

```txt
men
women
kids
```

Allowed brand values:

```txt
nike
adidas
puma
levi
zara
```

Example product document:

```json
{
  "image": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/example.jpg",
  "title": "Nike Running Shoes",
  "description": "Comfortable everyday running shoes.",
  "category": "men",
  "brand": "nike",
  "price": 120,
  "salePrice": 99,
  "totalStock": 20
}
```

If Cloudinary keys are not configured, image upload from the admin UI will fail. You can still test products by manually pasting an image URL into MongoDB.

## 7. Carts

You normally do not create carts manually. They are created when a user adds an item to cart.

Example structure:

```json
{
  "userId": "USER_OBJECT_ID",
  "items": [
    {
      "productId": "PRODUCT_OBJECT_ID",
      "quantity": 2
    }
  ]
}
```

## 8. Addresses

Addresses are created during checkout/account address flow.

Example structure:

```json
{
  "userId": "USER_OBJECT_ID",
  "address": "123 Main Street",
  "city": "Colombo",
  "pincode": "00100",
  "phone": "0712345678",
  "notes": "Near the main road"
}
```

## 9. Orders

Orders are created when a user starts PayPal checkout.

For checkout to work, add these to `server/.env`:

```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

You normally do not create orders manually.

## 10. Reviews

Reviews are created from the product details page.

Example structure:

```json
{
  "productId": "PRODUCT_OBJECT_ID",
  "userId": "USER_OBJECT_ID",
  "userName": "Sherin",
  "reviewMessage": "Good product.",
  "reviewValue": 5
}
```

## 11. Recommended Fresh Database Flow

1. Start backend:

```sh
cd server
npm run dev
```

2. Start frontend:

```sh
cd vite
npm run dev
```

3. Register your first account.
4. In Atlas, change that account's `role` to `"admin"`.
5. Log out and log in again.
6. Go to admin products and add products.
7. Register or use another account as a normal `"user"` to test shopping.

## 12. Quick Troubleshooting

If login says the user does not exist, you are probably connected to a new empty database. Register again or switch `MONGO_URI` to the old database.

If the server says `MongoDB Connected` but Atlas shows no collections, that is normal until the app writes data.

If admin routes send you away, check that your user document has:

```json
"role": "admin"
```

If product images fail, configure Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
