# 📋 Project Development Notes

> **Started:** 02/08/2026 at 3:03 PM

---

## Phase 1: Submit Form

- After Cursor helped with the submit form, had to go back to manually resolve UI issues like stacked icons and missing text for dropdown (showed without a label - can be confusing what it does)
- Inconvenient but I had to remove the option to select all for the **'Target Personas'** - reason is I did not find an easy way to add the label and due to the time constraint I decided to just remove it for now so I don't waste time
- Looked into the Calendar component docs and added `showButtonBar` to be able to clear date added. Disabled manual input for better error avoidance

---

## Phase 2: Dashboard & Loading States
> **Started:** 3:41 PM

- 🚽 Taking a restroom break - 3:42 PM - back 3:46 PM
- Adjusted spacing for the search and search icon
- Updated the layout for the modal
- Looking into adding skeleton loading animations for the Ideas table. Currently it is only adding it for the initial load but I want it on every load and click of the refresh button. Reasoning: if we are calling an API then it makes sense - who knows how many records we are pulling from the call
- Added a skeleton loading animation for the grid view as that was "broken" since I updated the loading animation for the table

---

## Phase 3: Icons & Styling Consistency
> **Started:** 4:19 PM

- 💡 Lightbulb icon not showing. Looking up documentation for icons - [PrimeIcons Lightbulb SVG](https://github.com/primefaces/primeicons/blob/master/raw-svg/lightbulb.svg)
- Huh weird - the bulb icon just doesn't want to load so I will try a different icon. No big deal. Documentation is kind of meh
- 🐕 Stopping here to take dogs out for a walk. Will revisit this within the next two hours (depending on my dogs and how long they want to go on a walk for)
- Updating icons and colors to match throughout the dashboard to avoid confusion and keep everything consistent for each status
- Updated the main status like Planned, In Progress and New to match with the chart

---

## Phase 4: 
> **Started:** 5:47 PM
- double checked phase 4 and made sure we had the  keyboard + SR support. Surpirse, it wasn't implemented.
- shortcut for switching from light to dark theme is CRTL+SHIFT+L
- intresting. SO for the themeing part, i am looking at the documentation here: https://primevue.org/theming/styled/#darkmode but looking at the code we are actually implementing it differently 
```
// Apply theme by swapping CSS link
function applyTheme() {
  const theme = isDark.value ? DARK_THEME : LIGHT_THEME
  const linkId = 'theme-link'
  
  let link = document.getElementById(linkId)
  
  if (!link) {
    // Create link element if it doesn't exist
    link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  
  link.href = `https://unpkg.com/primevue@3/resources/themes/${theme}/theme.css`
  
  // Save preference
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}
```

---

## ⏱️ Time Tracking

| Event | Time |
|-------|------|
| Stopped | 4:30 PM - 02/08/2026 |
| Continuing | 5:20 PM - 02/08/2026 |

**Total hours as of now:** 1hr and 23mins
