export const pageConfig = {
  title: "Page Title",
  description:
    "Consequat esse labore dolore voluptate duis magna voluptate labore sint esse.Exercitation commodo consequat deserunt ex aute Lorem voluptate.",
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
