// ---------------------------
// Constants & Helpers
// ---------------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOHAmIFNDMmsIY4UacgweLFF72besFD523UOK5KyM_YF1A7akt0aB6xEh8ResPWQzC/exec";

const form = document.getElementById("evalForm");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");

const normalize = v => (v || "").toString().trim().toLowerCase();

// --- Chart.js Global Configuration ---
Chart.defaults.color = '#94a3b8'; // text-muted
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// ---------------------------
// Form Submission (Stays largely the same)
// ---------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  
  const formData = new FormData(form);
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, { method: "POST", body: formData });
    const result = await response.json();
    if (result.status === "success") {
      statusMessage.textContent = "✅ Evaluation submitted successfully!";
      statusMessage.style.color = "#10b981";
      form.reset();
    } else { throw new Error(result.message); }
  } catch (err) {
    statusMessage.textContent = "❌ Submission failed.";
    statusMessage.style.color = "#ef4444";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Evaluation";
  }
});

// ---------------------------
// Dashboard Fetch & Charts
// ---------------------------
fetch(GOOGLE_SCRIPT_URL)
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) return;

    document.getElementById("totalResponses").textContent = data.length;

    const avg = key => (data.reduce((a, b) => a + Number(b[key] || 0), 0) / data.length).toFixed(1);

    document.getElementById("avgTechnical").textContent = avg("technicalRating");
    document.getElementById("avgWork").textContent = avg("workRating");
    document.getElementById("avgCommunication").textContent = avg("communicationRating");
    document.getElementById("avgAttitude").textContent = avg("attitudeRating");

    const yesCount = data.filter(d => normalize(d.recommendation) === "yes").length;
    const noCount = data.filter(d => normalize(d.recommendation) === "no").length;
    const maybeCount = data.filter(d => normalize(d.recommendation) === "maybe").length;

    document.getElementById("recommendYes").textContent = yesCount;
    document.getElementById("recommendNo").textContent = noCount;
    document.getElementById("recommendMaybe").textContent = maybeCount;

    const ctxBar = document.getElementById("ratingChart").getContext("2d");

    new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["Technical", "Work", "Comm.", "Attitude"],
        datasets: [{
          data: [
            avg("technicalRating"),
            avg("workRating"),
            avg("communicationRating"),
            avg("attitudeRating")
          ],
          // Use the lightest blue for maximum contrast
          backgroundColor: "#38bdf8", 
          hoverBackgroundColor: "#ffffff", // Turns white on hover for clear visibility
          borderRadius: 20,
          barThickness: 16,
          // Adds a subtle glow effect to the bars
          shadowBlur: 10,
          shadowColor: "rgba(56, 189, 248, 0.5)"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 0,
            max: 5,
            grid: { 
              color: "rgba(255, 255, 255, 0.1)", // Brightened grid lines slightly
              drawBorder: false 
            },
            ticks: { 
              color: "#f1f5f9", // Brightest text color
              stepSize: 1,
              font: { weight: '600' }
            }
          },
          x: {
            grid: { display: false },
            ticks: { 
              color: "#f1f5f9", // Brightest text color
              font: { weight: '600' }
            }
          }
        }
      }
    });
    
    // 2. Clean Doughnut (Recommendation)
    const ctxDoughnut = document.getElementById("recommendationChart").getContext("2d");
    new Chart(ctxDoughnut, {
      type: "doughnut",
      data: {
        labels: ["Yes", "No", "Maybe"],
        datasets: [{
          data: [yesCount, noCount, maybeCount],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
          hoverOffset: 0,
          borderWidth: 8,
          borderColor: "#0f172a" // Matches card background for "gap" effect
        }]
      },
      options: {
        cutout: "85%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 30, color: '#64748b' } }
        }
      }
    })
}); 