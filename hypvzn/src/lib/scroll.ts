/**
 * Smoothly scrolls to an element by its ID.
 */
export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.warn(`[Scroll] Element with ID "${id}" not found.`);
  }
};
