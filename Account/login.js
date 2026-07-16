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

// CHECK ACTIVITY
async function checkSessionAndRedirect() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        window.location.href = "../Dashboard/dashboard.html";
    }
}

checkSessionAndRedirect(); 

// ELEMENTS
const form = document.getElementById('login-form');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    messageEl.textContent = "Logging in...";
    messageEl.style.color = "inherit"; 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        messageEl.style.color = "red";
        messageEl.textContent = "Error: " + error.message;
    } else {
        messageEl.style.color = "green";
        messageEl.textContent = "Success! Redirecting...";
        
        // Redirect the user to your main project dashboard
        setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html";
        }, 1000);
    }
});