// API SETTINGS
const SUPABASE_URL = "https://sahcbybmqhnctxeycfrp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qVk15PitIx9N_9L22TknAA_gFJQraiD";

// API CONNECTION
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

//    CHECK ACTIVITY
async function checkSessionAndRedirect() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        window.location.href = "../Dashboard/dashboard.html";
    }
}
checkSessionAndRedirect(); 

// ELEMENTS
const form = document.getElementById('signup-form');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    messageEl.textContent = "Creating account...";
    messageEl.style.color = "inherit"; 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    //  VALIDATION
    if (password !== confirmPassword) {
        messageEl.style.color = "red";
        messageEl.textContent = "Passwords do not match!";
        return;
    }



    //  Check if the username is already taken 
    const { data: existingProfile, error: checkError } = await supabaseClient
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle(); 

    if (existingProfile) {
        messageEl.style.color = "red";
        messageEl.textContent = "Error: Username is already taken!";
        return; 
    }

    if (checkError) {   
        console.error("Database connection check failed:", checkError);
    }

    //  If the username is free, proceed with your original signUp logic
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username 
            }
        }
    });

    if (error) {
        messageEl.style.color = "red";
        if (error.message.includes("already registered")) {
            messageEl.textContent = "Error: Email is already registered!";
        } else {
            messageEl.textContent = "Error: " + error.message;
        }
        console.error(error);
    } else {
        messageEl.style.color = "green";
        messageEl.textContent = "Success! Account created. Redirecting to login...";
        form.reset();

        // Redirect to login.html 
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }
});