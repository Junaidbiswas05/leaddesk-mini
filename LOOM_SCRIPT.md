# Loom Walkthrough Script: LeadDesk Mini

**Goal:** Demonstrate the end-to-end functionality of LeadDesk Mini to verify it meets all requirements.

---

### Step 1: Landing Page & Client Validation
1. Start recording with the **Landing Page (`/`)** open in a fresh incognito window.
2. Say: *"Here is the public landing page for LeadDesk Mini."*
3. Click the **Get Started** submit button without filling out the form to trigger client-side validation errors.
4. Point out the validation errors (e.g., "Name must be at least 2 characters", "Please enter a valid email address").

### Step 2: Successful Lead Submission
1. Fill out the form with test data:
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Budget: `$5k-$20k`
   - Message: `I need a new SaaS landing page design.`
2. Click **Get Started**.
3. Show the success confirmation screen ("Message Sent!").

### Step 3: Admin Authentication Protection
1. Try to navigate to `/admin` directly in the URL bar.
2. Show that you are automatically redirected to `/admin/login` because the route is protected by NextAuth middleware.

### Step 4: Admin Login
1. Fill in the login credentials:
   - Email: `admin@digitalheroes.com`
   - Password: `supersecretpassword`
2. Click **Sign In**.
3. Point out that you are successfully redirected to the `/admin` dashboard.

### Step 5: Dashboard & Search
1. Show the table with the new lead (`Jane Smith`) at the top.
2. Use the search bar to search for "Jane" or "SaaS" to demonstrate the server-side filtering working dynamically.
3. Clear the search.

### Step 6: Status Toggle
1. Click the status dropdown for the lead and change it from `New` to `Contacted`.
2. Wait a second for it to update (optimistic UI or loading spinner finishes).
3. **Refresh the page** (F5) to prove that the new status (`Contacted`) persists in the database.

### Step 7: Footer Verification
1. Scroll down to the bottom of the admin page to show the footer: **"Built for Digital Heroes Training Task"**.
2. Click the link to prove it directs to `https://digitalheroesco.com`.
3. Say: *"That completes the walkthrough of the full-stack LeadDesk Mini application!"*
4. End recording.
