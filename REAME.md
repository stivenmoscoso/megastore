MegaStore Global - Data Migration & API System

1. Project Overview
This project is a high-performance backend solution designed to migrate legacy flat-file data (Excel/CSV) into a modern polyglot persistence architecture. It uses **PostgreSQL** for relational, transactional data and **MongoDB** for flexible audit logging.

2. Technical Architecture

SQL Database (PostgreSQL) - 3rd Normal Form (3FN)
The relational model was designed to eliminate data redundancy and ensure referential integrity.
* **Normalization Process:**
* **1FN:** Removed multi-valued attributes by creating atomic fields.
* **2FN:** Created separate tables for `Customers`, `Suppliers`, and `Categories` to ensure all non-key attributes depend on the primary key.
* **3FN:** Removed transitive dependencies. For example, `supplier_email` depends on `supplier_name`, so they were moved to a dedicated `suppliers` table, referenced by a Foreign Key in `products`.
* **Table Structure:** `customers`, `suppliers`, `categories`, `products`, `orders`, and `order_details`.

NoSQL Database (MongoDB) - Audit System
Used for the **Audit Log** system to track deleted products.
* **Justification (Embedding vs. Referencing):** We utilized **Embedding**.
* **Why?** When a product is deleted from the SQL database, we store the entire product object as a snapshot inside the Mongo document. This ensures that even if the relational record is gone, the audit log preserves the historical state of the data without needing to perform complex joins or lookups.

## 3. Installation & Setup

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd MegaStore
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Variables:**
Create a `.env` file in the root directory:
```env
PORT=3000
PG_USER=postgres
PG_HOST=localhost
PG_DB=megastore_db
PG_PASSWORD=your_password
PG_PORT=5432
MONGO_URI=mongodb://localhost:27017/megastore
```

4. **Database Setup:**
Execute the provided `database.sql` script in your PostgreSQL instance to create the schema.

5. **Run the Server:**
```bash
node src/app.js
```

## 4. API Endpoints

### Data Migration
* **POST** `/api/migrate`: Reads the `data.csv` file, parses the information, and populates the PostgreSQL database. It features **Idempotency logic** to prevent duplicate entries for customers, suppliers, and products.

### Business Intelligence (BI) Reports
* **GET** `/api/reports/suppliers`: Returns total items sold and total revenue per supplier.
* **GET** `/api/reports/customer/:email`: Returns the complete purchase history for a specific customer.

### Product Management
* **DELETE** `/api/products/:sku`: Removes a product from the SQL database and automatically creates an entry in the MongoDB **AuditLog** collection.

## 5. Migration Logic
The migration script uses a "Check-then-Insert" strategy (Idempotency):
1. It validates if the Category, Supplier, and Customer exist using `UNIQUE` constraints and `ON CONFLICT DO NOTHING`.
2. It links records using retrieved IDs to maintain strict referential integrity.
3. It ensures that the same CSV can be processed multiple times without corrupting the database state.