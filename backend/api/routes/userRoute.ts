import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;
    
    // Fetch the user's details based on the username
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('id, username, password_hash')
        .eq('username', username)
        .single();

    if (fetchError || !user) {
        return res.status(400).json({ success: false, error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        return res.status(400).json({ success: false, error: "Invalid username or password" });
    }

    // Generate a simple session token (for demonstration purposes only)
    const sessionToken = `user-${user.id}-${Date.now()}`;

    // Return the session token to the client
    res.json({ success: true, message: "Login successful", token: sessionToken });
});

export default router;