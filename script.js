const form = document.getElementById("quizForm");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const resultCard = document.getElementById("result");
const percentageEl = document.getElementById("percentage");
const rankEl = document.getElementById("rank");
const titleEl = document.getElementById("titleText");
const descriptionEl = document.getElementById("descriptionText");
const shareBtn = document.getElementById("shareBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const pulseFill = document.getElementById("pulseFill");
const toast = document.getElementById("toast");

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
  resultCard.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
  calculateBtn.textContent = "Update My Meter";
}

function resetForm() {
  form.reset();
  resultCard.classList.add("hidden");
  resetBtn.classList.add("hidden");
  calculateBtn.textContent = "Check My Bhakti";
  pulseFill.style.width = "0%";
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
  const score = Math.round(Math.min(100, Math.max(0, total / 1.2)));
  showResult(score);
});

resetBtn.addEventListener("click", resetForm);

shareBtn.addEventListener("click", () => {
  const score = percentageEl.textContent;
  const rank = rankEl.textContent;
  const title = titleEl.textContent;
  const shareText = `My Modi Bhakti Meter result: ${score}% bhakti, heart rank ${rank}, title ${title}. Check it at bhaktimeter.vercel.app and dare your friends to see their bhagwa score!`;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast("Result copied. Share the bhagwa meter!");
    }).catch(() => {
      showToast("Could not copy. Try again.");
    });
  } else {
    const fallback = document.createElement("textarea");
    fallback.value = shareText;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "absolute";
    fallback.style.left = "-9999px";
    document.body.appendChild(fallback);
    fallback.select();
    try {
      document.execCommand("copy");
      showToast("Result copied. Share the bhagwa meter!");
    } catch {
      showToast("Could not copy. Try again.");
    }
    document.body.removeChild(fallback);
  }
});

whatsappBtn.addEventListener("click", () => {
  const score = percentageEl.textContent;
  const rank = rankEl.textContent;
  const title = titleEl.textContent;
  const shareText = `My Modi Bhakti Meter result: ${score}% bhakti, heart rank ${rank}, title ${title}. Check it at bhaktimeter.vercel.app and dare your friends to see their bhagwa score!`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  window.open(whatsappUrl, "_blank");
});
