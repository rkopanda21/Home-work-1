/*
Program Name: patient-form-html
Author: Zakria Abbasi
Date Created: 9/15/2025
Date Last Edited: 11/14/2025
Version: 3.0
Description: Styles for patient form, layout, and review panel
*/
document.addEventListener("DOMContentLoaded", () => {

  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const dateDiv = document.getElementById("date");
  if (dateDiv) dateDiv.textContent = new Date().toLocaleDateString(undefined, options);

  const form = document.getElementById("patientForm");
  const reviewBtn = document.getElementById("reviewBtn");
  const validateBtn = document.getElementById("validateBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");

  const dob = document.getElementById("dob");
  const movein = document.getElementById("movein");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayISO = `${yyyy}-${mm}-${dd}`;
  if (dob) {
    dob.max = todayISO;                
    dob.min = `${yyyy - 120}-${mm}-${dd}`; 
  }
  if (movein) movein.min = todayISO;   

  const pain = document.getElementById("pain");
  const painValue = document.getElementById("painValue");
  if (pain && painValue) {
    painValue.textContent = pain.value;
    pain.addEventListener("input", () => {
      painValue.textContent = pain.value;
    });
  }

  const weight = document.getElementById("weight");
  const weightValue = document.getElementById("weightValue");
  if (weight && weightValue) {
    weightValue.textContent = `${weight.value} lbs`;
    weight.addEventListener("input", () => {
      weightValue.textContent = `${weight.value} lbs`;
    });
  }

  function showError(id, message) {
    const span = document.getElementById(id + "-error");
    if (span) span.textContent = message;
  }

  function clearError(id) {
    const span = document.getElementById(id + "-error");
    if (span) span.textContent = "";
  }

  function hasErrors() {
    return Array.from(document.querySelectorAll(".error-message")).some(el => el.textContent.trim() !== "");
  }

  function updateSubmitButton() {
    if (!submitBtn) return;
    if (hasErrors()) {
      submitBtn.style.display = "none";
    } else {
      submitBtn.style.display = "inline-block";
    }
  }

  function strongPassword(pwd) {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[!@#%^&*()\-\_=+\\/><\.,`~]/.test(pwd);
    const hasQuote = /"/.test(pwd);
    return hasUpper && hasLower && hasDigit && hasSpecial && !hasQuote && pwd.length >= 8 && pwd.length <= 30;
  }

  function normalizeUserId() {
    const id = document.getElementById("UserID");
    if (!id) return "";
    id.value = (id.value || "").trim().toLowerCase();
    return id.value;
  }

  function validateUserId() {
    const el = document.getElementById("UserID");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("UserID", "User ID is required.");
      return false;
    }
    const re = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;
    if (!re.test(value)) {
      showError("UserID", "5–20 chars; start with letter; letters, numbers, - or _ only.");
      return false;
    }
    clearError("UserID");
    return true;
  }

  function validateFirstName() {
    const el = document.getElementById("fname");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("fname", "First name is required.");
      return false;
    }
    const re = /^[A-Za-z'\-]{1,30}$/;
    if (!re.test(value)) {
      showError("fname", "Letters, apostrophes, and dashes only (1–30).");
      return false;
    }
    clearError("fname");
    return true;
  }

  function validateMiddleInitial() {
    const el = document.getElementById("mi");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      clearError("mi");
      return true;
    }
    const re = /^[A-Za-z]$/;
    if (!re.test(value)) {
      showError("mi", "Middle initial must be 1 letter or blank.");
      return false;
    }
    clearError("mi");
    return true;
  }

  function validateLastName() {
    const el = document.getElementById("lname");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("lname", "Last name is required.");
      return false;
    }
    const re = /^(?=.{1,30}$)[A-Za-z'\-]+(?:(?:\s)?(?:2nd|3rd|4th|5th))?$/;
    if (!re.test(value)) {
      showError("lname", "1–30 letters/apostrophes/dashes; optional 2nd–5th.");
      return false;
    }
    clearError("lname");
    return true;
  }

  function validateDob() {
    if (!dob) return true;
    const value = dob.value;
    if (!value) {
      showError("dob", "Date of birth is required.");
      return false;
    }
    const selected = new Date(value + "T00:00:00");
    const max = new Date(todayISO + "T00:00:00");
    const min = new Date(todayISO + "T00:00:00");
    min.setFullYear(min.getFullYear() - 120);
    if (selected > max || selected < min) {
      showError("dob", "DOB must be within the last 120 years and not in the future.");
      return false;
    }
    clearError("dob");
    return true;
  }

  function validateEmail() {
    const el = document.getElementById("email");
    if (!el) return true;
    let value = (el.value || "").trim();
    if (!value) {
      showError("email", "Email is required.");
      return false;
    }
    value = value.toLowerCase();
    el.value = value;
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!re.test(value)) {
      showError("email", "Email must be in the format name@domain.tld.");
      return false;
    }
    clearError("email");
    return true;
  }

  function validatePhone() {
    const el = document.getElementById("phone");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("phone", "Phone number is required.");
      return false;
    }
    const re = /^\d{3}-\d{3}-\d{4}$/;
    if (!re.test(value)) {
      showError("phone", "Use format 000-000-0000.");
      return false;
    }
    clearError("phone");
    return true;
  }

  function validateAddress1() {
    const el = document.getElementById("homeAddress1");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("homeAddress1", "Address Line 1 is required.");
      return false;
    }
    if (value.length < 2 || value.length > 30) {
      showError("homeAddress1", "2–30 characters required.");
      return false;
    }
    clearError("homeAddress1");
    return true;
  }

  function validateAddress2() {
    const el = document.getElementById("homeAddress2");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      clearError("homeAddress2");
      return true;
    }
    if (value.length < 2 || value.length > 30) {
      showError("homeAddress2", "If entered, must be 2–30 characters.");
      return false;
    }
    clearError("homeAddress2");
    return true;
  }

  function validateCity() {
    const el = document.getElementById("city");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("city", "City is required.");
      return false;
    }
    if (value.length < 2 || value.length > 30) {
      showError("city", "2–30 characters required.");
      return false;
    }
    clearError("city");
    return true;
  }

  function validateState() {
    const el = document.getElementById("state");
    if (!el) return true;
    const value = el.value;
    if (!value) {
      showError("state", "Please select a state.");
      return false;
    }
    clearError("state");
    return true;
  }

  function validateZip() {
    const el = document.getElementById("zip");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      showError("zip", "Zip code is required.");
      return false;
    }
    const re = /^\d{5}$/;
    if (!re.test(value)) {
      showError("zip", "Zip must be exactly 5 digits.");
      return false;
    }
    clearError("zip");
    return true;
  }

  function formatSsnInput() {
    const el = document.getElementById("ssn");
    if (!el) return;
    let digits = (el.value || "").replace(/\D/g, "");
    if (digits.length > 9) digits = digits.slice(0, 9);
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 3);
    }
    if (digits.length >= 4) {
      formatted += "-" + digits.slice(3, 5);
    }
    if (digits.length >= 6) {
      formatted += "-" + digits.slice(5, 9);
    }
    el.value = formatted;
  }

  function validateSsn() {
    const el = document.getElementById("ssn");
    if (!el) return true;
    const value = (el.value || "").trim();
    if (!value) {
      clearError("ssn");
      return true;
    }
    const re = /^\d{3}-\d{2}-\d{4}$/;
    if (!re.test(value)) {
      showError("ssn", "SSN must be 9 digits, formatted 000-00-0000.");
      return false;
    }
    clearError("ssn");
    return true;
  }

  function validatePain() {
    const el = document.getElementById("pain");
    if (!el) return true;
    const value = parseInt(el.value, 10);
    if (isNaN(value) || value < 1 || value > 10) {
      showError("pain", "Pain level must be between 1 and 10.");
      return false;
    }
    clearError("pain");
    return true;
  }

  function validateWeight() {
    const el = document.getElementById("weight");
    if (!el) return true;
    const value = parseInt(el.value, 10);
    if (isNaN(value) || value < 5 || value > 400) {
      showError("weight", "Weight must be between 5 and 400 lbs.");
      return false;
    }
    clearError("weight");
    return true;
  }

  function validateSymptoms() {
    const el = document.getElementById("symptoms");
    if (!el) return true;
    const value = el.value || "";
    if (value.includes('"')) {
      showError("symptoms", 'Please avoid using double quotes (").');
      return false;
    }
    clearError("symptoms");
    return true;
  }

  function checkPasswords() {
    const p1El = document.getElementById("Password");
    const p2El = document.getElementById("RPassword");
    const uidEl = document.getElementById("UserID");
    const fnEl = document.getElementById("fname");
    const lnEl = document.getElementById("lname");
    const p1 = (p1El?.value || "").trim();
    const p2 = (p2El?.value || "").trim();
    const uid = (uidEl?.value || "").trim().toLowerCase();
    const fn = (fnEl?.value || "").trim().toLowerCase();
    const ln = (lnEl?.value || "").trim().toLowerCase();

    let ok = true;
    clearError("Password");
    clearError("RPassword");

    if (!p1) {
      showError("Password", "Password is required.");
      ok = false;
    } else if (!strongPassword(p1)) {
      showError("Password", "8–30 chars with upper, lower, digit, and special; no double quotes.");
      ok = false;
    }

    if (!p2) {
      showError("RPassword", "Please re-enter the password.");
      ok = false;
    } else if (p1 && p1 !== p2) {
      showError("RPassword", "Passwords do not match.");
      ok = false;
    }

    if (p1 && uid && p1.toLowerCase().includes(uid)) {
      showError("Password", "Password cannot contain your user ID.");
      ok = false;
    }

    if (p1 && fn && p1.toLowerCase().includes(fn)) {
      showError("Password", "Password cannot contain your first name.");
      ok = false;
    }

    if (p1 && ln && p1.toLowerCase().includes(ln)) {
      showError("Password", "Password cannot contain your last name.");
      ok = false;
    }

    if (p1 && uid && p1.toLowerCase() === uid.toLowerCase()) {
      showError("Password", "Password cannot equal your user ID.");
      ok = false;
    }

    return ok;
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
  }

  function validateForm() {
    normalizeUserId();
    let ok = true;
    if (!validateUserId()) ok = false;
    if (!validateFirstName()) ok = false;
    if (!validateMiddleInitial()) ok = false;
    if (!validateLastName()) ok = false;
    if (!validateDob()) ok = false;
    if (!validateEmail()) ok = false;
    if (!validatePhone()) ok = false;
    if (!validateAddress1()) ok = false;
    if (!validateAddress2()) ok = false;
    if (!validateCity()) ok = false;
    if (!validateState()) ok = false;
    if (!validateZip()) ok = false;
    if (!validateSsn()) ok = false;
    if (!validatePain()) ok = false;
    if (!validateWeight()) ok = false;
    if (!validateSymptoms()) ok = false;
    if (!checkPasswords()) ok = false;
    updateSubmitButton();
    return ok;
  }

  function renderReview() {
    normalizeUserId();

    const zipEntered = document.getElementById("zip").value || "";
    const zipTrunc = (zipEntered.match(/^\d{5}/) || [""])[0];

    const vaccines = getCheckedValues("vaccines").join(", ") || "None";
    const insurance = document.querySelector('input[name="insurance"]:checked')?.value || "N/A";
    const pregnant = document.querySelector('input[name="pregnant"]:checked')?.value || "N/A";
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "N/A";
    const ssnRaw = document.getElementById("ssn")?.value || "";
    const ssnMasked = ssnRaw ? ssnRaw.replace(/\d(?=\d{4})/g, "•") : "N/A";

    const rows = [
      ["User ID (lowercased)", document.getElementById("UserID").value],
      ["First Name", document.getElementById("fname").value],
      ["Middle Initial", document.getElementById("mi").value || "N/A"],
      ["Last Name", document.getElementById("lname").value],
      ["DOB", document.getElementById("dob").value],
      ["Move-In / Travel Date", document.getElementById("movein")?.value || "N/A"],
      ["Email", document.getElementById("email").value],
      ["Phone", document.getElementById("phone").value],
      ["Address 1", document.getElementById("homeAddress1")?.value || "N/A"],
      ["Address 2", document.getElementById("homeAddress2")?.value || "N/A"],
      ["City", document.getElementById("city").value],
      ["State", document.getElementById("state").value],
      ["Zip (entered)", zipEntered],
      ["Zip (truncated to 5)", zipTrunc],
      ["Vaccines", vaccines],
      ["Insurance", insurance],
      ["Pregnant", pregnant],
      ["Gender", gender],
      ["Pain Level", document.getElementById("pain")?.value || "N/A"],
      ["Current Body Weight", `${document.getElementById("weight")?.value || "N/A"} lbs`],
      ["Symptoms", document.getElementById("symptoms").value || "N/A"],
      ["SSN (masked)", ssnMasked]
    ];

    const out = document.getElementById("review-output");
    out.innerHTML = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      const l = document.createElement("span"); l.style.fontWeight = "bold"; l.textContent = `${label}: `;
      const v = document.createElement("span"); v.textContent = value;
      row.appendChild(l); row.appendChild(v);
      out.appendChild(row);
    });

    const section = document.getElementById("review-section");
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      validateForm();
    });
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      if (!validateForm()) return;
      renderReview();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      if (!validateForm()) {
        e.preventDefault();
        return;
      }
      normalizeUserId();
    });
  }

  const userIdEl = document.getElementById("UserID");
  if (userIdEl) {
    userIdEl.addEventListener("blur", () => {
      normalizeUserId();
      validateUserId();
      updateSubmitButton();
    });
    userIdEl.addEventListener("input", () => {
      validateUserId();
      updateSubmitButton();
    });
  }

  const fnameEl = document.getElementById("fname");
  if (fnameEl) {
    fnameEl.addEventListener("blur", () => {
      validateFirstName();
      updateSubmitButton();
    });
    fnameEl.addEventListener("input", () => {
      validateFirstName();
      updateSubmitButton();
    });
  }

  const miEl = document.getElementById("mi");
  if (miEl) {
    miEl.addEventListener("blur", () => {
      validateMiddleInitial();
      updateSubmitButton();
    });
    miEl.addEventListener("input", () => {
      validateMiddleInitial();
      updateSubmitButton();
    });
  }

  const lnameEl = document.getElementById("lname");
  if (lnameEl) {
    lnameEl.addEventListener("blur", () => {
      validateLastName();
      updateSubmitButton();
    });
    lnameEl.addEventListener("input", () => {
      validateLastName();
      updateSubmitButton();
    });
  }

  if (dob) {
    dob.addEventListener("blur", () => {
      validateDob();
      updateSubmitButton();
    });
    dob.addEventListener("input", () => {
      validateDob();
      updateSubmitButton();
    });
  }

  const emailEl = document.getElementById("email");
  if (emailEl) {
    emailEl.addEventListener("blur", () => {
      validateEmail();
      updateSubmitButton();
    });
    emailEl.addEventListener("input", () => {
      validateEmail();
      updateSubmitButton();
    });
  }

  const phoneEl = document.getElementById("phone");
  if (phoneEl) {
    phoneEl.addEventListener("blur", () => {
      validatePhone();
      updateSubmitButton();
    });
    phoneEl.addEventListener("input", () => {
      validatePhone();
      updateSubmitButton();
    });
  }

  const addr1El = document.getElementById("homeAddress1");
  if (addr1El) {
    addr1El.addEventListener("blur", () => {
      validateAddress1();
      updateSubmitButton();
    });
    addr1El.addEventListener("input", () => {
      validateAddress1();
      updateSubmitButton();
    });
  }

  const addr2El = document.getElementById("homeAddress2");
  if (addr2El) {
    addr2El.addEventListener("blur", () => {
      validateAddress2();
      updateSubmitButton();
    });
    addr2El.addEventListener("input", () => {
      validateAddress2();
      updateSubmitButton();
    });
  }

  const cityEl = document.getElementById("city");
  if (cityEl) {
    cityEl.addEventListener("blur", () => {
      validateCity();
      updateSubmitButton();
    });
    cityEl.addEventListener("input", () => {
      validateCity();
      updateSubmitButton();
    });
  }

  const stateEl = document.getElementById("state");
  if (stateEl) {
    stateEl.addEventListener("change", () => {
      validateState();
      updateSubmitButton();
    });
  }

  const zipEl = document.getElementById("zip");
  if (zipEl) {
    zipEl.addEventListener("blur", () => {
      validateZip();
      updateSubmitButton();
    });
    zipEl.addEventListener("input", () => {
      validateZip();
      updateSubmitButton();
    });
  }

  const ssnEl = document.getElementById("ssn");
  if (ssnEl) {
    ssnEl.addEventListener("input", () => {
      formatSsnInput();
      validateSsn();
      updateSubmitButton();
    });
    ssnEl.addEventListener("blur", () => {
      validateSsn();
      updateSubmitButton();
    });
  }

  const passwordEl = document.getElementById("Password");
  const rpasswordEl = document.getElementById("RPassword");
  if (passwordEl) {
    passwordEl.addEventListener("input", () => {
      checkPasswords();
      updateSubmitButton();
    });
    passwordEl.addEventListener("blur", () => {
      checkPasswords();
      updateSubmitButton();
    });
  }
  if (rpasswordEl) {
    rpasswordEl.addEventListener("input", () => {
      checkPasswords();
      updateSubmitButton();
    });
    rpasswordEl.addEventListener("blur", () => {
      checkPasswords();
      updateSubmitButton();
    });
  }

  const symptomsEl = document.getElementById("symptoms");
  if (symptomsEl) {
    symptomsEl.addEventListener("input", () => {
      validateSymptoms();
      updateSubmitButton();
    });
    symptomsEl.addEventListener("blur", () => {
      validateSymptoms();
      updateSubmitButton();
    });
  }

  if (form && resetBtn) {
    form.addEventListener("reset", () => {
      setTimeout(() => {
        document.querySelectorAll(".error-message").forEach(el => { el.textContent = ""; });
        if (submitBtn) submitBtn.style.display = "none";
      }, 0);
    });
  }
});
