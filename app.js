// ----------------------------------------
//  PHC SOLUTIONS FRONTEND - CORE JS
// ----------------------------------------

// Replace these with your real keys from Supabase
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

const supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------
// AUTH HELPERS
// ------------------------------
async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}

// ------------------------------
// LOAD SERVICES
// ------------------------------
async function fetchServices() {
    let { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

// ------------------------------
// APPLY FOR SERVICE
// ------------------------------
async function applyForService(serviceId, message) {
    const user = await getCurrentUser();
    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // Get user profile
    const profileRes = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .single();

    const applicantId = profileRes.data.id;

    const { error } = await supabase.from("applications").insert([
        {
            service_id: serviceId,
            applicant_id: applicantId,
            message: message,
        },
    ]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Application submitted");
    }
}
