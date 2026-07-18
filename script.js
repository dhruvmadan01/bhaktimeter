const form = document.getElementById("quizForm");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const resultCard = document.getElementById("result");
const percentageEl = document.getElementById("percentage");
const rankEl = document.getElementById("rank");
const titleEl = document.getElementById("titleText");
const descriptionEl = document.getElementById("descriptionText");
const downloadCertBtn = document.getElementById("downloadCertBtn");
const shareCertBtn = document.getElementById("shareCertBtn");
const pulseFill = document.getElementById("pulseFill");
const toast = document.getElementById("toast");

// Payment Modal Selectors
// Payment Modal Selectors
const paymentModal = document.getElementById("paymentModal");
const closePaymentBtn = document.getElementById("closePaymentBtn");
const copyUpiBtn = document.getElementById("copyUpiBtn");
const verifyPaymentBtn = document.getElementById("verifyPaymentBtn");
const payerNameInput = document.getElementById("payerNameInput");
const paymentSpinner = document.getElementById("paymentSpinner");
const spinnerStatus = document.getElementById("spinnerStatus");

// WhatsApp Share selectors
const whatsappShareUnlockBtn = document.getElementById("whatsappShareUnlockBtn");
const whatsappCountText = document.getElementById("whatsappCountText");
const shareProgressFill = document.getElementById("shareProgressFill");

// Unlock & Results selectors
const resultActions = document.getElementById("resultActions");
const revealScoreBtn = document.getElementById("revealScoreBtn");

// Certificate Preview elements
const certBorder = document.getElementById("certBorder");
const certMainTitle = document.getElementById("certMainTitle");
const certRecipientName = document.getElementById("certRecipientName");
const certScore = document.getElementById("certScore");
const certRank = document.getElementById("certRank");
const certRankTitle = document.getElementById("certRankTitle");
const certPulseFill = document.getElementById("certPulseFill");
const certStampText = document.getElementById("certStampText");
const landingTeaser = document.getElementById("landingTeaser");

let pendingScore = null;
let whatsappShares = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("toast-show");
  setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.classList.add("hidden");
  }, 2100);
}

function getAnswerValue(name) {
  const answer = form.elements[name];
  for (const item of answer) {
    if (item.checked) {
      return Number(item.value);
    }
  }
  return null;
}

function computeTitle(score) {
  if (score >= 90) {
    return {
      title: "Bhagwa Yodha",
      description: "A true bhagwa believer: your love score is through the roof, and Modiji ranks at the top of your heart."
    };
  }

  if (score >= 70) {
    return {
      title: "Rashtravaad Ke Sipahi",
      description: "The Modi bhakti is strong in you. Your heart rank is powerful, and you carry the bhagwa spirit with pride."
    };
  }

  if (score >= 50) {
    return {
      title: "Andhbhakt",
      description: "You follow the bhagwa path with loyalty. Your love score is solid, and Modiji holds an important place in your heart."
    };
  }

  if (score >= 30) {
    return {
      title: "Tirchha Bhakta",
      description: "You have some bhagwa energy, but there are still questions in your heart. Modiji is not yet your first choice."
    };
  }

  return {
    title: "Anti National",
    description: "Your bhakti meter is very low. Modiji ranks far down, and your heart still needs to connect with the bhagwa vibe."
  };
}

function showResult(score) {
  const rank = Math.max(1, Math.min(10, Math.ceil(score / 10)));
  const { title, description } = computeTitle(score);

  percentageEl.textContent = score;
  rankEl.textContent = rank;
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  pulseFill.style.width = `${score}%`;

  // Update Certificate Content
  certScore.textContent = `${score}%`;
  certRank.textContent = `${rank}/10`;
  certRankTitle.textContent = title;
  certPulseFill.style.width = `${score}%`;

  if (score < 30) {
    certBorder.classList.add("anti-national");
    certMainTitle.textContent = "ANTI-NATIONAL REPORT CARD";
    certStampText.textContent = "SUSPECT";
  } else {
    certBorder.classList.remove("anti-national");
    certMainTitle.textContent = "CERTIFICATE OF FEALTY";
    certStampText.textContent = "APPROVED";
  }

  // Set recipient name (use input if filled, otherwise default)
  const nameVal = payerNameInput.value.trim();
  certRecipientName.textContent = nameVal ? nameVal : "Your Name";

  // Hide landing teaser when showing actual result
  if (landingTeaser) {
    landingTeaser.classList.add("hidden");
  }

  resultCard.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
  calculateBtn.textContent = "Update My Meter";
}

function resetForm() {
  form.reset();
  resultCard.classList.add("hidden");
  resultCard.classList.remove("locked");
  resultActions.classList.remove("hidden");
  revealScoreBtn.classList.add("hidden");
  resetBtn.classList.add("hidden");
  calculateBtn.textContent = "Check My Bhakti";
  pulseFill.style.width = "0%";
  certPulseFill.style.width = "0%";

  // Show landing teaser when resetting
  if (landingTeaser) {
    landingTeaser.classList.remove("hidden");
  }
}

calculateBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const q1 = getAnswerValue("q1");
  const q2 = getAnswerValue("q2");
  const q3 = getAnswerValue("q3");
  const q4 = getAnswerValue("q4");

  if (q1 === null || q2 === null || q3 === null || q4 === null) {
    alert("Please answer all the questions before checking your Bhakti Meter.");
    return;
  }

  const total = q1 + q2 + q3 + q4;
  pendingScore = Math.round(Math.min(100, Math.max(0, total / 1.2)));
  
  // Render results card immediately but blur/lock it
  showResult(pendingScore);
  resultCard.classList.add("locked");
  resultActions.classList.add("hidden");
  revealScoreBtn.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth" });

  // Clear any previous input, reset sharing progress, and open payment modal
  payerNameInput.value = "";
  whatsappShares = 0;
  whatsappCountText.textContent = "0/7";
  shareProgressFill.style.width = "0%";
  paymentSpinner.classList.add("hidden");
  paymentModal.classList.remove("hidden");
});

// Close Payment Modal
closePaymentBtn.addEventListener("click", () => {
  paymentModal.classList.add("hidden");
  pendingScore = null;
});

// Copy UPI ID function
copyUpiBtn.addEventListener("click", () => {
  const upiIdText = "9315095214@fam";
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(upiIdText).then(() => {
      showToast("UPI ID copied. Complete the ₹9 payment!");
    }).catch(() => {
      showToast("Failed to copy. Please manually copy: " + upiIdText);
    });
  } else {
    const fallback = document.createElement("textarea");
    fallback.value = upiIdText;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "absolute";
    fallback.style.left = "-9999px";
    document.body.appendChild(fallback);
    fallback.select();
    try {
      document.execCommand("copy");
      showToast("UPI ID copied. Complete the ₹9 payment!");
    } catch {
      showToast("Failed to copy. Please manually copy: " + upiIdText);
    }
    document.body.removeChild(fallback);
  }
});

// Verify Payment Simulation (10-second GPay Name verification)
verifyPaymentBtn.addEventListener("click", () => {
  const payerName = payerNameInput.value.trim();
  
  if (payerName.length < 3) {
    alert("Please enter your name as shown in GPay / UPI app (at least 3 letters).");
    return;
  }

  // Show spinner overlay and simulate 10-second ledger checks
  paymentSpinner.classList.remove("hidden");
  spinnerStatus.textContent = "Connecting to FamPay ledger...";

  // Phase 2: Scan incoming records for this user (3.5s delay)
  setTimeout(() => {
    spinnerStatus.textContent = `Scanning incoming transactions for "${payerName}"...`;
    
    // Phase 3: Verify the ₹9 amount status (3.5s delay)
    setTimeout(() => {
      spinnerStatus.textContent = "Matching payment receipt for ₹9.00...";
      
      // Phase 4: Resolution (3s delay)
      setTimeout(() => {
        paymentSpinner.classList.add("hidden");
        paymentModal.classList.add("hidden");
        
        // Success: unlock result and scroll
        resultCard.classList.remove("locked");
        resultActions.classList.remove("hidden");
        revealScoreBtn.classList.add("hidden");
        showResult(pendingScore);
        resultCard.scrollIntoView({ behavior: "smooth" });
        showToast("Payment verified! Score unlocked successfully.");
        pendingScore = null;
      }, 3000);
    }, 3500);
  }, 3500);
});

// WhatsApp Share to Unlock logic
whatsappShareUnlockBtn.addEventListener("click", () => {
  const shareText = `Check your bhakti score, heart rank, and relation title with Modiji on Modi Bhakti Meter: https://bhaktimeter.vercel.app`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, "_blank");

  // Increment click shares
  whatsappShares = Math.min(7, whatsappShares + 1);
  
  // Update progress UI
  whatsappCountText.textContent = `${whatsappShares}/7`;
  shareProgressFill.style.width = `${(whatsappShares / 7) * 100}%`;

  if (whatsappShares < 7) {
    showToast(`Shared ${whatsappShares}/7! Share with ${7 - whatsappShares} more friends/groups on WhatsApp.`);
  } else if (whatsappShares >= 7) {
    // Show spinner overlay for simulated verification
    paymentSpinner.classList.remove("hidden");
    spinnerStatus.textContent = "Verifying WhatsApp shares...";

    setTimeout(() => {
      spinnerStatus.textContent = "Unlocking free access...";
      
      setTimeout(() => {
        paymentSpinner.classList.add("hidden");
        paymentModal.classList.add("hidden");
        
        // Success: unlock result and scroll
        resultCard.classList.remove("locked");
        resultActions.classList.remove("hidden");
        revealScoreBtn.classList.add("hidden");
        showResult(pendingScore);
        resultCard.scrollIntoView({ behavior: "smooth" });
        showToast("Access unlocked for free via sharing! Jai Shri Ram!");
        
        // Reset state
        whatsappShares = 0;
        whatsappCountText.textContent = "0/7";
        shareProgressFill.style.width = "0%";
        pendingScore = null;
      }, 1200);
    }, 1000);
  }
});

resetBtn.addEventListener("click", resetForm);

// Download Certificate PNG
downloadCertBtn.addEventListener("click", () => {
  const certElement = document.getElementById("bhaktiCertificate");
  showToast("Rendering HD certificate...");
  
  const options = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff"
  };

  html2canvas(certElement, options).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const score = percentageEl.textContent;
      const titleName = titleEl.textContent.toLowerCase().replace(/\s+/g, "_");
      link.download = `modi_bhakti_certificate_${score}_${titleName}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Certificate downloaded successfully!");
    }, "image/png");
  }).catch(() => {
    showToast("Could not download certificate. Try taking a screenshot!");
  });
});

// Share Certificate (Direct file share on mobile, download fallback on desktop)
shareCertBtn.addEventListener("click", () => {
  const certElement = document.getElementById("bhaktiCertificate");
  const score = percentageEl.textContent;
  const title = titleEl.textContent;
  const shareText = `Check out my Modi Bhakti Certificate: ${score}% Bhakti, title "${title}". Test yours at https://bhaktimeter.vercel.app !`;
  
  showToast("Preparing sharing image...");

  const options = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff"
  };

  html2canvas(certElement, options).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], "bhakti_certificate.png", { type: "image/png" });
      
      // Try native sharing (direct attachment support on mobile)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: "Modi Bhakti Certificate",
          text: shareText
        }).then(() => {
          showToast("Shared successfully!");
        }).catch(err => {
          console.log("Share cancelled or failed:", err);
          fallbackTextShare(shareText);
        });
      } else {
        // Fallback: download and redirect to WhatsApp
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bhakti_certificate.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast("Certificate downloaded! Redirecting to WhatsApp...");
        setTimeout(() => {
          fallbackTextShare(shareText);
        }, 1500);
      }
    }, "image/png");
  }).catch(() => {
    fallbackTextShare(shareText);
  });
});

function fallbackTextShare(shareText) {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, "_blank");
}

// Re-open modal if they click reveal button
revealScoreBtn.addEventListener("click", () => {
  paymentModal.classList.remove("hidden");
});

// Reflect name input live on certificate
payerNameInput.addEventListener("input", () => {
  const nameVal = payerNameInput.value.trim();
  certRecipientName.textContent = nameVal ? nameVal : "Your Name";
});

// Recent Transactions Ticker Logic
const tickerNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha", "Divya", "Sandeep", "Karan", "Pooja", "Aarav", "Kabir", "Meera", "Diya"];
const tickerColleges = ["DU", "DTU", "IIT Delhi", "NSUT", "IP University", "VIT", "BITS Pilani", "SRM", "MU", "BHU", "RVCE", "MIT"];
const tickerTitles = [
  "Certified Bhakt Certificate",
  "Anti-National Report Card",
  "Rashtravaad Ke Sipahi Profile",
  "Bhagwa Yodha Status"
];

function updateTicker() {
  const name = tickerNames[Math.floor(Math.random() * tickerNames.length)];
  const college = tickerColleges[Math.floor(Math.random() * tickerColleges.length)];
  const title = tickerTitles[Math.floor(Math.random() * tickerTitles.length)];
  const mins = Math.floor(Math.random() * 8) + 1; // 1 to 8 mins ago
  
  const tickerEl = document.getElementById("tickerText");
  if (tickerEl) {
    tickerEl.style.opacity = 0;
    setTimeout(() => {
      tickerEl.innerHTML = `⚡ <strong>${name}</strong> from <strong>${college}</strong> just unlocked their <em>${title}</em> (${mins} mins ago)`;
      tickerEl.style.opacity = 1;
    }, 350);
  }
}

// Start ticker
updateTicker();
setInterval(updateTicker, 4000);





