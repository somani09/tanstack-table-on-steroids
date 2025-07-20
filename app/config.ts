export const pageConfig = {
  title: "Tanstack Table On steroids",
  description:
    "A fully interactive and customizable data table built with TanStack Table v8 and @dnd-kit. It supports advanced features like column pinning, drag-and-drop reordering, live resizing, and row selection—all controlled via modular state. Designed to mimic spreadsheet-like workflows with a modern UI and accessible UX. Ideal for both client-side dashboards and complex data-heavy interfaces.",
  infoSections: [
    {
      title: "Why We Built This",
      description:
        "Most data table libraries offer basic features but fall short when it comes to advanced workflows like column pinning, reordering, and dynamic resizing. We needed a system that mimicked spreadsheet-like interactivity while remaining fully customizable and performant.",
    },
    {
      title: "Our Approach",
      description:
        "This table is built using TanStack Table v8, @dnd-kit for drag-and-drop, and a layered state management system. We decoupled each feature—sorting, pinning, selection, resizing—into isolated configs, allowing maximum flexibility without coupling logic to rendering.",
    },
    {
      title: "What’s Inside",
      description:
        "The table supports column pinning with sticky positioning, keyboard/mouse drag-to-reorder with accessibility, live resizing, and checkbox-based row selection with footer summaries. All behaviors are controlled via state, allowing seamless server-side or client-side integrations.",
    },
  ],
};
