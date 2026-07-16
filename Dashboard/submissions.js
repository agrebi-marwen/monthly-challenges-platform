// 1. Configure & Initialize Supabase
const SUPABASE_URL = "https://sahcbybmqhnctxeycfrp.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_qVk15PitIx9N_9L22TknAA_gFJQraiD"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const logsTableBody = document.getElementById('logs-table-body');
let currentUser = null;

async function initSubmissionsPage() {
    // Authenticate user session
    const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
    
    if (authError || !session || !session.user) {
        window.location.href = "../Account/login.html";
        return;
    }
    
    currentUser = session.user;
    await fetchUserSubmissions();
}

async function fetchUserSubmissions() {
    logsTableBody.innerHTML = `<tr><td colspan="4" class="table-loading">Syncing secure telemetry feed...</td></tr>`;

    // We fetch submissions and join the matching 'challenges' records to display the title
    const { data: submissions, error } = await supabaseClient
        .from('submissions')
        .select(`
            id,
            submitted_at,
            submission_url,
            status,
            challenges (
                title
            )
        `)
        .eq('user_id', currentUser.id)
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error("Failed to query submissions log stream:", error);
        logsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="table-error">
                    Telemetry Fetch Failed: ${error.message}
                </td>
            </tr>`;
        return;
    }

    if (!submissions || submissions.length === 0) {
        logsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="table-empty">
                    No active or pending transmission signals detected from your origin coordinates.
                </td>
            </tr>`;
        return;
    }

    logsTableBody.innerHTML = ""; // Clear loader placeholder

    submissions.forEach(sub => {
        const timestamp = sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "Unknown";
        const challengeTitle = sub.challenges ? sub.challenges.title : "Unrecognized Anomaly";
        const targetUrl = sub.submission_url || "No target registered";
        
        // Status aesthetic rendering
        const cleanStatus = (sub.status || "PENDING").toUpperCase();
        let statusClass = "status-pending";
        if (cleanStatus === "APPROVED" || cleanStatus === "ACCEPTED") statusClass = "status-accepted";
        if (cleanStatus === "REJECTED") statusClass = "status-rejected";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-time">${timestamp}</td>
            <td class="col-title">${challengeTitle}</td>
            <td class="col-url">
                <a href="${targetUrl.startsWith('http') ? targetUrl : '#'}" target="_blank" class="table-link">
                    ${targetUrl}
                </a>
            </td>
            <td class="col-status">
                <span class="table-status-badge ${statusClass}">${cleanStatus}</span>
            </td>
        `;
        logsTableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', initSubmissionsPage);