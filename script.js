
let scholarships = [
  {
    id: 1,
    name: "National Merit Support (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹20,000",
    level: ["UG"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["All India"],
    maxIncome: 500000,
    minCGPA: 7,
    icon: "🏅",
    description: "A sample merit-based opportunity for undergraduate students.",
    deadline: "Sample deadline: 31 December",
    url: "https://scholarships.gov.in/"
  },
  {
    id: 2,
    name: "Telangana Student Aid (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹15,000",
    level: ["UG", "Diploma"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["Telangana"],
    maxIncome: 300000,
    minCGPA: 6,
    icon: "📚",
    description: "A sample education assistance program for Telangana students.",
    deadline: "Sample deadline: 15 November",
    url: "https://telanganaepass.cgg.gov.in/"
  },
  {
    id: 3,
    name: "Women in Technology Grant (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹25,000",
    level: ["UG", "PG"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["All India"],
    maxIncome: 600000,
    minCGPA: 7.5,
    icon: "💻",
    description: "A sample grant designed to encourage women pursuing technology.",
    deadline: "Sample deadline: 20 December",
    url: "https://www.buddy4study.com/"
  },
  {
    id: 4,
    name: "Postgraduate Excellence Grant (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹30,000",
    level: ["PG"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["All India"],
    maxIncome: 500000,
    minCGPA: 8,
    icon: "🎓",
    description: "A sample merit grant for postgraduate students.",
    deadline: "Sample deadline: 10 January",
    url: "https://scholarships.gov.in/"
  },
  {
    id: 5,
    name: "First-Generation Learner Aid (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹12,000",
    level: ["UG", "Diploma"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["Andhra Pradesh", "Telangana"],
    maxIncome: 250000,
    minCGPA: 5,
    icon: "🌱",
    description: "A sample financial assistance program for eligible learners.",
    deadline: "Sample deadline: 30 November",
    url: "https://scholarships.gov.in/"
  },
  {
    id: 6,
    name: "STEM Achievement Grant (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹18,000",
    level: ["UG"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["All India"],
    maxIncome: 400000,
    minCGPA: 8.5,
    icon: "🔬",
    description: "A sample achievement grant for science and engineering students.",
    deadline: "Sample deadline: 5 December",
    url: "https://www.buddy4study.com/"
  },
  {
    id: 7,
    name: "School Education Support (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹8,000",
    level: ["School"],
    categories: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
    states: ["All India"],
    maxIncome: 200000,
    minCGPA: 5,
    icon: "📖",
    description: "A sample financial aid program for school students.",
    deadline: "Sample deadline: 1 December",
    url: "https://scholarships.gov.in/"
  },
  {
    id: 8,
    name: "Inclusive Education Grant (Demo)",
    provider: "ScholarPath Sample Program",
    amount: "₹10,000",
    level: ["UG", "PG", "Diploma"],
    categories: ["SC", "ST", "OBC", "Minority"],
    states: ["All India"],
    maxIncome: 300000,
    minCGPA: 5,
    icon: "🤝",
    description: "A sample grant illustrating category-based eligibility filters.",
    deadline: "Sample deadline: 18 December",
    url: "https://scholarships.gov.in/"
  }
];

const $ = (id) => document.getElementById(id);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

let profile = readStorage("scholarPathProfile", null);
let savedIds = readStorage("scholarPathSaved", []);

if (!Array.isArray(savedIds)) savedIds = [];

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Browser storage is unavailable.");
    return false;
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getEligibility(item, student = profile) {
  if (!student) return false;

  return (
    item.level.includes(student.education) &&
    item.categories.includes(student.category) &&
    (
      item.states.includes("All India") ||
      item.states.includes(student.state)
    ) &&
    student.income <= item.maxIncome &&
    student.cgpa >= item.minCGPA
  );
}

function updateStats() {
  $("totalCount").textContent = scholarships.length;

  $("matchCount").textContent = profile
    ? scholarships.filter(item => getEligibility(item)).length
    : 0;

  $("savedCount").textContent = savedIds.length;
}

function renderScholarships() {
  const query = $("searchInput").value.trim().toLowerCase();
  const state = $("stateFilter").value;
  const level = $("levelFilter").value;
  const matchOnly = $("eligibilityFilter").value === "match";

  const filtered = scholarships.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesState =
      state === "All" ||
      item.states.includes(state) ||
      item.states.includes("All India");

    const matchesLevel =
      level === "All" || item.level.includes(level);

    const matchesEligibility =
      !matchOnly || getEligibility(item);

    return (
      matchesSearch &&
      matchesState &&
      matchesLevel &&
      matchesEligibility
    );
  });

  $("resultsInfo").textContent =
    `Showing ${filtered.length} of ${scholarships.length} sample scholarships`;

  const list = $("scholarshipList");

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <strong>No scholarships found</strong>
        Try changing your search or filters.
      </div>`;

    return;
  }

  list.innerHTML = filtered.map(item => {
    const matched = getEligibility(item);
    const saved = savedIds.includes(item.id);

    return `
      <article class="scholarship-card">
        <div class="card-top">
          <div style="display:flex;gap:12px;min-width:0">
            <div class="card-icon">${item.icon}</div>

            <div>
              <h3>${item.name}</h3>
              <p class="provider">${item.provider}</p>
            </div>
          </div>

          <span class="${matched ? "match-tag" : "demo-tag"}">
            ${matched ? "Potential match" : "Demo"}
          </span>
        </div>

        <div class="amount">
          ${item.amount}
          <small>sample award</small>
        </div>

        <p class="card-description">${item.description}</p>

        <div class="chips">
          <span class="chip">${item.level.join(" / ")}</span>
          <span class="chip">${item.states.join(", ")}</span>
          <span class="chip">
            Income ≤ ₹${item.maxIncome.toLocaleString("en-IN")}
          </span>
          <span class="chip">CGPA ≥ ${item.minCGPA}</span>
        </div>

        <p class="provider">${item.deadline}</p>

        <div class="card-actions">
          <a class="apply-btn"
             href="${item.url}"
             target="_blank"
             rel="noopener noreferrer">
            Explore Portal ↗
          </a>

          <button class="save-btn" data-save="${item.id}">
            ${saved ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </article>`;
  }).join("");
}

function renderSaved() {
  const list = $("savedList");

  const items = scholarships.filter(item =>
    savedIds.includes(item.id)
  );

  if (!items.length) {
    list.innerHTML = `
      <div class="empty-state">
        <strong>No saved scholarships yet</strong>
        Click the Save button on a scholarship to add it here.
      </div>`;

    return;
  }

  list.innerHTML = items.map(item => `
    <article class="saved-item">
      <div>
        <h3>${item.icon} ${item.name}</h3>
        <p>${item.amount} · Sample award</p>
      </div>

      <button class="remove-btn" data-remove="${item.id}">
        Remove
      </button>
    </article>
  `).join("");
}

function renderAll() {
  updateStats();
  renderScholarships();
  renderSaved();
}

$("profileForm").addEventListener("submit", event => {
  event.preventDefault();

  const income = Number($("income").value);
  const cgpa = Number($("cgpa").value);

  if (!Number.isFinite(income) || income < 0) {
    showToast("Enter a valid family income.");
    return;
  }

  if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
    showToast("CGPA must be between 0 and 10.");
    return;
  }

  profile = {
    name: $("studentName").value.trim(),
    education: $("education").value,
    year: $("year").value,
    state: $("state").value,
    category: $("category").value,
    income,
    cgpa
  };

  if (!profile.name) {
    showToast("Please enter your name.");
    return;
  }

  if (!saveStorage("scholarPathProfile", profile)) return;

  $("profileMessage").textContent =
    `Profile saved! ${
      scholarships.filter(item => getEligibility(item)).length
    } potential matches found.`;

  renderAll();
  showToast("Student profile saved successfully!");
});

function loadProfile() {
  if (!profile) return;

  $("studentName").value = profile.name || "";
  $("education").value = profile.education || "UG";
  $("year").value = profile.year || "3";
  $("state").value = profile.state || "Telangana";
  $("category").value = profile.category || "General";
  $("income").value = profile.income ?? "";
  $("cgpa").value = profile.cgpa ?? "";
}

[
  "searchInput",
  "stateFilter",
  "levelFilter",
  "eligibilityFilter"
].forEach(id => {
  $(id).addEventListener(
    id === "searchInput" ? "input" : "change",
    renderScholarships
  );
});

$("scholarshipList").addEventListener("click", event => {
  const button = event.target.closest("[data-save]");

  if (!button) return;

  const id = Number(button.dataset.save);

  const updated = savedIds.includes(id)
    ? savedIds.filter(savedId => savedId !== id)
    : [...savedIds, id];

  if (!saveStorage("scholarPathSaved", updated)) return;

  savedIds = updated;
  renderAll();

  showToast(
    savedIds.includes(id)
      ? "Scholarship saved!"
      : "Scholarship removed from saved items."
  );
});

$("savedList").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");

  if (!button) return;

  const id = Number(button.dataset.remove);

  const updated = savedIds.filter(savedId => savedId !== id);

  if (!saveStorage("scholarPathSaved", updated)) return;

  savedIds = updated;
  renderAll();

  showToast("Saved scholarship removed.");
});

document.querySelectorAll(".nav").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav").forEach(item =>
      item.classList.remove("active")
    );

    link.classList.add("active");
  });
});

// Initialize frontend-only ScholarPath
function initializeScholarPath() {
  loadProfile();
  renderAll();
}

initializeScholarPath();
