// services/api.js

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
import Cookies from 'js-cookie';


function authHeaders() {
    const token = Cookies.get('token');
    console.log('[authHeaders] token read from cookie:', token);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }


// ——— Admin Routes ———

// List all librarians
export async function getLibrarians() {
    const res = await fetch(`${API_BASE}/admin/librarians`, {
      headers: authHeaders(),
    });
  
    const data = await res.json();
    console.log('[getLibrarians] raw response data:', data);
  
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch librarians');
    }
  
    // now we know data.librarians should be an array
    console.log('[getLibrarians] returning librarians array:', data.librarians);
    return data.librarians;
  }


// Add a new librarian (auto-generate password)
export async function addLibrarian(librarianData) {
  const res = await fetch(`${API_BASE}/admin/librarians`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(librarianData),
  });
  const data = await res.json();    // always parse JSON

  if (!res.ok) {
    // throw the backend’s message (e.g. “Librarian already exists”)
    throw new Error(data.message || 'Failed to add librarian');
  }

  // On 201, data === { message, librarianId, password }
  return data;
}

// Update a librarian’s name/email
export async function updateLibrarian(id, updateData) {
  const res = await fetch(`${API_BASE}/admin/librarians/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updateData),
  });
  const data = await res.json();    // always parse JSON

  if (!res.ok) {
    // throw the backend’s message (e.g. “Librarian already exists”)
    throw new Error(data.message || 'Failed to update librarian');
  }

  // On 201, data === { message, librarianId, password }
  return data;
}

// Delete a librarian
export async function deleteLibrarian(id) {
  const res = await fetch(`${API_BASE}/admin/librarians/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete librarian');
  return res.json();
}

// ——— Auth Routes ———

// Student sign-up
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();

  if (res.ok) {
    // 201 → { message: 'Registration successful', userId: '...' }
    return data;
  } else {
    // e.g. 400 → { message: 'User already exists' }
    throw new Error(data.message || 'Failed to register');
  }
}

// Login (admin, librarian, or student)
export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (res.status === 401) {
    return { error: 'Invalid credentials' };
  } else if (!res.ok) {
    throw new Error('Login failed');
  }
  const response = await res.json();
  return response;
}

// ——— Book Routes ———

// Get all books (with optional filters)
export async function getBooks() {
    const res = await fetch(`${API_BASE}/books`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    console.log("[getBooks] raw:", data);
    if (!res.ok) throw new Error(data.message || 'Failed to fetch books');
    return data.books.map(book => ({ ...book, totalCount: book.totalCopies })); // expect an array of book objects
}

// Add a new book
export async function addBook(bookData) {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add book');
  // expect { message, bookId }
  return data;
}

// Update book details (and copies)
export async function updateBook(id, updateData) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return res.json();
}

// Delete a book
export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete book');
  return res.json();
}

// ——— Borrow Routes ———

// Recalculate fines for overdue records
export async function recalcFines() {
  const res = await fetch(`${API_BASE}/borrow/updateFines`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update fines');
  return res.json();
}

// Get full borrow history (all records)
export async function getBorrowHistory() {
    const res = await fetch(`${API_BASE}/borrow/history`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    console.log("[getBorrowHistory] raw:", data);
    if (!res.ok) throw new Error(data.message || 'Failed to fetch borrow history');
    return data.records; // expect an array of borrow records
  }

// ——— Librarian Routes ———

// List pending borrow requests
export async function getPendingRequests() {
  const res = await fetch(`${API_BASE}/librarian/pending`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  console.log("[getPendingRequests] raw:", data);
  if (!res.ok) throw new Error(data.message || "Failed to fetch pending requests");
  return data.pendingRequests; // Expect an array
}

// Approve a borrow request
export async function approveRequest(requestId) {
  const res = await fetch(`${API_BASE}/librarian/borrow/${requestId}/approve`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to approve request");
  return res.json();
}

// Reject a borrow request
export async function rejectRequest(requestId) {
  const res = await fetch(`${API_BASE}/librarian/borrow/${requestId}/reject`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to reject request");
  return res.json();
}

// Mark returned & calculate fine, increment copies
export async function returnBook(requestId, fine) {
  const res = await fetch(
    `${API_BASE}/librarian/borrow/${requestId}/return`,{ 
      method: 'PATCH' ,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',  // need to send JSON
      },
      body: JSON.stringify({ fine }),        // pass the fine
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to process return');
  return data;
}

// List overdue borrow records
export async function getOverdueRecords() {
    const res = await fetch(`${API_BASE}/librarian/overdue`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    console.log("[getOverdueRecords] raw:", data);
    if (!res.ok) throw new Error(data.message || 'Failed to fetch overdue records');
    return data.overdueRecords; // expect an array
}

// ——— Member Routes ———

// Submit a borrow request
export async function submitBorrowRequest(borrowData) {
  const res = await fetch(`${API_BASE}/member/borrow`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(borrowData),
  });
  if (!res.ok) throw new Error('Failed to submit borrow request');
  return res.json();
}

// List student’s approved (pending/approved) borrowed books
export async function getMyDueBooks() {
  
  const res = await fetch(`${API_BASE}/member/due`
    , {
      headers: authHeaders(),
    }
  );
  if (!res.ok) throw new Error('Failed to fetch due books');
  return res.json();
}

// Get student's own borrowing history (returned books)
export async function getMyBorrowHistory() {
  const res = await fetch(`${API_BASE}/borrow/member/history`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  console.log("[getMyBorrowHistory] raw:", data);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch borrow history');
  return data.records; // Expect an array of borrow records
}
