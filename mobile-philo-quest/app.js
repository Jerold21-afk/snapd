const quests = [
  "Read about Stoicism and write 1 practical takeaway.",
  "Compare Plato's cave to social media for 5 minutes.",
  "Debate free will vs determinism with a friend.",
  "Find one absurdist idea and decide if you agree.",
];

const challenges = [
  {
    question: "Which school emphasizes tranquility through acceptance?",
    answers: ["Stoicism", "Existentialism", "Utilitarianism"],
    correct: 0,
  },
  {
    question: "Who wrote *Meditations*?",
    answers: ["Aristotle", "Marcus Aurelius", "Descartes"],
    correct: 1,
  },
  {
    question: "The trolley problem is mainly about...",
    answers: ["Epistemology", "Ethics", "Aesthetics"],
    correct: 1,
  },
];

const philosophers = [
  {
    name: "Socrates",
    era: "470–399 BCE",
    power: "Question Storm",
    idea: "Knowledge begins with admitting ignorance.",
  },
  {
    name: "Confucius",
    era: "551–479 BCE",
    power: "Harmony Aura",
    idea: "Good society comes from cultivated character and relationships.",
  },
  {
    name: "Simone de Beauvoir",
    era: "1908–1986",
    power: "Freedom Lens",
    idea: "We become who we are through choices within social conditions.",
  },
];

const state = JSON.parse(localStorage.getItem("philoQuestState") || "null") || {
  xp: 0,
  level: 1,
  streak: 0,
  lastQuestDay: "",
  completedDaily: false,
  challengeIndex: 0,
};

const el = {
  xp: document.getElementById("xp"),
  xpGoal: document.getElementById("xpGoal"),
  level: document.getElementById("level"),
  streak: document.getElementById("streak"),
  dailyQuest: document.getElementById("dailyQuest"),
  completeQuest: document.getElementById("completeQuest"),
  question: document.getElementById("question"),
  choices: document.getElementById("choices"),
  philosopherSelect: document.getElementById("philosopherSelect"),
  philosopherCard: document.getElementById("philosopherCard"),
  journal: document.getElementById("journal"),
  saveJournal: document.getElementById("saveJournal"),
};

const today = new Date().toISOString().slice(0, 10);
if (state.lastQuestDay !== today) {
  state.completedDaily = false;
  state.lastQuestDay = today;
}

function xpGoal(level) {
  return 100 + (level - 1) * 30;
}

function addXP(points) {
  state.xp += points;
  while (state.xp >= xpGoal(state.level)) {
    state.xp -= xpGoal(state.level);
    state.level += 1;
  }
  save();
  renderStats();
}

function renderStats() {
  el.xp.textContent = state.xp;
  el.xpGoal.textContent = xpGoal(state.level);
  el.level.textContent = state.level;
  el.streak.textContent = `${state.streak} 🔥`;
}

function renderDailyQuest() {
  const dayIndex = Number(today.split("-").join("")) % quests.length;
  el.dailyQuest.textContent = quests[dayIndex];
  el.completeQuest.disabled = state.completedDaily;
  if (state.completedDaily) {
    el.completeQuest.textContent = "Completed ✅";
  }
}

function renderChallenge() {
  const challenge = challenges[state.challengeIndex % challenges.length];
  el.question.textContent = challenge.question;
  el.choices.innerHTML = "";

  challenge.answers.forEach((answer, idx) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = answer;
    button.onclick = () => {
      if (idx === challenge.correct) {
        addXP(30);
        alert("Correct! +30 XP");
      } else {
        alert("Nice try! No XP this round.");
      }
      state.challengeIndex += 1;
      save();
      renderChallenge();
    };
    el.choices.append(button);
  });
}

function renderPhilosophers() {
  philosophers.forEach((p, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = p.name;
    el.philosopherSelect.append(option);
  });

  const showCard = (index) => {
    const p = philosophers[index];
    el.philosopherCard.innerHTML = `
      <h3>${p.name} • ${p.era}</h3>
      <p><strong>Signature Power:</strong> ${p.power}</p>
      <p>${p.idea}</p>
    `;
  };

  el.philosopherSelect.onchange = (e) => showCard(e.target.value);
  showCard(0);
}

function save() {
  localStorage.setItem("philoQuestState", JSON.stringify(state));
}

el.completeQuest.onclick = () => {
  if (state.completedDaily) return;
  state.completedDaily = true;
  state.streak += 1;
  addXP(40);
  renderDailyQuest();
};

el.saveJournal.onclick = () => {
  if (!el.journal.value.trim()) {
    alert("Write a short reflection first!");
    return;
  }
  localStorage.setItem("philoQuestJournal", el.journal.value.trim());
  addXP(20);
  alert("Reflection saved! +20 XP");
};

el.journal.value = localStorage.getItem("philoQuestJournal") || "";
renderStats();
renderDailyQuest();
renderChallenge();
renderPhilosophers();
save();
