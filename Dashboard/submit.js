// 1. Configure & Initialize Supabase
const SUPABASE_URL = "https://sahcbybmqhnctxeycfrp.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_qVk15PitIx9N_9L22TknAA_gFJQraiD"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const challengeTitle = document.getElementById('challenge-title');
const challengeMonth = document.getElementById('challenge-month');
const challengePoints = document.getElementById('challenge-points');
const challengeInstructions = document.getElementById('challenge-instructions');
const submissionForm = document.getElementById('submission-form');
const submissionUrl = document.getElementById('submission-url');
const submissionMessage = document.getElementById('submission-message');
const submitBtn = document.getElementById('submit-btn');

let currentUser = null;
let challengeId = null;

async function initSubmitPage() {
    // Check if session exists
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session || !session.user) {
        window.location.href = "../Account/login.html";
        return;
    }
    
    currentUser = session.user;

    // Grab the challenge ID from URL query parameters (e.g. submit.html?id=uuid)
    const urlParams = new URLSearchParams(window.location.search);
    challengeId = urlParams.get('id');

    if (!challengeId) {
        challengeTitle.textContent = "Invalid Anomaly Code";
        challengeInstructions.textContent = "Please return to the dashboard and select an anomaly from the radar list.";
        submitBtn.disabled = true;
        return;
    }

    await loadChallengeDetails();
}

async function loadChallengeDetails() {
    const { data: challenge, error } = await supabaseClient
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

    if (error || !challenge) {
        challengeTitle.textContent = "Scanning Failure";
        challengeInstructions.textContent = "Could not locate this specific paradox anomaly inside the timeline databases.";
        console.error("Fetch challenge error:", error);
        return;
    }

    // Populate the HTML
    challengeTitle.textContent = challenge.title;
    challengeMonth.textContent = challenge.month_year || "Active Paradox";
    challengePoints.textContent = `Reward: ${challenge.points_worth} EP`;
    challengeInstructions.textContent = challenge.instructions;
}

// Handle Form Submission
submissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submissionMessage.textContent = "Syncing solution into portal...";
    submissionMessage.style.color = "white";

    const url = submissionUrl.value.trim();

    // Insert submission record into the 'submissions' table
    const { error } = await supabaseClient
        .from('submissions')
        .insert([
            {
                user_id: currentUser.id,
                challenge_id: challengeId,
                submission_url: url,
                status: 'PENDING',
                submitted_at: new Date().toISOString() // Ensure timestamp matches schema formatting
            }
        ]);

    if (error) {
        console.error("Supabase insert crash details:", error);
        submissionMessage.textContent = "Failed to secure solution: " + error.message;
        submissionMessage.style.color = "#ef4444";
        submitBtn.disabled = false;
    } else {
        submissionMessage.textContent = "Patch deployed successfully! Standing by for supervisor clearance.";
        submissionMessage.style.color = "#10b981";
        submissionUrl.value = "";
        submitBtn.textContent = "Patch Synchronized";
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Initialize Patch";
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', initSubmitPage);