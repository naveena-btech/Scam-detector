function analyseMessage() {
const message = document.getElementById("message").value.trim();

const riskElement = document.getElementById("risk");
const scoreElement = document.getElementById("score");
const warningsElement = document.getElementById("warnings");
const adviceElement = document.getElementById("advice");

warningsElement.innerHTML = "";

if (message.length === 0) {
    riskElement.textContent = "Please enter a message first.";
    scoreElement.textContent = "";
    adviceElement.textContent = "";
    return;
}

const text = message.toLowerCase();
let score = 0;
const warnings = [];

function checkPattern(pattern, points, warning) {
    if (pattern.test(text)) {
        score += points;
        warnings.push(warning);
    }
}

checkPattern(
    /\b(otp|one[- ]time password|password|pin|cvv)\b/i,
    3,
    "The message mentions sensitive authentication or banking information."
);

checkPattern(
    /\b(won|winner|prize|lottery|reward|claim your prize)\b/i,
    2,
    "The message contains a prize or reward claim."
);

checkPattern(
    /\b(urgent|immediately|act now|limited time|expires today|right now)\b/i,
    2,
    "The message creates urgency or pressures you to act quickly."
);

checkPattern(
    /\b(pay now|send money|processing fee|transfer money|pay a fee)\b/i,
    3,
    "The message requests payment or money transfer."
);

checkPattern(
    /\b(account blocked|account suspended|account will be closed|verify your account)\b/i,
    2,
    "The message uses an account warning or verification request."
);

checkPattern(
    /\b(click this link|click here|verify now|update your details)\b/i,
    1,
    "The message encourages you to click a link or provide updated details."
);

if (/https?:\/\/|www\./i.test(text)) {
    score += 1;
    warnings.push(
        "The message contains a web link. Check its destination carefully before opening it."
    );
}

// Limit the score to 10.
score = Math.min(score, 10);

let riskLevel;

if (score >= 6) {
    riskLevel = "HIGH RISK";
} else if (score >= 3) {
    riskLevel = "MEDIUM RISK";
} else {
    riskLevel = "LOW RISK";
}

riskElement.textContent = "Risk Level: " + riskLevel;
scoreElement.textContent = "Risk Score: " + score + "/10";

if (warnings.length === 0) {
    const item = document.createElement("li");
    item.textContent =
        "No warning signs from this tool's current rules were detected.";
    warningsElement.appendChild(item);
} else {
    warnings.forEach(function(warning) {
        const item = document.createElement("li");
        item.textContent = warning;
        warningsElement.appendChild(item);
    });
}

if (score >= 6) {
    adviceElement.textContent =
        "Safety advice: Do not click suspicious links, send money, or share OTPs or passwords. Verify the message using the organisation's official contact details.";
} else if (score >= 3) {
    adviceElement.textContent =
        "Safety advice: Be careful. Verify the sender and the request independently before taking action.";
} else {
    adviceElement.textContent =
        "Safety advice: No strong warning signs were detected by these rules, but this does not prove the message is safe.";
}

}