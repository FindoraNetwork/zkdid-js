
export default function scrollToElement(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth' });
}
