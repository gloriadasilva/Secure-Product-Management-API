# NexStore API
A secure product management API that allows you to manage your product listings and reach your customers. Create and manage your product listings while your customers can view and filter all available products.

## How to Install

**Step 1**: Create a folder in your local machine's VS Code

**Step 2**: Enter  

**Step 3**: Enter cd your-project-folder-name

**Step 4**: Enter npm install to install all packages and dependencies.

## NexStore Routes

– /api/v1/user: This route creates a new NexStore user

–/api/v1 /user/login: This route allows a NexStore user to log in with his/her credentials (email and password).

– /api/v1/auth/refresh: This route allows a NexStore user to refresh his/her expired token.

– /api/v1/user/logout: This route allows a NexStore user to log out.

– /api/v1/user/profile: This route allows you to fetch a NexStore user profile by ID.

– /api/v1/product: This route allows a NexStore user to create a new product.

– api/v1/product/edit/:id: This route allows a NexStore user to edit his/her product by ID.

– api/v1/product/delete/:id: This route allows a NexStore user to delete his/her product by ID.

 – api/v1/products: This route retrieves all available products.


– api/v1/product/search: This route allows you to search for a product by name, price, rating, and sort them either in ascending or descending order.

– api/v1/product/:id: This route allows you to retrieve a specific product by its name.

