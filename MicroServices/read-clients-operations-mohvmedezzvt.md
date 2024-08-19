# READ clients endpoints documentation

## **GET /api/auth/client**

### **Description:**

REtrieve all clients for the authenticated user. Supports pagination.

### **Query Parameters:**

- `page`: (Optional) The page number to retrieve. Default is 0 (first page).

### **Access:**

Private (Requires authentication)

### **Responses:**

- **200 OK:**
  - Returns an array of clients.
- **500 Internal Server Error:**
  - Returns an error message if there is an issue retrieving clients.

### **Example Request:**

```bash
GET /api/auth/client?page=1
```

## **GET /api/auth/client/:id**

### **Description:**

REtrieve a client by their ID.

### **Path Parameters:**

- `id`: The ID of the client to retrieve.

### **Access:**

Private (Requires authentication)

### **Responses:**

- **200 OK:**
  - Returns the client object.
- **404 Not Found:**
  - If the client is not found.
- **500 Internal Server Error:**
  - Returns an error message if there is an issue retrieving the client.

### **Example Request:**

```bash
GET /api/auth/client/123
```
