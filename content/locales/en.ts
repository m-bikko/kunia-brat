import type { Dictionary } from "@/content/types";
import { sitePaths } from "@/lib/site";

/**
 * English copy, translated from `ru.ts`.
 * Inner pages linked from here are Russian-only for now.
 */
export const en: Dictionary = {
  meta: {
    title: "AXIS (AxisGroup): turnkey school classroom fit-out in Kazakhstan",
    description:
      "Furniture and equipment for school classrooms: computer science, art, languages, pottery, technology and sewing workshops. Specification, design, delivery and installation.",
    ogImageAlt: "AXIS concept visualization of a Kazakh language classroom",
  },
  stamp: {
    object: "Object",
    objectValue: "Computer science classroom",
    stage: "Stage",
    stageValue: "Sketch",
    project: "Project",
    projectValue: "AXIS · Almaty",
    sheet: "Sheet",
    sheetTag: "Sheet {n}",
  },
  nav: {
    tagline: "Building spaces for learning",
    skipToContent: "Skip to content",
    cabinets: "Classrooms",
    catalog: "Catalog",
    services: "Services",
    about: "About",
    contactCta: "Discuss a project",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageLabel: "Site language",
  },
  hero: {
    title: { lead: "School classrooms, fitted out", accent: "turnkey." },
    subtitle:
      "We design, supply and install furniture and equipment for public and private schools across Kazakhstan.",
    primaryCta: "Choose a classroom",
    conceptCaption: "Concept visualization",
    slideLabel: "Show",
  },
  stats: {
    label: "AXIS in numbers",
    items: {
      classrooms: { one: "classroom fitted out", other: "classrooms fitted out" },
      schools: { one: "client school", other: "client schools" },
      directions: { one: "subject area", other: "subject areas" },
      brands: { one: "manufacturer brand", other: "manufacturer brands" },
    },
  },
  cabinets: {
    title: { lead: "Every talent", accent: "deserves its own space." },
    lead: "Eight subject areas. Choose what your students will create, and we will take care of the rest.",
    openKit: "See the kit",
    tour: "3D tour",
    quote: "Get a quote",
    categories: {
      technology: "Technology",
      creativity: "Creativity",
      craft: "Craft",
      languages: "Languages",
    },
    items: {
      informatics: {
        name: "Computer science",
        text: "From the first line of code to a project of their own. Workstations, digital equipment and space for teamwork.",
        features: ["Computer workstations", "Interactive panel", "Classroom furniture"],
        directoryLabel: "Computer science classroom fit-out",
      },
      art: {
        name: "Art room",
        text: "Draw, mix colours and find a personal style. Easels, large worktables and materials within reach.",
        features: ["Easels and stools", "Art tables", "Material storage"],
        directoryLabel: "Art classroom fit-out",
      },
      sewing: {
        name: "Sewing workshop",
        text: "Sew, construct and turn ideas into fabric. A space planned for every stage of making a piece.",
        features: ["Sewing machines", "Cutting island", "Mannequins and storage"],
        directoryLabel: "Sewing workshop fit-out",
      },
      pottery: {
        name: "Pottery studio",
        text: "Pottery wheels, a kiln, tools and drying space for finished pieces.",
        features: ["6 pottery wheels", "Firing kiln", "Tables and storage"],
        directoryLabel: "Pottery studio fit-out",
      },
      workshop: {
        name: "Technology workshop",
        text: "Workstations for wood and metalwork, machine tools, hand tools and protective gear.",
        features: ["12 workbenches", "Machines and tools", "Protective gear"],
        directoryLabel: "Technology workshop fit-out",
      },
      kazakh: {
        name: "Kazakh language classroom",
        text: "Classroom furniture, presentation equipment, language and literature resources.",
        features: ["25 student places", "Interactive panel", "Dictionaries and resources"],
        directoryLabel: "Kazakh language classroom fit-out",
      },
      russian: {
        name: "Russian language classroom",
        text: "Student places, an interactive panel, dictionaries and literature resources.",
        features: ["25 student places", "Interactive panel", "Dictionaries and literature"],
        directoryLabel: "Russian language classroom fit-out",
      },
      english: {
        name: "English language classroom",
        text: "Student places, interactive equipment, e-books and visual aids.",
        features: ["13 student places", "Interactive panel", "Language resources"],
        directoryLabel: "English language classroom fit-out",
      },
    },
    languagesTitle: "Language classrooms",
    languagesText: "Kazakh, Russian and English: student places, an interactive panel, dictionaries and resources.",
    languagesLinks: {
      kazakh: "Kazakh",
      russian: "Russian",
      english: "English",
    },
  },
  showroom: {
    eyebrow: "See it first",
    title: { lead: "Ideas", accent: "take shape." },
    text: "Choose a subject, look at the equipment and walk through your future classroom in 3D.",
    tabsLabel: "Choose a classroom",
    enter: "Enter 3D",
    hint: "Concept visualization. The 3D tour runs in the browser, nothing to install.",
  },
  brands: {
    title: { lead: "Brands we work with.", accent: "For every classroom." },
    text: "Equipment, furniture and materials for our learning spaces, from the brands featured in AXIS solutions.",
  },
  process: {
    title: { lead: "From an empty room", accent: "to a world of possibilities." },
    steps: [
      {
        label: "Survey",
        title: "It starts with your idea.",
        text: "We study the room and your goals, then plan zones, walkways and places for group work.",
      },
      {
        label: "Design",
        title: "A place for everyone.",
        text: "We select desks, seating and storage, and adapt the furniture to the lessons and the size of the room.",
      },
      {
        label: "Delivery",
        title: "Technology with a purpose.",
        text: "We choose equipment for your subject and handle procurement and delivery.",
      },
      {
        label: "Installation",
        title: "Ready for the first lesson.",
        text: "We install and connect the equipment, test it, set up workstations and walk your staff through it.",
      },
    ],
    more: "How we work",
    illustrationAlt: "Architectural illustration: a computer science classroom assembled step by step",
  },
  team: {
    title: { lead: "Behind every classroom", accent: "is our team." },
    workshop: {
      kicker: "We make",
      title: "Furniture workshop",
      text: "We adapt furniture to the room and to the way it will be taught in.",
      alt: "Work area of the AXIS furniture workshop",
    },
    store: {
      kicker: "We help you choose",
      title: "Ranzen store",
      text: "See school and art supplies in person before you order.",
      alt: "Sales floor of the Ranzen store with school and art supplies",
    },
    teamTitle: "The AXIS team",
    teamText: "We coordinate the project, delivery, installation and launch.",
  },
  faq: {
    title: "What does a classroom fit-out include?",
    items: [
      {
        question: "What is included in a fit-out?",
        answer:
          "We select furniture, equipment and materials for the subject, class size, room and school budget. We agree the specification, then organise delivery, installation and commissioning.",
        link: { label: "Fit-out stages", href: sitePaths.services },
      },
      {
        question: "What goes into a computer science classroom?",
        answer:
          "Computer workstations, networking, an interactive panel and classroom furniture. Other subjects need a different kit: pick a classroom above to see its equipment list.",
        link: { label: "Computer science classroom fit-out", href: "/kabinet-informatiki" },
      },
      {
        question: "How do I order a classroom fit-out?",
        answer:
          "Tell us the subject, the number of students, the room dimensions and any equipment you already have. If you have a floor plan or a specification, attach it and we will refine the kit and prepare a proposal.",
      },
      {
        question: "Where is the furniture made?",
        answer: "We adapt furniture to your room in our own workshop.",
        link: { label: "See AXIS production", href: sitePaths.about },
      },
      {
        question: "Are the classroom images finished projects?",
        answer: "No. The classroom images on this site show concepts, not photos of finished projects.",
      },
    ],
    directoryTitle: "School classroom fit-out",
    directoryText: "Equipment, the official equipment list and quote requests are on each subject page.",
  },
  g8: {
    title: { lead: "Sports equipment", accent: "for schools." },
    text: "G8 is our school sports site: equipment for gyms, PE lessons, clubs and competitions. Buy individual items or a complete space.",
    cta: "Go to G8",
  },
  contact: {
    eyebrow: "Your classroom is next",
    title: { lead: "What shall we", accent: "build together?" },
    text: "Choose a subject and tell us about the task. We will go through the equipment list and prepare a quote.",
    selectLabel: "Which classroom do you need?",
    submit: "Request a quote on WhatsApp",
    alternatives: "Or write or call us directly",
    messageTemplate: "Hello! Please prepare a quote for fitting out a classroom: {cabinet}.",
  },
  footer: {
    about: "We design and equip learning spaces across Kazakhstan.",
    solutions: "Solutions",
    navigation: "Navigation",
    contact: "Contact",
    guide: "Classroom fit-out guide",
    order70: "Fit-out under Order No. 70",
    address: "Megapolis Business Centre, Almaty",
    rights: "All rights reserved.",
  },
  whatsappFab: "Message us on WhatsApp",
  notFound: {
    title: "Page not found",
    text: "It may have moved. The home page lists every classroom we fit out and how to reach us.",
    home: "Back to home",
  },
};
