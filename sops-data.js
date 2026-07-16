/* ============================================================================
   FULL CIRCLE — SOP LIBRARY
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   To add a new SOP, copy one of the blocks below and change the details.
   To remove one, delete its block. To reorder, drag blocks up or down.

   Each SOP has 5 things you can set:
     title    -> The name shown on the tile         (required)
     link     -> The normal Google Doc / PDF share link you copy from Drive
                 (required). Just paste the link exactly as you copied it —
                 the dashboard turns it into a clean web view automatically.
     desc     -> A one-line description under the title (optional)
     icon     -> A single emoji shown on the tile (optional, defaults to 📄)
     tags     -> Extra words to help search find it (optional)

   RULES OF THUMB (read once):
     • Every line inside a block ends with a comma ,   except you can leave the
       last one without — safest is to just keep the commas as shown.
     • Keep the quotation marks "" around every value.
     • The Google Doc / PDF must be shared as "Anyone with the link – Viewer".
   ============================================================================ */

const SOP_CATEGORIES = [

  /* ----------------------------------------------------------------------- */
  {
    category: "Amazon Compliance",
    icon: "📑",
    sops: [
      {
        title: "Amazon-US-Product-Compliance-SOP",
        link: "https://docs.google.com/document/d/16wZQJz78rgY4hmm7uoI9CkF7sUhOCbYOSGSxuppB4Tk/edit",
        desc: "Amazon US Product Compliance, Testing & Certification SOP",
        icon: "✅",
        tags: "compliance"
      },
      {
        title: "Amazon Compliance Escalation SOP",
        link: "https://docs.google.com/document/d/1vnd-JPpfMLr7yJeXlwNtcJsi6trprXW2UXMmdJvtNdY/edit",
        desc: "Escalation Appeal for a compliance issue",
        icon: "🪜",
        tags: "Direct ID for escalating appeals"
      }
    ]
  },

  /* ----------------------------------------------------------------------- */
  {
    category: "PPC & Advertising",
    icon: "📈",
    sops: [
      {
        title: "Sponsored Products Campaign Build",
        link: "https://docs.google.com/document/d/REPLACE_WITH_YOUR_DOC_ID/edit",
        desc: "Standard structure for launching SP campaigns.",
        icon: "🎯",
        tags: "sp ads keywords bids acos"
      },
      {
        title: "Weekly Bid Optimization SOP",
        link: "https://docs.google.com/document/d/REPLACE_WITH_YOUR_DOC_ID/edit",
        desc: "The weekly bid and search-term review routine.",
        icon: "⚙️",
        tags: "acos tacos negative keywords harvesting"
      }
    ]
  },

  /* ----------------------------------------------------------------------- */
  {
    category: "Listings & Content",
    icon: "📝",
    sops: [
      {
        title: "Listing Optimization Playbook",
        link: "https://docs.google.com/document/d/REPLACE_WITH_YOUR_DOC_ID/edit",
        desc: "Titles, bullets, backend keywords, A+ content.",
        icon: "🛍️",
        tags: "seo title bullets a-plus brand store"
      }
    ]
  },

  /* ----------------------------------------------------------------------- */
  {
    category: "Reporting",
    icon: "📊",
    sops: [
      {
        title: "Monthly Client Report Template",
        link: "https://drive.google.com/file/d/REPLACE_WITH_YOUR_FILE_ID/view",
        desc: "How to pull data and build the monthly deck.",
        icon: "📅",
        tags: "kpi dashboard revenue growth deck pdf"
      }
    ]
  }

];
