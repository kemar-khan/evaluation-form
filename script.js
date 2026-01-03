const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwl7ZUSEMw0rodtnRQpMQKu_9-EH0AS1bpIjDcE6AVIYravQLlB1eL3LXNebucqiBKa/exec";

const form = document.getElementById("evalForm");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    statusMessage.textContent = "";

    const formData = new FormData(form);

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData   // ✅ NO headers
        });

        const result = await response.json();

        if (result.status === "success") {
            statusMessage.textContent = "✅ Evaluation submitted successfully!";
            statusMessage.style.color = "#10b981";
            form.reset();
        } else {
            throw new Error(result.message);
        }

    } catch (err) {
        console.error(err);
        statusMessage.textContent = "❌ Submission failed.";
        statusMessage.style.color = "#ef4444";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Evaluation";
    }
});
